# coding: utf-8
'''
Created on 2016年2月18日

@author: AilenZou
'''

import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 以下是常量，提供统一管理，方便语言本地化

# Error code
C_EC_auth = "authError"
C_EC_wrongPassword = "wrongPassword"
C_EC_userMissing = "userMissing"
C_EC_cacheError = "cacheError"
C_EC_emailError = "emailError"

# Error cause
C_CAUSE_userMissing = "userMissing"
C_CAUSE_wrongPassword = "wrongPassword"
C_CAUSE_authError = "authError"
C_CAUSE_cookieMissing = "cookieMissing"

C_CAUSE_accountExisted = "accountExisted"
C_CAUSE_accountNotExisted = "accountNotExisted"

C_CAUSE_setKeyError = "setKeyError"
C_CAUSE_getKeyError = "getKeyError"
C_CAUSE_delKeyError = "delKeyError"

C_CAUSE_sendError = "sendError"
C_CAUSE_invalidUrl = "invalidUrl"
