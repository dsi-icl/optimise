/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 13/02/2015
 * Time: 14:14
 * To change this template use File | Settings | File Templates.
 */

var recordModule = angular.module('Optimise.record',['ngResource']);

recordModule.factory('Record', function ($resource) {
    return {
        saveData: function(url) {
            var resource = $resource(url, {},{
                'save': {method: 'POST'}
            });
            return resource;
        }
    }
});

recordModule.factory('ReminderResource', function ($resource) {
    return {
        saveData: function(url) {
            console.log("saving data");
            var resource = $resource(url, {},{
                'save': {method: 'POST'}
            });
            return resource;
        },
        getData: function(url) {
            //console.log("saving data");
            var resource = $resource(url, {},{
                'get': {method: 'GET'}
            });
            return resource;
        }
    }
});

recordModule.factory('ICOMETRIX', function ($resource) {
    return {
        saveData: function(url) {
            var resource = $resource(url, {},{
                'save': {method: 'POST'}
            });
            return resource;
        }
    }
});

recordModule.factory('NewSubject', function ($resource) {
    return {
        createSubject: function(url) {
            var resource = $resource(url, {},{
                'save': {method: 'POST'}
            });
            return resource;
        }
    }
});

recordModule.factory('Edit', function ($resource) {
    return {
        editData: function(url) {
            var resource = $resource(url, {},
            {
                'save': {method: 'POST'}
            });
            return resource;
        }
    }
});

//recordModule.factory('DataGroup', function ($resource) {
//    return $resource('./api/wh/groups.php',{},{
//    });
//})

recordModule.factory('NewUser', function ($resource) {
    var url = "./api/wh/clinicians.php";
    return {
        createNewUser: function() {
            var resource = $resource(url, {}, {
                'save':{method: 'POST'}
            });
            return resource;
        }
    }
})

recordModule.factory('USUBJIDList', function($resource) {
    return {
        getSubjectList: function(url) {
            var resource = $resource(url, {},{

                'get': {method: 'GET'}
            });
            return resource;
        }
    }
})

recordModule.factory('USUBJID', function ($resource) {
    return {
        getSubjectData: function(url) {
            var resource = $resource(url, {},
                {
                    get: {method: 'GET'}
                });
            return resource;
        },
        getSubjects: function(url) {
            var resource = $resource(url, {},
                {
                    get: {method: 'GET'}
                });
            return resource;
        }
    }
});

recordModule.factory('DueAppointments', function ($resource) {
    return {
        getDueAppointments: function(url) {
            var resource = $resource(url, {},
                {
                    get: {method: 'GET'}
                });
            return resource;
        }
    }
});

recordModule.factory('DeleteFactory', function ($resource) {
    return {
        deleteSubjectData: function(url) {
            var resource = $resource(url, {},
                {
                    delete: {method: 'DELETE'}
                });
            return resource;
        }
    }
});

recordModule.factory('CONFIG', function ($resource) {

    return {
        getOnlineSetting: function(url) {
            var resource = $resource(url, {}, {
                    'get': {method: 'GET'}
                })
            return resource;
        }
    }
});

//recordModule.factory('XNATLogin', function ($resource) {
//
//    return $resource('https://central.xnat.org/j_spring_security_check',{},{
//        'get': {method: 'GET'},
//        'transformRequest': function(data, headers){
//            //MESS WITH THE DATA
//            var response = {}
//            response.data = data;
//            response.headers = headers();
//            return response;
//        }
//
//    });
//});
//
//recordModule.factory('CIFLogin', function ($resource) {
//    return $resource('http://cif-xnat.hh.med.ic.ac.uk/j_spring_security_check',{},{
//        'get': {method: 'GET'}
//    });
//});


recordModule.factory('USERID', function ($resource) {

    //var onlineOrLocal = 'local';
    var onlineOrLocal = 'online';

    if (onlineOrLocal=='local')
        return $resource('./api/wh/gettoken4c.php',{},{
    });
    else {
        return $resource('./api/wh/gettoken4c.php',{},{
        });
    }
});

