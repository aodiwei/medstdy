# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''

import os
import define
import config
import logs
import yaml



def init():
    config.ConfigMgr.init(os.path.join(define.root, "config/config.yaml"))
    conf = config.ConfigMgr.get("logger_user", {})
    logs.LoggerMgr.init(define.root, conf)

    

def finish():
    logger = logs.LoggerMgr.getLogger()
    logger.info("finish now")
