/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 10/03/16
 * Time: 17:29
 * To change this template use File | Settings | File Templates.
 */

var reminderModule = angular.module('Optimise.reminders', ['ui.bootstrap']);

reminderModule.factory('Reminder', function () {
    return function (USUBJID) {
        var Reminder = {
            USUBJID : USUBJID,
            SUBJID : '',
            STUDYID : 'OPTIMISE',
            DOMAIN:'REMINDER',
            REMINDERSEQ:'',
            REMINDERFREQUENCY: '',
            REMINDERCATEGORY: '',
//            REMINDERSTDTC: new Date(),
//            REMINDERENDTC: new Date(),
            REMINDERNOTES:'',
            REMINDERACTIVE:'On'
        }
        return Reminder;
    }
});


reminderModule.service('reminders', function (viewService, records, Reminder) {
    var labReminder = null;
    var reminders = [];

    var getLabReminder = function() {
        return labReminder;
    }

    var getReminders = function() {
        return reminders;
    }

    var setCurrentReminder = function (rm) {
        labReminder = rm;
    }

    var saveLabReminder = function(newReminder) {
        newReminder.REMINDERSEQ = generateREMINDERSEQ();
        reminders.push(newReminder);
        labReminder = newReminder;
        if (!viewService.workOffline())
            records.saveReminder(newReminder);
    }

    var deleteReminders = function () {
        reminders = [];
        labReminder = null;
    }

    var compileReminderSeq = function () {
        var seq = [];
        for (var e = 0; e < reminders.length; e++) {
            seq.push(reminders[e].REMINDERSEQ);
        }
        return seq;
    }

    var generateREMINDERSEQ = function () {
        var REMINDERSEQs = compileReminderSeq();
        if (REMINDERSEQs.length > 0) {
            REMINDERSEQs.sort();
            return (REMINDERSEQs[REMINDERSEQs.length-1]+1);
        }
        else {
            return 0;
        }
    }

    var editLabReminder = function(reminder, resName, resValue) {
        if (!viewService.workOffline())
        {
            var USUBJID = {fieldName: "USUBJID", value: reminder.USUBJID};
            var CAT = {fieldName:"REMINDERCATEGORY", value: reminder.REMINDERCATEGORY};
            var RESTOCHANGE = {fieldName:resName, value: resValue};
            //console.log(RESTOCHANGE);

            var idRecord = [USUBJID, CAT];
            var valueRecord = [RESTOCHANGE];
            records.editReminder(idRecord, valueRecord);
        }
    };

    var deleteLabReminder = function (rm){
        console.log(rm);
        var index = reminders.indexOf(rm);
        if (index > -1) {
            reminders.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteReminder(rm);
    }

    var populateReminder = function (RecordItems) {
        var labReminder = new Reminder();
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    labReminder.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    labReminder.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    labReminder.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'SUBJID': {
                    labReminder.SUBJID = RecordItems[i].value;
                    break;
                }
                case 'REMINDERFREQUENCY': {
                    labReminder.REMINDERFREQUENCY = RecordItems[i].value;
                    break;
                }
                case 'REMINDERCATEGORY': {
                    labReminder.REMINDERCATEGORY = RecordItems[i].value;
                    break;
                }

                case 'REMINDERNOTES': {
                    labReminder.REMINDERNOTES = RecordItems[i].value;
                    break;
                }
                case 'REMINDERACTIVE': {
                    labReminder.REMINDERACTIVE = RecordItems[i].value;
                    break;
                }
                case 'REMINDERSEQ': {
                    labReminder.REMINDERSEQ = parseInt(RecordItems[i].value);
                    break;
                }
            }
        }
        reminders.push(labReminder);
    }

    return {
        saveLabReminder: saveLabReminder,
        getLabReminder: getLabReminder,
        editLabReminder: editLabReminder,
        deleteLabReminder: deleteLabReminder,
        deleteReminders: deleteReminders,
        populateReminder: populateReminder,
        getReminders: getReminders,
        setCurrentReminder: setCurrentReminder
    }
});

