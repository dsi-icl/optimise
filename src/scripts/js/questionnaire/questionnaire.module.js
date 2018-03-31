/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:02
 * To change this template use File | Settings | File Templates.
 */

var questionnaireModule = angular.module('Optimise.questionnaire',['Optimise.record','Optimise.view']);

questionnaireModule.service('questionnaires', function (question, records, viewService) {
    var questionnaires = [];
    var currentQuestionnaire = [];

    var deleteQuestionnaires = function() {
        questionnaires = [];
        currentQuestionnaire = [];
    }

    var populateQuestionnaires = function (RecordItems) {
        var newQuestion = new question();
        //console.log(RecordItems);
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    newQuestion.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    newQuestion.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    newQuestion.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'QSSEQ':{
                    newQuestion.QSSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'QSTESTCD':{
                    newQuestion.QSTESTCD = RecordItems[i].value;
                    break;
                }
                case 'QSCAT':{
                    newQuestion.QSCAT = RecordItems[i].value;
                    break;
                }
                case 'QSTEST':{
                    newQuestion.QSTEST = RecordItems[i].value;
                    break;
                }
                case 'QSORRES':{
                    newQuestion.QSORRES = RecordItems[i].value;
                    break;
                }
                case 'QSSTRESC':{
                    /*
                    var value = RecordItems[i].value;
                    var indexOfPeriod = value.indexOf('.');
                    if (indexOfPeriod > -1)
                        newQuestion.QSSTRESC = value.substring(0, indexOfPeriod);
                    else
                        newQuestion.QSSTRESC = value;
                    break;
                    */

                    newQuestion.QSSTRESC = (parseFloat(RecordItems[i].value));
                    newQuestion.QSSTRESC = Math.round( newQuestion.QSSTRESC * 10) / 10;
                }
                case 'QSSTRESN':{
                    newQuestion.QSSTRESN = RecordItems[i].value;
                    break;
                }
                case 'QSDTC':{
                    newQuestion.QSDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'displayLabel':{
                    newQuestion.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    newQuestion.displayDate = RecordItems[i].value;
                    break;
                }
            }
        }
        questionnaires.push(newQuestion);
        //console.log(questionnaires);
    }

    var clearQuestionnaire = function() {
        currentQuestionnaire=[];
    }

    var setCurrentQuestionnaire = function (event, QSCAT) {
        clearQuestionnaire();
        //console.log(event);
        //console.log(QSCAT);
        var QSDTC = event.QSDTC.toDateString();
        for (var q = 0; q < questionnaires.length; q++) {
            if ((questionnaires[q].QSDTC.toDateString()==QSDTC) &&
                (questionnaires[q].QSCAT==QSCAT)) {
                currentQuestionnaire.push(questionnaires[q]);
            }
        }
        //console.log("Current Q");
        //console.log(currentQuestionnaire);

    }

    var editQuestion = function(question, resName, resValue) {
        var USUBJID = {fieldName: "USUBJID", value: question.USUBJID};
        var SEQ = {fieldName:"QSSEQ", value: question.QSSEQ};
        var RECTOCHANGE = {fieldName:resName, value: resValue};

        var idRecord = [USUBJID, SEQ];
        var valueRecord = [RECTOCHANGE];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var generateSEQ = function () {
        /*
        var SEQs = compileQuestions();

        if (SEQs.length > 0) {
            SEQs.sort(sortNumber);
            //console.log(SEQs);
            //console.log("Length: "+SEQs.length);
            //console.log("SEQ: "+SEQs[SEQs.length-1]);

            return (SEQs[SEQs.length-1]+1);
        }
        else {
            return 0;
        }
        */

        return new Date().getTime() + Math.floor((Math.random() * 100) + 1);
    }

    function sortNumber(a,b) {
        return a - b;
    }

    var compileQuestions = function () {
        var seq = [];
        for (var e = 0; e < questionnaires.length; e++) {
            seq.push(questionnaires[e].QSSEQ);
        }
        return seq;
    }

    var addQuestion = function (QSDTC, question) {
        question.QSSEQ = generateSEQ();
        question.QSDTC = new Date(QSDTC);
        questionnaires.push(question);
        if (!viewService.workOffline())
            records.saveRecord(question);
    }

    var deleteQuestion = function (question) {
        var index = questionnaires.indexOf(question);
        if (index > -1) {
            questionnaires.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteRecord(question);
    }

    var getQuestionByTest = function (QSTEST, QSDTC) {
        for (var q = 0; q < questionnaires.length; q++) {
            if ((questionnaires[q].QSDTC.toDateString() == QSDTC.toDateString())
                &&(questionnaires[q].QSTEST == QSTEST)) {
                return questionnaires[q];
            }
        }
        return null;
    }

    var getCurrentQuestionByTest = function (QSTEST) {
        for (var q = 0; q < currentQuestionnaire.length; q++) {
            if (currentQuestionnaire[q].QSTEST == QSTEST) {
                return currentQuestionnaire[q];
            }
        }
        return null;
    }

    var getCurrentQuestion = function () {
        return currentQuestionnaire;
    }

    var getAllQuestionsByCat = function(QSCAT) {
        var questionsFromCategory = [];
        for (var q = 0; q < questionnaires.length; q++) {
            if (questionnaires[q].QSCAT == QSCAT) {
                questionsFromCategory.push(questionnaires[q]);
            }
        }
        return questionsFromCategory;
    }

    var getQuestionsByCatOnDate = function (QSCAT, QSDTC) {
        var questionsFromCategory = [];
        for (var q = 0; q < questionnaires.length; q++) {
            if ((questionnaires[q].QSDTC.toDateString() == QSDTC.toDateString())
                &&(questionnaires[q].QSCAT == QSCAT)) {
                questionsFromCategory.push(questionnaires[q]);
            }
        }
        return questionsFromCategory;
    }

    var printQuestions = function() {
        console.log(questionnaires);
    }

    var getUniqueDates = function () {
        var MSCAT = ['PDDS', 'MSQOL-54', 'VAS', 'PROMIS'];
        var listOfDates = [];
        for (var cat = 0; cat < MSCAT.length; cat++) {
            var questions = getAllQuestionsByCat(MSCAT[cat]);
            //console.log(questions);
            var uniquelyDatedQuestions = getUniqueDatesAndCategories(questions);
            listOfDates = listOfDates.concat(uniquelyDatedQuestions);
            //console.log(listOfDates);
        }

        return listOfDates;
    }

    var getEDSSScores = function() {
        var edssScores = [];
        var questions = getAllQuestionsByCat('EDSS');
        var uniquelyDatedQuestions = getUniqueDatesAndCategories(questions);
        for (var e = 0; e < uniquelyDatedQuestions.length; e++){
            var aResult = getQuestionByTest('EDSS-Total Human', uniquelyDatedQuestions[e].QSDTC);
            edssScores.push(aResult);
        }
        //console.log(edssScores);
        edssScores.sort(date_sort_asc);
        //console.log(edssScores);
        return edssScores;
    }

    var getPDDSScores = function() {
        var pddsScores = [];
        var questions = getAllQuestionsByCat('PDDS');
        var uniquelyDatedQuestions = getUniqueDatesAndCategories(questions);
        for (var e = 0; e < uniquelyDatedQuestions.length; e++){
            var aResult = getQuestionByTest('Patient Determined Disease Step', uniquelyDatedQuestions[e].QSDTC);
            pddsScores.push(aResult);
        }
        //console.log(edssScores);
        pddsScores.sort(date_sort_asc);
        //console.log(edssScores);
        return pddsScores;
    }

    var getVASScores = function() {
        var vasScores = [];
        var questions = getAllQuestionsByCat('VAS');
        var uniquelyDatedQuestions = getUniqueDatesAndCategories(questions);
        for (var e = 0; e < uniquelyDatedQuestions.length; e++){
            var aResult = getQuestionByTest('VAS', uniquelyDatedQuestions[e].QSDTC);
            vasScores.push(aResult);
        }
        //console.log(vasScores);
        vasScores.sort(date_sort_asc);
        //console.log(vasScores);
        return vasScores;
    }

    var date_sort_asc = function (date1, date2) {
        // This is a comparison function that will result in dates being sorted in
        // ASCENDING order. As you can see, JavaScript's native comparison operators
        // can be used to compare dates. This was news to me.
        if (date1.QSDTC > date2.QSDTC) return 1;
        if (date1.QSDTC < date2.QSDTC) return -1;
        return 0;
    };

    var getMSQOL54 = function() {
        var phc = [];
        var mhc = [];
        var questions = getAllQuestionsByCat('MSQOL-54');
        var uniquelyDatedQuestions = getUniqueDatesAndCategories(questions);

        for (var e = 0; e < uniquelyDatedQuestions.length; e++){
            phc.push(getQuestionByTest('Physical Health Composite', uniquelyDatedQuestions[e].QSDTC));
            mhc.push(getQuestionByTest('Mental Health Composite', uniquelyDatedQuestions[e].QSDTC));
        }
        phc.sort(date_sort_asc);
        mhc.sort(date_sort_asc);
        return {phc:phc, mhc:mhc};
    }

    var getPROMIS = function() {
        var phc = [];
        var mhc = [];
        var questions = getAllQuestionsByCat('PROMIS');
        var uniquelyDatedQuestions = getUniqueDatesAndCategories(questions);

        for (var e = 0; e < uniquelyDatedQuestions.length; e++){
            phc.push(getQuestionByTest('Global Physical Health component', uniquelyDatedQuestions[e].QSDTC));
            mhc.push(getQuestionByTest('Global Mental Health component', uniquelyDatedQuestions[e].QSDTC));
        }
        phc.sort(date_sort_asc);
        mhc.sort(date_sort_asc);
        return {phc:phc, mhc:mhc};
    }

    var getUniqueDatesAndCategories = function (questions) {
        var uniqueDates = [];
        for (var v = 0; v < questions.length; v++){   // select events that happened on different days
            if (!dateExists(uniqueDates, questions[v].QSDTC)){
                uniqueDates.push(questions[v]);
            }
        }
        return uniqueDates;
    }

    var dateExists = function (uniqueDates, QSDTC){
        for (var d = 0; d < uniqueDates.length; d++) {
            if (uniqueDates[d].QSDTC.toDateString() == QSDTC.toDateString()) {
                return true;
            }
        }
        return false;
    }

    var getQuestionnaires = function() {
        return questionnaires;
    }


    return {
        editQuestion: editQuestion,
        addQuestion: addQuestion,
        getQuestionByTest: getQuestionByTest,
        getQuestionsByCatOnDate: getQuestionsByCatOnDate,
        deleteQuestion: deleteQuestion,
        populateQuestionnaires: populateQuestionnaires,
        printQuestions:printQuestions,
        setCurrentQuestionnaire: setCurrentQuestionnaire,
        getCurrentQuestionByTest: getCurrentQuestionByTest,
        getUniqueDates: getUniqueDates,
        getCurrentQuestion: getCurrentQuestion,
        clearQuestionnaire: clearQuestionnaire,
        deleteQuestionnaires: deleteQuestionnaires,
        getEDSSScores:getEDSSScores,
        getMSQOL54: getMSQOL54,
        getPDDSScores: getPDDSScores,
        getVASScores: getVASScores,
        getPROMIS: getPROMIS,
        getQuestionnaires: getQuestionnaires
    }
})

questionnaireModule.factory('question', function () {
    return function(USUBJID, QSCAT) {
        this.STUDYID="OPTIMISE";
        this.USUBJID= USUBJID;
        this.QSSEQ= "";
        this.QSTESTCD= "";   // Question short name
        this.QSTEST= "";  // Question Name eg. EDSS-Pyramidal
        this.QSCAT= QSCAT;     // Category eg. EDSS
        this.QSORRES= "";   //Finding in Original Units
        this.QSSTRESC= ""; //Character Result/Finding in Standard Format
        this.QSSTRESN= ""; // ￼Numeric Finding in Standard Units
        this.VISITNUM= "";
        this.VISIT= "";
        this.QSDTC= "";
        this.DOMAIN="QS";
    }
})

questionnaireModule.controller('questionnaireInfoCtrl', function($scope, $rootScope,
                                                                     $parse,
                                                                     questionnaires, question,
                                                                     viewService) {
    $scope.USUBJID = '';
    $scope.questionnaireIndex = '';

    var currentDate = new Date();

    var dayMonthYear = angular.element(document.querySelector('.QSDTC_DayMonthYear'));
    dayMonthYear.datepicker({
        format: "dd/mm/yyyy",
        endDate: currentDate.getFullYear().toString(),
        startView: 1,
        orientation: "top left",
        autoclose: true,
        todayHighlight: true
    });

    $scope.setQSDTC = function() {
        $scope.QSDTC = new Date($scope.QSDTC_displayDate.substr(6), parseInt($scope.QSDTC_displayDate.substr(3,2))-1, $scope.QSDTC_displayDate.substr(0,2));
        console.log($scope.QSDTC);
    }

    $rootScope.setQuestionnaireUSUBJID = function(USUBJID) {
        $scope.USUBJID = USUBJID;
    }

    $rootScope.setQuestionnaireIndex = function(questionnaireIndex) {
        $scope.questionnaireIndex = questionnaireIndex;
    }

    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Questionnaire') {
            return true;
        }
        else
            return false;
    };

    /*
    $scope.addMSQOL_12 = function (QSTEST) {

        var MSQOLQuestions = [{scopeVariable: $scope.msqol_Q0, QSTEST: 'MSQOL-Q0'},
            {scopeVariable: $scope.msqol_Q1, QSTEST: 'MSQOL-Q1'},
            {scopeVariable: $scope.msqol_Q2, QSTEST: 'MSQOL-Q2'},
            {scopeVariable: $scope.msqol_Q3, QSTEST: 'MSQOL-Q3'},
            {scopeVariable: $scope.msqol_Q4, QSTEST: 'MSQOL-Q4'},
            {scopeVariable: $scope.msqol_Q5, QSTEST: 'MSQOL-Q5'},
            {scopeVariable: $scope.msqol_Q6, QSTEST: 'MSQOL-Q6'},
            {scopeVariable: $scope.msqol_Q7, QSTEST: 'MSQOL-Q7'},
            {scopeVariable: $scope.msqol_Q8, QSTEST: 'MSQOL-Q8'},
            {scopeVariable: $scope.msqol_Q9, QSTEST: 'MSQOL-Q9'},
            {scopeVariable: $scope.msqol_Q10, QSTEST: 'MSQOL-Q10'},
            {scopeVariable: $scope.msqol_Q11, QSTEST: 'MSQOL-Q11'}
        ];
        var visitDate = $scope.QSDTC;
        for (var q = 0; q < MSQOLQuestions.length; q++) {
            if (QSTEST == MSQOLQuestions[q].QSTEST) {
                var MSQOLResOnDate = questionnaires.getQuestionByTest(MSQOLQuestions[q].QSTEST, visitDate);    // get questions taken on this date

                if (MSQOLResOnDate != null) {  // if existing record
                    editQuestion(MSQOLResOnDate, MSQOLQuestions[q].scopeVariable);
                }
                else {
                    var newQuestion = new question($scope.USUBJID, "MSQOL-12");
                    newQuestion.QSTEST = MSQOLQuestions[q].QSTEST;
                    newQuestion.QSSTRESC = MSQOLQuestions[q].scopeVariable;
                    newQuestion.displayLabel = 'MSQOL-12';
                    newQuestion.displayDate = visitDate.toDateString();
                    questionnaires.addQuestion(visitDate, newQuestion);
                }
            }
        }
        questionnaires.printQuestions();
    }
    */

    $scope.addPDDS = function() {

        var visitDate = $scope.QSDTC;
        var PDDSResOnDate = questionnaires.getQuestionByTest('Patient Determined Disease Step', visitDate);    // get questions taken on this date
        if (PDDSResOnDate != null) {  // if existing record
            editQuestion(PDDSResOnDate, $scope.pddScore);
        }
        else {
            var newQuestion = new question($scope.USUBJID, 'PDDS');
            newQuestion.QSTEST = 'Patient Determined Disease Step';
            newQuestion.QSSTRESC = $scope.pddScore;
            newQuestion.displayLabel = 'PDDS';
            newQuestion.displayDate = visitDate.toDateString();
            questionnaires.addQuestion(visitDate, newQuestion);
        }
        questionnaires.printQuestions();
    }


    var editQuestion = function (question, QSSTRESC) {
        question.QSDTC = $scope.QSDTC;
        question.QSSTRESC = QSSTRESC;
        questionnaires.editQuestion(question, 'QSSTRESC', question.QSSTRESC);
    }

    $scope.getDisabledFields = function() {
        return viewService.getView().DisableInputFields;
    }

    $rootScope.setNewQuestionnaireFields = function() {
        questionnaires.clearQuestionnaire();
        clearFields();
        $scope.questionnaireIndex = '';
    };

    $rootScope.displayQuestionnaireResults = function() {
        clearFields();
        var currentQuestionnaire = questionnaires.getCurrentQuestion();
        if ((currentQuestionnaire != null) &&(currentQuestionnaire.length > 0))
        {
            $scope.QSDTC =  currentQuestionnaire[0].QSDTC;
            $scope.QSDTC_displayDate = $scope.QSDTC.getDate()+"/"+(parseInt($scope.QSDTC.getMonth()+1))+"/"+$scope.QSDTC.getFullYear();// set date

            switch (currentQuestionnaire[0].QSCAT) {
                case 'PDDS': {
                    var PDDS = {scopeVariable:'pddScore', QSTEST:"Patient Determined Disease Step"};
                    var questionOnThisVisit = questionnaires.getCurrentQuestionByTest(PDDS.QSTEST);
                    if (questionOnThisVisit != null) {  // if a question was answered and recorded
                        var model = $parse(PDDS.scopeVariable);
                        model.assign($scope, questionOnThisVisit.QSSTRESC);
                    }
                    break;
                }
                case 'MSQOL-54': {
                    var physicalHealth = questionnaires.getCurrentQuestionByTest('Physical Health Composite');
                    $scope.QSDTC = physicalHealth.QSDTC;
                    $scope.physicalHealthComposite = physicalHealth.QSSTRESC;
                    $scope.mentalHealthComposite = questionnaires.getCurrentQuestionByTest('Mental Health Composite').QSSTRESC;
                    break;
                }
                case 'VAS': {
                    var VAS = {scopeVariable:'vasScore', QSTEST:"VAS"};
                    var questionOnThisVisit = questionnaires.getCurrentQuestionByTest(VAS.QSTEST);
                    if (questionOnThisVisit != null) {  // if a question was answered and recorded
                        var model = $parse(VAS.scopeVariable);
                        model.assign($scope, questionOnThisVisit.QSSTRESC);
                    }
                }
            }
        }
    }

    var clearFields = function() {
        $scope.QSDTC = '';
        $scope.QSDTC_displayDate='';

        var MSQOL54 = [{scopeVariable: 'physicalHealthComposite', testName: "Physical Health Composite"},
            {scopeVariable: 'mentalHealthComposite', testName: "Mental Health Composite"}];
        for (var k = 0; k < MSQOL54.length; k++){
            // Get the model
            var modelValue = $parse(MSQOL54[k].scopeVariable);
            modelValue.assign($scope,'');
        }

        var PDDS = {scopeVariable:'pddScore', QSTEST:"Patient Determined Disease Step"};
        var model = $parse(PDDS.scopeVariable);
        model.assign($scope, '');

        var VAS = {scopeVariable:'vasScore', QSTEST:"VAS"};
        var model = $parse(VAS.scopeVariable);
        model.assign($scope, '');

        /*
        var MSQOL = [{scopeVariable: 'msqol_Q0', QSTEST: 'MSQOL-Q0'},
            {scopeVariable: 'msqol_Q1', QSTEST: 'MSQOL-Q1'},
            {scopeVariable: 'msqol_Q2', QSTEST: 'MSQOL-Q2'},
            {scopeVariable: 'msqol_Q3', QSTEST: 'MSQOL-Q3'},
            {scopeVariable: 'msqol_Q4', QSTEST: 'MSQOL-Q4'},
            {scopeVariable: 'msqol_Q5', QSTEST: 'MSQOL-Q5'},
            {scopeVariable: 'msqol_Q6', QSTEST: 'MSQOL-Q6'},
            {scopeVariable: 'msqol_Q7', QSTEST: 'MSQOL-Q7'},
            {scopeVariable: 'msqol_Q8', QSTEST: 'MSQOL-Q8'},
            {scopeVariable: 'msqol_Q9', QSTEST: 'MSQOL-Q9'},
            {scopeVariable: 'msqol_Q10', QSTEST: 'MSQOL-Q10'},
            {scopeVariable: 'msqol_Q11', QSTEST: 'MSQOL-Q11'}
        ];
        for (var q = 0; q < MSQOL.length; q++){
             var model = $parse(MSQOL[q].scopeVariable);
                model.assign($scope, '');
        }*/
    }
});

questionnaireModule.directive('questionnaireEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/questionnaire/questionnaire.html'
    };
});

questionnaireModule.directive('msqol12Entry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/questionnaire/msqol12.html'
    };
});

questionnaireModule.directive('vasEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/questionnaire/vas.html'
    };
});

questionnaireModule.directive('msqol54Entry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/questionnaire/msqol54.html'
    };
});

questionnaireModule.directive('pddsEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/questionnaire/pdds.html'
    };
});

