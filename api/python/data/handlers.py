# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''
import tornado.web
import define
from api.basehandler import BaseHandler, CustomHTTPError
from data.data_storage.data_store import DataStorage
from logs import CustomMgrError


class UploadHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        try:
            files = self.request.files['file']
            user = self.get_current_user()
            user_name = user.get("user_name")
            data_mgr = DataStorage(user=user_name)
            map(data_mgr.data_store_mgr, files)
        except CustomMgrError, e:
            raise CustomHTTPError(401, error=define.C_EC_fileError, cause=e.message)

