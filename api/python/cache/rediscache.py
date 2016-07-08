# coding: utf-8
'''
Created on 2015年12月11日

@author: AilenZou
'''
from .cache import Cache
import pickle
import redis
import time
import exces


class RedisCache(Cache):
    def __init__(self, logger, timeout=10, **configs):
        """
            Cache implements with Redis.
            @param logger: logger to log.
            @param timeout: the expire time, None for forever.
        """
        try:
            timeout = int(timeout)
            if timeout <= 0:
                timeout = None
        except:
            timeout = 10
        self.__timeout = timeout
        self.__configs = configs
        self.__redisClient = redis.StrictRedis(**self.__configs)
        self.logger = logger

    def __retry(self, procedure, *args, **kwargs):
        retry = 0
        while True:
            retry += 1
            try:
                return procedure(*args, **kwargs)
            except:
                if retry >= 3:
                    self.logger.exception("Failed after %d retries", retry)
                    raise
                self.logger.warning("Error occurs, retrying ...")
                time.sleep(1)
        
    def _do_get_from_cache(self, key):
        v = self.__retry(self.__redisClient.get, key)
        if v is None:
            return None
        return pickle.loads(v)
        
    def _do_save_cache(self, key, value, timeoutSecond=None):
        v = pickle.dumps(value)
        timeout = self.__timeout if timeoutSecond is None else timeoutSecond
        def do(key, timeout, v):
            self.logger.debug("timeout: %s", timeout)
            if timeout is not None:
                self.__redisClient.setex(key, 
                                         timeout, 
                                         v
                                         )
            else:
                self.__redisClient.set(key,
                                       v)
        try:
            self.__retry(do, key, timeout, v)
        except redis.ConnectionError:
            raise exces.ConnectionError()
        
    def _do_delete_cache(self, *keys):
        try:
            self.__retry(self.__redisClient.delete, *keys)
        except redis.ConnectionError:
            raise exces.ConnectionError()
        
    def _do_list_keys(self, pattern):
        try:
            keys = self.__retry(self.__redisClient.keys, pattern)
            return keys if keys is not None else []
        except redis.ConnectionError:
            raise exces.ConnectionError()
