/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 27/02/2015
 * Time: 16:52
 * To change this template use File | Settings | File Templates.
 */
var associatedPersonMedicalHistory = angular.module('Optimise.associatedPersonMedicalHistory',[]);

associatedPersonMedicalHistory.factory('AssociatedPersonMedicalHistory',function() {
        return function(USUBJID, MHTERM, SREL) {
        var associatedPerson = {
            USUBJID: USUBJID,
            STUDYID: 'OPTIMISE',
            DOMAIN: 'APMH',
            APID: 'OPT001AP001',
            APMHSEQ:'',
            RSUBJID: USUBJID,
            SREL: SREL,
            MHCAT: '',
            MHSCAT: '',
            MHTERM: MHTERM,
            MHSTDTC: '',
            MHENDTC: ''
        };
        return associatedPerson;
    }
});

associatedPersonMedicalHistory.service('associatedPersonMedicalHistories',function(AssociatedPersonMedicalHistory,
                                                                                   records, viewService) {
    var associatedPersonMedicalHistories = [];

    var deleteAssociatedPersonMedicalHistories = function () {
        associatedPersonMedicalHistories = [];
    }

    var populateAPMH = function(RecordItems){
        var apmh = new AssociatedPersonMedicalHistory();
        for (var i = 0; i < RecordItems.length; i++){

            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    apmh.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    apmh.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    apmh.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'APID':{
                    apmh.APID = RecordItems[i].value;
                    break;
                }
                case 'APMHSEQ':{
                    apmh.APMHSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'RSUBJID':{
                    apmh.RSUBJID = RecordItems[i].value;
                    break;
                }
                case 'SREL':{
                    apmh.SREL = RecordItems[i].value;
                    break;
                }
                case 'MHCAT':{
                    apmh.MHCAT = RecordItems[i].value;
                    break;
                }
                case 'MHSCAT':{
                    apmh.MHSCAT = RecordItems[i].value;
                    break;
                }
                case 'MHTERM':{
                    apmh.MHTERM = RecordItems[i].value;
                    break;
                }
                case 'MHSTDTC':{
                    apmh.MHSTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'MHENDTC':{
                    apmh.MHENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
            }
        }
        associatedPersonMedicalHistories.push(apmh);
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
        for (var e = 0; e < associatedPersonMedicalHistories.length; e++) {
            seq.push(associatedPersonMedicalHistories[e].APMHSEQ);
        }
        return seq;
    }

    var addAPMH = function(USUBJID, MHTERM, SREL){

        var newAssociatedPersonMedicalHistory = new AssociatedPersonMedicalHistory(USUBJID, MHTERM, SREL);

        newAssociatedPersonMedicalHistory.APMHSEQ = generateSEQ();
        newAssociatedPersonMedicalHistory.MHTERM = MHTERM;
        newAssociatedPersonMedicalHistory.APID = USUBJID+"-"+newAssociatedPersonMedicalHistory.APMHSEQ;
        newAssociatedPersonMedicalHistory.SREL = SREL;

        associatedPersonMedicalHistories.push(newAssociatedPersonMedicalHistory);

        if (!viewService.workOffline())
            records.saveRecord(newAssociatedPersonMedicalHistory);

//        if (hasMS) {
//            var sameAssociatedPersonMedicalHistory = new AssociatedPersonMedicalHistory(USUBJID, 'Multiple Sclerosis', SREL);
//
//            sameAssociatedPersonMedicalHistory.APMHSEQ = generateSEQ();
//            sameAssociatedPersonMedicalHistory.MHTERM = 'Multiple Sclerosis';
//            sameAssociatedPersonMedicalHistory.APID = USUBJID+"-"+sameAssociatedPersonMedicalHistory.APMHSEQ;
//            sameAssociatedPersonMedicalHistory.SREL = SREL;
//            sameAssociatedPersonMedicalHistory.hasMS = true;
//
//            associatedPersonMedicalHistories.push(sameAssociatedPersonMedicalHistory);
//
//            if (!viewService.workOffline())
//                records.saveRecord(sameAssociatedPersonMedicalHistory);
//        }

        //console.log(associatedPersonMedicalHistories);

        /*
        var existingAPMH = getAPMHByTerm(SREL);
        //console.log(existingAPMH);
        if (existingAPMH != null)
        {
            if (MHTERM=="Multiple Sclerosis"){
                existingAPMH.hasms = true;
            }
            else{
                for (var t = 0; t < existingAPMH.apmhterms.length; t++){
                    if (existingAPMH.apmhterms[t]==''){
                        existingAPMH.apmhterms[t] = MHTERM;
                        break;
                    }
                }
            }
        }
        else{
            var newAPMH = new APMH(SREL);
            if (MHTERM=="Multiple Sclerosis"){
                newAPMH.hasms = true;
            }
            else{
                newAPMH.apmhterms[0]=MHTERM;
            }
            APMHList.push(newAPMH);
            console.log(newAPMH);
        }*/

    }

    var editAPMH = function (AP, recordToChange, valueToChange){
        var USUBJID = {fieldName: "USUBJID", value: AP.USUBJID};
        var APMHSEQ = {fieldName:"APMHSEQ", value: AP.APMHSEQ};
        var RECTOCHANGE = {fieldName:recordToChange, value: valueToChange};

        var idRecord = [USUBJID, MHSEQ];
        var valueRecord = [RECTOCHANGE];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var getAPMHWithMS = function(SREL) {
        for (var ap = 0; ap < associatedPersonMedicalHistories.length; ap++) {
            if ((associatedPersonMedicalHistories[ap].SREL == SREL)
                && (associatedPersonMedicalHistories[ap].MHTERM == 'Multiple Sclerosis'))
            {
                return associatedPersonMedicalHistories[ap];
            }
        }
        return null;
    }

    var APMHWithMSExists = function() {
        for (var ap = 0; ap < associatedPersonMedicalHistories.length; ap++) {
            if (associatedPersonMedicalHistories[ap].MHTERM == 'Multiple Sclerosis')
            {
                return true;
            }
        }
        return false;
    }

    var getAPMHByRel = function(SREL, MHTERM) {

        for (var ap = 0; ap < associatedPersonMedicalHistories.length; ap++) {
            if ((associatedPersonMedicalHistories[ap].SREL == SREL)
                && (associatedPersonMedicalHistories[ap].MHTERM == MHTERM))
            {
                return associatedPersonMedicalHistories[ap];
            }
        }
        return null;
    }

    var deleteAPMH = function(AP){
        var indexOfAP = associatedPersonMedicalHistories.indexOf(AP);
//        var APWithMS = getAPMHWithMS(AP.SREL);
//        if (APWithMS != null) {
//            var indexOFAPWithMS = associatedPersonMedicalHistories.indexOf(APWithMS);
//            if (indexOFAPWithMS > -1) {
//                associatedPersonMedicalHistories.splice(indexOFAPWithMS, 1);
//                /*
//                for (var v = 0; v < associatedPersonMedicalHistories.length; v++)
//                {
//                    associatedPersonMedicalHistories[v].APMHSEQ = v;
//                    associatedPersonMedicalHistories[v].APID = associatedPersonMedicalHistories[v].USUBJID+"-"+associatedPersonMedicalHistories.APMHSEQ;
//                }*/
//                if (!viewService.workOffline())
//                    records.deleteRecord(APWithMS);
//            }
//        }

        if (indexOfAP > -1) {
            associatedPersonMedicalHistories.splice(indexOfAP, 1);
            if (!viewService.workOffline())
                records.deleteRecord(AP);
        }
    }

    var getAPMHList = function(){
        return associatedPersonMedicalHistories;

    }

    return {
        addAPMH:addAPMH,
        deleteAPMH:deleteAPMH,
        getAPMHList: getAPMHList,
        editAPMH:editAPMH,
        getAPMHByRel:getAPMHByRel,
        APMHWithMSExists:APMHWithMSExists,
        populateAPMH:populateAPMH,
        deleteAssociatedPersonMedicalHistories: deleteAssociatedPersonMedicalHistories,
        getAPMHWithMS: getAPMHWithMS

    }
});
