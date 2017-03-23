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
    (r"/data/request_base_info_list", RequestBaseInfoDataListHandler),
    (r"/data/save_temp", SaveTempHandler),
    (r"/data/get_temp", GetTempHandler),
    (r"/data/record_statistic", RecordStatisticHandler),
    (r"/data/extract_feature", ExtractFeatureHandler),
    (r"/data/svm_predict", SvmPredictHandler),
]
