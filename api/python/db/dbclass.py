#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ""
__author__ = "adw"
__mtime__ = "2016/4/17"
__purpose__ = 
"""
from sqlalchemy import Column
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import Integer, String, DateTime

BaseModel = declarative_base()


class TbUser(BaseModel):
    """
    user table
    """
    __tablename__ = "tbl_user"

    uid = Column(Integer, primary_key=True)
    account = Column(String(255))
    email = Column(String(50))
    password = Column(String(50))
    image = Column(String(255))
    create_time = Column(DateTime)


class TbCookies(BaseModel):
    """
    user cookies
    """
    __tablename__ = "tbl_cookies"

    cookie = Column(String(255), primary_key=True)
    value = Column(String(255))
    update_time = Column(DateTime)


class TbPatientInfo(BaseModel):
    """
    patient info
    """
    __tablename__ = "tbl_patient_info"

    patient_id = Column(Integer, autoincrement=True, primary_key=True)
    medical_id = Column(Integer)
    name = Column(String(255))
    identity = Column(String(255))
    sex = Column(String(255))
    birthday = Column(String(255))
    age = Column(String(255))
    province = Column(String(255))
    city = Column(String(255))
    detail_addr = Column(String(255))
    marriage = Column(String(255))

