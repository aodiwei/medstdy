# coding=utf-8
"""
user manager
@david
"""
import base64
import hashlib
import json
import os
import re
import time
import uuid

import yagmail
from sqlalchemy.exc import IntegrityError

import config
import define
from db.dbclass import TbUser, TbCookies
from logs import LoggerMgr, CustomMgrError
log = LoggerMgr.getLogger()


class AccountMgr(object):
    """
    account manage
    """
    __ids = {}
    config.ConfigMgr.init(os.path.join(define.root, "config/config.yaml"))

    def __init__(self, db_session=None):
        self.__db_session = db_session

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
        # 加密
        m = hashlib.md5()
        m.update(kwargs["password"])
        kwargs["password"] = m.hexdigest()
        user = TbUser(**kwargs)
        try:
            self.__db_session.add(user)
            self.__db_session.commit()
            log.info("add a user: {account}".format(**kwargs))
        except IntegrityError, e:
            msg = e.message
            # 从异常里找出是账号冲突还是邮箱冲突
            if msg.find("account") > 0:
                conflict = "account has existed"
                log.warning("{0}:{1}".format(conflict, kwargs["account"]))
            elif msg.find("email") > 0:
                conflict = "email has existed"
                log.warning("{0}:{1}".format(conflict, kwargs["email"]))
            else:
                conflict = msg
            raise CustomMgrError(conflict)

    def login(self, **kwargs):
        """
        user login
        :param kwargs:
        :return:
        """
        p = re.compile(r"^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")
        if p.match(kwargs["user_name"]):  # email
            result = self.__db_session.query(TbUser.password, TbUser.uid).filter(TbUser.email == kwargs["user_name"]).first()
        else:
            result = self.__db_session.query(TbUser.password, TbUser.uid).filter(TbUser.account == kwargs["user_name"]).first()
        if result is None:
            raise CustomMgrError(define.C_CAUSE_accountNotExisted)
        m = hashlib.md5()
        m.update(kwargs["password"])
        encryopted_password = m.hexdigest()
        if result.password == encryopted_password:
            log.log("{} login success".format(kwargs["user_name"]))
            return result.uid
        else:
            log.warning("{0} login failed with wrong password".format(kwargs["user_name"]))
            return None

    def cookie_cache(self, **kwargs):
        """
        save cookie in redis
        :param kwargs:
        :return:
        """
        try:
            value = kwargs.copy()
            value.pop("cookie")
            value = json.dumps(value)
            tb_cookie = TbCookies()
            tb_cookie.cookie = kwargs["cookie"]
            tb_cookie.value = value
            self.__db_session.add(tb_cookie)
            self.__db_session.commit()
        except Exception, e:
            log.error(e)
            raise CustomMgrError(define.C_CAUSE_setKeyError)

    def cookie_auth(self, **kwargs):
        """
        和redis里缓存的cookie匹配
        :param kwargs:
        :return:
        """
        try:
            result = self.__db_session.query(TbCookies.value, TbCookies.update_time).\
                filter(TbCookies.cookie == kwargs["cookie"]).first()
            print result
            if result:
                conf = config.ConfigMgr.get("cookie", {})
                # cookie过期时间
                cookie_expire = int(conf.get("cookie_expire", 864000))
                update_time = int(time.mktime(result.update_time.timetuple()))
                current_timestamp = int(time.time())
                if current_timestamp - update_time < cookie_expire:
                    current_datetime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                    self.__db_session.query(TbCookies).filter(TbCookies.cookie == kwargs["cookie"]).\
                        update({TbCookies.update_time: current_datetime})
                    self.__db_session.commit()
                    return json.loads(result.value)
        except Exception, e:
            log.error(e)
            raise CustomMgrError(define.C_CAUSE_getKeyError)

    def cookie_delete(self, cookie):
        """
        delete cookie for logout
        :param cookie:
        :return:
        """
        self.__db_session.query(TbCookies).filter(TbCookies.cookie == cookie).delete()

    def get_user_info(self, uid):
        """
        get user info
        :param uid:
        :return:
        """
        result = self.__db_session.query(TbUser.account, TbUser.email, TbUser.uid, TbUser.create_time, TbUser.image).\
            filter(TbUser.uid == uid).first()

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
        result = self.__db_session.query(TbUser.password).filter(TbUser.uid == uid).first()
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
            log.warning("{0} modify password failed with wrong password".format(uid))
            raise CustomMgrError(define.C_CAUSE_wrongPassword)

    def reset_password(self, email, new_password):
        """
        reset password when forget password
        :param new_password:
        :param email:
        :return:
        """
        result = self.__db_session.query(TbUser.email).filter(TbUser.email == email).first()
        if result is None:
            raise CustomMgrError(define.C_CAUSE_accountNotExisted)
        m = hashlib.md5()
        m.update(new_password)
        encryopted_password = m.hexdigest()
        TbUser.email = encryopted_password

    def check_reset_pws_url(self, email, key):
        """
        check url
        :param key:
        :param email:
        :return:
        """
        pass
        redis_inst = self.get_redis_inst()
        _key = redis_inst.get(email)
        if _key != key:
            log.error("url key error {0} != {1}".format(_key, key))
            raise CustomMgrError("invalid url")

    def send_email_url(self, email):
        """
        send a email to reset password
        :param email:
        :return:
        """
        pass
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
            log.info("send a url:{0} to email successfully".format(url))
        except Exception, e:
            log.exception("send url:{0} failed".format(url))
            raise CustomMgrError("send url email failed")
