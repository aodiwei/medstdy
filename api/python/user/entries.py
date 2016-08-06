# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''

from user.handlers import *

entries = [
    # account
    (r"/user/register$", RegisterHandler),
    (r"/user/login$", LoginHandler),
    (r"/user/cookie_auth$", CookieAuthHandler),
    (r"/user/logout$", LogoutHandler),
    (r"/user/user_info$", UserInfoHandler),
    (r"/user/modify_psw$", ModifyPasswordHandler),
    (r"/user/reset_psw$", ResetPasswordHandler),
    (r"/user/send_mail_addr$", SendMailHandler),
    (r"/user/auth$", AuthHandler),

]
