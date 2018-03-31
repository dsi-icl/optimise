/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 31/03/16
 * Time: 11:20
 * To change this template use File | Settings | File Templates.
 */

var signsModule = angular.module('Optimise.signs',[]);

signsModule.directive('relapseSigns', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/clinicalEvent/relapseSigns.html',
        controller: 'relapseSignsCtrl'
    };
});

signsModule.directive('visitSigns', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/clinicalEvent/visitSigns.html',
        controller: 'visitSignsCtrl'
    };
});

signsModule.factory('signVocab', function() {
    var signTerms = {};

    signTerms['higherFunction.informationProcessingSpeed']={CETERM: 'Information processing speed', CEBODSYS:''};
    signTerms['higherFunction.executiveFunctions']={CETERM: 'Executive functions', CEBODSYS:''};
    signTerms['higherFunction.memory']={CETERM: 'Memory', CEBODSYS:''};
    signTerms['higherFunction.verbalFluency']={CETERM: 'Verbal fluency', CEBODSYS:''};
    signTerms['higherFunction.depression']={CETERM: 'Depression', CEBODSYS:''};
    signTerms['higherFunction.seizure']={CETERM: 'Seizure', CEBODSYS:''};

    signTerms['cranial.redDesaturation']={CETERM: 'Red desaturation', CEBODSYS:'Eye'};
    signTerms['cranial.fieldDefect']={CETERM: 'Field defect', CEBODSYS:'Eye'};
    //signTerms['cranial.ptosis']={CETERM: 'Ptosis', CEBODSYS:''};
    signTerms['cranial.oscillopia']={CETERM: 'Oscillopia', CEBODSYS:''};
    signTerms['cranial.sixthNervePalsy']={CETERM: 'Sixth nerve palsy', CEBODSYS:''};
    signTerms['cranial.fourthNervePalsy']={CETERM: 'Fourth nerve palsy', CEBODSYS:''};
    signTerms['cranial.thirdNervePalsy']={CETERM: 'Third nerve palsy', CEBODSYS:''};
    signTerms['cranial.dysarthria']={CETERM: 'Dysarthria', CEBODSYS:''};
    signTerms['cranial.dysphagia']={CETERM: 'Dysphagia', CEBODSYS:''};
    signTerms['cranial.vertigo']={CETERM: 'Vertigo', CEBODSYS:''};
    signTerms['cranial.trigeminalNeuralgia']={CETERM: 'Trigeminal neuralgia', CEBODSYS:''};
    signTerms['cranial.facialHypoesthesia']={CETERM: 'Facial hypoesthesia', CEBODSYS:'Face'};
    signTerms['cranial.atypicalFacialPain']={CETERM: 'Atypical facial pain', CEBODSYS:'Face'};
    signTerms['cranial.trigeminalPalsy']={CETERM: 'Trigeminal palsy', CEBODSYS:''};
    signTerms['cranial.hearingLoss']={CETERM: 'Hearing loss', CEBODSYS:''};


    signTerms['motor.weakness.upper']={CETERM: 'Weakness', CEBODSYS:'Upper Limbs'};
    signTerms['motor.weakness.lower']={CETERM: 'Weakness', CEBODSYS:'Lower Limbs'};
    signTerms['motor.spasticity.upper']={CETERM: 'Spasticity', CEBODSYS:'Upper Limbs'};
    signTerms['motor.spasticity.lower']={CETERM: 'Spasticity', CEBODSYS:'Lower Limbs'};

    signTerms['motor.tendonReflex.hyperreflexia.biceps.right']={CETERM: 'Hyperreflexia', CEBODSYS:'Biceps', CELAT:'right'};
    signTerms['motor.tendonReflex.hyperreflexia.biceps.left']={CETERM: 'Hyperreflexia', CEBODSYS:'Biceps', CELAT:'left'};
    signTerms['motor.tendonReflex.hyperreflexia.patella.right']={CETERM: 'Hyperreflexia', CEBODSYS:'Patella', CELAT:'right'};
    signTerms['motor.tendonReflex.hyperreflexia.patella.left']={CETERM: 'Hyperreflexia', CEBODSYS:'Patella', CELAT:'left'};
    signTerms['motor.tendonReflex.hyperreflexia.ankle.right']={CETERM: 'Hyperreflexia', CEBODSYS:'Ankle', CELAT:'right'};
    signTerms['motor.tendonReflex.hyperreflexia.ankle.left']={CETERM: 'Hyperreflexia', CEBODSYS:'Ankle', CELAT:'left'};

    signTerms['motor.tendonReflex.hyporeflexia.biceps.right']={CETERM: 'Hyporeflexia', CEBODSYS:'Biceps', CELAT:'right'};
    signTerms['motor.tendonReflex.hyporeflexia.biceps.left']={CETERM: 'Hyporeflexia', CEBODSYS:'Biceps', CELAT:'left'};
    signTerms['motor.tendonReflex.hyporeflexia.patella.right']={CETERM: 'Hyporeflexia', CEBODSYS:'Patella', CELAT:'right'};
    signTerms['motor.tendonReflex.hyporeflexia.patella.left']={CETERM: 'Hyporeflexia', CEBODSYS:'Patella', CELAT:'left'};
    signTerms['motor.tendonReflex.hyporeflexia.ankle.right']={CETERM: 'Hyporeflexia', CEBODSYS:'Ankle', CELAT:'right'};
    signTerms['motor.tendonReflex.hyporeflexia.ankle.left']={CETERM: 'Hyporeflexia', CEBODSYS:'Ankle', CELAT:'left'};

    signTerms['motor.tremor.postural.upper']={CETERM: 'Postural Tremor', CEBODSYS:'Upper Limbs'};
    signTerms['motor.tremor.intention.upper']={CETERM: 'Intention Tremor', CEBODSYS:'Upper Limbs'};

    signTerms['cerebellar.ataxia.upper']={CETERM: 'Ataxia', CEBODSYS:'Upper Limbs'};
    signTerms['cerebellar.ataxia.lower']={CETERM: 'Ataxia', CEBODSYS:'Lower Limbs'};
    signTerms['cerebellar.ataxia.trunk']={CETERM: 'Ataxia', CEBODSYS:'Trunk'};

    signTerms['somatosensory.dysesthesia.upper']={CETERM: 'Dysesthesia', CEBODSYS:'Upper Limbs'};
    signTerms['somatosensory.dysesthesia.lower']={CETERM: 'Dysesthesia', CEBODSYS:'Lower Limbs'};
    signTerms['somatosensory.dysesthesia.trunk']={CETERM: 'Dysesthesia', CEBODSYS:'Trunk'};
    signTerms['somatosensory.anesthesia.upper']={CETERM: 'Anesthesia', CEBODSYS:'Upper Limbs'};
    signTerms['somatosensory.anesthesia.lower']={CETERM: 'Anesthesia', CEBODSYS:'Lower Limbs'};
    signTerms['somatosensory.anesthesia.trunk']={CETERM: 'Anesthesia', CEBODSYS:'Trunk'};

    signTerms['mobility']={CETERM: 'Mobility', CEBODSYS:''};
    signTerms['maximumDistance']={CETERM: 'Maximum Distance', CEBODSYS:''};

    signTerms.getTerm = function(modelName) {
        //console.log(modelName);
        return signTerms[modelName];
    }

    signTerms.getScopeVariable = function(CETERM, CEBODYSYS, CELAT, CESEV) {
        var theKey = '';
        angular.forEach(signTerms, function(value, key) {
            if ((value.CETERM == CETERM)&&(value.CEBODSYS == CEBODYSYS)) {
                if (CESEV == "")
                    theKey = key;
                else {
                    if (key.indexOf(CELAT.toLowerCase())>-1) {
                        theKey = key;
                    }
                }
            }
        });
        return theKey;
    }

    return signTerms;
});

