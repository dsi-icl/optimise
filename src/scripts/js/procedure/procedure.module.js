/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:13
 * To change this template use File | Settings | File Templates.
 */

var procedureModule = angular.module('Optimise.procedure',['Optimise.record','Optimise.view']);

procedureModule.factory('procedure', function () {
    return function(USUBJID, PRTRT) {
        this.USUBJID= USUBJID;
        this.STUDYID= 'OPTIMISE';
        this.DOMAIN="PR";
        this.PRSEQ= "";
        this.PRTRT= PRTRT;   // Question short name
        this.PRSTDTC= "";
        this.PRLNKID='';
        this.PRLOC='';
        this.PRLAT='';
        this.displayLabel='';
        this.displayDate='';
        this.XNATExperimentID='';
        this.XNATExperimentURI='';
    }
})

procedureModule.service('procedures', function (procedure, records, viewService) {
    var procedures = [];
    var currentProcedure = '';

    var deleteProcedures = function() {
        procedures = [];
        currentProcedure = '';
    }

    var getProcedures = function() {
        return procedures;
    }

    var setCurrentProcedure = function (PR) {
        currentProcedure = PR;
    }

    var getCurrentProcedure = function () {
        return currentProcedure;
    }

    var syncExperiments = function (experiments, USUBJID) {
        //console.log(experiments);

        for (var e = 0; e < experiments.length; e++) {
            var dateOfExperiment = dateFromXNATRetrievedExperiment(experiments[e].date);
            //console.log(dateOfExperiment);

            // TO DO: if (new procedure not found in db, add procedure)
            var foundProcedures = getProcedureByTRTAndDate('MRI',  dateOfExperiment);
            //console.log(foundProcedures);
            if (foundProcedures.length == 0){
                var aProcedure = new procedure(USUBJID, 'MRI');
                aProcedure.PRLOC = 'Head';
                aProcedure.PRSTDTC = dateOfExperiment;
                aProcedure.displayLabel = experiments[e].label;
                aProcedure.displayDate = dateOfExperiment.toDateString();
                aProcedure.XNATExperimentID = experiments[e].id;
                aProcedure.XNATExperimentURI = experiments[e].uri;

                //procedures.push(aProcedure);
                addProcedure(aProcedure);
            }
        }
    }

    var dateFromXNATRetrievedExperiment = function (dateOfExperiment) {
        return new Date(getYear(dateOfExperiment), getMonth(dateOfExperiment), getDay(dateOfExperiment));
    }

    var getYear = function(aDateString) {
        //console.log(aDateString.substr(0,4));
        return (aDateString.substr(0,4));
    }

    var getMonth = function(aDateString) {
        //console.log(aDateString.substr(5,7));
        return (aDateString.substr(5,2)-1);
    }

    var getDay = function(aDateString) {
        //console.log(aDateString.substr(8,10));
        return (aDateString.substr(8,2));
    }

    var getProcedureDates = function(PRTRT) {
        var dates = [];
        for (var e = 0; e < procedures.length; e++) {
            if (procedures[e].PRTRT==PRTRT){
                dates.push(procedures[e]);
            }
        }
        return dates;
    }

    var createNewProcedure = function (RecordItems) {
        var aProcedure = new procedure();
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    aProcedure.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    aProcedure.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    aProcedure.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'PRSEQ':{
                    aProcedure.PRSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'PRTRT':{
                    aProcedure.PRTRT = RecordItems[i].value;
                    break;
                }
                case 'PRSTDTC':{
                    aProcedure.PRSTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'PRLNKID':{
                    aProcedure.PRLNKID = RecordItems[i].value;
                    break;
                }
                case 'PRLOC':{
                    aProcedure.PRLOC = RecordItems[i].value;
                    break;
                }
                case 'PRLAT':{
                    aProcedure.PRLAT = RecordItems[i].value;
                    break;
                }
                case 'displayLabel':{
                    aProcedure.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    aProcedure.displayDate = RecordItems[i].value;
                    break;
                }
                case 'XNATExperimentID':{
                    aProcedure.XNATExperimentID = RecordItems[i].value;
                    break;
                }
                case 'XNATExperimentURI':{
                    aProcedure.XNATExperimentURI = RecordItems[i].value;
                    break;
                }
            }
        }
        return aProcedure;
    }
    var populateProcedures = function (RecordItems) {

        procedures.push(createNewProcedure(RecordItems));
    }

    var generateSEQ = function () {
        var SEQs = compileProcedures();
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


    var compileProcedures = function () {
        var seq = [];
        for (var e = 0; e < procedures.length; e++) {
            seq.push(procedures[e].PRSEQ);
        }
        return seq;
    }

    var addProcedure = function(procedure)
    {
        procedure.PRSEQ = generateSEQ();
        procedures.push(procedure);
        if (!viewService.workOffline())
            records.saveRecord(procedure);
    }

    var editProcedure = function (pr, recordToChange, valueToChange){
        var USUBJID = {fieldName: "USUBJID", value: pr.USUBJID};
        var PRSEQ = {fieldName:"PRSEQ", value: pr.PRSEQ};
        var RECTOCHANGE = {fieldName:recordToChange, value: valueToChange};

        var idRecord = [USUBJID, PRSEQ];
        var valueRecord = [RECTOCHANGE];

        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }


    var getProcedureByTRTAndDate = function(PRTRT, PRSTDTC)
    {
        var validProcedures = [];
        for (var p = 0; p < procedures.length; p++) {
            if ((procedures[p].PRTRT==PRTRT)
                &&(procedures[p].PRSTDTC.toDateString()==PRSTDTC.toDateString())){
                    validProcedures.push(procedures[p]);
            }
        }
        return validProcedures;
    }

    var getVisitProceduresByDate = function(PRSTDTC)
    {
        var procedureNames = ['Nine Hole Peg Test', 'Eight Metre Walk Test'];
        var validProcedures = [];
        for (var n = 0; n < procedureNames.length; n++){
            for (var p = 0; p < procedures.length; p++) {
                if ((procedures[p].PRTRT==procedureNames[n])
                    &&(procedures[p].PRSTDTC.toDateString()==PRSTDTC.toDateString())){
                    validProcedures.push(procedures[p]);
                }
            }
        }
        return validProcedures;
    }

    var getImagingProceduresByDate = function(PRSTDTC)
    {
        var procedureNames = ['MRI'];
        var validProcedures = [];
        for (var n = 0; n < procedureNames.length; n++){
            for (var p = 0; p < procedures.length; p++) {
                if ((procedures[p].PRTRT==procedureNames[n])
                    &&(procedures[p].PRSTDTC.toDateString()==PRSTDTC.toDateString())){
                    validProcedures.push(procedures[p]);
                }
            }
        }
        return validProcedures;
    }

    var getImagingProcedures = function()
    {
        var procedureNames = ['MRI'];
        var validProcedures = [];
        for (var n = 0; n < procedureNames.length; n++){
            for (var p = 0; p < procedures.length; p++) {
                if (procedures[p].PRTRT==procedureNames[n]){
                    validProcedures.push(procedures[p]);
                }
            }
        }
        return validProcedures;
    }

    var deleteProcedure = function (procedure) {
        var index = procedures.indexOf(procedure);
        if (index > -1) {
            procedures.splice(index, 1);
            if (!viewService.workOffline()) {
                records.deleteRecord(procedure);
            }
        }
    }


    var printProcedures = function () {
        console.log(procedures);
    }

    return {
        addProcedure:addProcedure,
        editProcedure: editProcedure,
        getProcedureByTRTAndDate: getProcedureByTRTAndDate,
        populateProcedures:populateProcedures,
        getVisitProceduresByDate: getVisitProceduresByDate,
        deleteProcedure: deleteProcedure,
        printProcedures: printProcedures,
        syncExperiments: syncExperiments,
        setCurrentProcedure: setCurrentProcedure,
        getCurrentProcedure: getCurrentProcedure,
        getProcedures: getProcedures,
        deleteProcedures: deleteProcedures,
        getImagingProceduresByDate: getImagingProceduresByDate,
        getImagingProcedures: getImagingProcedures,
        getProcedureDates: getProcedureDates,
        createNewProcedure: createNewProcedure
    };
})