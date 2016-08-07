#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/7/23"
__purpose__ = 
"""
import os
import platform
import re
import time

from bs4 import BeautifulSoup, element

import define
from logs import LoggerMgr, CustomMgrError
from tools.utility import Utility, Instances

log = LoggerMgr.getLogger()


class DataStorage(object):
    """
    data storage
    """

    def __init__(self, user):
        self.user = user
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
        :param file_info:
        :return:
        """
        try:
            filename = file_info.filename
            file_body = file_info.body
            file_path = os.path.join(self.data_file_path, filename)
            with open(file_path, 'w') as f:
                f.write(file_body)
            log.info("store file {0} success".format(filename))
            self.store_data_mongodb(file_body, filename)
            # 记录操作
            collection = self._mongodb.get_collection("tbl_user_operation_history")
            oper_datetime = time.strftime("%Y%m%d_%H%M%S")
            operation_cause = "upload file {0}".format(filename)
            oper = {
                oper_datetime: operation_cause
            }
            collection.update_one(filter={"_id": self.user}, update={"$set": oper}, upsert=True)
        except Exception, e:
            log.exception("parse file {0} failed {1}".format(filename, e))
            raise CustomMgrError(define.C_CAUSE_fileError)

    def store_data_mongodb(self, file_body, filename):
        """
        parse xml and store in mongodb
        :param filename:
        :param file_body:
        :return:
        """
        soup = BeautifulSoup(file_body, "xml")
        id_ele = soup.find("medical_id")
        _id = id_ele.text.encode("utf-8").strip()
        create_datetime = time.strftime("%Y-%m-%d %H:%M:%S")

        tbl_list = soup.find_all(re.compile(r"^tbl*"))
        for tbl in tbl_list:
            doc = {"_id": _id, "create_datetime": create_datetime}
            tbl_name = tbl.name.encode("utf-8")
            if tbl_name == "tbl_user_info":
                tbl_name = "tbl_patient_info"
                doc["filename"] = filename
            collection = self._mongodb.get_collection(tbl_name)
            exist_id = collection.find_one({"_id": _id})
            if exist_id is not None:
                log.warning("medical_id {0} is existed in {1}, filename:{2}".format(_id, tbl_name, filename))
                continue
            fields = tbl.contents
            if tbl_name == "tbl_long_medical_orders" or tbl_name == "tbl_temp_medical_orders":
                doc["items"] = self._parse_items(fields)
            else:
                doc_temp = self._parse_fields(fields)
                doc.update(doc_temp)

            collection.insert_one(doc)
            log.info("finish insert {0} to {1}".format(_id, tbl_name))

    def _parse_item(self, item):
        """
        解析单个item： <item>...</item>
        :param item:
        :return:
        """
        item_doc = {}
        for filed in item:
            if not isinstance(filed, element.Tag):
                continue
            item_doc[filed.name.encode("utf-8")] = filed.text.encode("utf-8").strip()
        return item_doc

    def _parse_items(self, fields):
        """
        解析tbl_long_medical_orders tbl_temp_medical_orders这样的第一级为<item>的表
        :return:
        """
        items_value = []
        for item in fields:
            if not isinstance(item, element.Tag):
                continue
            item_doc = self._parse_item(item)
            items_value.append(item_doc)
        return items_value

    def _parse_fields(self, fields):
        """
        解析第一级非<item>的表，已经存在第二级为<item>的表
        :rtype: object
        :param fields:
        :return:
        """
        doc = {}
        for field in fields:
            if not isinstance(field, element.Tag):
                continue
            children = field.contents
            if len(children) == 1:  # 处理第一级字段，如medical_id
                doc[field.name.encode("utf-8")] = field.text.encode("utf-8").strip()
            else:  # 处理第一级字段下还有子字段的
                item_list = []
                for item in children:
                    if not isinstance(item, element.Tag):
                        continue
                    item_doc = self._parse_item(item)
                    item_list.append(item_doc)
                doc[field.name.encode("utf-8")] = item_list

        return doc