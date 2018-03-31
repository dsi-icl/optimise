/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:16
 * To change this template use File | Settings | File Templates.
 */

var medicalHistoryModule = angular.module('Optimise.medicalHistory',[]);

medicalHistoryModule.factory('MedicalEvent', function() {

    return function(USUBJID, mhcat) {
        var medicalHistory = {
            STUDYID: 'OPTIMISE',
            DOMAIN: 'MH',
            USUBJID: USUBJID,
            MHSEQ: '',
            MHCAT: mhcat,
            MHSCAT: '',
            MHTERM: '',
            MHSTDTC: '',
            MHENDTC: '',
            MHENRTPT: '',
            MHLOC: '',
            MHLAT: '',    //LEFT/ Right /Bilateral
            displayNote: '',    //LEFT/ Right /Bilateral
            displaySTDTC:'',
            displayENDTC:'',
            displayLabel:'',
            displayDate:''
        }
        return medicalHistory;
    }
})

medicalHistoryModule.service('medicalHistory', function(MedicalEvent, records, viewService) {
    var medicalHistory = [];

    var deleteMedicalHistory = function() {
        medicalHistory = [];
    }

    var printMedicalHistory = function() {
        console.log(medicalHistory);
    }

    var getHistoricalOccurences = function (MHCAT, RHSTDTC) {
        var historicalOccurences = [];
        for (var m = 0; m < medicalHistory.length; m++) {
            if (medicalHistory[m].MHCAT==MHCAT) {
                if (medicalHistory[m].MHSTDTC.getYear() < RHSTDTC) {
                    historicalOccurences.push(medicalHistory[m]);
                }
            }
        }
        return historicalOccurences;
    }

    var editOccurence = function (oc, recordToChange, valueToChange){
        var USUBJID = {fieldName: "USUBJID", value: oc.USUBJID};
        var MHSEQ = {fieldName:"MHSEQ", value: oc.MHSEQ};
        var RECTOCHANGE = {fieldName:recordToChange, value: valueToChange};

        var idRecord = [USUBJID, MHSEQ];
        var valueRecord = [RECTOCHANGE];

        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var generateSEQ = function () {
        var SEQs = compileHistory();
        if (SEQs.length > 0) {
            SEQs.sort(sortNumber);
            return (SEQs[SEQs.length-1]+1);
        }
        else {
            return 0;
        }
    }

    function sortNumber(a,b) {
        return a - b;
    }


    var compileHistory = function () {
        var seq = [];
        for (var e = 0; e < medicalHistory.length; e++) {
            seq.push(medicalHistory[e].MHSEQ);
        }
        return seq;
    }

    var addOccurence = function (newOccurence) {
        newOccurence.MHSEQ = generateSEQ();
        if (newOccurence.MHSTDTC != '') {
            newOccurence.displayLabel = newOccurence.MHSTDTC.getFullYear();
            newOccurence.displayDate = newOccurence.MHSTDTC.getFullYear();
        }
        medicalHistory.push(newOccurence);
        if (!viewService.workOffline())
            records.saveRecord(newOccurence);
    }

    var deleteOccurence = function (occurence) {
        var index = medicalHistory.indexOf(occurence);
        if (index > -1) {
            medicalHistory.splice(index, 1);
            if (!viewService.workOffline())
                records.deleteRecord(occurence);
        }
    }

    var getOccurenceBySeq = function(mhseq){
        for (var i = 0; i < medicalHistory.length; i++){
            if (medicalHistory[i].MHSEQ == mhseq) {
                return medicalHistory[i];
            }
        }
        return null;
    }

    var getOccurencesInCategory = function(mhcat){
        var occurenceInCategory = [];
        for (var i = 0; i < medicalHistory.length; i++){
            var anOccurence = medicalHistory[i];
            if (medicalHistory[i].MHCAT == mhcat) {
                occurenceInCategory.push(anOccurence);
            }
        }
        return occurenceInCategory;
    }

    var getOccurencesInSubCategory = function(mhscat){
        var occurenceInCategory = [];
        for (var i = 0; i < medicalHistory.length; i++){
            var anOccurence = medicalHistory[i];
            if (anOccurence.MHSCAT == mhscat) {
                occurenceInCategory.push(anOccurence);
            }
        }
        return occurenceInCategory;
    }

    var occurenceExists = function(mhscat) {
        for (var i = 0; i < medicalHistory.length; i++){
            var anOccurence = medicalHistory[i];
            if (anOccurence.MHSCAT==mhscat)
            {
                return anOccurence;
            }
        }
        return null;
    }

    var getMedicalHistory = function() {
        return medicalHistory;
    }

    var populateMedicalHistory = function(RecordItems) {
        var mh = new MedicalEvent();
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    mh.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    mh.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    mh.USUBJID = RecordItems[i].value;
                    //mh.SUBJID = RecordItems[i].value;
                    break;
                }
                case 'MHSEQ':{
                    mh.MHSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'MHTERM':{
                    mh.MHTERM = RecordItems[i].value;
                    break;
                }
                case 'MHENRTPT':{
                    mh.MHENRTPT = RecordItems[i].value;
                    break;
                }
                case 'MHCAT':{
                    mh.MHCAT = RecordItems[i].value;
                    break;
                }
                case 'MHSCAT':{
                    mh.MHSCAT = RecordItems[i].value;
                    break;
                }
                case 'MHSTDTC':{
                    mh.MHSTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'MHENDTC':{
                    mh.MHENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'MHLOC':{
                    mh.MHLOC = RecordItems[i].value;
                    break;
                }
                case 'MHLAT':{
                    mh.MHLAT = RecordItems[i].value;
                    break;
                }
                case 'displaySTDTC':{
                    mh.displaySTDTC = RecordItems[i].value;
                    break;
                }
                case 'displayENDTC':{
                    mh.displayENDTC = RecordItems[i].value;
                    break;
                }
                case 'displayLabel':{
                    mh.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    mh.displayDate = RecordItems[i].value;
                    break;
                }
                case 'displayNote':{
                    mh.displayNote = RecordItems[i].value;
                    break;
                }
            }
        }
        medicalHistory.push(mh);
        //console.log(medicalHistory);
    }

    return {
        getMedicalHistory: getMedicalHistory,
        addOccurence: addOccurence,
        editOccurence: editOccurence,
        deleteOccurence: deleteOccurence,
        getOccurencesInCategory: getOccurencesInCategory,
        getOccurencesInSubCategory: getOccurencesInSubCategory,
        occurenceExists: occurenceExists,
        populateMedicalHistory:populateMedicalHistory,
        getHistoricalOccurences: getHistoricalOccurences,
        printMedicalHistory: printMedicalHistory,
        getOccurenceBySeq: getOccurenceBySeq,
        deleteMedicalHistory: deleteMedicalHistory
    }
});

