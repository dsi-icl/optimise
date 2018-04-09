/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:06
 * To change this template use File | Settings | File Templates.
 */

//var visitModule = angular.module('Optimise.subjectVisit',['Optimise.view',
//    'Optimise.clinicalEvent',
//    'Optimise.questionnaire',
//    'Optimise.findingAbout',
//    'Optimise.procedure',
//    'Optimise.relationship',
//    'Optimise.record',
//    'Optimise.vitalSign',
//    'Optimise.adverseEvent',
//    'Optimise.communication']);

var visitModule = angular.module('Optimise.subjectVisit',['ui.bootstrap']);


visitModule.service('subjectVisits', function(subjectVisit, records, viewService, symptoms, signs, communications) {
    var subjectVisits = [];
    var currentVisit = [];
    var currentVisitDate = null;

    var getPreviousVisit = function(secondDate) {
        var visits = subjectVisits;
        for (var v = 1; v < visits.length; v++) {
            if (visits[v].SVSTDTC.toDateString() == secondDate.toDateString()) {
                return visits[v-1].SVSTDTC;
            }
        }
        return new Date(1900,1,1);
    }

    var setVisitParametersForCommunications = function(newDate) {
        //console.log(visits);
        if (subjectVisits.length == 0) {
            communications.setTimeSpan({"start":new Date(1900,1,1), 'end':new Date()});
            console.log("trying to create timespan for visit which has not yet happened.");
        }
        else if (subjectVisits.length == 1) {
            communications.setTimeSpan({'start':new Date(1900,1,1), 'end':subjectVisits[subjectVisits.length-1].SVSTDTC});
        }
        else {
            communications.setTimeSpan({"start":getPreviousVisit(newDate), 'end':newDate});
        }
    }


    var setVisitParametersForSymptomAndSign = function(newDate, newUSUBJID) {
        currentVisitDate=newDate;
        symptoms.setDate(newDate);
        symptoms.setUSUBJID(newUSUBJID);
        signs.setDate(newDate);
        signs.setUSUBJID(newUSUBJID);
    }

//    var getCurrentVisitDate = function() {
//        return currentVisitDate;
//    }

    var deleteSubjectVisits = function() {
        subjectVisits=[];
        currentVisit = [];
    }

    var getSubjectVisits = function() {
        subjectVisits.sort(sortDate);
        return subjectVisits;
    }

    var populateSubjectVisits = function(RecordItems) {
        //console.log(RecordItems);
        var visit = new subjectVisit();
        for (var i = 0; i < RecordItems.length; i++){
            //console.log(RecordItems[i].fieldName+ ": "+RecordItems[i].value);
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    visit.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    visit.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    visit.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'VISITNUM':{
                    visit.VISITNUM = RecordItems[i].value;
                    break;
                }
                case 'VISIT':{
                    visit.VISIT = RecordItems[i].value;
                    break;
                }
                case 'SVSTDTC':{
                    visit.SVSTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'SVENDTC':{
                    visit.SVENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
//                case 'SVSTDTC_display':{
//                    visit.SVSTDTC_display = RecordItems[i].value;
//                    break;
//                }
                case 'displayDate':{
                    visit.displayDate = RecordItems[i].value;
                    break;
                }
                // case 'diagnosisNote':{
                //     visit.diagnosisNote = RecordItems[i].value;
                //     break;
                // }
            }
        }
        subjectVisits.push(visit);
    }

    var clearVisit = function () {
        currentVisit = [];
        currentVisitDate=null;
    }

    var setCurrentVisit = function (visit) {
        currentVisit = getVisitByDate(visit.SVSTDTC);
    }

    var getCurrentVisit = function () {
        return currentVisit;
    }

    var getVisitByDate = function (SVSTDTC){
        var visitsOnDate = [];
        for (var v = 0; v < subjectVisits.length; v++)
        {
            if (subjectVisits[v].SVSTDTC==SVSTDTC) {
                visitsOnDate.push(subjectVisits[v]);
            }
        }
        return visitsOnDate;
    }

    var generateSEQ = function () {
        var SEQs = compileVisits();
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


    var compileVisits = function () {
        var seq = [];
        for (var e = 0; e < subjectVisits.length; e++) {
            seq.push(subjectVisits[e].VISITNUM);
        }
        return seq;
    }

    var sortDate = function (a, b) {
        var key1 = a.SVSTDTC;
        var key2 = b.SVSTDTC;

        if (key1 < key2) {
            return -1;
        } else if (key1 == key2) {
            return 0;
        } else {
            return 1;
        }
    }

    var addVisit = function (visit) {
        visit.VISITNUM = generateSEQ();
        subjectVisits.push(visit);
        if (!viewService.workOffline())
            records.saveRecord(visit);
    }

    var getUniqueDates = function () {
        var uniqueDates = [];
        for (var v = 0; v < subjectVisits.length; v++){   // select events that happened on different days
            if (!dateExists(uniqueDates, subjectVisits[v].SVSTDTC)){
                uniqueDates.push(subjectVisits[v]);
            }
        }
        uniqueDates.sort(function(a,b) {
            return b.SVSTDTC - a.SVSTDTC;
        });
        return uniqueDates;
    }

    var dateExists = function (uniqueDates, SVSTDTC){
        for (var d = 0; d < uniqueDates.length; d++) {
            if (uniqueDates[d].SVSTDTC == SVSTDTC) {
                return true;

            }
        }
        return false;
    }

    var getVisitByType = function(VISIT, SVSDTC) {
        for (var v = 0; v < subjectVisits.length; v++) {
            if ((subjectVisits[v].VISIT == VISIT)
                && (subjectVisits[v].SVSTDTC==SVSDTC)) {
                return subjectVisits[v];
            }
        }
        return null;
    }

    var getVisitByDate = function(SVSDTC) {
        var visitsOnThisDate = [];
        for (var v = 0; v < subjectVisits.length; v++) {
            if (subjectVisits[v].SVSTDTC==SVSDTC) {
                visitsOnThisDate.push(subjectVisits[v]);
            }
        }
        return visitsOnThisDate;
    }

    var deleteVisit = function(visit) {
        //console.log(visit);
        var index = subjectVisits.indexOf(visit);
        if (index > -1) {
            subjectVisits.splice(index, 1);
            if (!viewService.workOffline())
                records.deleteRecord(visit);
        }
    }

    var displayVisits = function() {
        console.log(subjectVisits);
    }

    var editVisit = function(aSubjectVisit, resName, resValue) {
        var VISITNUM = {fieldName:"VISITNUM", value: aSubjectVisit.VISITNUM};
        var SVRESTOCHANGE = {fieldName:resName, value: resValue};

        var idRecord = [USUBJID, VISITNUM];
        var valueRecord = [SVRESTOCHANGE];

        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    return {
        addVisit:addVisit,
        clearVisit:clearVisit,
        getUniqueDates:getUniqueDates,
        setCurrentVisit:setCurrentVisit,
        getCurrentVisit: getCurrentVisit,
        getVisitByType:getVisitByType,
        getVisitByDate:getVisitByDate,
        deleteVisit:deleteVisit,
        displayVisits:displayVisits,
        populateSubjectVisits:populateSubjectVisits,
        getSubjectVisits: getSubjectVisits,
        deleteSubjectVisits: deleteSubjectVisits,
        editVisit: editVisit,
        //getCurrentVisitDate: getCurrentVisitDate,
        setVisitParametersForSymptomAndSign: setVisitParametersForSymptomAndSign,
        setVisitParametersForCommunications: setVisitParametersForCommunications
    }

})

visitModule.factory('subjectVisit', function() {
    return function(USUBJID) {
        this.STUDYID= 'OPTIMISE';
        this.DOMAIN= 'SV';
        this.USUBJID= USUBJID;
        this.VISITNUM = '';
        this.VISIT= '';      //Visit Name
        this.SVSTDTC= '';     //Start Date/Time of Visit
        this.SVENDTC= '';    //End Date/Time of Visit
        //this.SVSTDTC_display='';
        this.displayDate='';
        //this.diagnosisNote = '';
    }
});



visitModule.controller('visitInfoCtrl', function ($rootScope, $scope, $parse, $uibModal,//locationScopeVariables,
                                               subjectVisit, subjectVisits,
                                               clinicalEvent, clinicalEvents,
                                               question, questionnaires,
                                               procedure, procedures,
                                               findingAbout, findingsAbout,
                                               relationships,
                                               viewService,
                                               vitalSigns, VitalSign,
                                               subjectCharacteristic, SubjectCharacteristic,
                                                patients) {

    $scope.USUBJID = '';
    $scope.SVSTDTCValidated = false;

    $scope.edssItems = ['0','0.5','1','1.5','2','2.5','3','3.5','4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10'];

    var currentDate = new Date();

    var dayMonthYear = angular.element(document.querySelector('.DTC_DayMonthYear'));
    dayMonthYear.datepicker({
        format: "dd/mm/yyyy",
        endDate: currentDate.getFullYear().toString(),
        startView: 1,
        orientation: "top left",
        autoclose: true,
        todayHighlight: true
    });

    $rootScope.setVisitUSUBJID = function(USUBJID) {
        $scope.USUBJID = USUBJID;
    }

    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Visit')
            return true;
        else
            return false;
    }

    $scope.preventAddVisitProperties = function () {
        return !$scope.SVSTDTCValidated;
    }

    $scope.getDisabledFields = function() {
        return viewService.getView().DisableInputFields;    // disable these fields
    }

    $rootScope.displayVisit = function () {
        clearFields();
        $scope.SVSTDTCValidated = true;
        var currentVisit = subjectVisits.getCurrentVisit();

        if (currentVisit.length > 0) {  // if there are more then one reason/status for the visit
            $scope.SVSTDTC = currentVisit[0].SVSTDTC; // set date
            subjectVisits.setVisitParametersForSymptomAndSign($scope.SVSTDTC, $scope.USUBJID);
            subjectVisits.setVisitParametersForCommunications($scope.SVSTDTC);
            //$scope.diagnosisNote = currentVisit[0].diagnosisNote;

            if ($scope.isUnder18()) {
                displaySubjectCharacteristic();
            }

            var signsOnThisVisit = vitalSigns.getSignsByDate(currentVisit[0].SVSTDTC);
            var vitalSignKeys = [{scopeVariable:'height', signTerm:'Height'},
                {scopeVariable:'weight', signTerm:'Weight'},
                {scopeVariable:'systolic', signTerm:'Systolic Blood Pressure'},
                {scopeVariable:'diastolic', signTerm:'Diastolic Blood Pressure'},
                {scopeVariable:'pulse', signTerm:'Pulse Rate'}];

            for (var recordedSigns = 0; recordedSigns<signsOnThisVisit.length; recordedSigns++){
                for (var signNames= 0; signNames < vitalSignKeys.length; signNames++){
                    if (signsOnThisVisit[recordedSigns].VSTEST==vitalSignKeys[signNames].signTerm){
                        var model = $parse(vitalSignKeys[signNames].scopeVariable);
                        model.assign($scope, signsOnThisVisit[recordedSigns].VSORRES);
                    }
                }
            }

            for (var q = 0; q < $scope.EDSS.length; q++){
                var questionOnThisVisit = questionnaires.getQuestionByTest($scope.EDSS[q].QSTEST, currentVisit[0].SVSTDTC);
                if (questionOnThisVisit != null) {  // if a question was answered and recorded
                    $scope.EDSS[q].score = questionOnThisVisit.QSSTRESC.toString();
                    var model = $parse($scope.EDSS[q].scopeVariable);
                    model.assign($scope, $scope.EDSS[q].score);
                }
            }

            var questionOnThisVisit = questionnaires.getQuestionByTest($scope.EDMUS.QSTEST, currentVisit[0].SVSTDTC);
            if (questionOnThisVisit != null) {  // if a question was answered and recorded
                $scope.EDMUS.score = questionOnThisVisit.QSSTRESC.toString();
                $scope.edmus_score = $scope.EDMUS.score;
            }

            var procedureOnDate = procedures.getProcedureByTRTAndDate('Eight Metre Walk Test',currentVisit[0].SVSTDTC);
            //console.log(procedureOnDate);
            if (procedureOnDate.length > 0) { // if procedure found on record
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure
                //console.log(findingsByPRLNKID);
                if (findingsByPRLNKID.length != 2) {
                    alert("Expected 2 findings, found: "+findingsByPRLNKID.length);
                }
                if (findingsByPRLNKID.length > 0) {
                    var model = $parse('eightMFirst');
                    model.assign($scope, findingsByPRLNKID[0].FAORES);
                    if (findingsByPRLNKID.length > 1) {
                        var model = $parse('eightMSecond');
                        model.assign($scope, findingsByPRLNKID[1].FAORES);   // record second finding
                    }
                }
            }

            procedureOnDate = procedures.getProcedureByTRTAndDate('Nine Hole Peg Test',currentVisit[0].SVSTDTC);
            if (procedureOnDate.length > 0) { // if procedure found on record
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure
                for (var f = 0; f < findingsByPRLNKID.length; f++){
                    if ((findingsByPRLNKID[f].FALAT=="Right")&&(findingsByPRLNKID[f].FATPT == '1/2')) {
                        var model = $parse('nineHolePegFirstRight');
                        model.assign($scope, findingsByPRLNKID[f].FAORES);
                    }
                    else if ((findingsByPRLNKID[f].FALAT=="Left")&&(findingsByPRLNKID[f].FATPT == '1/2')) {
                        var model = $parse('nineHolePegFirstLeft');
                        model.assign($scope, findingsByPRLNKID[f].FAORES);
                    }
                    else if ((findingsByPRLNKID[f].FALAT=="Right")&&(findingsByPRLNKID[f].FATPT == '2/2')) {
                        var model = $parse('nineHolePegSecondRight');
                        model.assign($scope, findingsByPRLNKID[f].FAORES);
                    }
                    else if ((findingsByPRLNKID[f].FALAT=="Left")&&(findingsByPRLNKID[f].FATPT == '2/2')) {
                        var model = $parse('nineHolePegSecondLeft');
                        model.assign($scope, findingsByPRLNKID[f].FAORES);
                    }
                }
            }

            procedureOnDate = procedures.getProcedureByTRTAndDate('Symbol Digit Modality Test',currentVisit[0].SVSTDTC);
            if (procedureOnDate.length > 0) { // if procedure found on record
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure
                var model = $parse('symbolDigitModality');
                model.assign($scope, findingsByPRLNKID[0].FAORES);
            }

            procedureOnDate = procedures.getProcedureByTRTAndDate('Low Contrast Visual Acuity',currentVisit[0].SVSTDTC);
            if (procedureOnDate.length > 0) {
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure
                for (var f = 0; f < findingsByPRLNKID.length; f++){
                    if (findingsByPRLNKID[f].FALAT=="Right") {
                        var model = $parse('lowContrastVisualAcuityRight');
                        model.assign($scope, findingsByPRLNKID[f].FAORES);
                    }
                    else if (findingsByPRLNKID[f].FALAT=="Left") {
                        var model = $parse('lowContrastVisualAcuityLeft');
                        model.assign($scope, findingsByPRLNKID[f].FAORES);
                    }
                }
            }
        }
    }

    $rootScope.setNewVisitFields = function() {
        subjectVisits.clearVisit();
        //$scope.SVSTDTC_display = '';
        //$scope.SVSTDTC = '';
        //$scope.SVSTDTCValidated = false;
        $scope.clearCommunications();
        clearFields();
    };

    var clearFields = function () {
        //$scope.SVSTDTC_display = '';
        $scope.SVSTDTC = '';
        $scope.SVSTDTCValidated = false;
        //$scope.diagnosisNote = '';

        $scope.academicConcerns = '';
        $scope.schoolAttendance = '';

        //subjectVisits.setVisitParametersForSymptomAndSign($scope.SVSTDTC, "");

        $scope.EDSS = [{score:0, scopeVariable: 'edss_pyramidal', QSTEST: 'EDSS-Pyramidal'},
            {score:0, scopeVariable: 'edss_cerebellar', QSTEST: 'EDSS-Cerebellar'},
            {score:0, scopeVariable: 'edss_brainStem', QSTEST: 'EDSS-BrainStem'},
            {score:0, scopeVariable: 'edss_sensory', QSTEST: 'EDSS-Sensory'},
            {score:0, scopeVariable: 'edss_bowelBladder', QSTEST: 'EDSS-BowelBladder'},
            {score:0, scopeVariable: 'edss_visual', QSTEST: 'EDSS-Visual'},
            {score:0, scopeVariable: 'edss_mental', QSTEST: 'EDSS-Mental'},
            {score:0, scopeVariable: 'edss_ambulation', QSTEST: 'EDSS-Ambulation'},
            {score:0, scopeVariable: 'edss_human', QSTEST: 'EDSS-Total Human'},
            {score:0, scopeVariable: 'edss_computer', QSTEST: 'EDSS-Total Computer'}];

        for (var k = 0; k < $scope.EDSS.length; k++){

            var model = $parse($scope.EDSS[k].scopeVariable);
            model.assign($scope, 0);
        }

        $scope.EDMUS = {score:'', QSTEST: 'EDMUS'};
        $scope.edmus_score = '';

        var procedureKeys = ['eightMFirst', 'eightMSecond',
            'nineHolePegFirstLeft', 'nineHolePegFirstRight',
            'nineHolePegSecondLeft','nineHolePegSecondRight', 'symbolDigitModality'];

        for (var p = 0; p < procedureKeys.length; p++) {
            var model = $parse(procedureKeys[p]);
            model.assign($scope,'');
        }

        var vitalSignKeys = ['height', 'weight', 'systolic', 'diastolic', 'pulse'];
        for (var v = 0; v < vitalSignKeys.length; v++) {
            var model = $parse(vitalSignKeys[v]);
            model.assign($scope,'');
        }

        $scope.lowContrastVisualAcuityLeft = '';
        $scope.lowContrastVisualAcuityRight = '';
    }

    $scope.isUnder18 = function() {
        if (patients.getCurrentPatientAge() <= 18)
            return true;
        return false;
    }

    var displaySubjectCharacteristic = function () {
        var aChar = subjectCharacteristic.getThisSubjectCharacteristicOnDate('ACADEMIC CONCERNS', $scope.SVSTDTC);
        if (aChar != null)
            $scope.academicConcerns = aChar.SCORRES;
        else
            $scope.academicConcerns = '';

        aChar = subjectCharacteristic.getThisSubjectCharacteristicOnDate('PERCENT SCHOOL ATTENDANCE', $scope.SVSTDTC);
        if (aChar != null)
            $scope.schoolAttendance = aChar.SCORRES;
        else
            $scope.schoolAttendance = '';
    }

    $scope.editSubjectCharacteristic = function(propertyName, propertyValue) {

        switch (propertyName) {
            case 'ACADEMIC CONCERNS': {
                $scope.academicConcerns = propertyValue;
                break;
            };
            case 'PERCENT SCHOOL ATTENDANCE': {
                $scope.schoolAttendance = propertyValue;
                break;
            };
        }

        var aChar = subjectCharacteristic.getThisSubjectCharacteristicOnDate(propertyName, $scope.SVSTDTC);
        if ((aChar == null)){
            var newChar = new SubjectCharacteristic(patients.getCurrentPatient().USUBJID, propertyName);
            newChar.SCDTC = $scope.SVSTDTC;
            newChar.SCORRES = propertyValue;
            subjectCharacteristic.addSubjectCharacteristic(newChar);
        }
        else {
            aChar.SCORRES = propertyValue;
            subjectCharacteristic.editSubjectCharacteristic(aChar, propertyName, propertyValue);
        }

    }

    var editQuestion = function (question, QSSTRESC) {
        //question.QSDTC = new Date($scope.SVSTDTC.substr(6), parseInt($scope.SVSTDTC.substr(3,2))-1, $scope.SVSTDTC.substr(0,2));
        question.QSTCTC = $scope.SVSTDTC;
        question.QSSTRESC = QSSTRESC;
        questionnaires.editQuestion(question, 'QSSTRESC', question.QSSTRESC);
    }

    var editFinding = function (findingABout, FAORES) {
        findingAbout.FADTC = $scope.SVSTDTC;
        findingABout.FAORES = FAORES;
        findingsAbout.editFinding(findingABout);
    }

    $scope.SVSTDTC = new Date();

    $rootScope.setNewVisitDate = function(display, SVSTDTC) {
        $scope.SVSTDTC = SVSTDTC;
        //$scope.SVSTDTC = new Date(SVSTDTC.substr(6), parseInt(SVSTDTC.substr(3,2))-1, SVSTDTC.substr(0,2));
        $scope.SVSTDTCValidated = true;
        var newVisit = new subjectVisit($scope.USUBJID);
        //newVisit.SVSTDTC = new Date($scope.SVSTDTC.substr(6), parseInt($scope.SVSTDTC.substr(3,2))-1, $scope.SVSTDTC.substr(0,2));
        newVisit.SVSTDTC = $scope.SVSTDTC;
        newVisit.displayDate = display;

        subjectVisits.addVisit(newVisit);
        subjectVisits.setCurrentVisit(newVisit);
        subjectVisits.setVisitParametersForSymptomAndSign($scope.SVSTDTC,$scope.USUBJID);
        subjectVisits.setVisitParametersForCommunications($scope.SVSTDTC);

    }

    var addProcedureSection = function(PRTRT) {
        var aProcedure = new procedure($scope.USUBJID, PRTRT);
        aProcedure.PRSTDTC = $scope.SVSTDTC;
        aProcedure.PRLNKID = $scope.SVSTDTC+" "+PRTRT;
        procedures.addProcedure(aProcedure);
        return aProcedure;
    }

    var addFindingSection = function(FAOBJ, FAORES) {
        var aFinding = new findingAbout($scope.USUBJID, FAOBJ, 'Functional Test', ''); // Is it mobility??
        aFinding.FAORES = FAORES;
        aFinding.FASTRESU = 'seconds';
        aFinding.FADTC = $scope.SVSTDTC;
        aFinding.FALNKID = $scope.SVSTDTC+" "+PRTRT;
        findingsAbout.addFinding(aFinding);
        return aFinding;
    }

    $scope.addProcedure = function (PRTRT) {
        if (PRTRT=='Symbol Digit Modality Test') {
            var procedureOnDate = procedures.getProcedureByTRTAndDate('Symbol Digit Modality Test', $scope.SVSTDTC);

            if (procedureOnDate.length == 1) { // if procedure already on record
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure

                if (findingsByPRLNKID.length == 1) {
                    findingsByPRLNKID[0].FAORES = $scope.symbolDigitModality; // need to EDIT FINDING
                    findingsAbout.editFinding(findingsByPRLNKID[0]);
                }
            }
            else {
                var sdmt = addProcedureSection(PRTRT);
                var sdmtFinding = addFindingSection("Cognitive Impairment", $scope.symbolDigitModality);
                relationships.addRelationship(sdmt,sdmtFinding, 'PRLNKID', 'FALNKID', 'One', 'One', sdmtFinding.FALNKID);
            }
        }

        if (PRTRT=='Low Contrast Visual Acuity') {
            var procedureOnDate = procedures.getProcedureByTRTAndDate('Low Contrast Visual Acuity', $scope.SVSTDTC);

            if (procedureOnDate.length > 0) { // if procedure already on record
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure
                for (var f = 0; f < findingsByPRLNKID.length; f++){
                    if (findingsByPRLNKID[f].FALAT=="Right") {
                        findingsByPRLNKID[f].FAORES = $scope.lowContrastVisualAcuityRight;
                        findingsAbout.editFinding(findingsByPRLNKID[f]);
                    }
                    else if (findingsByPRLNKID[f].FALAT=="Left") {
                        findingsByPRLNKID[f].FAORES = $scope.lowContrastVisualAcuityLeft;
                        findingsAbout.editFinding(findingsByPRLNKID[f]);
                    }
                }
            }
            else {
                var slcla = addProcedureSection(PRTRT);

                var slclaLeft = new findingAbout($scope.USUBJID, 'Visual Acuity', 'Functional Test', '');
                slclaLeft.FAORES = $scope.lowContrastVisualAcuityLeft;
                slclaLeft.FADTC = $scope.SVSTDTC;
                slclaLeft.FALNKID = $scope.SVSTDTC+" Low Contrast Visual Acuity";
                slclaLeft.FALOC = "Eye";
                slclaLeft.FALAT = "Left";

                var slclaRight = new findingAbout($scope.USUBJID, 'Visual Acuity', 'Functional Test', '');
                slclaRight.FAORES = $scope.lowContrastVisualAcuityRight;
                slclaRight.FADTC = $scope.SVSTDTC;
                slclaRight.FALNKID = $scope.SVSTDTC+" Low Contrast Visual Acuity";
                slclaRight.FALOC = "Eye";
                slclaRight.FALAT = "Right";

                findingsAbout.addFinding(slclaLeft);
                findingsAbout.addFinding(slclaRight);

                relationships.addRelationship(slcla,slclaLeft, 'PRLNKID', 'FALNKID', 'One', 'Many', slclaLeft.FALNKID);
                relationships.addRelationship(slcla,slclaRight, 'PRLNKID', 'FALNKID', 'One', 'Many', slclaRight.FALNKID);
            }
        }

        if (PRTRT == 'Eight Metre Walk Test')
        {
            var procedureOnDate = procedures.getProcedureByTRTAndDate('Eight Metre Walk Test',$scope.SVSTDTC);

            if (procedureOnDate.length > 0) { // if procedure already on record
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);  // get findings from procedure
                findingsByPRLNKID[0].FAORES = $scope.eightMFirst; // record first finding
                findingsAbout.editFinding(findingsByPRLNKID[0]);

                findingsByPRLNKID[1].FAORES = $scope.eightMSecond;    // record second finding
                findingsAbout.editFinding(findingsByPRLNKID[1]);
            }
            else { // if procedure not on record
                var eightMTest = addProcedureSection(PRTRT);
                var eightMTestFinding1 = addFindingSection("Mobility",$scope.eightMFirst);
                relationships.addRelationship(eightMTest,eightMTestFinding1, 'PRLNKID', 'FALNKID', 'One', 'Many', eightMTestFinding1.FALNKID);
                var eightMTestFinding2 = addFindingSection("Mobility",$scope.eightMSecond);
                relationships.addRelationship(eightMTest,eightMTestFinding2, 'PRLNKID', 'FALNKID', 'One', 'Many', eightMTestFinding2.FALNKID);
            }
        }

        if (PRTRT == 'Nine Hole Peg Test'){
            procedureOnDate = procedures.getProcedureByTRTAndDate('Nine Hole Peg Test',$scope.SVSTDTC);
            if (procedureOnDate.length == 1) { // if nine peg hole test already in record as a procedure with findings
                var findingsByPRLNKID = findingsAbout.getFindingsByLNKID(procedureOnDate[0].PRLNKID);
                for (var f = 0; f < findingsByPRLNKID.length; f++){
                    if ((findingsByPRLNKID[f].FALAT=="Right")&&(findingsByPRLNKID[f].FATPT == '1/2')) {
                        findingsByPRLNKID[f].FAORES = $scope.nineHolePegFirstRight;
                        //findingsAbout.editFinding(findingsByPRLNKID[f]);
                    }
                    else if ((findingsByPRLNKID[f].FALAT=="Left")&&(findingsByPRLNKID[f].FATPT == '1/2')) {
                        findingsByPRLNKID[f].FAORES = $scope.nineHolePegFirstLeft;
                        //findingsAbout.editFinding(findingsByPRLNKID[f]);
                    }

                    else if ((findingsByPRLNKID[f].FALAT=="Right")&&(findingsByPRLNKID[f].FATPT == '2/2')) {
                        findingsByPRLNKID[f].FAORES = $scope.nineHolePegSecondRight;
                        //findingsAbout.editFinding(findingsByPRLNKID[f]);
                    }
                    else if ((findingsByPRLNKID[f].FALAT=="Left")&&(findingsByPRLNKID[f].FATPT == '2/2')) {
                        findingsByPRLNKID[f].FAORES = $scope.nineHolePegSecondLeft;
                        //findingsAbout.editFinding(findingsByPRLNKID[f]);

                    }
                    findingsAbout.editFinding(findingsByPRLNKID[f]);
                }
            }
            else {  // if no procedures on record
                var ninePegTest = addProcedureSection(PRTRT);

                var ninePegTestFinding1 = new findingAbout($scope.USUBJID, 'Mobility', 'Functional Test', '');
                ninePegTestFinding1.FAORES = $scope.nineHolePegFirstRight;
                ninePegTestFinding1.FASTRESU = 'seconds';
                ninePegTestFinding1.FADTC = $scope.SVSTDTC;
                ninePegTestFinding1.FALNKID = $scope.SVSTDTC+" Nine Hole Peg Test";
                ninePegTestFinding1.FALOC = "Hand";
                ninePegTestFinding1.FALAT = "Right";
                ninePegTestFinding1.FATPT = "1/2";
                findingsAbout.addFinding(ninePegTestFinding1);
                relationships.addRelationship(ninePegTest,ninePegTestFinding1, 'PRLNKID', 'FALNKID', 'One', 'Many', ninePegTestFinding1.FALNKID);

                var ninePegTestFinding2 = new findingAbout($scope.USUBJID, 'Mobility', 'Functional Test', '');
                ninePegTestFinding2.FAORES = $scope.nineHolePegFirstLeft;
                ninePegTestFinding2.FASTRESU = 'seconds';
                ninePegTestFinding2.FADTC = $scope.SVSTDTC;
                ninePegTestFinding2.FALNKID = $scope.SVSTDTC+" Nine Hole Peg Test";
                ninePegTestFinding2.FALOC = "Hand";
                ninePegTestFinding2.FALAT = "Left";
                ninePegTestFinding2.FATPT = "1/2";
                findingsAbout.addFinding(ninePegTestFinding2);
                relationships.addRelationship(ninePegTest,ninePegTestFinding2, 'PRLNKID', 'FALNKID', 'One', 'Many', ninePegTestFinding2.FALNKID);


                var ninePegTestFinding3 = new findingAbout($scope.USUBJID, 'Mobility', 'Functional Test', '');
                ninePegTestFinding3.FAORES = $scope.nineHolePegSecondRight;
                ninePegTestFinding3.FASTRESU = 'seconds';
                ninePegTestFinding3.FADTC = $scope.SVSTDTC;
                ninePegTestFinding3.FALNKID = $scope.SVSTDTC+" Nine Hole Peg Test";
                ninePegTestFinding3.FALOC = "Hand";
                ninePegTestFinding3.FALAT = "Right";
                ninePegTestFinding3.FATPT = "2/2";
                findingsAbout.addFinding(ninePegTestFinding3);
                relationships.addRelationship(ninePegTest,ninePegTestFinding3, 'PRLNKID', 'FALNKID', 'One', 'Many', ninePegTestFinding3.FALNKID);

                var ninePegTestFinding4 = new findingAbout($scope.USUBJID, 'Mobility', 'Functional Test', '');
                ninePegTestFinding4.FAORES = $scope.nineHolePegSecondLeft;
                ninePegTestFinding4.FASTRESU = 'seconds';
                ninePegTestFinding4.FADTC = $scope.SVSTDTC;
                ninePegTestFinding4.FALNKID = $scope.SVSTDTC+" Nine Hole Peg Test";
                ninePegTestFinding4.FALOC = "Hand";
                ninePegTestFinding4.FALAT = "Left";
                ninePegTestFinding4.FATPT = "2/2";
                findingsAbout.addFinding(ninePegTestFinding4);
                relationships.addRelationship(ninePegTest,ninePegTestFinding4, 'PRLNKID', 'FALNKID', 'One', 'Many', ninePegTestFinding4.FALNKID);

            }

        }
        //procedures.printProcedures();
    }

    // $scope.addDiagnosisNote = function() {
    //     var visit =subjectVisits.getCurrentVisit();
    //     if (visit != null) {
    //         visit[0].diagnosisNote = $scope.diagnosisNote;
    //         subjectVisits.editVisit(visit[0], 'diagnosisNote', $scope.diagnosisNote);
    //     }
    //     visit =subjectVisits.getCurrentVisit();
    //     console.log(visit);
    // }

    $scope.editVitalSign = function (VSTEST) {
        var vitalSignKeys = [{scopeVariable:$scope.height, signTerm:'Height', unit:"cm"},
            {scopeVariable:$scope.weight, signTerm:'Weight', unit:"kg"},
            {scopeVariable:$scope.systolic, signTerm:'Systolic Blood Pressure', unit:"mmHg"},
            {scopeVariable:$scope.diastolic, signTerm:'Diastolic Blood Pressure', unit:"mmHg"},
            {scopeVariable:$scope.pulse, signTerm:'Pulse Rate', unit:"Beats Per Min"}];

        var currentSign = vitalSigns.getSignByTest(new Date($scope.SVSTDTC), VSTEST);
        if (currentSign == null){
            var newSign = new VitalSign($scope.USUBJID, VSTEST);
            for (var v = 0; v < vitalSignKeys.length; v++)
            {
                if (vitalSignKeys[v].signTerm == VSTEST){
                    newSign.VSORRES = vitalSignKeys[v].scopeVariable;
                    newSign.VSORRESU = vitalSignKeys[v].unit;
                    newSign.VISIT=$scope.VISIT;
                    newSign.VSDTC=new Date($scope.SVSTDTC);
                    newSign.VSTEST=VSTEST;
                    vitalSigns.addVitalSign(newSign);
                }
            }
        }
        else {
            for (var v = 0; v < vitalSignKeys.length; v++)
            {
                if (vitalSignKeys[v].signTerm == VSTEST){
                    currentSign.VSORRES = vitalSignKeys[v].scopeVariable;
                    vitalSigns.editVitalSign(currentSign);
                }
            }
        }
    };

    $scope.addEDSS_Main = function() {
        var visitDate = new Date($scope.SVSTDTC);
        var EDSSResOnDate = questionnaires.getQuestionByTest("EDSS-Total Human", visitDate);
        if (EDSSResOnDate != null) {  // if existing record
            editQuestion(EDSSResOnDate, $scope.edss_human);
            $scope.EDSS[8].score = $scope.edss_human;
            console.log($scope.edss_human);
        }
        else {
            var newQuestion = new question($scope.USUBJID, "EDSS");
            newQuestion.QSTEST = "EDSS-Total Human";
            newQuestion.QSSTRESC = $scope.edss_human;
            $scope.EDSS[8].score = $scope.edss_human;

            questionnaires.addQuestion(visitDate, newQuestion);
        }
    }

    $scope.addEDMUS_Main = function() {
        var visitDate = new Date($scope.SVSTDTC);
        var EDMUSResOnDate = questionnaires.getQuestionByTest("EDMUS", visitDate);
        if (EDMUSResOnDate != null) {  // if existing record
            editQuestion(EDMUSResOnDate, $scope.edmus_score);
            $scope.EDMUS.score = $scope.edmus_score;
        }
        else {
            var newQuestion = new question($scope.USUBJID, "EDMUS");
            newQuestion.QSTEST = "EDMUS";
            newQuestion.QSSTRESC = $scope.edmus_score;
            $scope.EDMUS.score = $scope.edmus_score;
            questionnaires.addQuestion(visitDate, newQuestion);
        }
    }

    var addEDSS = function () {
        var visitDate = new Date($scope.SVSTDTC);
        //console.log($scope.EDSS);
        for (var q = 0; q < $scope.EDSS.length; q++) {
            var EDSSResOnDate = questionnaires.getQuestionByTest($scope.EDSS[q].QSTEST, visitDate);    // get questions taken on this date

            if (EDSSResOnDate != null) {  // if existing record
                editQuestion(EDSSResOnDate, $scope.EDSS[q].score);
                if ($scope.EDSS[q].QSTEST == 'EDSS-Total Human'){
                    $scope.edss_human = $scope.EDSS[q].score;
                    //console.log($scope.edss_human);
                }
            }
            else {
                if ($scope.EDSS[q].score != '') {
                    var newQuestion = new question($scope.USUBJID, "EDSS");
                    newQuestion.QSTEST = $scope.EDSS[q].QSTEST;
                    newQuestion.QSSTRESC = $scope.EDSS[q].score;
                    questionnaires.addQuestion(visitDate, newQuestion);

                    if ($scope.EDSS[q].QSTEST == 'EDSS-Total Human'){
                        $scope.edss_human = $scope.EDSS[q].score;
                    }
                }
            }
        }

        questionnaires.printQuestions();
    }

    $scope.openEDSS = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'edss.html',
            controller: 'edssCtrl',
            windowClass: 'edss-modal-window',
            resolve: {
                EDSS: function() {
                    return $scope.EDSS;
                },
                dateValidated: function() {
                    return $scope.SVSTDTCValidated;
                }
            }
        });

        modalInstance.result.then(function () {
            addEDSS();
        }, function () {
            console.log("EDSS Closed");
        });
    };

    var addEDMUS = function() {

        //console.log($scope.EDMUS);
        var visitDate = new Date($scope.SVSTDTC);
        var EDMUSResOnDate = questionnaires.getQuestionByTest('EDMUS', visitDate);    // get questions taken on this date
        if (EDMUSResOnDate != null) {  // if existing record
            editQuestion(EDMUSResOnDate, $scope.EDMUS.score);
            //$scope.edmus_score = $scope.EDMUS.score;
        }
        else {
            if ($scope.EDMUS.score != '') {
                var newQuestion = new question($scope.USUBJID, 'EDMUS');
                newQuestion.QSTEST = 'EDMUS';
                newQuestion.QSSTRESC = $scope.EDMUS.score;
                questionnaires.addQuestion(visitDate, newQuestion);
            }
        }
        $scope.edmus_score = $scope.EDMUS.score;
        console.log($scope.edmus_score);
        questionnaires.printQuestions();
    }

    $scope.openEDMUS = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'edmus.html',
            controller: 'edmusCtrl',
            windowClass: 'edmus-modal-window',
            resolve: {
                EDMUS: function() {
                    return $scope.EDMUS;
                },
                dateValidated: function() {
                    return $scope.SVSTDTCValidated;
                }
            }
        });

        modalInstance.result.then(function () {
            //console.log('Edmus opened');
            addEDMUS();
        }, function () {
            console.log("EDMUS Closed");
        });
    };
});