signsModule.service('signs', function(clinicalEvents, clinicalEvent) {
    var signDate = null;
    var USUBJID = '';

    var setDate = function(newDate) {
        signDate = newDate;
    }

    var getDate = function() {
        return signDate;
    }

    var setUSUBJID = function(newUSUBJID) {
        USUBJID = newUSUBJID;
        //console.log(USUBJID);
    }

    var editEvent = function(aSign, CELAT) {
        if (CELAT == false) {  //if this symptom is to be unchecked
            clinicalEvents.deleteEvent(aSign);
        } else {                // else change laterality
            aSign.CELAT = CELAT;
            clinicalEvents.editEvent(aSign, 'CELAT', CELAT);
        }
    }

    var createEvent = function(CETERM, CEBODSYS, CELAT, useRelapseGrpID) {
        var newSign = new clinicalEvent(USUBJID, CETERM, 'Sign');
        newSign.CESTDTC = signDate;
        newSign.CEBODSYS = CEBODSYS;
        newSign.CELAT = CELAT;

        if (useRelapseGrpID){ // a relapse symptom, shares same grpid with relapse event
            var event = clinicalEvents.getCurrentEvent();
            if ((event!= null)&&(event.length > 0)) {
                newSign.CEGRPID = event[0].CEGRPID;
            } else {
                alert("Associating symptom with a non-event");
            }
        }

        clinicalEvents.addEvent(newSign);
    }

    var createEventSev = function(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID) {
        var newSign = new clinicalEvent(USUBJID, CETERM, 'Sign');
        newSign.CESTDTC = signDate;
        newSign.CEBODSYS = CEBODSYS;
        newSign.CELAT = CELAT;
        newSign.CESEV = CESEV;
        if (useRelapseGrpID){ // a relapse symptom, shares same grpid with relapse event
            var event = clinicalEvents.getCurrentEvent();
            if ((event!= null)&&(event.length > 0)) {
                newSign.CEGRPID = event[0].CEGRPID;
            } else {
                alert("Associating symptom with a non-event");
            }
        }
        clinicalEvents.addEvent(newSign);
    }

    var editStatus = function (signsOnDate) {
        var visitSignExists = false;
        var relapseSignExists = false;
        for (var s = 0; s < signsOnDate.length; s++) {
            if (signsOnDate[s].CEGRPID == -1)
                visitSignExists = true;
            if (signsOnDate[s].CEGRPID != -1)
                relapseSignExists = true;
        }

        return [visitSignExists, relapseSignExists];
    }

    var editSign = function(CETERM, CEBODSYS, CELAT, useRelapseGrpID) {
        if ((signDate!= null) && (USUBJID!= '')){
            var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Sign', CETERM, CEBODSYS, signDate);

            if (signsOnDate.length > 0){ // if sign already recorded on this day

                for (var s = 0; s < signsOnDate.length; s++) {

                    // relapse sign, visit sign already recorded
                    // -> create new relapse sign
                    if ((useRelapseGrpID)
                        &&(signsOnDate[s].CEGRPID==-1)
                        &&(editStatus(signsOnDate)[0] == true)
                        &&(editStatus(signsOnDate)[1] == false)) {
                        createEvent(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
                    }

                    // visit sign, relapse sign already recorded
                    // -> create new sign
                    // a relapse sign exists, create a visit one too
                    else if ((!useRelapseGrpID)
                        &&(signsOnDate[s].CEGRPID!=-1)
                        &&(editStatus(signsOnDate)[0] == false)
                        &&(editStatus(signsOnDate)[1] == true)) {
                        createEvent(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
                        console.log("create a new visit sign, a relapse system exists but not a visit one");
                    }

                    // relapse sign, relapse sign already recorded
                    // -> create new sign
                    else if ((useRelapseGrpID)
                        &&(signsOnDate[s].CEGRPID!=-1)
                        &&(editStatus(signsOnDate)[1] == true)) {
                        editEvent(signsOnDate[s], CELAT);
                        console.log('editing an existing sign, a relapse sign exists');
                    }

                    // visit sign, visit sign already recorded
                    // -> edit
                    else if ((!useRelapseGrpID)
                        &&(signsOnDate[s].CEGRPID==-1)
                        &&(editStatus(signsOnDate)[0] == true)) {
                        editEvent(signsOnDate[s], CELAT);
                    }
                }

            }
            else {
                createEvent(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
            }
            //clinicalEvents.printEvents();
        }
        else {
            alert("Failed to add sign");
        }
    }

    var editSignSev = function(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID) {

        if ((signDate!= null) && (USUBJID!= '')){
            var allSignsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Sign', CETERM, CEBODSYS, signDate);
            var signsOnDate = [];
            for (var s = 0; s < allSignsOnDate.length; s++) {
                if (allSignsOnDate[s].CELAT == CELAT)
                    signsOnDate.push(allSignsOnDate[s]);
            }
            if (signsOnDate.length > 0){
                var edited = false;
                for (var lat = 0; lat < signsOnDate.length; lat++){
                    //if (signsOnDate[lat].CELAT == CELAT) {

                        //signsOnDate[lat].CESEV= CESEV;

                        // no relapse sign, visit sign already recorded
                        // -> create new relapse sign
                        if ((useRelapseGrpID)
                            &&(signsOnDate[lat].CEGRPID==-1)
                            &&(editStatus(signsOnDate)[0] == true)
                            &&(editStatus(signsOnDate)[1] == false) ) {
                            createEventSev(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID);
                            console.log('new relapse sign to record, relapse sign not recorded before');
                        }

                        /// no visit sign, relapse sign already recorded
                        // -> create new visit sign
                        // a relapse sign exists, create a visit one too
                        else if ((!useRelapseGrpID)
                            &&(signsOnDate[lat].CEGRPID!=-1)
                            &&(editStatus(signsOnDate)[0] == false)
                            &&(editStatus(signsOnDate)[1] == true)) {
                            createEventSev(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID);
                            console.log('new relapse sign to record, relapse sign not recorded before');
                        }

                        // relapse sign, relapse sign already recorded
                        // -> create new symptom
                        else if ((useRelapseGrpID)
                            &&(signsOnDate[lat].CEGRPID!=-1)
                            &&(editStatus(signsOnDate)[1] == true)) {
                                console.log(CESEV);
                                if (CESEV == '') {
                                    clinicalEvents.deleteEvent(signsOnDate[lat]);
                                }
                                else {
                                    signsOnDate[lat].CESEV= CESEV;
                                    clinicalEvents.editEvent(signsOnDate[lat], 'CESEV', CESEV);
                                }
                                console.log('Editing existing relapse sign');
//                            var edited = false;
//                            for (var alat = 0; alat < signsOnDate.length; alat++){
//                                if (signsOnDate[alat].CELAT == CELAT) {
//                                    if (CESEV == '') {
//                                        clinicalEvents.deleteEvent(signsOnDate[alat]);
//                                    }
//                                    else {
//                                        signsOnDate[alat].CESEV= CESEV;
//                                        clinicalEvents.editEvent(signsOnDate[alat], 'CESEV', CESEV);
//                                    }
//                                    edited=true;
//                                }
//                            }
//                            if (!edited) {
//                                createEventSev(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID);
//                            }
                        }

                        // visit symptom, visit symptom already recorded
                        // -> edit
                        else if ((!useRelapseGrpID)
                            &&(signsOnDate[lat].CEGRPID==-1)
                            &&(editStatus(signsOnDate)[0] == true)) {
                                console.log(CESEV=='');
                                if (CESEV == '') {
                                    console.log('deleting');
                                    clinicalEvents.deleteEvent(signsOnDate[lat]);
                                }
                                else {
                                    console.log('editing');
                                    signsOnDate[lat].CESEV= CESEV;
                                    clinicalEvents.editEvent(signsOnDate[lat], 'CESEV', CESEV);
                                }
                                console.log('Editing existing visit sign');
//                            var edited = false;
//                            for (var lat = 0; lat < signsOnDate.length; lat++){
//                                if (signsOnDate[lat].CELAT == CELAT) {
//                                    if (CESEV == '') {
//                                        clinicalEvents.deleteEvent(signsOnDate[alat]);
//                                    }
//                                    else {
//                                        signsOnDate[lat].CESEV= CESEV;
//                                        clinicalEvents.editEvent(signsOnDate[lat], 'CESEV', CESEV);
//                                    }
//                                    edited=true;
//                                }
//                            }
//                            if (!edited) {
//                                createEventSev(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID);
//                            }
                        }

//                        clinicalEvents.editEvent(signsOnDate[lat], 'CESEV', CESEV);
//                        edited=true;
                    //}
                }
//                if (!edited) {
//                    createEventSev(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID);
//                }
            }
            else {
                createEventSev(CETERM, CEBODSYS, CELAT, CESEV, useRelapseGrpID);
            }

        }
        else {
            alert ("Failed to add sign");
        }
    }

    var getSigns = function() {
        if ((signDate!= null) && (USUBJID!= '')){
            var signsOnDate = clinicalEvents.getEventsFromCategoryAndDate('Sign', signDate);
            return signsOnDate;
        }
        else {
            alert ("Failed to find sign");
        }
        return [];
    }



    return {
        setDate: setDate,
        getDate: getDate,
        setUSUBJID: setUSUBJID,
        editSign: editSign,
        getSigns: getSigns,
        editSignSev: editSignSev
    }
});


signsModule.controller('relapseSignsCtrl', function ($rootScope, $parse, $scope, signs, signVocab, clinicalEvents) {

    var useRelapseGrpID = true;

    var checkCESEVNeedsUndoing = function(CETERM, CEBODSYS, CELAT, CESEV, model) {
        var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Sign', CETERM, CEBODSYS, signs.getDate());
        for (var lat = 0; lat < signsOnDate.length; lat++){
            if ((signsOnDate[lat].CELAT == CELAT) && (signsOnDate[lat].CEGRPID != -1)) {
                if (signsOnDate[lat].CESEV == CESEV) {
                    model.assign($scope, '');
                    CESEV = "";
                }
            }
        }
        return CESEV;
    }

    var checkCELATNeedsUndoing = function(CETERM, CEBODSYS, CELAT, model) {
        var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Sign', CETERM, CEBODSYS, signs.getDate());
        for (var s = 0; s < signsOnDate.length; s++) {
            if ((signsOnDate[s].CELAT == CELAT) && (signsOnDate[s].CEGRPID != -1)){
                model.assign($scope, '');
                CELAT = false;
            }
        }
        return CELAT;
    }

    $scope.editSign = function(modelName) {
        var CETERM = signVocab.getTerm(modelName).CETERM;//signTerms[modelName].CETERM;
        var CEBODSYS = signVocab.getTerm(modelName).CEBODSYS;
        if (modelName.indexOf('right')>-1){
            var model = $parse(modelName);
            var CESEV = model($scope);
            CESEV = checkCESEVNeedsUndoing(CETERM, CEBODSYS, 'Right', CESEV, model);
            signs.editSignSev(CETERM, CEBODSYS, 'Right', CESEV, useRelapseGrpID);

        } else if (modelName.indexOf('left')>-1){
            var model = $parse(modelName);
            var CESEV = model($scope);
            CESEV = checkCESEVNeedsUndoing(CETERM, CEBODSYS, 'Left', CESEV, model);
            signs.editSignSev(CETERM, CEBODSYS, 'Left', CESEV, useRelapseGrpID);
        }
        else {
            var model = $parse(modelName);
            var CELAT = model($scope);
            CELAT = checkCELATNeedsUndoing(CETERM, CEBODSYS, CELAT, model);
            console.log(CELAT);
            signs.editSign(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
        }
    }


    $rootScope.displayRelapseSigns = function() {
        clearFields();
        var currentSigns = signs.getSigns();
        for (var s = 0; s < currentSigns.length; s++) {
            if (currentSigns[s].CEGRPID != -1) {
                var modelName = signVocab.getScopeVariable(currentSigns[s].CETERM, currentSigns[s].CEBODSYS, currentSigns[s].CELAT, currentSigns[s].CESEV);
                var model = $parse(modelName);
                if (currentSigns[s].CESEV != "") {
                    if (modelName.indexOf(currentSigns[s].CELAT.toLowerCase())>-1)
                        model.assign($scope, currentSigns[s].CESEV);
                } else {
                    model.assign($scope, currentSigns[s].CELAT);
                }
            }
        }
    }

    $rootScope.clearRelapseSignFields = function() {
        clearFields();
    }

    var clearFields = function () {
        angular.forEach(signVocab, function(value, key) {
            var model = $parse(key);
            model.assign($scope,'');
        });
    }
})

signsModule.controller('visitSignsCtrl', function ($rootScope, $parse, $scope, signs, signVocab, clinicalEvents) {

    var useRelapseGrpID = false;

    var checkCESEVNeedsUndoing = function(CETERM, CEBODSYS, CELAT, CESEV, model) {
        var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Sign', CETERM, CEBODSYS, signs.getDate());
        for (var lat = 0; lat < signsOnDate.length; lat++){
            if ((signsOnDate[lat].CELAT == CELAT)&& (signsOnDate[lat].CEGRPID == -1)) {
                if (signsOnDate[lat].CESEV == CESEV) {
                    model.assign($scope, '');
                    CESEV = "";
                }
            }
        }
        return CESEV;
    }

    var checkCELATNeedsUndoing = function(CETERM, CEBODSYS, CELAT, model) {
        var signsOnDate = clinicalEvents.getEventByTermBodsysOnDate('Sign', CETERM, CEBODSYS, signs.getDate());
        for (var s = 0; s < signsOnDate.length; s++) {
            if ((signsOnDate[s].CELAT == CELAT) && (signsOnDate[s].CEGRPID == -1)) {
                model.assign($scope, '');
                CELAT = false;
            }
        }
        return CELAT;
    }

    $scope.editSign = function(modelName) {
        var CETERM = signVocab.getTerm(modelName).CETERM;//signTerms[modelName].CETERM;
        var CEBODSYS = signVocab.getTerm(modelName).CEBODSYS;

        if (modelName.indexOf('right')>-1){
            var model = $parse(modelName);
            var CESEV = model($scope);
            CESEV = checkCESEVNeedsUndoing(CETERM, CEBODSYS, 'Right', CESEV, model);
            signs.editSignSev(CETERM, CEBODSYS, 'Right', CESEV, useRelapseGrpID);

        } else if (modelName.indexOf('left')>-1){
            var model = $parse(modelName);
            var CESEV = model($scope);
            CESEV = checkCESEVNeedsUndoing(CETERM, CEBODSYS, 'Left', CESEV, model);
            signs.editSignSev(CETERM, CEBODSYS, 'Left', CESEV, useRelapseGrpID);
        }
        else {
            var model = $parse(modelName);
            var CELAT = model($scope);
            CELAT = checkCELATNeedsUndoing(CETERM, CEBODSYS, CELAT, model);
            signs.editSign(CETERM, CEBODSYS, CELAT, useRelapseGrpID);
        }
    }

    $rootScope.displayVisitSigns = function() {
        clearFields();
        var currentSigns = signs.getSigns();
        for (var s = 0; s < currentSigns.length; s++) {
            if (currentSigns[s].CEGRPID == -1) {
                var modelName = signVocab.getScopeVariable(currentSigns[s].CETERM, currentSigns[s].CEBODSYS, currentSigns[s].CELAT, currentSigns[s].CESEV);
                var model = $parse(modelName);
                if (currentSigns[s].CESEV != "") {
                    if (modelName.indexOf(currentSigns[s].CELAT.toLowerCase())>-1)
                        model.assign($scope, currentSigns[s].CESEV);
                } else {
                    model.assign($scope, currentSigns[s].CELAT);
                }
            }
        }
    }

    $rootScope.clearVisitSignFields = function() {
        clearFields();
    }

    var clearFields = function() {
        angular.forEach(signVocab, function(value, key) {
            var model = $parse(key);
            model.assign($scope,'');
        });
    }
})



