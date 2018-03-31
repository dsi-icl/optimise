/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 11/03/2015
 * Time: 20:24
 * To change this template use File | Settings | File Templates.
 */

var vitalSignModule = angular.module('Optimise.vitalSign',['Optimise.view', 'Optimise.record']);

vitalSignModule.factory('VitalSign', function() {

    return function(USUBJID, vstest) {
        var vitalSign = {
            STUDYID:"OPTIMISE",
            DOMAIN:'VS',
            USUBJID:USUBJID,
            VSSEQ:"",
            VSTESTCD:"",
            VSTEST:vstest,
            VSPOS:"",
            VSORRES:"",
            VSORRESU:"",
            VSSTRESC:"",
            VSSTRESN:"",
            VSSTRESU:"",
            VSLOC:'',
            VSLAT:'',
            VSBLFL:'',
            VSDRVFL:'',
            VISITNUM:'',
            VISIT:'',
            VSDTC:''
        }
        return vitalSign;
    }
});

vitalSignModule.service('vitalSigns', function(records, viewService,
                                               VitalSign) {
    var vitalSigns = [];

    var deleteVitalSigns = function() {
        vitalSigns = [];
    }

    var populateVitalSigns = function(RecordItems) {
        //console.log(RecordItems);
        var vs = new VitalSign();
        for (var i = 0; i < RecordItems.length; i++){
            //console.log(RecordItems[i].fieldName+ ": "+RecordItems[i].value);
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    vs.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    vs.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    vs.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'VSSEQ':{
                    vs.VSSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'VSTESTCD':{
                    vs.VSTESTCD = RecordItems[i].value;
                    break;
                }
                case 'VSTEST':{
                    vs.VSTEST = RecordItems[i].value;
                    break;
                }
                case 'VSPOS':{
                    vs.VSPOS = RecordItems[i].value;
                    break;
                }
                case 'VSORRES':{
                    vs.VSORRES = RecordItems[i].value;
                    break;
                }
                case 'VSORRESU':{
                    vs.VSORRESU = RecordItems[i].value;
                    break;
                }
                case 'VSSTRESC':{
                    vs.VSSTRESC = RecordItems[i].value;
                    break;
                }
                case 'VSSTRESN':{
                    vs.VSSTRESN = RecordItems[i].value;
                    break;
                }
                case 'VSSTRESU':{
                    vs.VSSTRESU = RecordItems[i].value;
                    break;
                }
                case 'VSLOC':{
                    vs.VSLOC = RecordItems[i].value;
                    break;
                }
                case 'VSLAT':{
                    vs.VSLAT = RecordItems[i].value;
                    break;
                }
                case 'VSBLFL':{
                    vs.VSBLFL = RecordItems[i].value;
                    break;
                }
                case 'VSDTC':{
                    vs.VSDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }

            }
        }
        vitalSigns.push(vs);
        //console.log(vitalSigns);
    }

    var generateSEQ = function () {
        var SEQs = compileSigns();
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


    var compileSigns = function () {
        var seq = [];
        for (var e = 0; e < vitalSigns.length; e++) {
            seq.push(vitalSigns[e].VSSEQ);
        }
        return seq;
    }

    var addVitalSign = function(vs) {
        vs.VSSEQ = generateSEQ();
        vitalSigns.push(vs);
        if (!viewService.workOffline())
            records.saveRecord(vs);
    }

    var editVitalSign = function(vs) {
        var USUBJID = {fieldName: "USUBJID", value: vs.USUBJID};
        var VSTEST = {fieldName:"VSTEST", value: vs.VSTEST};
        var VSORRES = {fieldName:"VSORRES", value: vs.VSORRES};
        var VSSEQ = {fieldName:"VSSEQ", value: vs.VSSEQ};

        var idRecord = [USUBJID, VSTEST, VSSEQ];
        var valueRecord = [VSORRES];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var deleteVitalSign = function(vs) {
        var index = vitalSigns.indexOf(vs);
        if (index > -1) {
            vitalSigns.splice(index, 1);
            if (!viewService.workOffline())
                records.deleteRecord(vs);
        }
    }

    var getSignsByDate = function(VSDTC) {
        var signs = [];
        for (var e = 0; e < vitalSigns.length; e++) {
            if (vitalSigns[e].VSDTC.toDateString() == VSDTC.toDateString())
            {
                signs.push(vitalSigns[e]);
            }
        }
        return signs;
    }

    var getSignByTest = function(VSDTC, VSTEST) {

        for (var e = 0; e < vitalSigns.length; e++) {
            //console.log(VSDTC.toDateString());
            //console.log(vitalSigns[e].VSDTC.toDateString());
            //console.log(VSTEST);
            //console.log(vitalSigns[e].VSTEST);
            if ((vitalSigns[e].VSDTC.toDateString() == VSDTC.toDateString())&&
                (vitalSigns[e].VSTEST == VSTEST))
            {
                return vitalSigns[e];
            }
        }
        return null;
    }

    var print = function() {
        console.log(vitalSigns);
    }

    var getVitalSigns = function() {
        return vitalSigns;
    }

    return {
        addVitalSign: addVitalSign,
        deleteVitalSign: deleteVitalSign,
        getSignsByDate: getSignsByDate,
        getSignByTest:getSignByTest,
        print:print,
        editVitalSign:editVitalSign,
        populateVitalSigns: populateVitalSigns,
        deleteVitalSigns: deleteVitalSigns,
        getVitalSigns: getVitalSigns
    }
});
