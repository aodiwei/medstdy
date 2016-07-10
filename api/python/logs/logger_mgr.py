# coding: utf-8
'''
Created on 2016年2月16日

@author: David Ao
'''

# from .standard import StandardLogger
from .exceptions import UnknownKeyError

import logging
import os


class LoggerMgr(object):
    '''
    classdocs
    '''
    C_LOGGER_NAME = "tornado.access"
    
    @classmethod
    def init(cls, root, configs):
        defaultLevel = configs.get("level", "INFO")
        f = "%(levelname)s-%(asctime)s-%(filename)s-%(lineno)d-%(funcName)s[%(thread)d]: %(message)s"
        defaultFormat = configs.get("format", f)
        defaultFmtter = logging.Formatter(defaultFormat)
        logger = logging.getLogger(cls.C_LOGGER_NAME)
        logger.setLevel(logging.getLevelName(defaultLevel))

        filePath = configs.get("path")
        if not filePath.startswith("/"):
            filePath = os.path.join(root, filePath)
        dirPath = os.path.dirname(filePath)
        if not os.path.exists(dirPath):
            os.mkdir(dirPath)
        hdlr = logging.FileHandler(filePath)
        fmt = defaultFmtter
        hdlr.setFormatter(fmt)
        hdlr.setLevel(logging.getLevelName(defaultLevel))
        logger.addHandler(hdlr)

            
    @classmethod
    def getLogger(cls):
        return logging.getLogger(cls.C_LOGGER_NAME)

