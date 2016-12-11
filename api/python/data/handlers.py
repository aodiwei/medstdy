# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''
import json
import re

import tornado.web
import define
from api.basehandler import BaseHandler, CustomHTTPError
from data.data_storage.data_store import DataStorage
from logs import CustomMgrError, DataExistError
from tools.utility import Utility


class UploadXmlHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        files = self.request.files['file']
        user = self.get_current_user()
        user_name = user.get("user_name")
        try:
            data_mgr = DataStorage(user=user_name)
            map(data_mgr.store_xml_from_web, files)
        except CustomMgrError, e:
            raise CustomHTTPError(400, error=define.C_EC_fileError, cause=e.message)


class UploadCsvHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        files = self.request.files['file']
        user = self.get_current_user()
        user_name = user.get("user_name")
        try:
            data_mgr = DataStorage(user=user_name)
            map(data_mgr.store_csv_from_web, files)
        except CustomMgrError, e:
            raise CustomHTTPError(400, error=define.C_EC_fileError, cause=e.message)


class FormDataHandler(BaseHandler):
    """
    存录入的数据
    """

    @tornado.web.authenticated
    def post(self):
        data_info = json.loads(self.request.body)
        user = self.get_current_user()
        user_name = user.get("user_name")
        data_mgr = DataStorage(user=user_name)

        try:
            data_mgr.form_data(**data_info)
        except DataExistError, e:
            raise CustomHTTPError(412, error=define.C_EC_formError, cause=e.message)


class RequestDataHandler(BaseHandler):
    """
    获取的数据
    """

    @tornado.web.authenticated
    def get(self):
        medical_id = self.get_argument("medical_id")
        out_date = self.get_argument("out_date")
        data_mgr = DataStorage()
        try:
            res = data_mgr.get_data(medical_id, out_date)
        except DataExistError, e:
            raise CustomHTTPError(412, error=define.C_CAUSE_IdNonexistence, cause=e.message)

        self.write(res)


class RequestBaseInfoDataListHandler(BaseHandler):
    """
    获取基本信息数据list
    """

    @tornado.web.authenticated
    def get(self):
        try:
            skip = int(self.get_argument("skip", 0))
            limit = int(self.get_argument("limit", 50))
            all = int(self.get_argument("all", 0))
            field = self.get_argument("field", None)
            query = self.get_argument("query", None)
        except ValueError as e:
            raise CustomHTTPError(400, error=define.C_EC_InvalidArgError, cause=e.message)
        data_mgr = DataStorage()
        try:
            params = {}
            if all == 0:
                params = {"dataer": {"$exists": 1}}
            if field and query:
                rexExp = re.compile(u".*{}.*".format(query), re.IGNORECASE)
                if field == "main_diagnosis":
                    params.update({'main_diagnosis.diagnosis': rexExp})
                elif field == "main_surgery":
                    params.update({'main_surgery.surgery': rexExp})
                else:
                    params.update({field: query})
            docs, count = data_mgr.get_base_data_list(skip, limit, **params)
            res = {
                "data": docs,
                "count": count
            }
        except DataExistError, e:
            raise CustomHTTPError(412, error=define.C_CAUSE_IdNonexistence, cause=e.message)

        self.write(res)


class SaveTempHandler(BaseHandler):
    """
    每1分钟自动保存当前录入情况，但不保存到数据库
    """
    @tornado.web.authenticated
    def post(self):
        data_info = json.loads(self.request.body)
        user = self.get_current_user()
        user_name = user.get("user_name")
        data_mgr = DataStorage(user=user_name)

        try:
            data_mgr.save_temp(**data_info)
        except Exception, e:
            raise CustomHTTPError(400, error=define.C_CAUSE_fileError, cause=e.message)


class GetTempHandler(BaseHandler):
    """
    每1分钟自动保存当前录入情况，但不保存到数据库
    """
    @tornado.web.authenticated
    def get(self):
        user = self.get_current_user()
        user_name = user.get("user_name")
        data_mgr = DataStorage(user=user_name)

        try:
            res = data_mgr.get_temp()
        except Exception, e:
            raise CustomHTTPError(400, error=define.C_CAUSE_fileError, cause=e.message)

        self.write(res)


class RecordStatisticHandler(BaseHandler):
    """
    每1分钟自动保存当前录入情况，但不保存到数据库
    """
    @tornado.web.authenticated
    def get(self):
        data_mgr = DataStorage(None)

        try:
            res = data_mgr.record_statistic()
        except Exception, e:
            raise CustomHTTPError(400, error=define.C_CAUSE_mongodbError, cause=e.message)

        self.write({
            "data": res
        })
