/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 17/03/2015
 * Time: 16:19
 * To change this template use File | Settings | File Templates.
 */

var nervousSystemFindingModule = angular.module('Optimise.nervousSystemFindings',
    ['Optimise.view', 'Optimise.record']);

nervousSystemFindingModule.factory('NervousSystemFinding', function() {
    return function(USUBJID, NVTEST) {
        var finding = {
            STUDYID:'OPTIMISE',
            DOMAIN:'NV',
            USUBJID:USUBJID,
            SPDEVID:'',
            NVSEQ:'',
            NVGRPID:'',
            NVTESTCD:'',
            NVTEST:NVTEST,
            NVCAT:'',
            NVORRES:'',
            NVORRESU:'',
            NVSTRESC:'',
            NVSTRESN:'',
            NVSTRESU:'',
            NVORNRLO:'',
            NVORNRHI:'',
            NVNRIND:'',
            NVLOC:'',
            NVLAT:'',
            NVMETHOD:'',
            NVDTC:''
        };
        return finding;
    };
});

nervousSystemFindingModule.service('nervousSystemFindings', function(NervousSystemFinding, viewService, records){
    var nervousSystemFindings = [];
    var currentCollectionDate = new Date();

    var deleteNervousSystemFindings = function() {
        nervousSystemFindings = [];
    }

    var populateNervousSystemFindings = function(RecordItems) {
        var newTestResult = new NervousSystemFinding();
        for (var i = 0; i < RecordItems.length; i++){

            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    newTestResult.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    newTestResult.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    newTestResult.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'SPDEVID':{
                    newTestResult.SPDEVID = RecordItems[i].value;
                    break;
                }
                case 'NVSEQ':{
                    newTestResult.NVSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'NVGRPID':{
                    newTestResult.NVGRPID = RecordItems[i].value;
                    break;
                }
                case 'NVTESTCD':{
                    newTestResult.NVTESTCD = RecordItems[i].value;
                    break;
                }
                case 'NVTEST':{
                    newTestResult.NVTEST = RecordItems[i].value;
                    break;
                }
                case 'NVCAT':{
                    newTestResult.NVCAT = RecordItems[i].value;
                    break;
                }
                case 'NVORRES':{
                    newTestResult.NVORRES = RecordItems[i].value;
                    break;
                }
                case 'NVORRESU':{
                    newTestResult.NVORRESU = RecordItems[i].value;
                    break;
                }
                case 'NVSTRESC':{
                    newTestResult.NVSTRESC = RecordItems[i].value;
                    break;
                }
                case 'NVSTRESN':{
                    newTestResult.NVSTRESN = RecordItems[i].value;
                    break;
                }
                case 'NVSTRESU':{
                    newTestResult.NVSTRESU = RecordItems[i].value;
                    break;
                }
                case 'NVORNRLO':{
                    newTestResult.NVORNRLO = RecordItems[i].value;
                    break;
                }
                case 'NVORNRHI':{
                    newTestResult.NVORNRHI = RecordItems[i].value;
                    break;
                }
                case 'NVNRIND':{
                    newTestResult.NVNRIND = RecordItems[i].value;
                    break;
                }
                case 'NVLOC':{
                    newTestResult.NVLOC = RecordItems[i].value;
                    break;
                }
                case 'NVDTC':{
                    newTestResult.NVDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'NVLAT':{
                    newTestResult.NVLAT = RecordItems[i].value;
                    break;
                }
                case 'NVMETHOD':{
                    newTestResult.NVMETHOD = RecordItems[i].value;
                    break;
                }
                case 'NVNRIND':{
                    newTestResult.NVNRIND = RecordItems[i].value;
                    break;
                }
                case 'NVLOC':{
                    newTestResult.NVLOC = RecordItems[i].value;
                    break;
                }
                case 'NVDTC':{
                    newTestResult.LBDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'displayLabel':{
                    newTestResult.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    newTestResult.displayDate= RecordItems[i].value;
                    break;
                }
            }
        }
        nervousSystemFindings.push(newTestResult);
    }

    var getNervousSystemFindings = function() {
        return nervousSystemFindings;
    }

    var printNSFindings = function() {
        console.log(nervousSystemFindings);
    }

    var generateSEQ = function () {
        var SEQs = compileResults();
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

    var compileResults = function () {
        var seq = [];
        for (var e = 0; e < nervousSystemFindings.length; e++) {
            seq.push(nervousSystemFindings[e].NVSEQ);
        }
        return seq;
    }

    var editFinding = function(NV, NVORES) {
        var USUBJID = {fieldName: "USUBJID", value: NV.USUBJID};
        var NVSEQ = {fieldName:"NVSEQ", value: NV.NVSEQ};

        var RECTOCHANGE = {fieldName:'NVORRES', value: NVORES};
        var idRecord = [USUBJID, NVSEQ];
        var valueRecord = [RECTOCHANGE];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var addFinding = function (NV){
        NV.NVSEQ = generateSEQ();
        nervousSystemFindings.push(NV);
        if (!viewService.workOffline())
            records.saveRecord(NV);
    }

    var deleteFinding = function (NV){
        console.log(NV);
        var index = nervousSystemFindings.indexOf(NV);
        console.log(index);
        if (index > -1) {
            nervousSystemFindings.splice(index, 1);
            if (!viewService.workOffline())
                records.deleteRecord(NV);
        }
    }

    var getUniqueDates = function () {
        var uniqueDates = [];
        for (var d = 0; d < nervousSystemFindings.length; d++){   // select events that happened on different days
            if (!dateExists(uniqueDates, nervousSystemFindings[d].NVDTC.toDateString())){
                uniqueDates.push(nervousSystemFindings[d]);
            }
        }
        return uniqueDates;
    }

    var dateExists = function (uniqueDates, NVDTC){
        for (var d = 0; d < uniqueDates.length; d++) {
            if (uniqueDates[d].NVDTC.toDateString() == NVDTC) {
                return true;
            }
        }
        return false;
    }

    var getVEPFinding = function(NVTEST, NVLAT, NVDTC) {
        var dateCriteria = NVDTC.toDateString();
        for (var t = 0; t < nervousSystemFindings.length; t++){
            if ((nervousSystemFindings[t].NVCAT=='Evoked Potential')
                &&(nervousSystemFindings[t].NVTEST == NVTEST)
                &&(dateCriteria==nervousSystemFindings[t].NVDTC.toDateString()
                &&(nervousSystemFindings[t].NVLAT==NVLAT))) {
                return (nervousSystemFindings[t]);
            }
        }
        return null;
    }

    var getSEPFinding = function(NVTEST, NVLAT, NVDTC, NVLOC) {
        var dateCriteria = NVDTC.toDateString();
        for (var t = 0; t < nervousSystemFindings.length; t++){
            if ((nervousSystemFindings[t].NVCAT=='Evoked Potential')
                &&(nervousSystemFindings[t].NVTEST == NVTEST)
                &&(dateCriteria==nervousSystemFindings[t].NVDTC.toDateString()
                &&(nervousSystemFindings[t].NVLAT==NVLAT)
                &&(nervousSystemFindings[t].NVLOC==NVLOC))) {
                return (nervousSystemFindings[t]);
            }
        }
        return null;
    }

    var getFindingsByDate = function (NVDTC) {
        var testsOnDate = [];
        var dateCriteria = NVDTC.toDateString();
        for (var t = 0; t < nervousSystemFindings.length; t++){
            if (dateCriteria==nervousSystemFindings[t].NVDTC.toDateString()){
                testsOnDate.push(nervousSystemFindings[t]);
            }
        }
        return testsOnDate;
    };

    var getFindingsOfCurrentDate = function() {
        return getFindingsByDate(currentCollectionDate);
    }

    var setCurrentCollectionDate = function(event) {
        if (event.DOMAIN=='IS') {
            currentCollectionDate = event.ISDTC;
        }
        else if (event.DOMAIN=='LB'){
            currentCollectionDate = event.LBDTC;
        }
        else  {
            currentCollectionDate = event.NVDTC;
        }
    }

    var getAssessmentByDate = function (NVDTC) {
        var testsOnDate = [];
        var dateCriteria = NVDTC.toDateString();
        for (var t = 0; t < nervousSystemFindings.length; t++){
            if (dateCriteria==nervousSystemFindings[t].NVDTC.toDateString()){
                testsOnDate.push(nervousSystemFindings[t]);
            }
        }
        return testsOnDate;
    };

    return {
        printNSFindings:printNSFindings,
        addFinding:addFinding,
        editFinding: editFinding,
        deleteFinding:deleteFinding,
        getUniqueDates:getUniqueDates,
        getVEPFinding:getVEPFinding,
        getSEPFinding: getSEPFinding,
        getFindingsOfCurrentDate:getFindingsOfCurrentDate,
        setCurrentCollectionDate: setCurrentCollectionDate,
        getNervousSystemFindings: getNervousSystemFindings,
        populateNervousSystemFindings: populateNervousSystemFindings,
        deleteNervousSystemFindings: deleteNervousSystemFindings,
        getAssessmentByDate: getAssessmentByDate
    };
});