/**
 * Created by David Ao on 2016/8/20.
 */

var test_data = {
    //patient_info: {
    //    medical_id: "975951111",
    //    name: "薛婷婷",
    //    sex: "女",
    //    birthday: new Date("1988-09-29"),
    //    identity: "420381198809291228",
    //    province: "湖北省",
    //    city: "十堰市",
    //    age: 26,
    //    detail_addr: "丹江口市龙口路5号2栋8号",
    //    marriage: "未婚",
    //    job: "职员",
    //    in_date: new Date(new Date("2015-09-18 15:03:00"),
    //    out_date: new Date(new Date("2015-09-29 15:02:00"),
    //    outpatient: "dfdfdf"
    //},
    //clinical_course: {
    //    gist: 'xx',
    //    check_record: [
    //        {date: new Date('2016-08-10 04:02:00'), content: 'xxx'},
    //        {date: new Date('2016-08-19T14:02:00'), content: 'yyy'}
    //    ],
    //    ill_description: 'xxx',
    //    treat_plan: 'xxx',
    //    antidiastole: 'xx',
    //    init_diag: 'xxx'
    //},
    //long_medical_orders: {
    //    items: [{
    //        start_datetime: new Date('2015-09-21 12:28'),
    //        medical_order: '重症监护（麻醉）',
    //        start_execute_doctor: '张三',
    //        start_execute_nurse: '李梅',
    //        start_execute_datetime: new Date('2015-09-21 12:28'),
    //        stop_datetime: new Date('2015-09-21 12:28'),
    //        stop_execute_doctor: 'xxx',
    //        stop_execute_nurse: 'xxx',
    //        stop_execute_datetime: new Date('2015-09-21 12:28'),
    //    }]
    //},
    //temp_medical_orders: {
    //    items: [{
    //        start_datetime: new Date('2015-09-21 12:28'),
    //        medical_order: '重症监护（麻醉）',
    //        start_execute_doctor: '张三',
    //        start_execute_nurse: '李梅',
    //        start_execute_datetime: new Date('2015-09-21 12:28'),
    //        checker: '李梅'
    //    }]
    //}


    tbl_surgery: {
        "instrument_nurses": "\u5218\u5cb3", "surgery_doctor": "\u5f20\u8d85",
        "before_diag": "\u9ab8\u540e\u7f29 \u53d1\u80b2\u6027", "description": "\u624b\u672f\u8fc7\u7a0b",
        "narcosis_way": "\u5168\u9ebb", "later_diag": "\u9ab8\u540e\u7f29 \u53d1\u80b2\u6027",
        "narcosis_doctor": "\u738b\u7389\u6167", "_id": "0102231", "surgery_name": "\u9ab8\u6253\u9489"
    },

    tbl_after_surgery: {
        "_id": "0102231", "description": [{"date": "", "content": "\u60a3\u8005\u3001\u3001\u3001\u3001"},
            {"date": "", "content": "\u672f\u540e"}]
    },

    tbl_temp_medical_orders: {
        "items": [
            {
                "start_datetime": new Date("2015-09-21T04:28:00.000Z"), "start_execute_doctor": "\u5f20\u4e09", "checker": "\u674e\u6885",
                "start_execute_nurse": "\u674e\u6885", "start_execute_datetime": new Date("2015-09-21T04:28:00.000Z"),
                "medical_order": "\u91cd\u75c7\u76d1\u62a4\uff08\u9ebb\u9189\uff09"
            }], "_id": "0102231"
    },

    tbl_leave: {
        "description": "\u60a3\u8005\u75c5\u60c5", "leave_diag": "\u540e\u7f29",
        "advice": "\u4fdd\u6301\u53e3\u8154\u6e05\u6d01",
        "treatment": "\u8fc7\u7a0b", "_id": "0102231", "init_diag": "\u540e\u7f29"
    },

    tbl_clinical_course: {
        "gist": "\u6839\u636e\u60a3\u8005\u75c5\u53f2",
        "check_record": [{"date": new Date("2016-08-09T20:02:00.000Z"), "content": "\u60a3\u8005\u60c5\u51b5\u826f\u597d"}],
        "ill_description": "\u60a3\u8005\u4e2d\u5e74\u7537\u6027",
        "treat_plan": "1.\u5b8c\u5584\u672f\u524d\u5404\u9879\u76f8\u5173\u68c0\u67e5",
        "antidiastole": "\u8bca\u65ad\u660e\u786e", "_id": "0102231",
        "init_diag": "\u9ab8\u540e\u7f29 \u53d1\u80b2\u6027"
    },

    tbl_hospitalized: {
        "history_illness": "\u5426\u8ba4\u9ad8\u8840\u538b", "_id": "0102231",
        "family_illness": "\u7236\u6bcd\u5065\u5eb7",
        "present_illness": "1\u5e74\u524d\u81ea\u89c9\u9ab8\u90e8\u540e\u7f29 \u5f71\u54cd\u7f8e\u89c2\uff0c\u672a\u8fdb\u884c\u7279\u6b8a\u6cbb\u7597",
        "assist_exam": "\u8840\u5e38\u89c4", "surgery": "\u60a3\u8005\u660e\u663e\u540e\u7f29",
        "recent": "\u4e00\u822c\u72b6\u51b5\u826f\u597d",
        "complain": "\u81ea\u89c9\u9ab8\u90e8\u540e\u7f29 \u5f71\u54cd\u7f8e\u89c21\u5e74",
        "physical_exam": "\u53d1\u80b2\u6b63\u5e38", "admits_diag": "\u9ab8\u540e\u7f29 \u53d1\u80b2\u6027"
    },

    tbl_long_medical_orders: {
        "items": [
            {
                "start_datetime": new Date("2015-09-21T04:28:00.000Z"), "start_execute_doctor": "\u5f20\u4e09", "stop_execute_nurse": "xxx",
                "stop_datetime": new Date("2015-09-21T04:28:00.000Z"), "stop_execute_doctor": "xxx", "start_execute_nurse": "\u674e\u6885",
                "start_execute_datetime": new Date("2015-09-21T04:28:00.000Z"), "medical_order": "\u91cd\u75c7\u76d1\u62a4\uff08\u9ebb\u9189\uff09",
                "stop_execute_datetime": new Date("2015-09-21T04:28:00.000Z")
            },
            {
                "start_datetime": "", "start_execute_doctor": "xx", "stop_execute_nurse": "xx", "stop_datetime": "",
                "stop_execute_doctor": "xxx",
                "start_execute_nurse": "xx", "start_execute_datetime": "", "medical_order": "\u4e09\u7ea7\u62a4\u7406",
                "stop_execute_datetime": ""
            }
        ],
        "_id": "0102231"
    },

    tbl_patient_info: {
        "province": "\u5185\u8499\u53e4\u7701", "city": "\u547c\u4f26\u8d1d\u5c14\u5e02", "_id": "0102231",
        "name": "\u65f6\u57f9\u5065", "detail_addr": "\u9102\u6e29\u514b\u81ea\u6cbb\u5dde\u65d7\u5df4\u9547",
        "age": 26,
        "medical_id": "0102231", "sex": "\u7537", "job": "\u5de5\u4eba", "birthday": new Date("1988-09-29T00:00:00.000Z"),
        "marriage": "\u5df2\u5a5a", "outpatient": "\u9ab8\u540e\u7f29 \u53d1\u80b2\u6027",
        "out_date": new Date("2015-09-29T07:02:00.000Z"), "in_date": new Date("2015-09-18T07:03:00.000Z"),
        "identity": "420381198809291228"
    }
};

module.exports = test_data;