recordModule.service('records', function (Record, Edit, USUBJID, $http, $q, USUBJIDList,
                                          NewSubject, DeleteFactory, NewUser, ICOMETRIX, DueAppointments, ReminderResource) {

    var token='';

    var setToken = function(newToken) {
        token = newToken;
    }

    var getToken = function() {
        return token;
    }

    //var onlineOrLocal = 'local';
    var onlineOrLocal = 'online';

    var getURL = function(functionName) {

        var api = '';
        if (functionName == 'USUBJID') {
            if (onlineOrLocal == 'local')
                api = './api/opt.php';
            else
                api = './api/opt.php';
        }

        if (functionName == 'Appointments') {
            if (onlineOrLocal == 'local')
                api = './api/getListAppointmentsDue2.php';
            else
                api = './api/getListAppointmentsDue2.php';
        }

        if (functionName == 'Delete') {
            if (onlineOrLocal == 'local')
                api = './api/wh/patients.php';
            else
                api = './api/wh/patients.php';
        }

        if (functionName == 'USUBJIDList') {
            if (onlineOrLocal == 'local')
                api = './api/actions.php?action=list&fieldName=USUBJID';
            else
                api = './api/actions.php?action=list&fieldName=USUBJID';
        }

        if (functionName == 'NHSIDList') {
            if (onlineOrLocal == 'local')
                api = './api/actions.php?action=list&fieldName=NHS_USUBJID';
            else
                api = './api/actions.php?action=list&fieldName=NHS_USUBJID';
        }

        if (functionName == 'Record') {
            if (onlineOrLocal == 'local')
                api = './api/opt.php';
            else
                api = './api/opt.php';
        }

        if (functionName == 'Reminder') {
            if (onlineOrLocal == 'local')
                api = './api/reminders.php';
            else
                api = './api/reminders.php';
        }

        /*
        if (functionName == 'Edit') {
            if (onlineOrLocal == 'local')
                api = './api/opt.php?OID=2';
            else
                api = './api/opt.php?OID=2';
        }*/

        if (functionName == 'Config') {
            if (onlineOrLocal == 'local')
                api = '/Optimise/scripts/js/view/config.json';
            else
                api = 'Optimise/scripts/js/view/config.json';
        }

        if (functionName == 'NewSubject') {
            if (onlineOrLocal == 'local')
                api = './api/wh/patients.php?action=new';
            else
                api = './api/wh/patients.php?action=new';
        }

        return api;
    }

    var formatForPostSave = function (aRecord) {

        var keys = Object.keys(aRecord);
        var recordSet = [];
        var recordItems = [];
        var keysAndItems = [];
        var newRecordItem = {"RecordItems":keysAndItems};
        recordSet.push(newRecordItem);
        var root = {"RecordSet":recordSet};

        for (var k = 0; k < keys.length; k++){
            var keyAndItem = {"fieldName":keys[k], "value": aRecord[keys[k]]};
            keysAndItems.push(keyAndItem);
        }

        return angular.toJson(root);
    }


    var getEventID = function(event) {
        switch (DOMAIN) {
            case 'QS': {
                return event.DOMAIN+"_"+event.QSSEQ;
            }
            case 'SV': {
                return event.DOMAIN+"_"+event.VISITNUM;
            }
            case 'FA': {
                return event.DOMAIN+"_"+event.FASEQ;
            }
            case 'CE': {
                return event.DOMAIN+"_"+event.CESEQ;
            }
            case 'PR': {
                return event.DOMAIN+"_"+event.PRSEQ;
            }
            case 'EX': {
                return event.DOMAIN+"_"+event.EXSEQ;
            }
            case 'REL': {
                return event.DOMAIN+"_"+event.RELID;
            }
            case 'DM': {
                return event.DOMAIN+"_"+event.USUBJID;
            }
            case 'LB': {
                return event.DOMAIN+"_"+event.LBSEQ;
            }
            case 'IS': {
                return event.DOMAIN+"_"+event.ISSEQ;
            }
            case 'NV': {
                return event.DOMAIN+"_"+event.NVSEQ;
            }
            case 'VS': {
                return event.DOMAIN+"_"+event.VSSEQ;
            }
            case 'SU': {
                return event.DOMAIN+"_"+event.SUSEQ;
            }
            case 'SC': {
                return event.DOMAIN+"_"+event.SCSEQ;
            }
            case 'DU': {
                return event.DOMAIN+"_"+event.DUSEQ;
            }
            case 'MO': {
                return event.DOMAIN+"_"+event.MOSEQ;
            }
        };
    }


    var formatForPostEdit = function (idRecord, valueRecord) {
        var root = {"CurrentRecord":idRecord, "NewRecord":valueRecord};
        return angular.toJson(root);
    }

     var deleteSubject = function (USUBJID) {
         var input = {'w_id': USUBJID};
         var deferred = $q.defer();
         var url = getURL('Delete');
         try {
             var DataToDelete = DeleteFactory.deleteSubjectData(url);
             DataToDelete.delete(input, function (result){
                 result.$promise
                     .then(function() {
                         deferred.resolve(result);
                     })
             });
         }
         catch (e) {
             deferred.reject(e);
         }
         return deferred.promise;
     }


    var formatForDelete = function (aRecord) {
        var keys = Object.keys(aRecord);
        var recordSet = [];
        var recordItems = [];
        var keysAndItems = [];
        var newRecordItem = {RecordItems:keysAndItems};
        recordSet.push(newRecordItem);

        var USUBJID = {fieldName:"USUBJID", value: aRecord.USUBJID};
        keysAndItems.push(USUBJID);

        var STUDYID = {fieldName:"STUDYID", value: aRecord.STUDYID};
        keysAndItems.push(STUDYID);

        var DOMAIN = {fieldName:"DOMAIN", value: aRecord.DOMAIN};
        keysAndItems.push(DOMAIN);

        for (var k = 0; k < keys.length; k++){
            //console.log(keys[k]);

            switch (keys[k]) {
                case 'QSSEQ': {
                    var keyAndItem = {fieldName:"QSSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'FASEQ': {
                    var keyAndItem = {fieldName:"FASEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'PRSEQ': {
                    var keyAndItem = {fieldName:"PRSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'RELID': {
                    var keyAndItem = {fieldName:"RELID", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'CESEQ': {
                    var keyAndItem = {fieldName:"CESEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'VSSEQ': {

                    var keyAndItem = {fieldName:"VSSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'MHSEQ': {

                    var keyAndItem = {fieldName:"MHSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'APMHSEQ': {

                    var keyAndItem = {fieldName:"APMHSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'EXSEQ': {

                    var keyAndItem = {fieldName:"EXSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'NVSEQ': {

                    var keyAndItem = {fieldName:"NVSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'MOSEQ': {

                    var keyAndItem = {fieldName:"MOSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'SUSEQ': {

                    var keyAndItem = {fieldName:"SUSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'DUSEQ': {

                    var keyAndItem = {fieldName:"DUSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'SCSEQ': {

                    var keyAndItem = {fieldName:"SCSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'LBSEQ': {

                    var keyAndItem = {fieldName:"LBSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'ISSEQ': {

                    var keyAndItem = {fieldName:"ISSEQ", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
                case 'VISITNUM': {
                    var keyAndItem = {fieldName:"VISITNUM", value: aRecord[keys[k]]};
                    keysAndItems.push(keyAndItem);
                    break;
                }
            };

        }
        return angular.toJson(newRecordItem);
    }

    var formatForDeleteGivenDomain = function (USUBJID_field, STUDYID_field, seqFieldName, seqValue) {

        var recordSet = [];
        var keysAndItems = [];
        var newRecordItem = {"RecordItems":keysAndItems};

        recordSet.push(newRecordItem);
        if ((seqFieldName != "USUBJID") && (seqFieldName != "STUDYID")){
            var newUSUBJID = {fieldName:"USUBJID", value: USUBJID_field};
            keysAndItems.push(newUSUBJID);

            var newSTUDYID = {fieldName:"STUDYID", value: STUDYID_field};
            keysAndItems.push(newSTUDYID);
        }

        var keyAndItem = {"fieldName":seqFieldName, "value": seqValue};
        keysAndItems.push(keyAndItem);

        return angular.toJson(newRecordItem);
    }

    var getSubject = function(subjectID)
    {
        var input = {'USUBJID': subjectID, 'token':token};
        var deferred = $q.defer();
        var url = getURL('USUBJID');
        try {
            var USUBJIDData = USUBJID.getSubjectData(url);
            USUBJIDData.get(input, function (subjectData){
                subjectData.$promise
                    .then(function() {
                        deferred.resolve(subjectData);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

//    var getParsedDemographics= function()
//    {
//        var deferred = $q.defer();
//        try {
//            var demographicAPICall = getDemographics();
//            demographicAPICall.then(function(demographics) {
//                var tempData = [];
//                var dmRecords = demographics.RecordSet;
//
//                for (var dm = 0; dm < dmRecords.length; dm++) {
//                    var aRecord = dmRecords[dm];
//                    var opt_id ='';
//                    var nhs_id ='';
//                    var age = '';
//                    var sex = '';
//                    var rficdtc = '';
//                    var aRecordItems = aRecord.RecordItems;
//                    for (var item = 0; item < aRecordItems.length; item++) {
//                        if (aRecordItems[item].fieldName == 'USUBJID')
//                            opt_id = aRecordItems[item].value;
//                        else if (aRecordItems[item].fieldName == 'NHS_USUBJID')
//                            nhs_id = aRecordItems[item].value;
//                        else if (aRecordItems[item].fieldName == 'BRTHDTC')
//                            age = '';
//                        else if (aRecordItems[item].fieldName == 'SEX')
//                            sex = aRecordItems[item].value;
//                        else if (aRecordItems[item].fieldName == 'RFICDTC')
//                            rficdtc = aRecordItems[item].value;
//                    }
//                    var row = {opt_id: opt_id, nhs_id: nhs_id, age:age, sex: sex, rficdtc: rficdtc, selected: false};
//                    tempData.push(row);
//                }
//
//                demographics.$promise
//                    .then(function() {
//                        deferred.resolve(tempData);
//                    })
//
//            });
//        }
//        catch (e) {
//            deferred.reject(e);
//        }
//        return deferred.promise;
//    }

    var getAllDemographics = function() {
        var input = {'DOMAIN': 'DM', 'token':token};
        var deferred = $q.defer();
        var url = getURL('USUBJID');
        try {
            var USUBJIDData = USUBJID.getSubjects(url);
            USUBJIDData.get(input, function (data){
                data.$promise
                    .then(function() {
                        deferred.resolve(data);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    var getDueAppointments = function() {
        var deferred = $q.defer();
        var url = getURL('Appointments');
        try {
            var appointmentsData = DueAppointments.getDueAppointments(url);
            appointmentsData.get({}, function (data){
                data.$promise
                    .then(function() {
                        deferred.resolve(data);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    var getOptimiseID = function(NHSID) {
        var input = {'NHS_USUBJID': NHSID, 'token':token};
        var deferred = $q.defer();
        var url = getURL('USUBJID');
        try {
            var USUBJIDData = USUBJID.getSubjectData(url);
            USUBJIDData.get(input, function (subjectData){
                subjectData.$promise
                    .then(function() {
                        deferred.resolve(subjectData);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    var getUSUBJIDList = function() {
        var deferred = $q.defer();
        var url = getURL('USUBJIDList');
        try {
            var subjectList = USUBJIDList.getSubjectList(url);
            subjectList.get(function (subjects){
                subjects.$promise
                    .then(function() {
                        deferred.resolve(subjects);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    var getNHSIDList = function() {
        var deferred = $q.defer();
        var url = getURL('NHSIDList');
        try {
            var subjectList = USUBJIDList.getSubjectList(url);
            subjectList.get(function (subjects){
                subjects.$promise
                    .then(function() {
                        deferred.resolve(subjects);
                    })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    var createNewSubject = function(patientRecord, prefix) {
        var deferred = $q.defer();
        var url = getURL('NewSubject');
        var patientJson = formatForPostSave(patientRecord);
        var input = {"username":patientRecord.NHS_USUBJID,"optimise_prefix":prefix,"demography_data": JSON.parse(patientJson)};

        try {
            var newSubject = NewSubject.createSubject(url);
            newSubject.save(input, function (subject){
                subject.$promise
                    .then(function() {
                        console.log(subject)
                        deferred.resolve(subject);
                    })
            });

        }
        catch (e) {
            console.log(e);
            deferred.reject(e);
        }
        return deferred.promise;

    }

    var saveRecord = function (newRecord) {
        var jsonBody = formatForPostSave(newRecord);
        var url = getURL('Record')+"?token="+token;
        Record.saveData(url).save(jsonBody);
    };

    var saveReminder = function (newReminder) {
        var jsonBody = formatForPostSave(newReminder);
        var url = getURL('Reminder');
        //console.log(jsonBody);
        ReminderResource.saveData(url).save(jsonBody);
    };

    var editRecord = function (idRecord, valueRecord) {
        var jsonBody = formatForPostEdit(idRecord, valueRecord);
        //console.log(jsonBody);
        var url = getURL('Record')+"?OID=2&token="+token;
        Edit.editData(url).save(jsonBody);
    };

//    var editRecord = function (idRecord, valueRecord) {
//        var jsonBody = formatForPostEdit(idRecord, valueRecord);
//        var url = getURL('Edit');
//        Edit.editData(url).save(jsonBody);
//    };

    var editReminder = function (idRecord, valueRecord) {
        var jsonBody = formatForPostEdit(idRecord, valueRecord);
        var url = getURL('Reminder')+"?OID=2";
        ReminderResource.saveData(url).save(jsonBody);
    };

    var getReminder = function (USUBJID) {
        var jsonBody = {"USUBJID":USUBJID};
        var url = getURL('Reminder');

        var deferred = $q.defer();
        try {
            ReminderResource.getData(url).get(jsonBody,function(data) {
                data.$promise.then(function(data) {
                    deferred.resolve(data);
                })
            });
        }
        catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;

    };

    var deleteReminder = function(rm) {
        if (((rm.USUBJID != undefined)&&
            (rm.USUBJID != "")&&
            (parseInt(rm.REMINDERSEQ) != NaN))) {
                var jsonBody = {"USUBJID":rm.USUBJID, "DOMAIN":rm.DOMAIN, "REMINDERSEQ": rm.REMINDERSEQ};
                var api = '';
                if (onlineOrLocal == 'local')
                    api = './api/reminders.php';
                else
                    api = './api/reminders.php';

                $http({url: api,
                    method: 'DELETE',
                    data: jsonBody,
                    headers: {"Content-Type": "application/json;charset=utf-8"}}).then(function(res) {
                        console.log(res.data);
                    }, function(error) {
                        console.log(error);
                    });
        }
        else
        {
            alert ("Invalid reminder to delete: "+rm.USUBJID+", "+rm.REMINDERSEQ);
        }
    }

    var saveIcometrixJob = function (newJob) {
        var api = '';
        if (onlineOrLocal == 'local')
            api = './api/icometrix/setIcometrixJobs.php';
        else
            api = './api/icometrix/setIcometrixJobs.php';
        //console.log(angular.toJson(newJob));
        console.log(api);
        ICOMETRIX.saveData(api).save(angular.toJson(newJob));
    };

    var createNewInterest = function (name, email) {
        var jsonBody = {"username": name, "password": "newInterestPW_"+name, "email": email, "site": "AAN", "group_ids":["daeAANUsers"]};
        //console.log(jsonBody);
        console.log(NewUser.createNewUser().save(jsonBody));
    }

    var overwriteSubject = function (USUBJID, jsonToPost) {

        if (USUBJID != ''){
            var subjectToDelete = {RecordItems:[{fieldName:"USUBJID", value:USUBJID}]};
            var jsonToDelete = angular.toJson(subjectToDelete);

            var api = '';
            if (onlineOrLocal == 'local')
                api = './api/opt.php';
            else
                api = './api/opt.php';

            $http({url: api,
                method: 'DELETE',
                data: jsonToDelete,
                headers: {"Content-Type": "application/json;charset=utf-8"}}).then(function(res) {
                    var url = getURL('Record');
                    Record.saveData(url).save(jsonToPost);
                    //console.log(jsonToPost);
                }, function(error) {
                    console.log(error);
                });
        }
    };

    var deleteRecord = function(recordToDelete) {

        if ((recordToDelete!=null)
            &&(recordToDelete.USUBJID != undefined)
            &&(recordToDelete.USUBJID != null)
            &&(recordToDelete.USUBJID != '')
            &&(recordToDelete.DOMAIN != null)
            && (recordToDelete.DOMAIN != '')
            &&(recordToDelete.STUDYID != null)&& (recordToDelete.STUDYID != ''))
        {
            var jsonBody = formatForDelete(recordToDelete);
            var api = '';


            if (onlineOrLocal == 'local')
                api = './api/opt.php?token='+token;
            else
                api = './api/opt.php?token='+token;

            $http({url: api,
                method: 'DELETE',
                data: jsonBody,
                headers: {"Content-Type": "application/json;charset=utf-8"}}).then(function(res) {
                    console.log(res.data);
                }, function(error) {
                    console.log(error);
                });

        }
        else
        {
            console.log(recordToDelete);
            alert ("You nearly deleted db!");
        }
    }


    var getRecordSet = function($scope, subjectID) {
        var url = getURL('USUBJID');
        USUBJID.getData(url).get({project: 'OPTIMISE', USUBJID: subjectID, 'token':token},function(data) {
            data.$promise.then(function() {
                return data;
            })
        });
    }

    var printRecord = function(subjectID) {
        //console.log(subjectID);
        var url = getURL('USUBJID');
        USUBJID.getData(url).get({project: 'OPTIMISE', USUBJID: subjectID, 'token':token},function(data) {
        //USUBJID.get({project:'OPTIMISE', USUBJID:subjectID}, function(data) {
            console.log("Number of Records Found:"+data.RecordSet.length);
            angular.forEach(data.RecordSet, function(recordSet) {
                angular.forEach(recordSet, function(items) {
                    console.log("Number of FieldName/Values Found:"+items.length);
                    //console.log(items);
                    //printItems(items);
                })
            })
        });
    }

    var formatStringToDate = function (aDate) {
        if (aDate != '') {
            var date = new Date(aDate);
            return date;
        }
        else
            return '';
    }

    return {
        formatForPostSave: formatForPostSave,
        formatForPostEdit: formatForPostEdit,
        saveRecord: saveRecord,
        editRecord: editRecord,
        printRecord: printRecord,
        getRecordSet: getRecordSet,
        deleteRecord:deleteRecord,
        formatForDeleteGivenDomain:formatForDeleteGivenDomain,
        //deleteRecordGivenJSON: deleteRecordGivenJSON,
        formatStringToDate:formatStringToDate,
        getEventID: getEventID,
        setToken: setToken,
        getToken: getToken,
        getURL: getURL,
        getSubject: getSubject,
        deleteSubject: deleteSubject,
        overwriteSubject:overwriteSubject,
        getOptimiseID: getOptimiseID,
        getUSUBJIDList: getUSUBJIDList,
        getNHSIDList: getNHSIDList,
        createNewSubject: createNewSubject,
        getAllDemographics: getAllDemographics,
        getDueAppointments: getDueAppointments,
        createNewInterest: createNewInterest,
        saveIcometrixJob: saveIcometrixJob,
        saveReminder: saveReminder,
        getReminder: getReminder,
        deleteReminder: deleteReminder,
        editReminder: editReminder

    };
});
