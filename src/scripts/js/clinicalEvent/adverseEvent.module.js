/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 11/05/2015
 * Time: 16:50
 * To change this template use File | Settings | File Templates.
 */

var adverseEventModule = angular.module('Optimise.adverseEvent',[]);

adverseEventModule.factory('AdverseEvent', function() {
    return function(USUBJID, AETERM) {
        this.STUDYID= 'OPTIMISE';
        this.DOMAIN= 'AE';
        this.USUBJID= USUBJID;
        this.AESEQ ='';
        this.AETERM = AETERM;
        this.AESTDTC= '';      //Visit Name
        this.AEENDTC= '';     //Start Date/Time of Visit
        this.AEMODIFY= '';    //End Date/Time of Visit
        this.AEDECOD= '';    //Description of Unplanned Visit
        this.AEBODSYS ='';
        this.AESEV = '';
        this.AESER= '';      //Visit Name
        this.AEACN= '';     //Start Date/Time of Visit
        this.AEREL= '';    //End Date/Time of Visit
        this.AEOUT= '';
        this.AESCONG ='';
        this.AESDISAB = '';
        this.AESDTH= '';      //Visit Name
        this.AESHOSP= '';     //Start Date/Time of Visit
        this.AESLIFE= '';    //End Date/Time of Visit
        this.AESMIE= '';    //Description of Unplanned Visit
        this.AESTDY = '';
        this.AEENDY= '';      //Visit Name
        this.AEENRF= '';    //End Date/Time of Visit
        this.displayLabel= '';    //End Date/Time of Visit
        this.displayDate= '';    //End Date/Time of Visit
    }
});

