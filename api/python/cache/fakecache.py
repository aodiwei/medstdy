# coding: utf-8
'''
Created on 2016年3月18日

@author: AilenZou
'''

from .cache import Cache

class FakeCache(Cache):
    def __init__(self):
        """
            Fake cache for disabling cache.
        """
        pass
        
    def _do_get_from_cache(self, key):
        return None
        
    def _do_save_cache(self, key, value, timeoutSecond=None):
        pass
        
    def _do_delete_cache(self, *keys):
        pass
    
    def _do_list_keys(self, pattern):
        return []
