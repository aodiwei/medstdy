#coding: utf-8
'''
Created on 2015年12月11日

@author: David Ao
'''

class Cache(object):
    def _do_get_from_cache(self, key):
        """
            Get value from cache.
            @param key: String, the key.
            @return: value of the key; None if missing.
        """
        raise
    
    def _do_save_cache(self, key, value, timeout=None):
        """
            Save new value of the key.
            @param key: String.
            @param value: object value to save.
            @param timeout: Expire time in second, None for forever.
        """
        raise
    
    def _do_delete_cache(self, key):
        """
            Delete key from the cache.
            @param key: String.
        """
        raise
    
    def _do_list_keys(self, pattern):
        """
            List all of the keys matching the pattern.
            @param pattern: pattern string for matching, None for all.
            @return:
                List of keys.
        """
        raise
    
    def get(self, key, fetcher=None, forceReload=False, **kwargs):
        """
            Get value of the @key, if there is no value, @fetcher will be called
            with @args and @kwargs for fetching the value. If no value fetched, 
            None will be returned.
            @param key: String.
            @param fetcher: Function, the method to fetch value if missing.
            @param forceReload: True for forcing to reload data.
            @param kwargs: KV args for fetcher.
            @return: 
                Value of the key; None if missing.
        """
        value = self._do_get_from_cache(key) if not forceReload else None
        if value is None and fetcher is not None:
            value = fetcher(**kwargs)
            if value is None:
                return None
            self._do_save_cache(key, value)
        return value
            
    def set(self, key, value, timeout=None):
        """
            Set value of key.
            @param key: String.
            @param value: object.
            @param timeout: Expire time in second, None for forever.
        """
        self._do_save_cache(key, value, timeout)
        
    def delete(self, *keys):
        """
            Delete key from the cache.
            @param keys: list of keys.
        """
        self._do_delete_cache(*keys)
        
    def list_keys(self, pattern):
        """
            List all of the keys matching the pattern.
            @param pattern: pattern string for matching, None for all.
            @return:
                List of keys.
        """
        return self._do_list_keys(pattern)
