# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''
import tornado.web
import define
from api.basehandler import BaseHandler, CustomHTTPError


class UploadHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        pass
