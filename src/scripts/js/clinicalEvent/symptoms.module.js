var symptomsModule = angular.module('Optimise.symptoms',['ui.bootstrap']);

symptomsModule.directive('visitSymptoms', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        scope:{},
        templateUrl:'scripts/js/clinicalEvent/visitSymptoms.html',
        controller: 'visitSymptomsCtrl'
    };
});

symptomsModule.directive('relapseSymptoms', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        scope:{},
        templateUrl:'scripts/js/clinicalEvent/relapseSymptoms.html',
        controller: 'relapseSymptomsCtrl'
    };
});


symptomsModule.factory('symptomVocab', function() {
    var symptomTerms = {};

    symptomTerms['higherFunction.cognitiveProblems']={CETERM: 'Cognitive problems', CEBODSYS:''};
    symptomTerms['higherFunction.emotionalLability']={CETERM: 'Emotional lability', CEBODSYS:''};
    symptomTerms['higherFunction.depression']={CETERM: 'Depression', CEBODSYS:''};
    symptomTerms['higherFunction.fatigue']={CETERM: 'Fatigue', CEBODSYS:''};
    symptomTerms['higherFunction.seizure']={CETERM: 'Seizure', CEBODSYS:''};

    symptomTerms['cranial.blurredVision']={CETERM: 'Blurred vision', CEBODSYS:''};
    symptomTerms['cranial.doubleVision']={CETERM: 'Double vision', CEBODSYS:''};
    symptomTerms['cranial.greying']={CETERM: 'Greying of vision in one eye', CEBODSYS:''};
    symptomTerms['cranial.fieldDefect']={CETERM: 'Field defect', CEBODSYS:''};
    symptomTerms['cranial.blindness']={CETERM: 'Blindness', CEBODSYS:''};
    symptomTerms['cranial.uncontrolledEyeMovements']={CETERM: 'Uncontrolled eye movements', CEBODSYS:''};
    symptomTerms['cranial.dysarthria']={CETERM: 'Dysarthria', CEBODSYS:''};
    symptomTerms['cranial.dysphagia']={CETERM: 'Dysphagia', CEBODSYS:''};
    symptomTerms['cranial.dizziness']={CETERM: 'Dizziness', CEBODSYS:''};
    symptomTerms['cranial.vertigo']={CETERM: 'Vertigo', CEBODSYS:''};
    symptomTerms['cranial.facialPain']={CETERM: 'Facial pain', CEBODSYS:'Face'};
    symptomTerms['cranial.facialHypoesthesia']={CETERM: 'Facial hypoesthesia', CEBODSYS:'Face'};
    symptomTerms['cranial.facialWeakness']={CETERM: 'Facial weakness', CEBODSYS:'Face'};

    symptomTerms['motor.weakness.upper']={CETERM: 'Weakness', CEBODSYS:'Upper Limbs'};
    symptomTerms['motor.weakness.lower']={CETERM: 'Weakness', CEBODSYS:'Lower Limbs'};
    symptomTerms['motor.spasticity.upper'] = {CETERM:'Spasticity', CEBODSYS:'Upper Limbs'};
    symptomTerms['motor.spasticity.lower'] = {CETERM:'Spasticity', CEBODSYS:'Lower Limbs'};
    symptomTerms['motor.difficultyWalking']={CETERM: 'Difficulty walking', CEBODSYS:''};
    symptomTerms['motor.tremor.upper']={CETERM: 'Tremor', CEBODSYS:'Upper Limbs'};
    // symptomTerms['motor.tremor.lower']={CETERM: 'Tremor', CEBODSYS:'Lower Limbs'};

    symptomTerms['somatosensory.pain.upper']={CETERM: 'Pain', CEBODSYS:'Upper Limbs'};
    symptomTerms['somatosensory.pain.lower']={CETERM: 'Pain', CEBODSYS:'Lower Limbs'};
    symptomTerms['somatosensory.pain.trunk']={CETERM: 'Pain', CEBODSYS:'Trunk'};
    symptomTerms['somatosensory.paresthesia.upper']={CETERM: 'Paresthesia', CEBODSYS:'Upper Limbs'};
    symptomTerms['somatosensory.paresthesia.lower']={CETERM: 'Paresthesia', CEBODSYS:'Lower Limbs'};
    symptomTerms['somatosensory.paresthesia.trunk']={CETERM: 'Paresthesia', CEBODSYS:'Trunk'};
    symptomTerms['somatosensory.dysesthesia.upper']={CETERM: 'Dysesthesia', CEBODSYS:'Upper Limbs'};
    symptomTerms['somatosensory.dysesthesia.lower']={CETERM: 'Dysesthesia', CEBODSYS:'Lower Limbs'};
    symptomTerms['somatosensory.dysesthesia.trunk']={CETERM: 'Dysesthesia', CEBODSYS:'Trunk'};
    symptomTerms['somatosensory.anesthesia.upper']={CETERM: 'Anesthesia', CEBODSYS:'Upper Limbs'};
    symptomTerms['somatosensory.anesthesia.lower']={CETERM: 'Anesthesia', CEBODSYS:'Lower Limbs'};
    symptomTerms['somatosensory.anesthesia.trunk']={CETERM: 'Anesthesia', CEBODSYS:'Trunk'};
    symptomTerms['somatosensory.pruritus.upper']={CETERM: 'Pruritus', CEBODSYS:'Upper Limbs'};
    symptomTerms['somatosensory.pruritus.lower']={CETERM: 'Pruritus', CEBODSYS:'Lower Limbs'};
    symptomTerms['somatosensory.pruritus.trunk']={CETERM: 'Pruritus', CEBODSYS:'Trunk'};
    symptomTerms['somatosensory.lhermitte']={CETERM: 'Lhermitte sign', CEBODSYS:''};
    symptomTerms['somatosensory.heatIntolerance']={CETERM: 'Heat intolerance', CEBODSYS:''};

    symptomTerms['autonomic.bladderUrgency']={CETERM: 'Bladder urgency', CEBODSYS:''};
    symptomTerms['autonomic.bladderFrequency']={CETERM: 'Bladder frequency', CEBODSYS:''};
    symptomTerms['autonomic.bladderIncontinence']={CETERM: 'Bladder incontinence', CEBODSYS:''};
    symptomTerms['autonomic.bladderHesitancy']={CETERM: 'Bladder hesitancy', CEBODSYS:''};
    symptomTerms['autonomic.constipation']={CETERM: 'Constipation', CEBODSYS:''};
    symptomTerms['autonomic.bowelIncontinence']={CETERM: 'Bowel incontinence', CEBODSYS:''};
    symptomTerms['autonomic.sexualFunction']={CETERM: 'Problems with sexual function', CEBODSYS:''};

    symptomTerms.getTerm = function(modelName) {
        return symptomTerms[modelName];
    }

    symptomTerms.getScopeVariable = function(CETERM, CEBODYSYS) {
        var theKey = "";
        angular.forEach(symptomTerms, function(value, key) {
            if ((value.CETERM == CETERM)&&(value.CEBODSYS == CEBODYSYS)) {
                theKey = key;
            }
        })
        return theKey;

    }

    return symptomTerms;
});

