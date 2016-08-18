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
from logs import CustomMgrError
from tools.utility import Utility


class UploadHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        files = self.request.files['file']
        user = self.get_current_user()
        user_name = user.get("user_name")
        try:
            data_mgr = DataStorage(user=user_name)
            map(data_mgr.store_data_from_web, files)
        except CustomMgrError, e:
            raise CustomHTTPError(500, error=define.C_EC_fileError, cause=e.message)


class FormDataHandler(BaseHandler):
    """
    存录入的数据
    """
    @tornado.web.authenticated
    def post(self):
        patient_info = self.get_argument("patient_info", None)
        patient_info = json.loads(patient_info, encoding="utf-8")
        in_date = patient_info["in_date"]
        in_date = Utility.utc2local(in_date)
        pass