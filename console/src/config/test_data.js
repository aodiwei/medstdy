/**
 * Created by David Ao on 2016/8/20.
 */

var test_data = {
    patient_info: {
        medical_id: "975951111",
        name: "薛婷婷",
        sex: "女",
        birthday: new Date("1988-09-29"),
        identity: "420381198809291228",
        province: "湖北省",
        city: "十堰市",
        age: 26,
        detail_addr: "丹江口市龙口路5号2栋8号",
        marriage: "未婚",
        job: "职员",
        in_date: new Date("2015-09-18 15:03:00"),
        out_date: new Date("2015-09-29 15:02:00"),
        outpatient: "dfdfdf"
    },
    clinical_course: {
        gist: 'xx',
        check_record: [
            {date: new Date('2016-08-10 04:02:00'), content: 'xxx'},
            {date: new Date('2016-08-19T14:02:00'), content: 'yyy'}
        ],
        ill_description: 'xxx',
        treat_plan: 'xxx',
        antidiastole: 'xx',
        init_diag: 'xxx'
    },
    long_medical_orders: {
        items: [{
            start_datetime: new Date('2015-09-21 12:28'),
            medical_order: '重症监护（麻醉）',
            start_execute_doctor: '张三',
            start_execute_nurse: '李梅',
            start_execute_datetime: new Date('2015-09-21 12:28'),
            stop_datetime: new Date('2015-09-21 12:28'),
            stop_execute_doctor: 'xxx',
            stop_execute_nurse: 'xxx',
            stop_execute_datetime: new Date('2015-09-21 12:28'),
        }]
    },
    temp_medical_orders: {
        items: [{
            start_datetime: new Date('2015-09-21 12:28'),
            medical_order: '重症监护（麻醉）',
            start_execute_doctor: '张三',
            start_execute_nurse: '李梅',
            start_execute_datetime: new Date('2015-09-21 12:28'),
            checker: '李梅'
        }]
    }
};

module.exports = test_data;