/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:24
 * To change this template use File | Settings | File Templates.
 */

var clinicalEventModule = angular.module('Optimise.clinicalEvent',['Optimise.view', 'Optimise.record']);

clinicalEventModule.service('clinicalEvents', function(clinicalEvent, records, viewService) {
    var clinicalEvents = [];

    var deleteClinicalEvents = function() {
        clinicalEvents=[];
        currentEvent = null;
    }

    var currentEvent = null;

    var medicalConditions = [
        'Abdominal pain',
        'Allergy to Asprin',
        'Allergy to Codeine',
        'Allergy to Methylprednisolone',
        'Allergy to Morphine',
        'Allergy to Penicillin',
        'Allergy to Stemetil',
        'Allergy to Sulphurs',
        'Anaphylaxis',
        'Anemia',
        'Angina pectoris',
        'Anorexia',
        'Anxiety',
        'Arthralgia',
        'Astheria',
        'Autoimmune thyroid disease',
        'Blindness',
        'Blood and lymphatic disorders',
        'Blurred vision',
        'Broncho-pulmonary disorders',
        'Cardiovascular disorders',
        'Chest Pain',
        'Chills',
        'Constipation',
        'Crohns disease',
        'Depression',
        'Derpmatological disorders',
        'Diarrhea',
        'Dizziness',
        'Dyspnea',
        'Endorcine disorders',
        'Epilepsy',
        'Fever',
        'Flu-like symptoms',
        'Gastrointestinal disorders',
        'Genito-urinary disorders',
        'Headache',
        'Hepatic disorders',
        'Hypersensitivity reaction',
        'Hypertension',
        'Hypertonia',
        'Inflammatory bowel disease',
        'Injection site necrosis',
        'Injection side reaction',
        'Insomnia',
        'Liver test(s) abnormality',
        'Lymphopenia',
        'Migraine',
        'Migraine',
        'Muscle ache',
        'Musculoskeletal disorders',
        'Myasthenia gravis',
        'Myelodysplastic syndrome',
        'Nausea',
        'Neutropenia',
        'Palpitation',
        'Pernicious anemia',
        'Pruritus',
        'Psoriasis',
        'Psychiatric disorders',
        'Rash',
        'Renal disorders',
        'Renal test(s) abnormality',
        'Retinal disorders',
        'Rheumatoid arthritis',
        'Rhinitis',
        'Seizures/convulsions',
        'Sinusitis',
        'S L E (Systemic Lupus Erythematosus)',
        'Surgery',
        'Sweating',
        'Tachycardia',
        'Thromboembolic events',
        'Tinnitus',
        'Type 1 diasbetes mellitus',
        'Ulcerative colitis',
        'Vasodilation',
        'Verigo',
        'Vitiligo',
        'Vomiting'
    ];

    var getMedicalConditions = function() {
        return medicalConditions;
    }

    var populateClinicalEvents = function (RecordItems) {
        var newEvent = new clinicalEvent();
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
                case 'CESEQ':{
                    newEvent.CESEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'CEGRPID':{
                    newEvent.CEGRPID = parseInt(RecordItems[i].value);
                    break;
                }
                case 'CELNKID':{
                    newEvent.CELNKID = RecordItems[i].value;
                    break;
                }
                case 'CETERM':{
                    newEvent.CETERM = RecordItems[i].value;
                    break;
                }
                case 'CESEV':{
                    newEvent.CESEV = RecordItems[i].value;
                    break;
                }
                case 'CESTDTC':{
                    newEvent.CESTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'CEENDTC':{
                    newEvent.CEENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'CEBODSYS':{
                    newEvent.CEBODSYS = RecordItems[i].value;
                    break;
                }
                case 'CELAT':{
                    newEvent.CELAT = RecordItems[i].value;
                    break;
                }
                case 'CEOUT':{
                    newEvent.CEOUT = RecordItems[i].value;
                    break;
                }
                case 'CECAT':{
                    newEvent.CECAT = RecordItems[i].value;
                    break;
                }
                case 'displayLabel':{
                    newEvent.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    newEvent.displayDate = RecordItems[i].value;
                    break;
                }
            }
        }
        clinicalEvents.push(newEvent);
    }

    var setEvent = function (event) {
        if (event != null)
            //currentEvent = getEventsByTerm(event.CECAT, event.CETERM, event.CESTDTC);
            if (event.CETERM == 'Multiple Sclerosis Relapse') {
                currentEvent =  getEventsByCatTermAndGroupID(event.CECAT, "Multiple Sclerosis Relapse", event.CEGRPID);
            }
            else
                currentEvent =  getEventsByTerm(event.CECAT, "Multiple Sclerosis Relapse", event.CESTDTC);
        else
            currentEvent = [];
    }

    var setSymptoms = function (visit) {
        currentEvent = getSymptomsByDate(visit.SVSTDTC);
    }

    var clearEvent = function () {
        currentEvent = [];
    }

    var getCurrentEvent = function () {
        return currentEvent;
    }

    var getEventsByDate = function(CESTDTC){
        var events = []
        for (var e = 0; e < clinicalEvents.length; e++) {
            if (clinicalEvents[e].CESTDTC.toDateString() == CESTDTC.toDateString())
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getSymptomsByDate = function(CESTDTC){
        var symptoms = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if ((clinicalEvents[e].CESTDTC.toDateString() == CESTDTC.toDateString())
                &&(clinicalEvents[e].CECAT == 'Symptom'))
            {
                symptoms.push(clinicalEvents[e]);
            }
        }
        return symptoms;
    }

    var getEventsByTerm = function (CECAT, CETERM, CESTDTC) {   // eg. all 'multiple sclerosis relapses'
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if ((clinicalEvents[e].CETERM == CETERM) && (clinicalEvents[e].CECAT == CECAT))
            {
                if  (clinicalEvents[e].CESTDTC.toDateString() == CESTDTC.toDateString()){
                    events.push(clinicalEvents[e]);
                }
            }
        }
        return events;
    }

    var getEventsByCatTermAndGroupID = function (CECAT, CETERM, CEGRPID) {   // eg. all 'multiple sclerosis relapses'
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if ((clinicalEvents[e].CETERM == CETERM)
                && (clinicalEvents[e].CECAT == CECAT)
                && (clinicalEvents[e].CEGRPID == CEGRPID))
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getEventByBodSys = function (CEBODSYS, CETERM, CEGRPID) { // eg. all 'brain stem'
        for (var e = 0; e < clinicalEvents.length; e++) {
            if ((clinicalEvents[e].CEBODSYS == CEBODSYS)&&
                (clinicalEvents[e].CEGRPID == CEGRPID) &&
                (clinicalEvents[e].CETERM == CETERM))
            {
                return clinicalEvents[e];
            }
        }
    }


    var getEventsByCatGroupID = function (CECAT, CEGRPID) { // eg. all 'brain stem'
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if((clinicalEvents[e].CEGRPID == CEGRPID)&&
                (clinicalEvents[e].CECAT==CECAT))
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getEvents = function (CETERM) {
        var events = []
        for (var e = 0; e < clinicalEvents.length; e++) {
            if (clinicalEvents[e].CETERM == CETERM)
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getEventByTermOnDate = function (CETERM, CESTDTC) {
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if ((clinicalEvents[e].CETERM == CETERM)
                && (clinicalEvents[e].CESTDTC.toDateString() == CESTDTC.toDateString()))
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getEventByTermBodsysOnDate = function (CECAT, CETERM, CEBODSYS, CESTDTC) {
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if ((clinicalEvents[e].CECAT == CECAT)
                &&(clinicalEvents[e].CETERM == CETERM)
                &&((clinicalEvents[e].CEBODSYS == CEBODSYS))
                && (clinicalEvents[e].CESTDTC.toDateString() == CESTDTC.toDateString()))
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getEventsFromCategory = function (CECAT) {
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            if (clinicalEvents[e].CECAT == CECAT)
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getEventsFromCategoryAndDate = function (CECAT, CESTDTC) {
        var events = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            //console.log(clinicalEvents[e].CECAT);
            if ((clinicalEvents[e].CECAT == CECAT)&&
                (clinicalEvents[e].CESTDTC.toDateString()==CESTDTC.toDateString()))
            {
                events.push(clinicalEvents[e]);
            }
        }
        return events;
    }

    var getUniqueDatesFromCategory = function (CECAT) {
        var events = getEventsFromCategory(CECAT);
        var uniqueDates = [];
        for (var d = 0; d < events.length; d++){   // select events that happened on different days
            if (!dateExists(uniqueDates, events[d].CESTDTC)){
                uniqueDates.push(events[d]);
            }
        }
        return uniqueDates;
    }

    var getUniqueGroupsFromCategory = function (CECAT) {
        var events = getEventsFromCategory(CECAT);
        var uniqueGroups = [];
        for (var d = 0; d < events.length; d++){   // select events that happened on different days
            if (!groupExists(uniqueGroups, events[d].CEGRPID)){
                uniqueGroups.push(events[d]);
            }
        }
        return uniqueGroups;
    }

    var groupExists = function (uniqueGroups, CEGRPID){
        for (var d = 0; d < uniqueGroups.length; d++) {
            if (uniqueGroups[d].CEGRPID == CEGRPID) {
                return true;
            }
        }
        return false;
    }

    var dateExists = function (uniqueDates, CESTDTC){
        for (var d = 0; d < uniqueDates.length; d++) {
            if (uniqueDates[d].CESTDTC.toDateString() == CESTDTC.toDateString()) {
                return true;
            }
        }
        return false;
    }

    var termExists = function (CETERM) {
        //console.log(medicalConditions);
        for (var t = 0; t < medicalConditions.length; t++){
            if (medicalConditions[t]==CETERM){
                return true;
            }
        }
        return false;
    }

    var getNewCEGRPID = function() {
        var SEQs = compileGrpIds();
        if (SEQs.length > 0) {
            SEQs.sort(sortNumber);
            return (SEQs[SEQs.length-1]+1);
        }
        else {
            return 0;
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
        for (var e = 0; e < clinicalEvents.length; e++) {
            seq.push(clinicalEvents[e].CESEQ);
        }
        return seq;
    }

    var compileGrpIds = function () {
        var seq = [];
        for (var e = 0; e < clinicalEvents.length; e++) {
            seq.push(clinicalEvents[e].CEGRPID);
        }
        return seq;
    }

    var addEvent = function (newEvent) {
        newEvent.CESEQ = generateSEQ();
        clinicalEvents.push(newEvent);
        if (!viewService.workOffline())
        {
            //viewService.workOffline();
            records.saveRecord(newEvent);
        }
    }

    var editEvent = function(event, resName, resValue) {
        var USUBJID = {fieldName: "USUBJID", value: event.USUBJID};
        var CESEQ = {fieldName:"CESEQ", value: event.CESEQ};
        var CERESTOCHANGE = {fieldName:resName, value: resValue};

        var idRecord = [USUBJID, CESEQ];
        var valueRecord = [CERESTOCHANGE];

        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var deleteEvent = function (event) {
        var index = clinicalEvents.indexOf(event);
        if (index > -1) {
            clinicalEvents.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteRecord(event);
    }

    var printEvents = function() {
        console.log(clinicalEvents);
    }

    var getClinicalEvents = function() {
        return clinicalEvents;
    }

    return {
        getClinicalEvents: getClinicalEvents,
        getEvents: getEvents,
        addEvent: addEvent,
        editEvent: editEvent,
        setEvent: setEvent,
        deleteEvent: deleteEvent,
        clearEvent: clearEvent,
        getCurrentEvent: getCurrentEvent,   // get the current day in which a relapse occured
        getEventByBodSys:getEventByBodSys, // event occurs in same body system, same day
        getEventsByTerm:getEventsByTerm, // same event, same day
        printEvents: printEvents,
        getSymptomsByDate: getSymptomsByDate,
        setSymptoms: setSymptoms,
        getEventsByDate: getEventsByDate,
        populateClinicalEvents:populateClinicalEvents,
        getEventByTermOnDate: getEventByTermOnDate,
        getUniqueDatesFromCategory:getUniqueDatesFromCategory,
        getEventsFromCategoryAndDate:getEventsFromCategoryAndDate,
        termExists: termExists,
        getEventsFromCategory:getEventsFromCategory,
        getMedicalConditions:getMedicalConditions,
        getNewCEGRPID: getNewCEGRPID,
        getEventsByCatTermAndGroupID: getEventsByCatTermAndGroupID,
        getUniqueGroupsFromCategory: getUniqueGroupsFromCategory,
        deleteClinicalEvents:deleteClinicalEvents,
        getEventByTermBodsysOnDate: getEventByTermBodsysOnDate,
        getEventsByCatGroupID: getEventsByCatGroupID
    }
})

clinicalEventModule.factory('clinicalEvent', function() {
    return function(USUBJID, CETERM, CECAT) {
        var clinicalEvent = {
            STUDYID: 'OPTIMISE',
            DOMAIN: 'CE',
            USUBJID: USUBJID,
            CESEQ: '',
            CEGRPID:-1,
            CELNKID: '',
            CETERM: CETERM,
            CESEV: '',
            CESTDTC: '',
            CEENDTC: '',
            CEBODSYS: '',
            CEOUT: '',
            displayLabel:'',
            CECAT:CECAT,
            CELAT: ''
        }
        return clinicalEvent;
    }
});
