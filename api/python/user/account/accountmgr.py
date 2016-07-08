# coding=utf-8
"""
user manager
@david
"""
import base64
import hashlib
import json
import os
import uuid

import redis
import requests

import config
import define
from logs import LoggerMgr
from user.db.dbclass import User
from sqlalchemy.exc import IntegrityError
import yagmail


class CustomMgrError(Exception):
    def __init__(self, msg):
        self.message = msg

    def __str__(self):
        return repr(self.message)


class AccountMgr(object):
    """
    account manage
    """
    __ids = {}
    config.ConfigMgr.init(os.path.join(define.root, "config/user.yaml"))

    def __init__(self, db_session=None):
        self.__db_session = db_session
        self.__logger = LoggerMgr.getLogger()

    def get_redis_inst(self):
        """
        get a redis instance
        :return:
        """
        redis_conf = config.ConfigMgr.get("redis", {})
        redis_host = redis_conf.get("host", "localhost")
        redis_port = redis_conf.get("port", 6379)

        return redis.StrictRedis(host=redis_host, port=redis_port, db=0)

    def send_email(self, subject, contents, send_to=None, **kwargs):
        """
        send email, by default, use email info in config file, if you want use personal email,
        use kwargs like:
        kwargs = {
            "user": xxxx,
            "password", xxxx,
            "host": xxx,
            "to":xxx,
            "cc":xxx # a list or str
        }
        :param subject:
        :param contents:
        :param kwargs:
        :return:
        """
        if kwargs:
            user = kwargs.get("user")
            password = kwargs.get("password")
            host = kwargs.get("host")
            to = kwargs.get("to")
            cc = kwargs.get("cc", None)
        else:
            conf = config.ConfigMgr.get("email", {})
            user = conf.get("user")
            password = conf.get("password")
            host = conf.get("host")
            to = conf.get("to")
            cc = conf.get("cc", "")
            if cc:
                cc = cc.split(",")

        if send_to is not None:
            to = send_to
        to = to.encode("utf-8")
        yag = yagmail.SMTP(user=user, password=password, host=host)
        yag.send(to=to, subject=subject, contents=contents, cc=cc)


    def register(self, **kwargs):
        """
        user register
        :param kwargs:
        :return:
        """
        id = self.__get_id(User.__tablename__)
        if not id:
            return None
        kwargs["uid"] = id
        # 加密
        m = hashlib.md5()
        m.update(kwargs["password"])
        kwargs["password"] = m.hexdigest()
        user = User(**kwargs)
        try:
            self.__db_session.add(user)
            self.__db_session.commit()
            self.__logger.info("add a user: {account}".format(**kwargs))
        except IntegrityError, e:
            msg = e.message
            # 从异常里找出是账号冲突还是邮箱冲突
            if msg.find("account") > 0:
                conflict = "account has existed"
                self.__logger.warning("{0}:{1}".format(conflict, kwargs["account"]))
            elif msg.find("email") > 0:
                conflict = "email has existed"
                self.__logger.warning("{0}:{1}".format(conflict, kwargs["email"]))
            else:
                conflict = msg
            raise CustomMgrError(conflict)

    def __get_id(self, db_name):
        """
        get primary id for db table
        :param db_name:
        :return:
        """
        ids = AccountMgr.__ids.get(db_name, None)
        if not ids:
            conf = config.ConfigMgr.get("id_server", {})
            # host = conf.get("host", "localhost")
            # port = conf.get("port", "10000")
            payload = {"type": db_name, "count": int(conf.get("{0}_req_num".format(db_name), 5)),}
            url = "http://{host}:{port}/allocate".format(**conf)
            try:
                response = requests.get(url=url, params=payload)
            except requests.ConnectionError, e:
                raise CustomMgrError("id allocate server exception")

            if response.status_code == 200:
                result = json.loads(response.text)
                if result.get("data", None):
                    result["data"].reverse()
                    self.__logger.info("{0} get primary id {1}".format(db_name, result))
                    AccountMgr.__ids[db_name] = ids = result["data"]

        return ids.pop() if ids else None

    def login(self, **kwargs):
        """
        user login
        :param kwargs:
        :return:
        """
        result = self.__db_session.query(User.password, User.uid).filter(User.email == kwargs["user_name"]).first()
        if result is None:
            raise CustomMgrError(define.C_CAUSE_accountNotExisted)
        m = hashlib.md5()
        m.update(kwargs["password"])
        encryopted_password = m.hexdigest()
        if result.password == encryopted_password:
            return result.uid
        else:
            self.__logger.warning("{0} login failed with wrong password".format(kwargs["user_name"]))
            return None

    def cookie_cache(self, **kwargs):
        """
        save cookie in redis
        :param kwargs:
        :return:
        """
        try:
            redis_inst = self.get_redis_inst()
            value = kwargs.copy()
            value.pop("cookie")
            value = json.dumps(value)
            conf = config.ConfigMgr.get("redis", {})
            # cookie过期时间
            cookie_expire = conf.get("cookie_expire", 864000)
            redis_inst.set(kwargs["cookie"], value, ex=int(cookie_expire))
        except redis.ConnectionError, e:
            self.__logger.error(e)
            raise CustomMgrError(define.C_CAUSE_setKeyError)

    def cookie_auth(self, **kwargs):
        """
        和redis里缓存的cookie匹配
        :param kwargs:
        :return:
        """
        try:
            redis_inst = self.get_redis_inst()
            value = redis_inst.get(kwargs["cookie"])
            if value:
                conf = config.ConfigMgr.get("redis", {})
                # cookie过期时间
                cookie_expire = conf.get("cookie_expire", 864000)
                redis_inst.expire(kwargs["cookie"], cookie_expire)
                return json.loads(value)
        except redis.ConnectionError, e:
            self.__logger.error(e)
            raise CustomMgrError(define.C_CAUSE_getKeyError)

    def cookie_delete(self, cookie):
        """
        delete cookie for logout
        :param cookie:
        :return:
        """
        redis_inst = self.get_redis_inst()
        redis_inst.delete(cookie)
        self.__logger.info("delete cooike from redis {0}".format(cookie))

    def get_user_info(self, uid):
        """
        get user info
        :param uid:
        :return:
        """
        result = self.__db_session.query(User.account, User.email, User.uid, User.create_time, User.image).\
            filter(User.uid == uid).first()

        if result:
            response = {
                "uid": result.uid,
                "account": result.account,
                "email": result.email,
                "create_time": str(result.create_time),
                "image": result.image,
            }
        else:
            response = None

        return response

    def modify_password(self, uid, old_password, new_password):
        """
        modify user password
        :param new_password:
        :param old_password:
        :param uid:
        :return:
        """
        result = self.__db_session.query(User.password).filter(User.uid == uid).first()
        if result is None:
            raise CustomMgrError(define.C_CAUSE_accountNotExisted)
        m = hashlib.md5()
        m.update(old_password)
        encryopted_password = m.hexdigest()
        if result.password == encryopted_password:
            m.update(new_password)
            encryopted_password = m.hexdigest()
            result.password = encryopted_password
        else:
            self.__logger.warning("{0} modify password failed with wrong password".format(uid))
            raise CustomMgrError(define.C_CAUSE_wrongPassword)

    def reset_password(self, email, new_password):
        """
        reset password when forget password
        :param new_password:
        :param email:
        :return:
        """
        result = self.__db_session.query(User.email).filter(User.email == email).first()
        if result is None:
            raise CustomMgrError(define.C_CAUSE_accountNotExisted)
        m = hashlib.md5()
        m.update(new_password)
        encryopted_password = m.hexdigest()
        User.email = encryopted_password

    def check_reset_pws_url(self, email, key):
        """
        check url
        :param key:
        :param email:
        :return:
        """
        redis_inst = self.get_redis_inst()
        _key = redis_inst.get(email)
        if _key != key:
            self.__logger.error("url key error {0} != {1}".format(_key, key))
            raise CustomMgrError("invalid url")

    def send_email_url(self, email):
        """
        send a email to reset password
        :param email:
        :return:
        """
        rand_str = base64.b64encode(uuid.uuid4().bytes)
        m = hashlib.md5()
        m.update(rand_str)
        key = m.hexdigest()
        redis_inst = self.get_redis_inst()
        redis_inst.set(email, key, ex=600)

        conf = config.ConfigMgr.get("user_server", {})
        url = "http://{host}:{port}/reset_psw?key={0}&email={1}".format(key, email, **conf)
        content = "请勿回复本邮件.点击下面的链接,重设密码<br/><a href=" + url + " target='_BLANK'>点击我重新设置密码</a>" \
                       + "<br/>tips:本邮件超过30分钟,链接将会失效，需要重新申请'找回密码'"
        subject = "teamwork 找回密码"

        try:
            self.send_email(subject=subject, contents=content, send_to=email)
            self.__logger.info("send a url:{0} to email successfully".format(url))
        except Exception, e:
            self.__logger.exception("send url:{0} failed".format(url))
            raise CustomMgrError("send url email failed")