reminderModule.controller('reminderInfoCtrl', function($scope,
                                                        $rootScope,
                                                        viewService,
                                                        reminders, Reminder) {


    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Reminders') {
            return true;
        }
        else
            return false;
    }

    $rootScope.setNewReminderFields = function () {
        $scope.reminder ={"start":'',
            "end":'',
            "on":'Off',
            "category":'',
            "frequency":'',
            "notes": ""};
        $scope.USUBJID = '';
        $scope.SUBJID = '';
    }

    $rootScope.setNewReminderFields();

    var clearFields = function() {
        $scope.reminder ={"start":'',
            "end":'',
            "on":'Off',
            "category":'',
            "frequency":'',
            "notes": ""};
    }

    $rootScope.displayReminder = function() {
        clearFields();
//        var theReminder = reminders.getLabReminder();
//        if (theReminder != null) {
//            $scope.reminder.on = "On";
//            $scope.reminder.notes = theReminder.REMINDERNOTES;
//            $scope.reminder.start = theReminder.REMINDERSTDTC;
//            $scope.reminder.end = theReminder.REMINDERENDTC;
//            $scope.reminder.category = theReminder.REMINDERCATEGORY;
//
//            var secondsInADay = 86400;
//            switch (theReminder.REMINDERFREQUENCY) {
//                case (secondsInADay * 7): {
//                    $scope.reminder.frequency = 'Once/ Week';
//                    break;
//                }
//
//                case (secondsInADay * 30.5): {
//                    $scope.reminder.frequency = 'Once/ Month';
//                    break;
//                }
//
//                case (secondsInADay * (30.5/2)): {
//                    $scope.reminder.frequency = 'Twice/ Month';
//                    break;
//                }
//
//                case (secondsInADay * 365): {
//                    $scope.reminder.frequency = 'Once/ Year';
//                    break;
//                }
//
//                case (secondsInADay * (365/2)): {
//                    $scope.reminder.frequency = 'Twice/ Year';
//                    break;
//                }
//
//            }
//        }
    }

    var currentDate = new Date();

    $rootScope.setReminderSUBJID = function(USUBJID, SUBJID) {
        $scope.USUBJID = USUBJID;
        $scope.SUBJID = SUBJID;
        reminders.setCurrentReminder(new Reminder(USUBJID));

    }

    var isThisADate = function(ddmmyy) {
        //console.log(ddmmyy);
        if ( Object.prototype.toString.call(ddmmyy) === "[object Date]" ) {
            return true;
        }
        else {
            return false;
        }
    }

    var getSeconds = function(frequency) {
        var secondsInADay = 86400;
        var frequencyInSeconds = '';
        switch (frequency) {
            case ('Once/ Week'): {
                frequencyInSeconds = secondsInADay * 7;
                break;
            }

            case ('Once/ Month'): {
                frequencyInSeconds = secondsInADay * 30.5;
                break;
            }

            case ('Twice/ Month'): {
                frequencyInSeconds = secondsInADay * (30.5/2);
                break;
            }

            case ('Once/ Year'): {
                frequencyInSeconds = secondsInADay * 365;
                break;
            }

            case ('Twice/ Year'): {
                frequencyInSeconds = secondsInADay * (365/2);
                break;

            }
            default: {
                frequencyInSeconds = '';
            }

        }
        console.log(frequencyInSeconds);
        return frequencyInSeconds;
    }

    $scope.setThisReminder = function (aReminder, status) {
        if (status == "On") {
            aReminder.REMINDERACTIVE = "On";
            reminders.editLabReminder(aReminder, 'REMINDERACTIVE', 'On');
        }
        else if (status == 'Delete'){
            if (aReminder != '')
                reminders.deleteLabReminder(aReminder);
        }
        else if (status == 'Off'){
            if (aReminder != '') {
                aReminder.REMINDERACTIVE == "Off";
                reminders.editLabReminder(aReminder, 'REMINDERACTIVE', 'Off');
            }
        }
    }

    $scope.setReminder = function (status) {
        if (status == "On") {
//            var startDate = new Date($scope.reminder.start.substr(6),
//                parseInt($scope.reminder.start.substr(3,2))-1,
//                parseInt($scope.reminder.start.substr(0,2)));
//
//            var endDate = new Date($scope.reminder.end.substr(6),
//                parseInt($scope.reminder.end.substr(3,2))-1,
//                parseInt($scope.reminder.end.substr(0,2)));

            if (($scope.reminder.frequency != '')) {
                var newReminder = new Reminder($scope.USUBJID);
                newReminder.SUBJID = $scope.SUBJID;
                newReminder.REMINDERFREQUENCY = getSeconds($scope.reminder.frequency);
                newReminder.REMINDERCATEGORY = $scope.reminder.category;
                newReminder.REMINDERNOTES = $scope.reminder.notes;
                newReminder.REMINDERACTIVE = "On";
                reminders.saveLabReminder(newReminder);
                //console.log(newReminder);
                clearFields();
            }
        }
    }

    $scope.getFrequency = function (seconds) {
        var secondsInADay = 86400;
        var frequencyPhrase = '';
        switch (seconds) {
            case (secondsInADay * 7): {
                frequencyPhrase = 'Once/ Week';
                break;

            }
            case (secondsInADay * 30.5): {
                frequencyPhrase =  'Once/ Month';
                break;

            }
            case (secondsInADay * (30.5/2)): {
                frequencyPhrase =  'Twice/ Month';
                break;

            }
            case (secondsInADay * 365): {
                frequencyPhrase =  'Once/ Year';
                break;

            }
            case (secondsInADay * (365/2)): {
                frequencyPhrase =  'Twice/ Year';
                break;
            }
            default: {
                frequencyPhrase = seconds;
            }
        }
        return frequencyPhrase ;
    }

    $scope.editThisReminder = function (aReminder, fieldName, fieldValue) {
        if (fieldName == 'REMINDERFREQUENCY') {
            var secondsInADay = 86400;
            var secondsInFrequencyPeriod = 0;
            switch (fieldValue) {
                case ('Once/ Week'): {
                    secondsInFrequencyPeriod = secondsInADay * 7;
                    break;
                }

                case ('Once/ Month'): {
                    secondsInFrequencyPeriod = secondsInADay * 30.5;
                    break;
                }

                case ('Twice/ Month'): {
                    secondsInFrequencyPeriod = secondsInADay * (30.5/2);
                    break;
                }

                case ('Once/ Year'): {
                    secondsInFrequencyPeriod = secondsInADay * 365;
                    break;
                }

                case ('Twice/ Year'): {
                    secondsInFrequencyPeriod = secondsInADay * (365/2);
                    break;
                }

            }
            aReminder.REMINDERFREQUENCY = secondsInFrequencyPeriod;
            reminders.editLabReminder(aReminder, 'REMINDERFREQUENCY', secondsInFrequencyPeriod);
        }
        else if (fieldName == 'REMINDERNOTES') {
            aReminder.REMINDERNOTES = fieldValue;
            reminders.editLabReminder(aReminder, 'REMINDERNOTES', fieldValue);

        }
        else if (fieldName == 'REMINDERDOMAIN') {
            aReminder.REMINDERCATEGORY = fieldValue;
            reminders.editLabReminder(aReminder, 'REMINDERCATEGORY', fieldValue);
        }
    }

    $scope.editReminder = function (fieldName) {
        if (fieldName == 'REMINDERCATEGORY') {
            $scope.reminder.notes = $scope.reminder.category+": "+$scope.reminder.notes;
        }
    }

    var setDatePicker = function() {
        var dayMonthYear = angular.element(document.querySelectorAll('.input-daterange'));
        dayMonthYear.datepicker({
            format: "dd/mm/yyyy",
            endDate: currentDate.getFullYear().toString(),
            startView: 1,
            orientation: "auto",
            autoclose: true,
            todayHighlight: true
        });
    }

    setDatePicker();


    $scope.getReminders = function () {
        //console.log(reminders.getReminders());
        return reminders.getReminders();
    }

})

