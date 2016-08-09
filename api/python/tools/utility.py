#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/7/24"
__purpose__ = 
"""
import os

import pymongo
import yagmail

import config
import define


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
