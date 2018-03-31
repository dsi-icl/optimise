/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 06/05/2015
 * Time: 16:16
 * To change this template use File | Settings | File Templates.
 */

var morphologyModule = angular.module('Optimise.morphology',['Optimise.view', 'Optimise.record']);

morphologyModule.factory('Morphology', function() {
    return function(USUBJID, MOTEST) {
        var Morphology = {
            STUDYID:'OPTIMISE',
            DOMAIN:'MO',
            USUBJID:USUBJID,
            SPDEVID:'',
            MOSEQ:'',
            MOLNKID:'',
            MOREFID:'',
            MOTESTCD:'',
            MOTEST:MOTEST,
            MOORRES:'',
            MOORRESU:'',
            MOSTRESC:'',
            MOSTRESN:'',
            MOSTRESU:'',
            MOLOC:'',
            MOSLOC:'',
            MOLAT:'',
            MOMETHOD:'',
            MOANMETH:'',
            MODTC:''
        }
        return Morphology;
    };
});

morphologyModule.service('morphologyServices', function(Morphology, records, viewService) {
    var morphologicalFindings = [];

    var deleteMorphologicalFindings = function() {
        morphologicalFindings = []
    }

    var getMorphologicalFindings = function() {
        return morphologicalFindings;
    }

    var populateMorphologicalFindings = function (RecordItems) {
        var aFinding = new Morphology();
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
                case 'SPDEVID':{
                    aFinding.SPDEVID = RecordItems[i].value;
                    break;
                }
                case 'MOSEQ':{
                    aFinding.MOSEQ = (RecordItems[i].value);
                    break;
                }
                case 'MOLNKID':{
                    aFinding.MOLNKID = RecordItems[i].value;
                    break;
                }
                case 'MOREFID':{
                    aFinding.MOREFID = RecordItems[i].value;
                    break;
                }
                case 'MOTESTCD':{
                    aFinding.MOTESTCD = RecordItems[i].value;
                    break;
                }
                case 'MOTEST':{
                    aFinding.MOTEST = RecordItems[i].value;
                    break;
                }
                case 'MOORRES':{
                    aFinding.MOORRES = getPossiblyTrueFalseValues(RecordItems[i].value);
                    break;
                }
                case 'MOORRESU':{
                    aFinding.MOORRESU = RecordItems[i].value;
                    break;
                }
                case 'MOSTRESC':{
                    aFinding.MOSTRESC = RecordItems[i].value;
                    break;
                }
                case 'MOSTRESN':{
                    aFinding.MOSTRESN = RecordItems[i].value;
                    break;
                }
                case 'MOSTRESU':{
                    aFinding.MOSTRESU = RecordItems[i].value;
                    break;
                }
                case 'MOLOC':{
                    aFinding.MOLOC = RecordItems[i].value;
                    break;
                }
                case 'MOSLOC':{
                    aFinding.MOSLOC = RecordItems[i].value;
                    break;
                }
                case 'MOLAT':{
                    aFinding.MOLAT = RecordItems[i].value;
                    break;
                }
                case 'MOMETHOD':{
                    aFinding.MOMETHOD = RecordItems[i].value;
                    break;
                }
                case 'MOANMETH':{
                    aFinding.MOANMETH = RecordItems[i].value;
                    break;
                }
                case 'MODTC':{
                    aFinding.MODTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
            }
        }
        morphologicalFindings.push(aFinding);
        //console.log(aFinding);
    }

    var getPossiblyTrueFalseValues = function (value) {
        if (value =='True')
            return true;
        else if (value=='False') {
            return false;
        }
        else
            return value;
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
        for (var e = 0; e < morphologicalFindings.length; e++) {
            seq.push(morphologicalFindings[e].MOSEQ);
        }
        return seq;
    }

    var addMorphologicalFinding = function(mo) {
        mo.MOSEQ = generateSEQ();
        morphologicalFindings.push(mo);
        if (!viewService.workOffline())
            records.saveRecord(mo);
    }

    var editMorphologicalFinding = function(mo) {
        var USUBJID = {fieldName: "USUBJID", value: mo.USUBJID};
        var MOTEST = {fieldName:"MOTEST", value: mo.MOTEST};
        var MOSTRESC = {fieldName:"MOSTRESC", value: mo.MOSTRESC};
        var MOSEQ = {fieldName:"MOSEQ", value: mo.MOSEQ};

        var idRecord = [USUBJID, MOTEST, MOSEQ];
        var valueRecord = [MOSTRESC];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var editMorphologicalResult = function(mo) {
        var USUBJID = {fieldName: "USUBJID", value: mo.USUBJID};
        var MOTEST = {fieldName:"MOTEST", value: mo.MOTEST};
        var MOORRES = {fieldName:"MOORRES", value: mo.MOORRES};
        var MOSEQ = {fieldName:"MOSEQ", value: mo.MOSEQ};

        var idRecord = [USUBJID, MOTEST, MOSEQ];
        var valueRecord = [MOORRES];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var editMorphologicalLocation = function(mo) {
        var USUBJID = {fieldName: "USUBJID", value: mo.USUBJID};
        var MOTEST = {fieldName:"MOTEST", value: mo.MOTEST};
        var MOLOC = {fieldName:"MOLOC", value: mo.MOLOC};
        var MOSEQ = {fieldName:"MOSEQ", value: mo.MOSEQ};

        var idRecord = [USUBJID, MOTEST, MOSEQ];
        var valueRecord = [MOLOC];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var deleteMorphologicalFinding = function(mo) {
        var index = morphologicalFindings.indexOf(mo);
        if (index > -1) {
            morphologicalFindings.splice(index, 1);
            if (!viewService.workOffline())
                records.deleteRecord(mo);
        }
    }

    var getFindingsByDate = function(MODTC) {
        var findings = [];
        for (var e = 0; e < morphologicalFindings.length; e++) {
            if (morphologicalFindings[e].MODTC.toDateString() == MODTC.toDateString())
            {
                findings.push(morphologicalFindings[e]);
            }
        }
        return findings;
    }

    var getFindingByDateTest = function(MODTC, MOTEST) {

        for (var e = 0; e < morphologicalFindings.length; e++) {
            if ((morphologicalFindings[e].MODTC.toDateString() == MODTC.toDateString())&&
                (morphologicalFindings[e].MOTEST == MOTEST))
            {
                return morphologicalFindings[e];
            }
        }
        return null;
    }

    var getFindingByTest = function(MOTEST) {
        var listMOTests = [];
        for (var e = 0; e < morphologicalFindings.length; e++) {
            if (morphologicalFindings[e].MOTEST == MOTEST)
            {
                listMOTests.push(morphologicalFindings[e]);
            }
        }
        return listMOTests;
    }

    var getFindingByTestAndLocation = function(MODTC, MOTEST, MOLOC) {

        for (var e = 0; e < morphologicalFindings.length; e++) {
            if ((morphologicalFindings[e].MODTC.toDateString() == MODTC)&&
                (morphologicalFindings[e].MOTEST == MOTEST) &&
                (morphologicalFindings[e].MOLOC == MOLOC))
            {
                return morphologicalFindings[e];
            }
        }
        return null;
    }

    var print = function() {
        console.log(morphologicalFindings);
    }

    return {
        addMorphologicalFinding: addMorphologicalFinding,
        deleteMorphologicalFinding: deleteMorphologicalFinding,
        editMorphologicalLocation: editMorphologicalLocation,
        getFindingsByDate: getFindingsByDate,
        getFindingByTest:getFindingByTest,
        print:print,
        editMorphologicalFinding:editMorphologicalFinding,
        editMorphologicalResult: editMorphologicalResult,
        populateMorphologicalFindings: populateMorphologicalFindings,
        getFindingByTestAndLocation:getFindingByTestAndLocation,
        getMorphologicalFindings:getMorphologicalFindings,
        deleteMorphologicalFindings:deleteMorphologicalFindings,
        getFindingByDateTest: getFindingByDateTest
    }
});
