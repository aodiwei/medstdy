# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''

from user.handlers import *

entries = [
    # account
    (r"/register$", RegisterHandler),
    (r"/login$", LoginHandler),
    (r"/cookie_auth$", CookieAuthHandler),
    (r"/logout$", LogoutHandler),
    (r"/user_info$", UserInfoHandler),
    (r"/modify_psw$", ModifyPasswordHandler),
    (r"/reset_psw$", ResetPasswordHandler),
    (r"/send_mail_addr$", SendMailHandler),

]
