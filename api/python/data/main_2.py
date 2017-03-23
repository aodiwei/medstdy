#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/7/23"
__purpose__ = 
"""
import os
import sys
import platform
sys.path.append("..")
import env

env.init()
from data_storage.data_store import DataStorage
from mlearn.svm_ml import SvmLm

if __name__ == "__main__":
    data_mgr = DataStorage("manual_operation")
    # data_mgr.store_data_from_disk()
    # plat = platform.system()
    # if 'Windows' in plat:
    #     path = u"D:/MedStudy/source/testcsv"
    # elif "Darwin" in plat:
    #     path = "/Users/David/medstdy/docs/data"
    # else:
    #     pass
    # for root, dirs, files in os.walk(path):
    #     for fn in files:
    #         sub_path = os.path.join(root, fn)
    #         sub_path = sub_path.replace("\\", '/')
    #         data_mgr.parse_csv_file(path=sub_path)

    # data_mgr.get_base_data_list(0, 10)
    # file = ["103497_20160118", "28187_20160725", "30297_20160722", "30749_20160725", "34588_20160425", "29530_20160729", ]
    # file = ["109163_20160620"]
    # for item in file:
    #     data_mgr.parse_json("/Users/David/data_file/json/{}.json".format(item))

    # result = data_mgr.extract_feature()
    # data_mgr.write_feature_cvs()

    ml = SvmLm()
    res = ml.predict("自觉双侧面下部宽大，影响美观3年余")
    print res