reminderModule.directive('reminderEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: 'scripts/js/communication/reminder.html'
    };
})

reminderModule.service('remindersForAppointmentsDue', function($q, Reminder, records,
                                                               ImmunogenicitySpecimenAssessment,
                                                               immunogenicitySpecimenAssessments,
                                                               laboratoryTestResults, LaboratoryTestResult,
                                                                procedure, procedures) {

    var getSubjectList = function () {
        //[{"NHS_USUBJID":"12345","USUBJID":"OPT-DM-01-0"}]
        return localStorage.getItem('NHS_OPT_Map');
    }

    var getData = function(USUBJID) {
        if (subjectList != null) {
            subjectList = JSON.parse(subjectList);
            for (var s = 0; s < subjectList.length; s++) {
                var anItem = JSON.parse(localStorage.getItem(subjectList[s].USUBJID));
                if (anItem==null) {
                    $scope.deleteSubject(subjectList[s].USUBJID);
                    alert(subjectList[s].USUBJID+" removed. Close window and try again.")
                    return;
                }
                var RecordSet = JSON.parse(localStorage.getItem(subjectList[s].USUBJID)).RecordSet;
                var opt_id ='';
                var nhs_id ='';
                var age = '';
                var sex = '';
                var rficdtc = '';
                for (var r = 0; r < RecordSet.length; r++) {
                    if (RecordSet[r] != null) {
                        var RecordItem = RecordSet[r].RecordItems;
                        for (var item = 0; item < RecordItem.length; item++) {
                            if ((RecordItem[item].fieldName=="DOMAIN") && (RecordItem[item].value=="DM")) {
                                for (var i = 0; i < RecordItem.length; i++) {
                                    if (RecordItem[i].fieldName == 'USUBJID')
                                        opt_id = RecordItem[i].value;
                                    else if (RecordItem[i].fieldName == 'NHS_USUBJID')
                                        nhs_id = RecordItem[i].value;
                                    else if (RecordItem[i].fieldName == 'BRTHDTC')
                                        age = getAge (records.formatStringToDate(RecordItem[i].value));
                                    else if (RecordItem[i].fieldName == 'SEX')
                                        sex = RecordItem[i].value;
                                    else if (RecordItem[i].fieldName == 'RFICDTC') {
                                        rficdtc = RecordItem[i].value;
                                    }

                                }
                                var row = {opt_id: opt_id, nhs_id: nhs_id, age:age, sex: sex, rficdtc: rficdtc, selected: false};
                                dmData.push(row);
                            }
                        }
                    }

                }
            }
        }
    }

    var populateReminder = function (RecordItems) {
        var newReminder = new Reminder();
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    newReminder.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    newReminder.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    newReminder.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'SUBJID': {
                    newReminder.SUBJID = RecordItems[i].value;
                }
                case 'REMINDERFREQUENCY': {
                    newReminder.REMINDERFREQUENCY = RecordItems[i].value;
                }
                case 'REMINDERCATEGORY': {
                    newReminder.REMINDERCATEGORY = RecordItems[i].value;
                }

                case 'REMINDERSTDTC': {
                    newReminder.REMINDERSTDTC = records.formatStringToDate(RecordItems[i].value);
                }
                case 'REMINDERENDTC': {
                    newReminder.REMINDERENDTC = records.formatStringToDate(RecordItems[i].value);
                }

                case 'REMINDERNOTES': {
                    newReminder.REMINDERNOTES = RecordItems[i].value;
                }
                case 'REMINDERACTIVE': {
                    newReminder.REMINDERACTIVE = RecordItems[i].value;
                }
            }
        }
        return newReminder;

    }


    var getRemindersForUSUBJID = function(patientData) {
        var reminders = [];
        for (var r = 0; r < patientData.length; r++) {
            if (patientData[r] != null) {
                var RecordItems = patientData[r].RecordItems;
                for (var item = 0; item < RecordItems.length; item++) {
                    if ((RecordItems[item].fieldName=="DOMAIN") && (RecordItems[item].value=="REMINDER")) {
                        var newReminder = populateReminder(RecordItems);
                        reminders.push(newReminder);
                        break;
                    }
                }
            }
        }
        return reminders;
    }

    var printReminderRecords = function(reminders) {
        for (var r= 0; r < reminders.length; r++) {
            //console.log(reminders[r]);
            console.log(reminders[r].DOMAIN+": "+reminders[r].REMINDERCATEGORY);
        }
    }

    var getUniqueSerologicalDatesForUSUBJID = function(patientData) {
        var assessments = [];
        for (var r = 0; r < patientData.length; r++) {
            if (patientData[r] != null) {
                var RecordItems = patientData[r].RecordItems;
                for (var item = 0; item < RecordItems.length; item++) {
                    if ((RecordItems[item].fieldName=="DOMAIN") && (RecordItems[item].value=="IS")) {
                        var newIS = immunogenicitySpecimenAssessments.createNewISA(RecordItems);
                        assessments.push(newIS);
                        break;
                    }
                }
            }
        }
        var uniqueAssessments = immunogenicitySpecimenAssessments.getUniqueDatesGivenList(assessments);
        var uniqueDates = [];
        for (var a = 0; a < uniqueAssessments.length; a++) {
            uniqueDates.push(uniqueAssessments[a].ISDTC);
        }
        return uniqueDates;
    }

    var getUniqueLabDatesForUSUBJID = function(patientData) {
        var assessments = [];
        for (var r = 0; r < patientData.length; r++) {
            if (patientData[r] != null) {
                var RecordItems = patientData[r].RecordItems;
                for (var item = 0; item < RecordItems.length; item++) {
                    if ((RecordItems[item].fieldName=="DOMAIN") && (RecordItems[item].value=="LB")) {
                        var newLB = laboratoryTestResults.createNewLabTestResult(RecordItems);
                        assessments.push(newLB);
                        break;
                    }
                }
            }
        }
        var uniqueAssessments = laboratoryTestResults.getUniqueDatesGivenList(assessments);
        var uniqueDates = [];
        for (var a = 0; a < uniqueAssessments.length; a++) {
            uniqueDates.push(uniqueAssessments[a].LBDTC);
        }
        return uniqueDates;
    }

    var getUniqueImagingDatesForUSUBJID = function(patientData) {
        var assessments = [];
        for (var r = 0; r < patientData.length; r++) {
            if (patientData[r] != null) {
                var RecordItems = patientData[r].RecordItems;
                for (var item = 0; item < RecordItems.length; item++) {
                    if ((RecordItems[item].fieldName=="PRTRT") && (RecordItems[item].value=="MRI")) {
                        var newMRI = procedures.createNewProcedure(RecordItems);
                        assessments.push(newMRI.PRSTDTC);
                        break;
                    }
                }
            }
        }

        return assessments;
    }



    var sortAscending = function (date1, date2) {
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    }

    var getMostRecent = function (appointmentDates) {
        appointmentDates.sort(sortAscending);
        var mostRecent = appointmentDates[appointmentDates.length -1];
        return mostRecent;
    }

    var getNextDue = function(frequency, mostRecent) {
        var nextDueDate = new Date (mostRecent);
        nextDueDate.setSeconds(nextDueDate.getSeconds()+frequency);
        return nextDueDate;
    }

    var getNextDueWarning = function(frequency, mostRecent) {
        var nextDue = getNextDue(frequency, mostRecent);
        var weekAdvanceNotice = 604800;
        nextDue.setSeconds(nextDue.getSeconds()-weekAdvanceNotice);
        return nextDue;
    }

    var appointmentsShouldBeFlagged = function (reminder, appointmentDates) {
        if ((reminder != null) && (appointmentDates != null)){
            if (appointmentDates.length > 0) {
                var mostRecent = getMostRecent(appointmentDates);
                var nextDue = getNextDueWarning(reminder.REMINDERFREQUENCY, mostRecent);
                console.log(nextDue);
                var today = new Date();

                var overdueSeconds = Math.floor(today.getTime()-nextDue.getTime());
                var overdueDays = overdueSeconds/86400000;
                if (overdueDays > 0)
                    return true;
            }
        }
        return false;
    }

    var createNewReminderForList = function(id, frequency, notes, appointmentDates) {
        var lastAppointment = getMostRecent(appointmentDates);
        var due = getNextDue(frequency, lastAppointment);

        var aReminder = {'id':id, 'last':lastAppointment, 'due':due, 'notes':notes};
        return aReminder;
    }

    var getAppointments = function () {
        return $q(function(resolve, reject) {
            var appointmentsDue = [];
            var subjectList = getSubjectList();
            //console.log(subjectList);
            if (subjectList != null) {
                subjectList = JSON.parse(subjectList);
                for (var s = 0; s < subjectList.length; s++) {
                    var patientRecords = JSON.parse(localStorage.getItem(subjectList[s].USUBJID)).RecordSet;
                    var reminderRecords = getRemindersForUSUBJID(patientRecords);

                    for (var r = 0; r < reminderRecords.length; r++) {
                        if (reminderRecords[r].REMINDERACTIVE == 'On') {

                            if (reminderRecords[r].REMINDERCATEGORY == 'IS') {
                                var uniqueAssessmentDates = getUniqueSerologicalDatesForUSUBJID(patientRecords);
                                var raiseAFlag = appointmentsShouldBeFlagged(reminderRecords[r], uniqueAssessmentDates);
                                if (raiseAFlag) {
                                    var aReminder = createNewReminderForList(subjectList[s].NHS_USUBJID, reminderRecords[r].REMINDERFREQUENCY, reminderRecords[r].REMINDERNOTES, uniqueAssessmentDates);
                                    appointmentsDue.push(aReminder);
                                }
                            }
                            if (reminderRecords[r].REMINDERCATEGORY == 'MRI') {
                                var uniqueAssessmentDates = getUniqueImagingDatesForUSUBJID(patientRecords);
                                var raiseAFlag = appointmentsShouldBeFlagged(reminderRecords[r], uniqueAssessmentDates);

                                if (raiseAFlag) {
                                    var aReminder = createNewReminderForList(subjectList[s].NHS_USUBJID, reminderRecords[r].REMINDERFREQUENCY, reminderRecords[r].REMINDERNOTES, uniqueAssessmentDates);
                                    appointmentsDue.push(aReminder);
                                }
                            }

                            if (reminderRecords[r].REMINDERCATEGORY == 'LB') {
                                var uniqueAssessmentDates = getUniqueLabDatesForUSUBJID(patientRecords);
                                console.log(uniqueAssessmentDates);
                                var raiseAFlag = appointmentsShouldBeFlagged(reminderRecords[r], uniqueAssessmentDates);

                                if (raiseAFlag) {
                                    var aReminder = createNewReminderForList(subjectList[s].NHS_USUBJID, reminderRecords[r].REMINDERFREQUENCY, reminderRecords[r].REMINDERNOTES, uniqueAssessmentDates);
                                    appointmentsDue.push(aReminder);
                                }
                            }
                        }

                    }
                }
            }
            resolve(appointmentsDue);
        })

    }

    return {
        //getSubjectList: getSubjectList,
        getAppointments: getAppointments
    }

})
/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 26/07/16
 * Time: 15:52
 * To change this template use File | Settings | File Templates.
 */
