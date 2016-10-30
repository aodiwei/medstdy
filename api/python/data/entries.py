# coding: utf-8
'''
Created on 2016年2月18日

@author: David Ao
'''

from data.handlers import *
entries = [
    (r"/data/upload-xml", UploadXmlHandler),
    (r"/data/upload-csv", UploadCsvHandler),
    (r"/data/form-data", FormDataHandler),
    (r"/data/request_data", RequestDataHandler),
]