symptomsModule.service('symptoms', function(clinicalEvents, clinicalEvent) {
    var symptomDate = null;
    var USUBJID = '';

    var setDate = function(newDate) {
        symptomDate = newDate;
    }

    var getDate = function() {
        return symptomDate;
    }

    var setUSUBJID = function(newUSUBJID) {
        USUBJID = newUSUBJID;
    }

    var editEvent = function(aSymptom, CELAT) {
        if (CELAT == false) {  //if this symptom is to be unchecked
            clinicalEvents.deleteEvent(aSymptom);
        } else {                // else change laterality
            aSymptom.CELAT = CELAT;
            clinicalEvents.editEvent(aSymptom, 'CELAT', CELAT);
        }
    }

    var createEvent = function(CETERM, CEBODSYS, CELAT, useRelapseGrpID) {
        var newSymptom = new clinicalEvent(USUBJID, CETERM, 'Symptom');
        newSymptom.CESTDTC = symptomDate;
        newSymptom.CEBODSYS = CEBODSYS;
        newSymptom.CELAT = CELAT;

        if (useRelapseGrpID){ // a relapse symptom, shares same grpid with relapse event
            var event = clinicalEvents.getCurrentEvent();
            if ((event!= null)&&(event.length > 0)) {
                newSymptom.CEGRPID = event[0].CEGRPID;
            } else {
                console.log("associating symptom with a non-event")
            }
        }

        clinicalEvents.addEvent(newSymptom);
    }

    var editStatus = function (symptomsOnDate) {
        var visitSymptomExists = false;
        var relapseSymptomExists = false;
        for (var s = 0; s < symptomsOnDate.length; s++) {
            if (symptomsOnDate[s].CEGRPID == -1)
                visitSymptomExists = true;
            if (symptomsOnDate[s].CEGRPID != -1)
                relapseSymptomExists = true;
        }

        return [visitSymptomExists, relapseSymptomExists];
    }

    var editSymptom = function(CETERM, CEBODSYS, CELAT, useRelapseGrpID) {
        if ((symptomDate!= null) && (USUBJID!= '')){
            var symptomsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Symptom', CETERM, CEBODSYS, symptomDate);
            //console.log(symptomsOnDate);
            if (symptomsOnDate.length > 0){ // if symptom already recorded on this day
                for (var s = 0; s < symptomsOnDate.length; s++) {

                    // relapse symptom, visit symptom already recorded
                    // -> create new relapse symptom
                    if ((useRelapseGrpID)
                        &&(symptomsOnDate[s].CEGRPID==-1)
                        &&(editStatus(symptomsOnDate)[0] == true)
                        &&(editStatus(symptomsOnDate)[1] == false)) {
                            createEvent(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
                            console.log(1);
                    }

                    // visit symptom, relapse symptom already recorded
                    // -> create new symptom
                    // a relapse symptom exists, create a visit one too
                    else if ((!useRelapseGrpID)
                            &&(symptomsOnDate[s].CEGRPID!=-1)
                            &&(editStatus(symptomsOnDate)[0] == false)
                            &&(editStatus(symptomsOnDate)[1] == true)) {
                                createEvent(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
                                console.log("create a new visit symptom, a relapse system exists but not a visit one");
                    }

                    // relapse symptom, relapse symptom already recorded
                    // -> edit new symptom
                    else if ((useRelapseGrpID)
                            &&(symptomsOnDate[s].CEGRPID!=-1)
                            &&(editStatus(symptomsOnDate)[1] == true)) {
                                editEvent(symptomsOnDate[s], CELAT);
                                console.log('editing an existing symptom, a relapse symptom exists');
                    }

                    // visit symptom, visit symptom already recorded
                    // -> edit
                    else if ((!useRelapseGrpID)
                        &&(symptomsOnDate[s].CEGRPID==-1)
                        &&(editStatus(symptomsOnDate)[0] == true)) {
                            editEvent(symptomsOnDate[s], CELAT);
                            console.log('Editing an existing visit symptom, a visit symptom exists');
                    }

                    console.log('Relapse:'+ useRelapseGrpID);
                    console.log('Edit action:'+ editStatus(symptomsOnDate));
                    console.log('GroupID:'+symptomsOnDate[s].CEGRPID);
//                    else {
//                        symptomsOnDate[s]
//                        console.log("Error in recording symptoms")
//
//                    }
                }
                var symptomsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Symptom', CETERM, CEBODSYS, symptomDate);
                console.log(symptomsOnDate);


                // relapse symptom, visit symptom already recorded
                // -> create new symptom
                // visit symptom, relapse already recorded
                // -> create new symptom
                // relapse symptom, relapse already recorded
                // -> edit
                // visit symptom, visit symptom already recorded
                // -> edit

            }
            else {
                createEvent(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
                console.log(5);
            }
            //clinicalEvents.printEvents();
        }
        else {
            console.log("failed to add symptom");
            console.log("symptomsDate"+symptomDate.toLocaleString());
            console.log(USUBJID);
        }
    }

    var getSymptoms = function() {
        if ((symptomDate!= null) && (USUBJID!= '')){
            //console.log(symptomDate);
            var symptomsOnDate = clinicalEvents.getEventsFromCategoryAndDate('Symptom', symptomDate);
            //console.log(symptomsOnDate);
            return symptomsOnDate;
        }
        else {
            console.log("failed to find symptoms");
            console.log("symptomsDate"+symptomDate.toLocaleString());
            console.log(USUBJID);
        }
        return [];
    }

    return {
        setDate: setDate,
        getDate: getDate,
        setUSUBJID: setUSUBJID,
        editSymptom: editSymptom,
        getSymptoms: getSymptoms
    }
});


symptomsModule.controller('visitSymptomsCtrl', function ($rootScope, $parse, $scope, symptoms, symptomVocab, clinicalEvents) {

    var useRelapseGrpID = false;

    var checkCELATNeedsUndoing = function(CETERM, CEBODSYS, CELAT, model) {
        var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Symptom', CETERM, CEBODSYS, symptoms.getDate());
        for (var s = 0; s < signsOnDate.length; s++) {
            // if this symptom already exists and is the same value
            // if the symptom is a visit symptom
            if ((signsOnDate[s].CELAT == CELAT) && (signsOnDate[s].CEGRPID == -1)) {
                model.assign($scope, '');
                CELAT = false;
            }
        }
        return CELAT;
    }

    $scope.editSymptom = function(modelName) {
        var CETERM = symptomVocab.getTerm(modelName).CETERM;//symptomTerms[modelName].CETERM;
        var CEBODSYS = symptomVocab.getTerm(modelName).CEBODSYS;
        var model = $parse(modelName);
        var CELAT = model($scope);

        CELAT = checkCELATNeedsUndoing(CETERM, CEBODSYS, CELAT, model);
        //console.log('Visit');
        //console.log(modelName);
        console.log(CELAT);
        symptoms.editSymptom(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
    }

    $rootScope.displayVisitSymptoms = function() {
        clearFields();
        var currentSymptoms = symptoms.getSymptoms();
        for (var s = 0; s < currentSymptoms.length; s++) {
            if (currentSymptoms[s].CEGRPID == -1) {
                var modelName = symptomVocab.getScopeVariable(currentSymptoms[s].CETERM, currentSymptoms[s].CEBODSYS);
                var model = $parse(modelName);
                model.assign($scope, currentSymptoms[s].CELAT);
            }
        }
    }

    $rootScope.clearVisitSymptomFields = function() {
        clearFields();
    }

    var clearFields = function() {
        angular.forEach(symptomVocab, function(value, key) {
            var model = $parse(key);
            model.assign($scope,'');
        });
    }
})

symptomsModule.controller('relapseSymptomsCtrl', function ($rootScope, $parse, $scope, symptoms, symptomVocab, clinicalEvents) {

    var useRelapseGrpID = true;

    var checkCELATNeedsUndoing = function(CETERM, CEBODSYS, CELAT, model) {
        var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Symptom', CETERM, CEBODSYS, symptoms.getDate());
        // if this symptom already exists and is the same value
        // if is a relapse symptom
        // if the symptom is a relapse symptom
        for (var s = 0; s < signsOnDate.length; s++) {
            if ((signsOnDate[s].CELAT == CELAT)&& (signsOnDate[s].CEGRPID != -1)) {
                model.assign($scope, '');
                CELAT = false;
            }
        }
        return CELAT;
    }

    $scope.editSymptom = function(modelName) {
        var CETERM = symptomVocab.getTerm(modelName).CETERM;//symptomTerms[modelName].CETERM;
        var CEBODSYS = symptomVocab.getTerm(modelName).CEBODSYS;
        var model = $parse(modelName);
        var CELAT = model($scope);

        CELAT = checkCELATNeedsUndoing(CETERM, CEBODSYS, CELAT, model);
        console.log('Relapse');
        console.log(modelName);
        console.log(CELAT);
        symptoms.editSymptom(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
    }

    $rootScope.displayRelapseSymptoms = function() {
        clearFields();
        var currentSymptoms = symptoms.getSymptoms();

        for (var s = 0; s < currentSymptoms.length; s++) {
            if (currentSymptoms[s].CEGRPID != -1) {
                var modelName = symptomVocab.getScopeVariable(currentSymptoms[s].CETERM, currentSymptoms[s].CEBODSYS);
                var model = $parse(modelName);
                model.assign($scope, currentSymptoms[s].CELAT);
            }

        }
    }

    $rootScope.clearRelapseSymptomFields = function() {
        clearFields();
    }

    var clearFields = function () {
        angular.forEach(symptomVocab, function(value, key) {
            var model = $parse(key);
            model.assign($scope,'');
        });
    }
})
