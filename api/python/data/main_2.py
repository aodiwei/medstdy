#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/7/23"
__purpose__ = 
"""
import sys
sys.path.append("..")
import env

env.init()
from data_storage.data_store import DataStorage

if __name__ == "__main__":
    data_mgr = DataStorage("manual_operation")
    # data_mgr.store_data_from_disk()
    path = "/Users/David/Documents/唇腭裂q36.920150101-20151231_u8.csv"
    data_mgr.parse_csv_file(path=path)