# coding: utf-8
'''
Created on 2016年2月18日

@author: AilenZou
'''
import tornado.web
import define
from api.basehandler import BaseHandler, CustomHTTPError


class SelfHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        pass


class LoginHandler(BaseHandler):
    def post(self):
        email = self.get_argument("email")
        password = self.get_argument("password")
        # raise CustomHTTPError(401,
        #                       define.C_EC_wrongPassword,
        #                       cause=define.C_CAUSE_userMissing
        #                       )
