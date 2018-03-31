/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:18
 * To change this template use File | Settings | File Templates.
 */

var findingModule = angular.module('Optimise.findingAbout',['Optimise.view', 'Optimise.record']);

findingModule.factory('findingAbout', function() {
    return function(USUBJID, FAOBJ, FACAT, FASCAT) {
        var findingsAbout = {
            STUDYID: 'OPTIMISE',
            DOMAIN: 'FA',
            USUBJID: USUBJID,
            FASEQ: '',
            FATESTCD: '',
            FATEST: '',
            FAOBJ: FAOBJ,      //RRMS
            FACAT: FACAT,     //PRIMARY DIAGNOSIS
            FASCAT: FASCAT,    // ONSET COURSE
            FALOC: '',    //EYE
            FALAT: '',    //Right
            FATPT: '',    //Right
            FAMETHOD: '',    //MRI
            FAORES:'',
            FASTRESU:'',
            //FADTC: new Date (2015, 01, 01),
            FADTC: '',
            FALNKID:''
        }
        return findingsAbout;
    }
});

findingModule.service('findingsAbout', function(findingAbout, records, viewService) {
    var findings = [];

    var deleteFindings = function() {
        findings = [];
    }

    var populateFindings = function (RecordItems) {
        var aFinding = new findingAbout();
        //console.log(RecordItems);
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    aFinding.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    aFinding.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    aFinding.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'FASEQ':{
                    aFinding.FASEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'FATESTCD':{
                    aFinding.FATESTCD = RecordItems[i].value;
                    break;
                }
                case 'FATEST':{
                    aFinding.FATEST = RecordItems[i].value;
                    break;
                }
                case 'FAOBJ':{
                    aFinding.FAOBJ = RecordItems[i].value;
                    break;
                }
                case 'FACAT':{
                    aFinding.FACAT = RecordItems[i].value;
                    break;
                }
                case 'FASCAT':{
                    aFinding.FASCAT = RecordItems[i].value;
                    break;
                }
                case 'FALOC':{
                    aFinding.FALOC = RecordItems[i].value;
                    break;
                }
                case 'FALAT':{
                    aFinding.FALAT = RecordItems[i].value;
                    break;
                }
                case 'FATPT':{
                    aFinding.FATPT = RecordItems[i].value;
                    break;
                }
                case 'FAMETHOD':{
                    aFinding.FAMETHOD = RecordItems[i].value;
                    break;
                }
                case 'FAORES':{
                    aFinding.FAORES = RecordItems[i].value;
                    break;
                }
                case 'FASTRESU':{
                    aFinding.FASTRESU = RecordItems[i].value;
                    break;
                }
                case 'FADTC':{
                    aFinding.FADTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'FAMETHOD':{
                    aFinding.FAMETHOD = RecordItems[i].value;
                    break;
                }
                case 'FALNKID':{
                    aFinding.FALNKID = RecordItems[i].value;
                    break;
                }
            }
        }
        findings.push(aFinding);
    }

    var displayFindings = function() {
        console.log(findings);
    }

    var generateSEQ = function () {
        var SEQs = compileFindings();
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

    var compileFindings = function () {
        var seq = [];
        for (var e = 0; e < findings.length; e++) {
            seq.push(findings[e].FASEQ);
        }
        return seq;
    }

    var addFinding = function (newFinding) {
        newFinding.FASEQ = generateSEQ();
        findings.push(newFinding);

        if (!viewService.workOffline())
            records.saveRecord(newFinding);
    }

    var getFindingsByLNKID = function (LNKID){
        var findingsWithLnk = [];
        for (var f = 0; f < findings.length; f++){
            if (findings[f].FALNKID == LNKID) {
                findingsWithLnk.push(findings[f]);
            }
        }
        return findingsWithLnk;
    }

    var findingsByLocAndMet = function (faloc, famethod) {
        for (var f = 0; f < findings.length; f++){
            if ((findings[f].FALOC == faloc) && (findings[f].FAMETHOD==famethod)) {
                return findings[f];
            }
            else
            {
                return null;
            }
        }
    }

    var findingsByLoc = function (faloc) {
        var faList = [];
        for (var f = 0; f < findings.length; f++){
            if (findings[f].FALOC == faloc) {
                faList.push(findings[f]);
            }
        }
        return faList;
    }

    var FASCATExists = function (FASCAT) {
        var faList = [];
        for (var f = 0; f < findings.length; f++){
            if (findings[f].FASCAT == FASCAT) {
                faList.push(findings[f]);
            }
        }
        return faList;
    }

    var deleteFinding = function (finding) {
        var index = findings.indexOf(finding);
        if (index > -1) {
            findings.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteRecord(finding);
    }

    var editFinding = function (fa) {
        var USUBJID = {fieldName: "USUBJID", value: fa.USUBJID};
        var FAORES = {fieldName:"FAORES", value: fa.FAORES};
        var FASEQ = {fieldName:"FASEQ", value: fa.FASEQ};

        var idRecord = [USUBJID, FASEQ];
        var valueRecord = [FAORES];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var editFindingMethod = function (faloc, famethod) {
        for (var f = 0; f < findings.length; f++)
        {
            if (findings[f].FALOC == faloc) {
                findings[f].FAMETHOD = famethod;
            }
        }
    }

    var getFindings = function() {
        return findings;
    }



    return {
        addFinding: addFinding,
        findingsByLocAndMet:findingsByLocAndMet,
        findingsByLoc:findingsByLoc,
        deleteFinding: deleteFinding,
        editFindingMethod: editFindingMethod,
        displayFindings: displayFindings,
        getFindingsByLNKID:getFindingsByLNKID,
        populateFindings:populateFindings,
        getFindings: getFindings,
        editFinding: editFinding,
        FASCATExists: FASCATExists,
        deleteFindings:deleteFindings
    }
});

findingModule.controller('findingAboutInfoCtrl', function($scope, viewService) {
    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Finding') {
            return true;
        }
        else
            return false;

    }
})

findingModule.directive('findingEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        template:'<h3>Findings</h3>'
    };
});