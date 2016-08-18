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
    LOCAL_FORMAT = "%Y-%m-%d %H:%M:%S"
    UTC_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


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
        host = conf.get("host", "localhost")
        port = conf.get("port", 27017)
        db = conf.get("db", "medlogic")
        mongo_cli = pymongo.MongoClient(host, int(port))
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
        collection = mongodb.get_collection("tbl_user_operation_history")
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
