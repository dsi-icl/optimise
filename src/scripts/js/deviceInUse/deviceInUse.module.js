/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 06/05/2015
 * Time: 16:16
 * To change this template use File | Settings | File Templates.
 */

var deviceInUseModule = angular.module('Optimise.deviceInUse',['Optimise.view', 'Optimise.record']);

deviceInUseModule.factory('DeviceInUse', function() {
    return function(USUBJID, DUTEST) {
        var device = {
            STUDYID:'OPTIMISE',
            DOMAIN:'DU',
            USUBJID:USUBJID,
            SPDEVID:'',
            DUSEQ:'',
            DUREFID:'',
            DUTESTCD:'',
            DUTEST:DUTEST,
            DUORRES:'',
            DUORRESU:'',
            DUDTC:'',
            SCANREF:''
        }
        return device;
    };
});

deviceInUseModule.service('deviceInUseServices', function(DeviceInUse, records, viewService) {

    var scansFromDevice = [];

    var populateDeviceInUse = function (RecordItems) {
        var aFinding = new DeviceInUse();
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
                case 'DUSEQ':{
                    aFinding.DUSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'DUREFID':{
                    aFinding.DULNKID = RecordItems[i].value;
                    break;
                }
                case 'DUTESTCD':{
                    aFinding.DUREFID = RecordItems[i].value;
                    break;
                }
                case 'DUTESTCD':{
                    aFinding.DUTESTCD = RecordItems[i].value;
                    break;
                }
                case 'DUTEST':{
                    aFinding.DUTEST = RecordItems[i].value;
                    break;
                }
                case 'DUORRES':{
                    aFinding.DUORRES = RecordItems[i].value;
                    break;
                }
                case 'DUORRESU':{
                    aFinding.DUORRESU = RecordItems[i].value;
                    break;
                }
                case 'DUDTC':{
                    aFinding.DUDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
            }
        }
        scansFromDevice.push(aFinding);
    }

    var generateSEQ = function () {
        var SEQs = compileScans();
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


    var compileScans = function () {
        var seq = [];
        for (var e = 0; e < scansFromDevice.length; e++) {
            seq.push(scansFromDevice[e].DUSEQ);
        }
        return seq;
    }

    var addDeviceInUse = function(du) {
        du.DUSEQ = generateSEQ();
        scansFromDevice.push(du);
        if (!viewService.workOffline())
            records.saveRecord(du);
    }

    var editDeviceInUse = function(du) {
        var USUBJID = {fieldName: "USUBJID", value: du.USUBJID};
        var DUTEST = {fieldName:"DUTEST", value: du.DUTEST};
        var DUORRES = {fieldName:"DUORRES", value: du.VSORRES};
        var DUSEQ = {fieldName:"DUSEQ", value: du.MOSEQ};

        var idRecord = [USUBJID, DUTEST, DUSEQ];
        var valueRecord = [DUORRES];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var deleteDeviceInUse = function(du) {
        var index = scansFromDevice.indexOf(du);
        scansFromDevice.splice(index, 1);
        if (index > -1) {
            if (!viewService.workOffline())
                records.deleteRecord(du);
        }
    }

    var getDeviceInUseByDate = function(DUDTC) {
        var properties = [];
        for (var e = 0; e < scansFromDevice.length; e++) {
            if (scansFromDevice[e].DUDTC.toDateString() == DUDTC.toDateString())
            {
                properties.push(scansFromDevice[e]);
            }
        }
        return properties;
    }

    var getDeviceInUseByTest = function(DUDTC, DUTEST) {
        var devices = [];
        for (var e = 0; e < scansFromDevice.length; e++) {
            if ((scansFromDevice[e].DUDTC.toDateString() == DUDTC.toDateString())&&
                (scansFromDevice[e].DUTEST == DUTEST)) {
                devices.push(scansFromDevice[e]);
            }
        }
        return devices;
    };


    var getScansByDate = function(DUDTC) {
        var scans = [];
        for (var e = 0; e < scansFromDevice.length; e++) {
            //console.log(scansFromDevice[e]);
            if ((scansFromDevice[e].DUDTC.toDateString() == DUDTC.toDateString())&&
                (scansFromDevice[e].DUTEST == 'Weighting')) {
                scans.push(scansFromDevice[e]);
            }
        }
        return scans;
    };

    var print = function() {
        console.log(scansFromDevice);
    }

    var deleteDevicesInUse = function() {
        scansFromDevice = [];
    }

    var getDevicesInUse = function() {
        return scansFromDevice;
    }

    return {
        addDeviceInUse: addDeviceInUse,
        editDeviceInUse: editDeviceInUse,
        deleteDeviceInUse:deleteDeviceInUse,
        getDeviceInUseByDate:getDeviceInUseByDate,
        getDeviceInUseByTest:getDeviceInUseByTest,
        populateDeviceInUse: populateDeviceInUse,
        getScansByDate:getScansByDate,
        print:print,
        deleteDevicesInUse: deleteDevicesInUse,
        getDevicesInUse: getDevicesInUse
    }
});
