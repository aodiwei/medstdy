# coding: utf-8
'''
Created on 2016年2月16日

@author: AilenZou
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
        for cfg in configs.get("handlers", []):
            if cfg["type"] == "file":
                filePath = cfg["path"]
                if not filePath.startswith("/"):
                    filePath = os.path.join(root, filePath)
                dirPath = os.path.dirname(filePath)
                if not os.path.exists(dirPath):
                    os.mkdir(dirPath)
                hdlr = logging.FileHandler(filePath)
                fmt = defaultFmtter
                if cfg.get("format", None) is not None:
                    fmt = logging.Formatter(cfg["format"])
                hdlr.setFormatter(fmt)
                hdlr.setLevel(logging.getLevelName(cfg.get("level", defaultLevel)))
                logger.addHandler(hdlr)
            else:
                raise UnknownKeyError("unknown type: %s" % cfg["type"])
            
    @classmethod
    def getLogger(cls):
        return logging.getLogger(cls.C_LOGGER_NAME)

