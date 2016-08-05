#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/7/23"
__purpose__ = 
"""
import os
import re
import platform

from bs4 import BeautifulSoup, element

import define
from logs import LoggerMgr, CustomMgrError
from tools.utility import Utility, Instances


log = LoggerMgr.getLogger()


class DataStorage(object):
    """
    data storage
    """
    def __init__(self):
        self._mongodb = Instances.get_mongo_inst()
        conf = Utility.conf_get("data_server")
        if 'Windows' in platform.system():
            self.data_file_path = conf.get("data_file_path_win")
        else:
            self.data_file_path = conf.get("data_file_path")
        if not os.path.exists(self.data_file_path):
            os.makedirs(self.data_file_path)

    def data_store_mgr(self, file_info):
        """
        import data
        :return:
        """
        try:
            filename = file_info.filename
            file_body = file_info.body.encode("utf-8")
            file_path = os.path.join(self.data_file_path, filename)
            with open(file_path, 'w') as f:
                f.write(file_body)
            log.info("store file {0} success".format(filename))
            # file_path = r"F:\17MedPro\workspace\medstdy\docs\template_with_data.xml"
            # self.store_data_mongodb(file_path)
        except Exception, e:
            log.error("parse file {0} failed {1}".format(filename, e))
            raise CustomMgrError(define.C_CAUSE_fileError)

    def store_data_mongodb(self, file_path):
        """
        parse xml and store in mongodb
        :param file_path:
        :return:
        """
        soup = BeautifulSoup(open(file_path), "xml")
        id_ele = soup.find("medical_id")
        _id = id_ele.text.encode("utf-8").strip()

        tbl_list = soup.find_all(re.compile(r"^tbl*"))
        for tbl in tbl_list:
            tbl_name = tbl.name.encode("utf-8")
            if tbl_name == "tbl_user_info":
                tbl_name = "tbl_patient_info"
            collection = self._mongodb.get_collection(tbl_name)
            exist_id = collection.find_one({"_id": _id})
            if exist_id is not None:
                log.warning("medical_id {0} is existed in {1}, filename:{2}".format(_id, tbl_name, file_path))
                continue
            fields = tbl.contents
            doc = {"_id": _id}
            for field in fields:
                if not isinstance(field, element.Tag):
                    continue
                items = field.contents
                if len(items) == 1:
                    doc[field.name.encode("utf-8")] = field.text.encode("utf-8").strip()
                else:
                    item_list = []
                    for item in items:
                        if not isinstance(item, element.Tag):
                            continue
                        item_doc = {}
                        for it in item:
                            if not isinstance(it, element.Tag):
                                continue
                            item_doc[it.name.encode("utf-8")] = it.text.encode("utf-8").strip()
                        item_list.append(item_doc)
                    doc[field.name.encode("utf-8")] = item_list

            collection.insert(doc)
            log.info("finish insert {0} to {1}".format(_id, tbl_name))