adverseEventModule.service('adverseEventService', function(records, viewService,
                                              AdverseEvent) {
    var adverseEvents = [];
    var currentEvent = null;

    var populateAdverseEvents = function(RecordItems) {
        var event = new AdverseEvent();
        for (var i = 0; i < RecordItems.length; i++){
            //console.log(RecordItems[i].fieldName+ ": "+RecordItems[i].value);
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    event.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    event.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    event.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'AESEQ':{
                    event.AESEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'AETERM':{
                    event.AETERM = RecordItems[i].value;
                    break;
                }
                case 'AESTDTC':{

                    event.AESTDTC = records.formatStringToDate(RecordItems[i].value);
                    //console.log("Date:" +event.AESTDTC.toDateString());
                    break;
                }
                case 'AEENDTC':{
                    event.AEENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'AEMODIFY':{
                    event.AEMODIFY = RecordItems[i].value;
                    break;
                }
                case 'AEDECOD':{
                    event.AEDECOD = RecordItems[i].value;
                    break;
                }
                case 'AEBODSYS':{
                    event.AEBODSYS = RecordItems[i].value;
                    break;
                }
                case 'AESER':{
                    event.AESER = RecordItems[i].value;
                    break;
                }
                case 'AEACN':{
                    event.AEACN = RecordItems[i].value;
                    break;
                }
                case 'AEREL':{
                    event.AEREL = RecordItems[i].value;
                    break;
                }
                case 'AEOUT':{
                    event.AEOUT = RecordItems[i].value;
                    break;
                }
                case 'AESEV':{
                    event.AESEV = RecordItems[i].value;
                    break;
                }
                case 'AESCONG':{
                    event.AESCONG = getTrueFalse(RecordItems[i].value);
                    break;
                }
                case 'AESDISAB':{
                    event.AESDISAB = getTrueFalse(RecordItems[i].value);
                    break;
                }
                case 'AESDTH':{
                    event.AESDTH = getTrueFalse(RecordItems[i].value);
                    //console.log("Death:" +event.AESDTH);
                    break;
                }
                case 'AESHOSP':{
                    event.AESHOSP = getTrueFalse(RecordItems[i].value);
                    break;
                }
                case 'AESLIFE':{
                    event.AESLIFE = getTrueFalse(RecordItems[i].value);
                    break;
                }
                case 'AEOUT':{
                    event.AEOUT = RecordItems[i].value;
                    break;
                }
                case 'AESMIE':{
                    event.AESMIE = RecordItems[i].value;
                    break;
                }
                case 'AESTDY':{
                    event.AESTDY = RecordItems[i].value;
                    break;
                }
                case 'AEENDY':{
                    event.AEENDY = RecordItems[i].value;
                    break;
                }
                case 'AEACN':{
                    event.AEACN = RecordItems[i].value;
                    break;
                }
                case 'AEENRF':{
                    event.AEENRF = RecordItems[i].value;
                    break;
                }
                case 'displayLabel':{
                    event.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    event.displayDate = RecordItems[i].value;
                    break;
                }
            }
        }
        adverseEvents.push(event);
    }

    var getTrueFalse = function (term) {
        if (term == 'True') {
            return true;
        }
        else
        {
            return false;
        }
    }

    var generateSEQ = function () {
        var SEQs = compileEvents();
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

    var compileEvents = function () {
        var seq = [];
        for (var e = 0; e < adverseEvents.length; e++) {
            seq.push(adverseEvents[e].AESEQ);
        }
        return seq;
    }

    var addAdverseEvent = function (adverseEvent) {
        adverseEvent.AESEQ = generateSEQ();
        adverseEvents.push(adverseEvent);
        if (!viewService.workOffline())
            records.saveRecord(adverseEvent);
    } ;

    var deleteAdverseEvent = function(adverseEvent) {
        var index = adverseEvents.indexOf(adverseEvent);
        if (index > -1) {
            adverseEvents.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteRecord(adverseEvent);
    };

    var getAdverseEventByDate = function(AESTDTC) {
        for (var e = 0; e < adverseEvents.length; e++) {
            if (adverseEvents[e].AESTDTC.toDateString() == AESTDTC) {
                return adverseEvents[e];
            }
        }
        return null;
    };

    var getAdverseEventByTermAndDate = function(AESTDTC, AETERM) {
        for (var e = 0; e < adverseEvents.length; e++) {
            if ((adverseEvents[e].AESTDTC.toDateString() == AESTDTC)&&(adverseEvents[e].AETERM == AETERM)) {
                return adverseEvents[e];
            }
        }
        return null;
    };

    var getAdverseEvents = function() {
        return adverseEvents;
    };

    var print = function() {
        console.log(adverseEvents);
    };

    var editAdverseEvent = function(event, resName, resValue) {
        if (!viewService.workOffline())
        {
            var USUBJID = {fieldName: "USUBJID", value: event.USUBJID};
            var SEQ = {fieldName:"AESEQ", value: event.AESEQ};
            var RESTOCHANGE = {fieldName:resName, value: resValue};

            var idRecord = [USUBJID, SEQ];
            var valueRecord = [RESTOCHANGE];
            records.editRecord(idRecord, valueRecord);
        }
    }

    var setEvent = function (event) {
        currentEvent = getEventByDate(event.AESTDTC.toDateString());
    }

    var getEventByDate = function (AESTDTC) {
        for (var e = 0; e < adverseEvents.length; e++) {
            if (adverseEvents[e].AESTDTC.toDateString() == AESTDTC)
                return adverseEvents[e];
        }
        return null;
    };

    var getCurrentEvent = function () {
        return currentEvent;
    };

    return {
        addAdverseEvent:addAdverseEvent,
        deleteAdverseEvent:deleteAdverseEvent,
        populateAdverseEvents:populateAdverseEvents,
        getAdverseEventByDate:getAdverseEventByDate,
        editAdverseEvent:editAdverseEvent,
        print: print,
        getAdverseEvents: getAdverseEvents,
        setEvent: setEvent,
        getCurrentEvent: getCurrentEvent,
        getAdverseEventByTermAndDate: getAdverseEventByTermAndDate
    }

});
