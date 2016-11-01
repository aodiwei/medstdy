#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/7/24"
__purpose__ = 
"""
import os

import datetime
import re
import platform

import pymongo
import time
import yagmail
import sunburnt

import config
import define


class CONST(object):
    """
    some const val
    """
    LOCAL_FORMAT_DATETIME = "%Y-%m-%d %H:%M:%S"
    LOCAL_FORMAT_DATE = "%Y-%m-%d"
    UTC_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"
    MONGODB_COLLECTIONS = ["patient_info", "clinical_course", "hospitalized", "surgery",
                           "after_surgery", "leave", "temp_medical_orders", "long_medical_orders"]


class Instances(object):
    """
    get instances
    """

    @classmethod
    def get_mongo_inst(cls):
        """
        init a mongo instance
        :return:
        """
        conf = Utility.conf_get("mongodb")
        plat = platform.system()
        if 'Windows' in plat or "Darwin" in plat:
            mongo_host = conf.get("host_local")
        else:
            mongo_host = conf.get("host")

        port = conf.get("port", 27017)
        db = conf.get("db", "medlogic")
        mongo_cli = pymongo.MongoClient(mongo_host, int(port))
        return mongo_cli.get_database(db)

    @classmethod
    def get_solr_inst(cls):
        """
        get slr instance
        :return:
        """
        conf = Utility.conf_get("solr")
        url = "http://{host}:{port}/solr/{core}".format(**conf)
        return sunburnt.SolrInterface(url=url, retry_timeout=10)


class Utility(object):
    """
    some utility
    """

    @classmethod
    def conf_get(cls, section):
        """
        config
        :param section:
        :return: conf
        """
        config.ConfigMgr.init(os.path.join(define.root, "config/config.yaml"))
        return config.ConfigMgr.get(section, {})

    @classmethod
    def send_email(cls, subject, contents, send_to=None, **kwargs):
        """
        send email, by default, use email info in config file, if you want use personal email,
        use kwargs like:
        kwargs = {
            "user": xxxx,
            "password", xxxx,
            "host": xxx,
            "to":xxx,
            "cc":xxx # a list or str
        }
        :param subject:
        :param contents:
        :param kwargs:
        :return:
        """
        if kwargs:
            user = kwargs.get("user")
            password = kwargs.get("password")
            host = kwargs.get("host")
            to = kwargs.get("to")
            cc = kwargs.get("cc", None)
        else:
            conf = config.ConfigMgr.get("email", {})
            user = conf.get("user")
            password = conf.get("password")
            host = conf.get("host")
            to = conf.get("to")
            cc = conf.get("cc", "")
            if cc:
                cc = cc.split(",")

        if send_to is not None:
            to = send_to
        to = to.encode("utf-8")
        yag = yagmail.SMTP(user=user, password=password, host=host)
        yag.send(to=to, subject=subject, contents=contents, cc=cc)

    @classmethod
    def log_important_operation(cls, user, cause):
        """
        把用户的重要操作记录到mongodb
        :param user:
        :param cause:
        :return:
        """
        mongodb = Instances.get_mongo_inst()
        collection = mongodb.get_collection("user_operation_history")
        oper_datetime = time.strftime("%Y%m%d_%H%M%S")
        oper = {
            oper_datetime: cause
        }
        collection.update_one(filter={"_id": user}, update={"$set": oper}, upsert=True)

    @classmethod
    def utc2local(cls, utc_st, date_inst=False):
        """
        UTC时间转本地时间（+8:00）
        :param date_inst: datetime instance
        :param utc_st:
        :return:
        """
        utc_st = utc_st.encode("utf-8")
        utc = datetime.datetime.strptime(utc_st, CONST.UTC_FORMAT)
        now_stamp = time.time()
        local_time = datetime.datetime.fromtimestamp(now_stamp)
        utc_time = datetime.datetime.utcfromtimestamp(now_stamp)
        offset = local_time - utc_time
        local_st = utc + offset
        if date_inst:
            return local_st
        else:
            return local_st.strftime(CONST.UTC_FORMAT)

    @classmethod
    def strptime(cls, datetime_str, inst=True):
        """
        format str to datetime instance,
        format including:
            YYYY-MM-DD
            YYYY/MM/DD
            YYYY_MM_DD
            YYYY-MM-DD %H:%M:%S
            YYYY/MM/DD %H:%M:%S
            YYYY_MM_DD %H:%M:%S
            YYYY-M-D
            YYYY/M/D
            YYYY_M_D
            YYYY-M-D %H:%M:%S
            YYYY/M/D %H:%M:%S
            YYYY_M_D %H:%M:%S
        :param inst:
        :param datetime_str:
        :return:datetime instance/string format
        """
        p_date = re.compile(r"^(\d{4})[-/_](\d{1,2})[-/_](\d{1,2})$")
        p_datetime = re.compile(r"^(\d{4})[-/_](\d{1,2})[-/_](\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$")
        result_date = p_date.findall(datetime_str)
        result_datetime = p_datetime.findall(datetime_str)
        if result_datetime:
            result = result_datetime[0]
            # this way perform better 7x than strptime
            datetime_inst = datetime.datetime(int(result[0]), int(result[1]), int(result[2]), int(result[3]),
                                              int(result[4]), int(result[5]), int(result[0]))
            datetime_str = datetime_inst.strftime(CONST.LOCAL_FORMAT_DATETIME)
        elif result_date:
            result = result_date[0]
            datetime_inst = datetime.datetime(int(result[0]), int(result[1]), int(result[2]))
            datetime_str = datetime_inst.strftime(CONST.LOCAL_FORMAT_DATE)
        else:
            raise ValueError("nonsupport datetime format: {}".format(datetime_str))

        return datetime_inst if inst else datetime_str
