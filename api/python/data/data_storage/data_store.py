#!/usr/bin/env python# coding:utf-8"""__title__ = ""__author__ = "adw"__mtime__ = "2016/7/23"__purpose__ ="""import osimport platformimport reimport timeimport jsonimport csvimport datetimefrom bs4 import BeautifulSoup, elementimport pymongoimport definefrom logs import LoggerMgr, CustomMgrError, DataExistErrorfrom tools.utility import Utility, Instances, CONSTlog = LoggerMgr.getLogger()class DataStorage(object):    """    data storage    """    def __init__(self, user=None):        self.user = user        self._mongodb = Instances.get_mongo_inst()        self._solr = Instances.get_solr_inst()        conf = Utility.conf_get("data_server")        plat = platform.system()        if 'Windows' in plat:            self.data_file_path = conf.get("data_file_path_win")        elif "Darwin" in plat:            self.data_file_path = conf.get("data_file_path_mac")        else:            self.data_file_path = conf.get("data_file_path")        self.xml_path = os.path.join(self.data_file_path, "xml")        self.json_path = os.path.join(self.data_file_path, "json")        self.csv_path = os.path.join(self.data_file_path, "csv")        if not os.path.exists(self.xml_path):            os.makedirs(self.xml_path)        if not os.path.exists(self.json_path):            os.makedirs(self.json_path)        if not os.path.exists(self.csv_path):            os.makedirs(self.csv_path)    def store_data_from_disk(self):        """        store disk xml to mongodb and solr        :return:        """        list_dirs = os.walk(self.xml_path)        for root, dirs, files in list_dirs:            for filename in files:                try:                    with open(os.path.join(self.xml_path, filename), "rb") as f:                        file_body = f.readlines()                        if file_body:                            file_body = file_body[0]                        else:                            continue                    self.data_store(file_body, filename)                except Exception, e:                    log.exception("import disk file {} failed".format(filename))    def store_xml_from_web(self, file_info):        """        存储来自网页上传的xml        :param file_info:        :return:        """        try:            filename = file_info.filename            file_body = file_info.body            file_path = os.path.join(self.xml_path, filename)            with open(file_path, 'w') as f:                f.write(file_body)            log.info("store file {0} success".format(filename))            self.data_store(file_body, filename)        except Exception, e:            log.exception("parse file {0} failed {1}".format(filename, e))            raise CustomMgrError(define.C_CAUSE_fileError)    def store_csv_from_web(self, file_info):        """        存储来自网页上传的csv        :param file_info:        :return:        """        try:            filename = file_info.filename            file_body = file_info.body            file_path = os.path.join(self.csv_path, filename)            with open(file_path, 'w') as f:                f.write(file_body)            log.info("store file {0} success".format(filename.encode("utf-8")))            self.parse_csv_file(file_path)        except Exception, e:            log.exception("parse csv file {0} failed {1}".format(filename.encode("utf-8"), e))            raise CustomMgrError(define.C_CAUSE_fileError)    def data_store(self, file_body, filename):        """        import data        :param filename:        :param file_body:        :return:        """        doc = self.parse_xml(file_body, filename)        self.add_doc_to_mongodb(**doc)        self.add_doc_to_solr(**doc)        # 记录操作        operation_cause = "upload file {0}".format(filename)        log.info(operation_cause)        Utility.log_important_operation(self.user, operation_cause)    def form_data(self, **data):        """        录入数据        :param data:        :return:        """        patient_info = data["patient_info"]        _id = "{0}_{1}".format(patient_info["medical_id"], patient_info["out_date"].replace("-", ""))        out_date = patient_info["out_date"]        collection = self._mongodb.get_collection("patient_info")        exist_id = collection.find_one({"_id": _id})        if exist_id is None:            msg = "medical_id {0} outdate {1} is nonexistence".format(_id, out_date)            log.warning(msg)            raise DataExistError(msg)        doc = {}        for k, v in data.iteritems():            if k in CONST.MONGODB_COLLECTIONS:                tab = v                tab["_id"] = _id                doc[k] = tab        doc["patient_info"]["dataer"] = self.user        doc["patient_info"]["create_time"] = datetime.datetime.now().strftime(CONST.LOCAL_FORMAT_DATETIME)        json_str = json.dumps(doc)        file_path = os.path.join(self.json_path, _id + ".json")        with open(file_path, "w") as f:            f.write(json_str)        self.add_doc_to_mongodb(**doc)        try:            self.add_doc_to_solr(**doc)        except Exception, e:            # 如果solr故障了，先不管            log.warning("solr exception: {}".format(e))        # 记录操作        operation_cause = "{0} type in  {1}".format(self.user, _id)        log.info(operation_cause)        Utility.log_important_operation(self.user, operation_cause)    def _format_text(self, text):        """        remove sign        :param text:        :return:        """        return text.strip().replace(" ", "").replace("\n", "").replace("\r", "")    def parse_xml(self, file_body, filename):        """        parse xml and store in mongodb        :param filename:        :param file_body:        :return:        """        soup = BeautifulSoup(file_body, "lxml")        id_ele = soup.find("medical_id")        _id = id_ele.text.strip()        create_datetime = time.strftime("%Y-%m-%d %H:%M:%S")        tbl_doc = {}        tbl_list = soup.find_all(re.compile(r"^tbl*"))        for tbl in tbl_list:            doc = {"_id": _id, "create_datetime": create_datetime}            tbl_name = tbl.name.lstrip("tbl_")            if tbl_name == "user_info":                tbl_name = "patient_info"                doc["filename"] = filename            fields = tbl.contents            if tbl_name == "long_medical_orders" or tbl_name == "temp_medical_orders":                doc["items"] = self._parse_items(fields)            else:                doc_temp = self._parse_fields(fields)                doc.update(doc_temp)            tbl_doc[tbl_name] = doc        return tbl_doc    def _parse_item(self, item):        """        解析单个item： <item>...</item>        :param item:        :return:        """        item_doc = {}        for field in item:            if not isinstance(field, element.Tag):                continue            item_doc[field.name] = self._format_text(field.text)        return item_doc    def _parse_items(self, fields):        """        解析long_medical_orders temp_medical_orders这样的第一级为<item>的表        :return:        """        items_value = []        for item in fields:            if not isinstance(item, element.Tag):                continue            item_doc = self._parse_item(item)            items_value.append(item_doc)        return items_value    def _parse_fields(self, fields):        """        解析第一级非<item>的表，已经存在第二级为<item>的表        :rtype: object        :param fields:        :return:        """        doc = {}        for field in fields:            if not isinstance(field, element.Tag):                continue            children = field.contents            if len(children) == 1:  # 处理第一级字段，如medical_id                doc[field.name] = self._format_text(field.text)            else:  # 处理第一级字段下还有子字段的                item_list = []                for item in children:                    if not isinstance(item, element.Tag):                        continue                    item_doc = self._parse_item(item)                    item_list.append(item_doc)                doc[field.name.strip()] = item_list        return doc    def add_doc_to_solr(self, **tbl_doc):        """        存入solr        :param tbl_doc:        :return:        """        solr_fields_str = Utility.conf_get("solr_fields")        solr_fields_list = solr_fields_str.split(" ")        solr_fields_set = set(solr_fields_list)        solr_fields = {}        for _, doc in tbl_doc.iteritems():            tbl_fields = doc.keys()            keys = solr_fields_set & set(tbl_fields)            for k in keys:                # 可能存在两种数据格式，一种就是Unicode，一种是utf-8                try:                    solr_fields[k] = doc[k]                except:                    solr_fields[k] = doc[k].decode("utf-8")        self._solr.add(solr_fields)        self._solr.commit()        log.info("add {} to solr".format(doc["_id"]))    def add_doc_to_mongodb(self, **tbl_doc):        """        存入mongodb        :param tbl_doc:        :return:        """        for tbl_name, doc in tbl_doc.iteritems():            collection = self._mongodb.get_collection(tbl_name)            collection.save(doc)            log.info("finish insert {0} to {1}".format(doc["_id"], tbl_name))        return True    def parse_csv_file(self, path):        """        parse csv file        :param path:        :return:        """        with open(path, "rb") as f:            read_csv = csv.DictReader(f)            for row in read_csv:                else_diagnosis = []                columns = read_csv.fieldnames[17:48:2]                for item in columns:                    if row[item]:                        else_diagnosis.append({                            "code": row[item],                            "diagnosis": row[item.strip("ICD")]                        })                    else:                        break                else_surgery = []                columns = read_csv.fieldnames[51:68:2]                for item in columns:                    if row[item]:                        else_surgery.append({                            "code": row[item],                            "surgery": row[item.strip("ICD") + "名称"]                        })                    else:                        break                patient_info = {                    "medical_id": row["病案号"],                    "name": row["姓名"],                    "identity": row["身份证号"],                    "sex": row["性别"],                    "birthday": Utility.strptime(row["出生日期"], inst=False),                    "age": row["年龄"],                    "province": row["户口省市"],                    # "city": row["城市"],                    "district": row["户口区县"],                    "detail_addr": row["户口住址"],                    "marriage": row["婚姻"],                    "job": row["职业"],                    "in_date": Utility.strptime(row["入院日期"], inst=False),                    "out_date": Utility.strptime(row["出院日期"], inst=False),                    "outpatient": {                        "code": row["门诊诊断ICD"],                        "diagnosis": row["门急诊诊断"]                    },                    "main_diagnosis": {                        "code": row["主要诊断ICD"],                        "diagnosis": row["主要诊断"]                    },                    "else_diagnosis": else_diagnosis,                    "main_surgery": {                        "code": row["主要手术ICD"],                        "surgery": row["主要手术名称"]                    },                    "else_surgery": else_surgery,                }                diag = []                diag.append(patient_info["main_diagnosis"]["diagnosis"])                for item in patient_info["else_diagnosis"]:                    diag.append(item["diagnosis"])                diag_str = ",".join(diag)                surgery = []                surgery.append(patient_info["main_surgery"]["surgery"])                for item in patient_info["else_surgery"]:                    surgery.append(item["surgery"])                surgery_str = ",".join(surgery)                tbls = {                    "patient_info": patient_info,                    "hospitalized": {                        "admits_diag": diag_str,                    },                    "clinical_course": {                        "init_diag": diag_str,                        "treat_plan": surgery_str                    },                    "surgery": {                        "before_diag": diag_str,                        "later_diag": diag_str,                        "surgery_name": surgery_str                    },                    "leave": {                        "init_diag": diag_str,                        "leave_diag": diag_str,                        "treatment": surgery_str                    },                }                self.form_data(**tbls)    def get_data(self, medical_id, out_date):        """        :param medical_id:        :param out_date:        :return:        """        _id = "{0}_{1}".format(medical_id, out_date.replace("-", ""))        res = {}        for item in CONST.MONGODB_COLLECTIONS:            if item == "patient_info":                collection = self._mongodb.get_collection(item)                result = collection.find_one({"_id": _id})                if result is None:                    msg = "{} is nonexistence".format(_id)                    log.error(msg)                    raise DataExistError(msg)                else:                    res[item] = result            else:                collection = self._mongodb.get_collection(item)                result = collection.find_one({"_id": _id})                res[item] = result        return res    def get_base_data_list(self, skip=0, limit=50, **kwargs):        """        get base info data list        :param skip:        :param limit:        :param kwargs:        :return:        """        try:            collection = self._mongodb.get_collection(CONST.MONGODB_COLLECTIONS[0])            params = {                "skip": int(skip),                "limit": int(limit)            }            params.update(**kwargs)            res = collection.find().sort([('create_time', pymongo.DESCENDING)]).skip(int(skip)).limit(int(limit))            docs = []            for item in res:                try:                    l = [x["diagnosis"] for x in item["else_diagnosis"]]                    item["else_diagnosis"] = ",".join(l)                    l = [x["surgery"] for x in item["else_surgery"]]                    item["else_surgery"] = ",".join(l)                    # item["sex"] = "男" if int(item["sex"]) else "女"                    item["main_diagnosis"] = item["main_diagnosis"]["diagnosis"]                    item["main_surgery"] = item["main_surgery"]["surgery"]                    item["outpatient"] = item["outpatient"]["diagnosis"]                except KeyError as e:                    msg = "{} miss field: {}".format(item["_id"], e)                    log.exception(msg)                docs.append(item)            count = collection.find().count()        except Exception as e:            msg = "Find base data list failed: {}".format(e)            log.error(msg)            raise CustomMgrError(msg)        return docs, count