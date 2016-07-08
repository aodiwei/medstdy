# coding: utf-8
'''
Created on 2016年2月18日

@author: AilenZou
'''
import os

import requests
import tornado.web
import tornado.httpclient

import config
import define
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class CustomHTTPError(tornado.web.HTTPError):
    def __init__(self, status_code, error, cause=None, log_message=None, *args, **kwargs):
        self.error = error
        self.cause = cause
        super(CustomHTTPError, self).__init__(status_code, log_message, *args, **kwargs)


class BaseHandler(tornado.web.RequestHandler):
    C_COOKIE = "cookie"

    def initialize(self):
        self.__db_session = None

    def on_finish(self, chunk=None):
        if self.__db_session:
            self.__db_session.close()

    @property
    def db_session(self):
        if self.__db_session is None:
            self.__db_session = self.__get_db_session()
        return self.__db_session
    
    def get_current_user(self):
        cookie = self.get_secure_cookie(self.C_COOKIE)
        if not cookie:
            raise CustomHTTPError(401, define.C_EC_auth, cause=define.C_CAUSE_cookieMissing)

        config.ConfigMgr.init(os.path.join(define.root, "config/user.yaml"))
        server_conf = config.ConfigMgr.get("user_server", {})
        url = "http://{host}:{port}/cookie_auth".format(**server_conf)
        payload = {
            "cookie": cookie,
        }
        response = requests.get(url=url, params=payload)
        if response.status_code == 200:
            return response.text
        return False
    
    def write_error(self, status_code, **kwargs):
        if status_code >= 500:
            tornado.web.RequestHandler.write_error(self, status_code, **kwargs)
        elif "exc_info" in kwargs:
            _, err, _ = kwargs['exc_info']
            if isinstance(err, CustomHTTPError):
                self.write({
                            "error": err.error,
                            "cause": err.cause,
                            })
            else:
                tornado.web.RequestHandler.write_error(self, status_code, **kwargs)
        else:
            tornado.web.RequestHandler.write_error(self, status_code, **kwargs)

    def __get_db_session(self):
        """
        use sqlalchemy to get a mysql session
        :return:
        """
        config.ConfigMgr.init(os.path.join(define.root, "config/user.yaml"))
        redis_conf = config.ConfigMgr.get("mysql", {})
        db_connect_string = "mysql+mysqldb://{user}:{password}@{host}:{port}/{dbname}?charset=utf8".format(**redis_conf)
        engine = create_engine(db_connect_string, echo=True)
        db_session = sessionmaker(bind=engine)
        return db_session()
