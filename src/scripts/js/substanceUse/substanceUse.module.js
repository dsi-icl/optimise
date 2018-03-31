/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 24/01/2015
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */

var substanceModule = angular.module('Optimise.substanceUse', ['Optimise.view', 'Optimise.record']);

substanceModule.factory('SubstanceUse', function () {
    return function (USUBJID, sutrt) {
        var SubstanceUse = {

            USUBJID : USUBJID,
            STUDYID : 'OPTIMISE',
            DOMAIN:'SU',
            SUSEQ :'',
            SUTRT:sutrt,
            SUDOSE:'',
            SUDOSU:'',
            SUCAT:'',
            SUDOSFRM:'',
            SUDOSFRQ:'',
            SUSTDTC: '',
            SUENDTC: ''
        }
        return SubstanceUse;
    }
});

substanceModule.service('substanceUse', function (SubstanceUse, records, viewService) {
    var substanceUse = [];

    var deleteSubstanceUse = function () {
        substanceUse = [];
    }

    var populateSubstanceUse = function (RecordItems) {
        var newEvent = new SubstanceUse();
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
                case 'SUSEQ':{
                    newEvent.SUSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'SUSTDTC':{
                    newEvent.SUSTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'SUTRT':{
                    newEvent.SUTRT = RecordItems[i].value;
                    break;
                }
                case 'SUDOSE':{
                    newEvent.SUDOSE = RecordItems[i].value;
                    break;
                }
                case 'SUDOSU':{
                    newEvent.SUDOSU = RecordItems[i].value;
                    break;
                }
                case 'SUDOSFRM':{
                    newEvent.SUDOSFRM = RecordItems[i].value;
                    break;
                }
                case 'SUDOSFRQ':{
                    newEvent.SUDOSFRQ = RecordItems[i].value;
                    break;
                }
                case 'SUENDTC':{
                    newEvent.SUENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'SUCAT':{
                    newEvent.SUCAT = RecordItems[i].value;
                    break;
                }

            }
        }
        substanceUse.push(newEvent);
    }

    var addSubstanceUse = function (SU){
        SU.SUSEQ = generateSUSEQ();
        substanceUse.push(SU);
        //console.log(substanceUse);
        if (!viewService.workOffline())
            records.saveRecord(SU);
    }

    var compileSubstanceUseSeq = function () {
        var seq = [];
        for (var e = 0; e < substanceUse.length; e++) {
            seq.push(substanceUse[e].SUSEQ);
        }
        return seq;
    }

    var generateSUSEQ = function () {
        var SUSEQs = compileSubstanceUseSeq();
        if (SUSEQs.length > 0) {
            SUSEQs.sort();
            return (SUSEQs[SUSEQs.length-1]+1);
        }
        else {
            return 0;
        }
    }

    var editSubstanceUse = function(substanceUse, resName, resValue) {
        if (!viewService.workOffline())
        {
            var USUBJID = {fieldName: "USUBJID", value: substanceUse.USUBJID};
            var SEQ = {fieldName:"SUSEQ", value: substanceUse.SUSEQ};
            var RESTOCHANGE = {fieldName:resName, value: resValue};
            //console.log(RESTOCHANGE);

            var idRecord = [USUBJID, SEQ];
            var valueRecord = [RESTOCHANGE];
            records.editRecord(idRecord, valueRecord);
        }
    };


    var deleteThisSubstanceUse = function (SU){
        var index = substanceUse.indexOf(SU);
        if (index > -1) {
            substanceUse.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteRecord(SU);
    }

    var getThisSubstanceUse = function (SUTRT) {
        var substanceUseToTreatment = [];
        //console.log(substanceUse);
        for (var e = 0; e < substanceUse.length; e++)
        {
            if (substanceUse[e].SUTRT == SUTRT){
                substanceUseToTreatment.push(substanceUse[e]);
            }
        }
        //console.log(substanceUseToTreatment);
        return substanceUseToTreatment;
    }

    var getSubstanceUseAscending = function (SUTRT) {
        var substanceUse = getSubstanceUse(SUTRT);
        var STDTCs = compileSubstanceUseStartDates(substanceUse);
        STDTCs.sort(sortAscending);
        var sortedSubstanceUse = [];
        for (var d = 0; d < STDTCs.length; d++) {
            sortedSubstanceUse.push(getSubstanceUseByDate(SUTRT, STDTCs[d]))
        }
        return substanceUse;
    }

    var sortAscending = function (date1, date2) {
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    }

    var compileSubstanceUseStartDates = function (substanceUse) {
        var startDates = [];
        for (var e = 0; e < substanceUse.length; e++) {
            startDates.push(substanceUse[e].SUSTDTC);
        }
        return startDates;
    }

    var getSubstanceUseByDate = function (SUTRT, SUSTDTC) {
        //var substanceUseMeetingCriteria = [];
        for (var e = 0; e < substanceUse.length; e++)
        {
            if (substanceUse[e].SUTRT == SUTRT){
                if (substanceUse[e].SUSTDTC.toDateString() == SUSTDTC.toDateString())
                {
                    return substanceUse[e];
                }
            }
        }
        return null;
    }

    var getSubstanceUseByDisplay = function (displayLabel, SUTRT) {
        var substanceUseMeetingCriteria = [];
        if (displayLabel.indexOf('Dose Change') > -1) // if a dose change is to be deleted
        {
            for (var e = 0; e < substanceUse.length; e++)
            {
                if (substanceUse[e].displayLabel==displayLabel)
                    substanceUseMeetingCriteria.push(substanceUse[e]);
            }
        }
        else {
            for (var e = 0; e < substanceUse.length; e++)
            {
                if (substanceUse[e].SUTRT == SUTRT){
                    substanceUseMeetingCriteria.push(substanceUse[e]);
                }
            }
        }

        return substanceUseMeetingCriteria;
    }


    var getUniqueSubstanceUse = function () {
        var uniqueSubstanceUse = [];
        for (var d = 0; d < substanceUse.length; d++){   // select events that happened on different days
            if (!substanceUseExists(uniqueSubstanceUse, substanceUse[d].SUTRT)){
                uniqueSubstanceUse.push(substanceUse[d]);
            }
        }
        return uniqueSubstanceUse;
    }

    var substanceUseExists = function (uniqueSubstanceUse, SUTRT){
        for (var d = 0; d < uniqueSubstanceUse.length; d++) {
            if (uniqueSubstanceUse[d].SUTRT == SUTRT) {
                return true;
            }
        }
        return false;
    }


    var getSubstanceUse = function() {
        //console.log(substanceUse);
        return substanceUse;
    }

    var clearSubstanceUse = function () {
        substanceUse=[];
    }

    return {
        editSubstanceUse: editSubstanceUse,
        addSubstanceUse: addSubstanceUse,
        deleteSubstanceUse: deleteSubstanceUse,
        getThisSubstanceUse: getThisSubstanceUse,
        getSubstanceUseByDate: getSubstanceUseByDate,
        getSubstanceUseByDisplay: getSubstanceUseByDisplay,
        clearSubstanceUse: clearSubstanceUse,
        getUniqueSubstanceUse: getUniqueSubstanceUse,
        populateSubstanceUse:populateSubstanceUse,
        getSubstanceUse: getSubstanceUse,
        getSubstanceUseAscending:getSubstanceUseAscending
    }
});
