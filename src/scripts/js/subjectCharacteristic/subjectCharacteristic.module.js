
/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 24/01/2015
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */

var subjectCharacteristicModule = angular.module('Optimise.subjectCharacteristic', ['Optimise.view', 'Optimise.record']);

subjectCharacteristicModule.factory('SubjectCharacteristic', function () {
    return function (USUBJID, SCTEST) {
        var characteristic = {

            USUBJID : USUBJID,
            STUDYID : 'OPTIMISE',
            DOMAIN:'SC',
            SCSEQ:'',
            SCTEST:SCTEST,
            SCDTC: '',
            SCORRES: ''
        }
        return characteristic;
    }
});

subjectCharacteristicModule.service('subjectCharacteristic', function (SubjectCharacteristic, records, viewService) {
    var subjectCharacteristics = [];

    var populateSubjectCharacteristic = function (RecordItems) {
        var newEvent = new SubjectCharacteristic();
        for (var i = 0; i < RecordItems.length; i++){

            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    newEvent.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    newEvent.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    newEvent.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'SCSEQ':{
                    newEvent.SCSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'SCTEST':{
                    newEvent.SCTEST = RecordItems[i].value;
                    break;
                }
                case 'SCORRES':{
                    newEvent.SCORRES = RecordItems[i].value;
                    break;
                }
                case 'SCDTC':{
                    newEvent.SCDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
            }
        }
        subjectCharacteristics.push(newEvent);
        //console.log(subjectCharacteristics);
    }

    var addSubjectCharacteristic = function (SC){
        SC.SCSEQ = generateSCSEQ();
        subjectCharacteristics.push(SC);
        //console.log(subjectCharacteristic);
        if (!viewService.workOffline())
            records.saveRecord(SC);
    }

    var compileSubjectCharacteristicSeq = function () {
        var seq = [];
        for (var e = 0; e < subjectCharacteristics.length; e++) {
            seq.push(subjectCharacteristics[e].SCSEQ);
        }
        return seq;
    }

    var generateSCSEQ = function () {
        var SCSEQs = compileSubjectCharacteristicSeq();
        if (SCSEQs.length > 0) {
            SCSEQs.sort();
            return (SCSEQs[SCSEQs.length-1]+1);
        }
        else {
            return 0;
        }
    }

    var editSubjectCharacteristic = function(subjectCharacteristic, resName, resValue) {
        if (!viewService.workOffline())
        {
            var USUBJID = {fieldName: "USUBJID", value: subjectCharacteristic.USUBJID};
            var SEQ = {fieldName:"SCSEQ", value: subjectCharacteristic.SCSEQ};
            var RESTOCHANGE = {fieldName:resName, value: resValue};

            var idRecord = [USUBJID, SEQ];
            var valueRecord = [RESTOCHANGE];
            records.editRecord(idRecord, valueRecord);
        }
    };


    var getThisSubjectCharacteristicOnDate = function (SCTEST, SCDTC) {
        for (var e = 0; e < subjectCharacteristics.length; e++)
        {
            if ((subjectCharacteristics[e].SCDTC.toDateString() == SCDTC.toDateString()) &&
                (subjectCharacteristics[e].SCTEST == SCTEST)){
                //console.log(subjectCharacteristics[e]);
                return subjectCharacteristics[e];
            }
        }
        return null;
    }

    var getThisSubjectCharacteristic = function (SCTEST) {
        for (var e = 0; e < subjectCharacteristics.length; e++)
        {
            if (subjectCharacteristics[e].SCTEST == SCTEST){
                //console.log(subjectCharacteristics[e]);
                return subjectCharacteristics[e];
            }
        }
        return null;
    }


    var getSubjectCharacteristics = function() {
        return subjectCharacteristics;
    }

    var deleteSubjectCharacteristics = function () {
        subjectCharacteristics=[];
    }

    return {
        editSubjectCharacteristic: editSubjectCharacteristic,
        addSubjectCharacteristic: addSubjectCharacteristic,
        getThisSubjectCharacteristicOnDate: getThisSubjectCharacteristicOnDate,
        getThisSubjectCharacteristic: getThisSubjectCharacteristic,
        deleteSubjectCharacteristics: deleteSubjectCharacteristics,
        populateSubjectCharacteristic:populateSubjectCharacteristic,
        getSubjectCharacteristics: getSubjectCharacteristics
    }
});
