# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''
import json

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
        outdate = self.get_argument("out_date")
        data_mgr = DataStorage()
        try:
            res = data_mgr.get_data(medical_id, outdate)
        except DataExistError, e:
            raise CustomHTTPError(412, error=define.C_CAUSE_IdNonexistence, cause=e.message)

        self.write(res)
