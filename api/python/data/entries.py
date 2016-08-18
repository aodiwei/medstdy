# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''

from data.handlers import *
entries = [
    (r"/data/upload-file", UploadHandler),
    (r"/data/form-data", FormDataHandler),
]
