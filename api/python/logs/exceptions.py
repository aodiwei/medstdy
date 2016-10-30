# coding: utf-8
'''
Created on 2016年2月16日

@author: David Ao
'''


class UnimplementedError(Exception):
    pass


class UnknownKeyError(Exception):
    pass


class CustomMgrError(Exception):
    def __init__(self, msg):
        self.message = msg

    def __str__(self):
        return repr(self.message)


class DataExistError(Exception):
    pass
