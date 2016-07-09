# coding: utf-8
'''
Created on 2015年10月14日

@author: David Ao
'''
import yaml


class ConfigMgr(object):

    @classmethod
    def init(cls, configFile):
        with open(configFile, 'r') as s:
            cls.__config = yaml.load(s)
    
    @classmethod
    def get(cls, key, default=None):
        return cls.__config.get(key, default)
    
    @classmethod
    def all(cls):
        return cls.__config