visitModule.controller('edssTestCtrl', function ($scope) {
    $scope.edss_pyramidal = 0;

});

visitModule.controller('edssCtrl', function ($scope, $parse, $uibModalInstance,
                                             EDSS, dateValidated) {


    // initialise edss functional scores
    $scope.initScores = function () {
        if (dateValidated) {
            for (var q = 0; q < EDSS.length; q++){
                var model = $parse(EDSS[q].scopeVariable);
                model.assign($scope, EDSS[q].score);
            }
        }
        else {
            for (var q = 0; q < EDSS.length; q++) {
                var model = $parse(EDSS[q].scopeVariable);
                model.assign($scope,0);
            }
        }
    }

    $scope.initScores();

    $scope.updateEDSS = function() {

        // place all scores into an array
        var fnScore = [$scope.edss_pyramidal,
            $scope.edss_cerebellar,
            $scope.edss_brainStem,
            $scope.edss_sensory,
            $scope.edss_bowelBladder,
            $scope.edss_visual,
            $scope.edss_mental];

        // sort scores, from lowest to highest
        // will need this for the getting highest and second highest scores
        fnScore.sort();

        /*
         *  Takes an array
         *  Returns largest value in array
         */
        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };

        /*
         *  Takes an array
         *  Returns a dictionary with array items as key, and frequency of those items as value
         */
        Array.prototype.frequency = function() {
            var counts = {};

            for(var i = 0; i< this.length; i++) {
                var num = this[i];
                counts[num] = counts[num] ? counts[num]+1 : 1;
            }
            return counts;
        };

        var highestScore = fnScore.max();

        // dict {score: frequencyOfScore}
        var counts = fnScore.frequency();

        // remove the highest scores from the array
        fnScore.splice(fnScore.length-counts[highestScore], counts[highestScore]);

        // the second highest is now the highest of the array
        var secondHighest = fnScore.max();

        // EDSS Neuro scoring algorithm from http://edss.neurol.ru
        try {
            if ($scope.edss_ambulation==12)
                $scope.edss_computer = 8.0;

            else if ($scope.edss_ambulation==11)
                $scope.edss_computer = 7.5;

            else if ($scope.edss_ambulation==10)
                $scope.edss_computer = 7.0;

            else if (($scope.edss_ambulation==8)||($scope.edss_ambulation==9))
                $scope.edss_computer = 6.5;

            else if (($scope.edss_ambulation==5)||($scope.edss_ambulation==6)||($scope.edss_ambulation==7))
                $scope.edss_computer = 6.0;

            else if ($scope.edss_ambulation==4)
                $scope.edss_computer = 5.5;

            /*  (IF : highest is '5'
             *      : frequency of '5' > 5 but less then 7
             *  OR : highest is '6'
             *     : frequency of  '6' > 1 but less or same as 7 )
             *  AND
             *  ( ambulation score is 3 )
             */
            else if (((highestScore == 5)&&(counts[5]>=1)&&(counts[5]<=7))
                ||((highestScore==6)&&(counts[6]>=1)&&(counts[6]<=7))
                && ($scope.edss_ambulation==3))
                $scope.edss_computer = 5.0;

            /*  (IF : highest is '4'
             *      : frequency of '4' >= 2 but <= as 7)
             *  AND
             *  ( ambulation score is 3 )
             */
            else if ((highestScore == 4) && ((counts[4]>=2)&&(counts[4]<=7))
                && ($scope.edss_ambulation==3))
                $scope.edss_computer = 5.0;

            else if ((highestScore == 3) && ((counts[3]>=6)&&(counts[3]<=7))
                && ($scope.edss_ambulation==3))
                $scope.edss_computer = 5.0;

            else if ((highestScore == 4) && (counts[4]==1)
                && (secondHighest == 3) && (counts[3]>=1)&&(counts[3]<=2)
                && ($scope.edss_ambulation==2))
                $scope.edss_computer = 4.5;

            else if ((highestScore == 3) && ((counts[3]==5))
                && ($scope.edss_ambulation==2))
                $scope.edss_computer = 4.5;

            /*  (IF : highest is '4'
             *      : frequency of '4' is 1
             *      : frequency of 3 is undefined
             *      : frequency of 2 is undefined )
             *  AND
             *  ( ambulation score is '0' or '1')
             *
             *  NOTE: Undefined == 0
             */
            else if ((highestScore == 4) && (counts[4]==1)
                && (counts[3]==undefined)
                && (counts[2]==undefined)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 4.0;

            /*  (IF : highest is '4'
             *      : frequency of '4' >= 2 but <= as 7)
             *  AND
             *  ( ambulation score is 3 )
             */
            else if ((highestScore == 3) && (counts[3]==2)
                && (counts[2]==undefined)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1))){
                if (counts[2]==undefined)
                    $scope.edss_computer = 3.5;
                else
                    $scope.edss_computer = 4.0;
            }

            else if ((highestScore == 3) && (counts[3]>=2) && (counts[3]<=4)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 4.0;

            else if ((highestScore == 2) && (counts[2]>=6) && (counts[2]<=7)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 4.0;

            else if ((highestScore == 3) && (counts[3]==1)
                && (secondHighest == 2) && (counts[2]>=1) && (counts[2]<=2)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 3.5;

            else if ((highestScore == 2) && (counts[2]==5)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 3.5;

            else if ((highestScore == 3) && ((counts[3]==1)
                &&(counts[2]==undefined))
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 3.0;

            else if ((highestScore == 2) && ((counts[2]>=3)
                &&(counts[2]<=4))
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 3.0;

            else if ((highestScore == 2) && (counts[2]==2)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 2.5;

            else if ((highestScore == 2) && (counts[2]==1)
                && (($scope.edss_ambulation==0)||($scope.edss_ambulation==1)))
                $scope.edss_computer = 2.0;

            else if ((highestScore == 1) && ((counts[1]>=2)
                &&(counts[1]<=7))
                && ($scope.edss_ambulation==0))
                $scope.edss_computer = 1.5;

            else if ((highestScore == 1) && (counts[1]==1)
                && ($scope.edss_ambulation==0))
                $scope.edss_computer = 1.0;

            else if ((highestScore == 0) && (counts[0]==7)
                && ($scope.edss_ambulation==0))
                $scope.edss_computer = 0.0;

            else {
                throw ("Error on this combination of functional scores: "+fnScore);
            }

        } catch (err) {
            alert(err);
        }
    }

    $scope.save = function () {
        var EDSSQuestions = [{scopeVariable: $scope.edss_pyramidal, QSTEST: 'EDSS-Pyramidal'},
            {scopeVariable: $scope.edss_cerebellar, QSTEST: 'EDSS-Cerebellar'},
            {scopeVariable: $scope.edss_brainStem, QSTEST: 'EDSS-BrainStem'},
            {scopeVariable: $scope.edss_sensory, QSTEST: 'EDSS-Sensory'},
            {scopeVariable: $scope.edss_bowelBladder, QSTEST: 'EDSS-BowelBladder'},
            {scopeVariable: $scope.edss_visual, QSTEST: 'EDSS-Visual'},
            {scopeVariable: $scope.edss_mental, QSTEST: 'EDSS-Mental'},
            {scopeVariable: $scope.edss_ambulation, QSTEST: 'EDSS-Ambulation'},
            {scopeVariable: $scope.edss_human, QSTEST: 'EDSS-Total Human'},
            {scopeVariable: $scope.edss_computer, QSTEST: 'EDSS-Total Computer'}];

        for (var q = 0; q < EDSSQuestions.length; q++) {
            switch (EDSSQuestions[q].QSTEST) {
                case 'EDSS-Pyramidal':{
                    EDSS[0].score = $scope.edss_pyramidal;
                    break;
                }
                case 'EDSS-Cerebellar':{
                    EDSS[1].score = $scope.edss_cerebellar;
                    break;
                }
                case 'EDSS-BrainStem':{
                    EDSS[2].score = $scope.edss_brainStem;
                    break;
                }
                case 'EDSS-Sensory':{
                    EDSS[3].score = $scope.edss_sensory;
                    break;
                }
                case 'EDSS-BowelBladder':{
                    EDSS[4].score = $scope.edss_bowelBladder;
                    break;
                }
                case 'EDSS-Visual':{
                    EDSS[5].score = $scope.edss_visual;
                    break;
                }
                case 'EDSS-Mental':{
                    EDSS[6].score = $scope.edss_mental;
                    break;
                }
                case 'EDSS-Ambulation':{
                    EDSS[7].score = $scope.edss_ambulation;
                    break;
                }
                case 'EDSS-Total Human':{
                    EDSS[8].score = $scope.edss_human;
                    break;
                }
                case 'EDSS-Total Computer':{
                    EDSS[9].score = $scope.edss_computer;
                    break;
                }
            }
        }
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }


    $scope.showHelpPanel = function(thisPanel) {
        if (thisPanel == $scope.helpPanel){
            return true;}
        else
            return false;
    };


    $scope.enableInput = function() {
        return !dateValidated;
    }
});

visitModule.controller('edmusCtrl', function ($scope, $uibModalInstance,
                                              EDMUS, dateValidated) {
    $scope.save = function () {
        EDMUS.score = $scope.chosen.entry;
        //console.log(EDMUS);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

    $scope.entries = [
        {score:'0', definition:'Normal findings on neurological examination.',checked:false},
        {score:'1', definition:'No disability. Minimal signs on neurological examination.',checked:false},
        {score:'2', definition:'Minimal and not ambulation-related disability. Able to run.',checked:false},
        {score:'3', definition:'Unlimited walking distance (WD) without rest but unable to run; or a significant not ambulation-related disability.',checked:false},
        {score:'4', definition:'Walks without aid. Limited WD, but > 500 meters without rest.',checked:false},
        {score:'5', definition:'Walks without aid. Limited WD, < 500 meters without rest.',checked:false},
        {score:'6A',definition:'Walks with permanent unilateral support. WD < 100 meters without rest.',checked:false},
        {score:'6B',definition:'Walks with permanent bilateral support. WD < 100 meters without rest.',checked:false},
        {score:'7', definition:'Home restricted. A few steps with wall or furniture assistance. WD < 20 meters without rest.',checked:false},
        {score:'8', definition:'Chair restricted. Unable to take a step. Some effective use of arms.',checked:false},
        {score:'9', definition:'Bedridden and totally helpless.',checked:false},
        {score:'10',definition:'Death due to MS.',checked:false}
    ];

    $scope.addEDMUS = function() {
        console.log($scope.chosen.entry);
        EDMUS.score = $scope.chosen.entry;
    }

    if (dateValidated)
        $scope.chosen = {entry: EDMUS.score};
    else
        $scope.chosen = {entry: ''};

    $scope.enableInput = function() {
        return !dateValidated;
    }
});

visitModule.directive('visitEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/subjectVisit/visit.html'
    };
});


//visitModule.directive('symptomsEntry', function() {
//    return {
//        restrict: 'AE',
//        replace: 'true',
//        templateUrl:'scripts/js/clinicalEvent/symptoms.html'
//    };
//});
//
//visitModule.directive('symptomsDraggable', function() {
//    return {
//        restrict: 'AE',
//        replace: 'true',
//        templateUrl:'scripts/js/clinicalEvent/symptomsDraggable.html'
//    };
//});
//
//visitModule.controller('symptomsDraggableCtrl', function ($scope) {
//    $scope.list1 = {title:'test1'};
//    $scope.list2 = {};
//    $scope.chosenSymptoms = [];
//    console.log("in draggable controller");
//
//    $scope.higherFunctions = [{title:"Cognitive Problems", drag:true, type: 'basic', space:'marginTop'},
//        {title:"Emotional Lability", drag:true, type: 'basic', space:'marginTop'},
//        {title:"Depression", drag:true, type: 'basic', space:'marginTop'},
//        {title:"Fatigue", drag:true, type: 'basic', space:'marginTop'},
//        {title:"Seizure", drag:true, type: 'basic', space:'marginTop'}];
//
//    $scope.cranialNerves = [{title:"Blurred vision", drag:true, type: 'basic', space:'marginTop'},
//        {title:"Greying of vision", drag:true, type: 'lateral', space:'marginTop'},
//        {title:"Field defect", drag:true, type: 'lateral', space:'marginTop'},
//        {title:"Blindness", drag:true, type: 'lateral', space:'marginTop'},
//        {title:"Uncontrolled eye movement", drag:true, type: 'basic', space:'doubleMarginTop'}];
//
//    $scope.isChosen = function(chosenTitle) {
//        for (var e = 0; e < $scope.chosen.length; e++) {
//            if (($scope.chosen[e].title) == chosenTitle) {
//                return true;
//            }
//        }
//        return false;
//    }
//
//    $scope.showAsBasic = function(item) {
//        if ((item.title)&&(item.type == 'basic'))
//            return true;
//        return
//            false;
//    }
//
//    $scope.showAsLateral = function(item) {
//        if ((item.title)&&(item.type == 'lateral'))
//            return true;
//        return
//            false;
//    }
//
//
//    $scope.startCallBack = function(chosenTitle) {
//        console.log('finished dragging');
//    }
//});


//visitModule.directive('signsEntry', function() {
//    return {
//        restrict: 'AE',
//        replace: 'true',
//        templateUrl:'scripts/js/clinicalEvent/signs.html'
//    };
//});
