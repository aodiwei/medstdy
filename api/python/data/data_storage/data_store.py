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
        self._solr = Instances.get_solr_inst()
        conf = Utility.conf_get("data_server")
        if 'Windows' in platform.system():
            self.data_file_path = conf.get("data_file_path_win")
        else:
            self.data_file_path = conf.get("data_file_path")
        if not os.path.exists(self.data_file_path):
            os.makedirs(self.data_file_path)

    def store_data_from_disk(self):
        """
        store disk xml to mongodb and solr
        :return:
        """
        list_dirs = os.walk(self.data_file_path)
        for root, dirs, files in list_dirs:
            for filename in files:
                try:
                    with open(os.path.join(self.data_file_path, filename), "rb") as f:
                        file_body = f.readlines()
                        if file_body:
                            file_body = file_body[0]
                        else:
                            continue
                    self.data_store(file_body, filename)
                except Exception, e:
                    log.exception("import disk file {} failed".format(filename))

    def store_data_from_web(self, file_info):
        """
        存储来自网页上传的xml
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
            self.data_store(file_body, filename)
        except Exception, e:
            log.exception("parse file {0} failed {1}".format(filename, e))
            raise CustomMgrError(define.C_CAUSE_fileError)

    def data_store(self, file_body, filename):
        """
        import data
        :param filename:
        :param file_body:
        :return:
        """
        tbl_doc = self.parse_xml(file_body, filename)
        self.add_doc_to_mongodb(**tbl_doc)
        self.add_doc_to_solr(**tbl_doc)
        # 记录操作
        operation_cause = "upload file {0}".format(filename)
        Utility.log_important_operation(self.user, operation_cause)

    def _format_text(self, text):
        """
        remove sign
        :param text:
        :return:
        """
        return text.strip().replace(" ", "").replace("\n", "").replace("\r", "")

    def parse_xml(self, file_body, filename):
        """
        parse xml and store in mongodb
        :param filename:
        :param file_body:
        :return:
        """
        soup = BeautifulSoup(file_body, "lxml")
        id_ele = soup.find("medical_id")
        _id = id_ele.text.strip()
        create_datetime = time.strftime("%Y-%m-%d %H:%M:%S")

        tbl_doc = {}
        tbl_list = soup.find_all(re.compile(r"^tbl*"))
        for tbl in tbl_list:
            doc = {"_id": _id, "create_datetime": create_datetime}
            tbl_name = tbl.name
            if tbl_name == "tbl_user_info":
                tbl_name = "tbl_patient_info"
                doc["filename"] = filename
            fields = tbl.contents
            if tbl_name == "tbl_long_medical_orders" or tbl_name == "tbl_temp_medical_orders":
                doc["items"] = self._parse_items(fields)
            else:
                doc_temp = self._parse_fields(fields)
                doc.update(doc_temp)
            tbl_doc[tbl_name] = doc
        return tbl_doc

    def _parse_item(self, item):
        """
        解析单个item： <item>...</item>
        :param item:
        :return:
        """
        item_doc = {}
        for field in item:
            if not isinstance(field, element.Tag):
                continue
            item_doc[field.name] = self._format_text(field.text)
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
                doc[field.name] = self._format_text(field.text)
            else:  # 处理第一级字段下还有子字段的
                item_list = []
                for item in children:
                    if not isinstance(item, element.Tag):
                        continue
                    item_doc = self._parse_item(item)
                    item_list.append(item_doc)
                doc[field.name.strip()] = item_list

        return doc

    def add_doc_to_solr(self, **tbl_doc):
        """
        存入solr
        :param tbl_doc:
        :return:
        """
        solr_fields_str = Utility.conf_get("solr_fields")
        solr_fields_list = solr_fields_str.split(" ")
        solr_fields_set = set(solr_fields_list)
        solr_fields = {}
        for _, doc in tbl_doc.iteritems():
            tbl_fields = doc.keys()
            keys = solr_fields_set & set(tbl_fields)
            for k in keys:
                solr_fields[k] = doc[k]

        self._solr.add(solr_fields)
        self._solr.commit()
        log.info("add {} to solr".format(doc["_id"]))

    def add_doc_to_mongodb(self, **tbl_doc):
        """
        存入mongodb
        :param tbl_doc:
        :return:
        """
        for tbl_name, doc in tbl_doc.iteritems():
            collection = self._mongodb.get_collection(tbl_name)
            exist_id = collection.find_one({"_id": doc["_id"]})
            if exist_id is not None:
                log.warning("medical_id {0} is existed in {1}".format(doc["_id"], tbl_name))
                continue
            collection.insert_one(doc)
            log.info("finish insert {0} to {1}".format(doc["_id"], tbl_name))

        return True
