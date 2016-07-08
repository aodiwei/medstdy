# coding: utf-8
'''
Created on 2016年3月10日

@author: AilenZou
'''

from .rediscache import RedisCache
from .fakecache import FakeCache
from .exces import UnsupportedError, UninitializedError

class CacheMgr(object):
    '''
    Manager for caches.
    '''
    __cache = None

    @classmethod
    def init(cls, logger, type, enable=True, **configs):
        '''
            Init the cache mgr.
            @param logger: logger instance for logging.
            @param type: 缓存类型，目前支持有"redis"
            @param enable: 是否启用缓存?
            @param configs: 针对此类型对应的配置
        '''
        if not enable:
            logger.warn("Run without cache")
            cls.__cache = FakeCache()
        else:
            if type == "redis":
                cls.__cache = RedisCache(logger, **configs)
            else:
                raise UnsupportedError()
    
    @classmethod
    def getCache(cls):
        if cls.__cache is None:
            raise UninitializedError()
        return cls.__cache