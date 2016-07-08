# coding: utf-8
'''
Created on 2016年2月18日

@author: AilenZou
'''

import os
import define
import config
import logs
import yaml
import cache


def init():
    config.ConfigMgr.init(os.path.join(define.root, "config/user.yaml"))
    with open(os.path.join(define.root, "config/user-logger.yaml"), 'r') as s:
        c = yaml.load(s)
        logs.LoggerMgr.init(define.root, c)
    logger = logs.LoggerMgr.getLogger()
    cacheConfig = config.ConfigMgr.get("cache", None)
    if cacheConfig is not None:
        # 设置了缓存
        cache.CacheMgr.init(logger, **cacheConfig)
    

def finish():
    logger = logs.LoggerMgr.getLogger()
    logger.info("finish now")
