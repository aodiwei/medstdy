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
