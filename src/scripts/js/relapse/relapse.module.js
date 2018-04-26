/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:22
 * To change this template use File | Settings | File Templates.
 */

var relapseModule = angular.module('Optimise.relapse',[]);

relapseModule.controller('relapseInfoCtrl', function ($rootScope,
    $scope,
    clinicalEvent,
    clinicalEvents,
    viewService,
    symptoms, signs,
    question, questionnaires,
    findingAbout, findingsAbout) {


    $scope.USUBJID = '';

    $rootScope.setRelapseUSUBJID = function(USUBJID) {
        $scope.USUBJID = USUBJID;
        symptoms.setUSUBJID($scope.USUBJID);
        signs.setUSUBJID($scope.USUBJID);
    };


    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Relapse')
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    var currentDate = new Date();

    var monthYear = angular.element(document.querySelectorAll('.DTC_MonthYear'));
    monthYear.datepicker({
        format: 'mm/yyyy',
        endDate: currentDate.getFullYear().toString(),
        minViewMode: 1,
        startView: 1,
        orientation: 'top left',
        autoclose: true,
        todayHighlight: true
    });

    $scope.getDisabledFields = function() {
        return viewService.getView().DisableInputFields;
    };

    $scope.datesValidated = false;

    $rootScope.setNewRelapseFields = function() {
        $scope.datesValidated = false;
        clinicalEvents.clearEvent();
        clearFields();
    };

    // get duration in weeks
    var getDuration = function (CESTDTC, CEENDTC) {
        var days = (CEENDTC-CESTDTC)/(1000*60*60*24);
        return Math.ceil(days/7);
    };

    var thisADate = function(ddmmyy) {
        if ( Object.prototype.toString.call(ddmmyy) === '[object Date]' ) {
            return true;
        }
        else {
            return false;
        }
    };

    $rootScope.displayRelapse = function() {
        clearFields();
        var currentRelapse = clinicalEvents.getCurrentEvent();  // get relapse, with affected functional systems

        if ((currentRelapse!= null)&&(currentRelapse.length > 0))
        {
            $scope.CESTDTC = currentRelapse[0].CESTDTC;
            $scope.datesValidated = true;
            $scope.CESTDTC_displayDate = parseInt($scope.CESTDTC.getMonth()+1)+'/'+$scope.CESTDTC.getFullYear();

            if (thisADate(currentRelapse[0].CEENDTC))
                $scope.duration = getDuration(currentRelapse[0].CESTDTC, currentRelapse[0].CEENDTC);

            $scope.CESEV = currentRelapse[0].CESEV;
            $scope.CEOUT = currentRelapse[0].CEOUT;

            symptoms.setDate($scope.CESTDTC);
            signs.setDate($scope.CESTDTC);

            for (var bodSys = 0; bodSys < currentRelapse.length; bodSys++)
            {
                switch(currentRelapse[bodSys].CEBODSYS) {
                case 'Pyramidal Tract':
                    $scope.pyramidalTract = true;
                    break;
                case 'Cerebellum':
                    $scope.cerebellum = true;
                    break;
                case 'Brain Stem':
                    $scope.brainStem = true;
                    break;
                case 'Sensory':
                    $scope.sensory = true;
                    break;
                case 'Bowel Bladder':
                    $scope.bowelBladder = true;
                    break;
                case 'Visual':
                    $scope.visual = true;
                    break;
                case 'Higher Function':
                    $scope.higherFunctional = true;
                    break;
                default:
                    $scope.otherBodySys = currentRelapse[bodSys].CEBODSYS;
                }
            }

            var currentFindings = findingsAbout.getFindingsByLNKID(currentRelapse[0].CELNKID);
            if (currentFindings != null) {
                for (var fa = 0; fa < currentFindings.length; fa++) {
                    if (currentFindings[fa].FASCAT == 'Impact on ADL')
                        $scope.adlScore = currentFindings[fa].FAORES;
                    else if  (currentFindings[fa].FASCAT == 'Corticosteroids prescribed')
                        $scope.steroidsPrescribed = currentFindings[fa].FAORES;
                }

            }
        }
    };

    var clearFields = function() {
        $scope.CESTDTC = '';
        $scope.CESTDTC_displayDate='';
        $scope.duration = '';
        $scope.CEENDTC = '';
        $scope.CESEV = '';
        $scope.CEOUT = '';
        $scope.pyramidalTract = false;
        $scope.cerebellum = false;
        $scope.brainStem = false;
        $scope.bowelBladder = false;
        $scope.sensory = false;
        $scope.visual = false;
        $scope.higherFunctional = false;
        $scope.adlScore = '';
        $scope.steroidsPrescribed = '';
    };

    $scope.editRelapseFinding = function (FASCAT) {

        var ce = clinicalEvents.getCurrentEvent();
        var currentCE = null;
        //console.log(ce);
        if ((ce != null) && (ce.length > 0)){
            var findings = findingsAbout.getFindingsByLNKID(ce[0].CELNKID);
            //console.log(findings);
            var findingsFound = false;
            for (var f = 0; f < findings.length; f++) {
                if (findings[f].FASCAT == FASCAT) {
                    if (FASCAT == 'Impact on ADL') {
                        if ($scope.adlScore == findings[f].FAORES)
                            $scope.adlScore = '';
                        findings[f].FAORES = $scope.adlScore;
                        findingsAbout.editFinding(findings[f]);
                        findingsFound = true;
                    }
                    else if (FASCAT == 'Corticosteroids prescribed') {
                        if ($scope.steroidsPrescribed == findings[f].FAORES)
                            $scope.steroidsPrescribed = '';
                        findings[f].FAORES = $scope.steroidsPrescribed;
                        findingsAbout.editFinding(findings[f]);

                        currentCE = clinicalEvents.getCurrentEvent();
                        for (ce = 0; ce < currentCE.length; ce++) {
                            if ($scope.steroidsPrescribed == 'Yes')
                                currentCE[ce].displayLabel = currentCE[ce].CESEV + ', Steroids';
                            else
                                currentCE[ce].displayLabel = currentCE[ce].CESEV;
                            clinicalEvents.editEvent(currentCE[ce], 'displayLabel', currentCE[ce].displayLabel);
                        }
                        findingsFound = true;
                    }

                }
            }
            if (!findingsFound) {
                var newFinding = new findingAbout($scope.USUBJID, 'Multiple Sclerosis Relapse', 'Severity Test', FASCAT);
                if (FASCAT == 'Corticosteroids prescribed'){
                    currentCE = clinicalEvents.getCurrentEvent();
                    for (ce = 0; ce < currentCE.length; ce++) {
                        if ($scope.steroidsPrescribed == 'Yes')
                            currentCE[ce].displayLabel = currentCE[ce].CESEV + ', Steroids';
                        else
                            currentCE[ce].displayLabel = currentCE[ce].CESEV;
                        clinicalEvents.editEvent(currentCE[ce], 'displayLabel', currentCE[ce].displayLabel);
                    }
                    newFinding.FAORES = $scope.steroidsPrescribed;
                }

                else if (FASCAT == 'Impact on ADL')
                    newFinding.FAORES = $scope.steroidsPrescribed;

                newFinding.FADTC = $scope.CESTDTC;
                newFinding.FALNKID = $scope.CESTDTC+' Multiple Sclerosis Relapse';
                findingsAbout.addFinding(newFinding);


            }
        }
    };

    var editRelapseProperties = function(inFunctionalSys, resName) {
        switch (resName) {
        case ('CESEV'): {
            if (inFunctionalSys.CESEV == $scope.CESEV)
                $scope.CESEV = '';
            inFunctionalSys.CESEV = $scope.CESEV;
            inFunctionalSys.displayLabel = $scope.CESEV;
            clinicalEvents.editEvent(inFunctionalSys, resName, $scope.CESEV);
            clinicalEvents.editEvent(inFunctionalSys, 'displayLabel', $scope.CESEV);
            break;
        }
        case ('CEOUT'): {
            if (inFunctionalSys.CEOUT == $scope.CEOUT)
                $scope.CEOUT = '';
            inFunctionalSys.CEOUT = $scope.CEOUT;
            clinicalEvents.editEvent(inFunctionalSys, resName, $scope.CEOUT);
            break;
        }
        case ('CESTDTC'): {
            inFunctionalSys.CESTDTC = generateCESTDTC();
            clinicalEvents.editEvent(inFunctionalSys, resName, inFunctionalSys.CESTDTC);
            break;
        }
        case ('CEENDTC'): {
            inFunctionalSys.CEENDTC = generateCEENDTC(inFunctionalSys.CESTDTC);
            clinicalEvents.editEvent(inFunctionalSys, resName, inFunctionalSys.CEENDTC);
            break;
        }
        }

        inFunctionalSys.displayLabel = inFunctionalSys.CESEV;
        inFunctionalSys.displayDate = $scope.CESTDTC_displayDate;
    };

    $scope.enableSeverityOutcomeCapture = function() {
        if (($scope.pyramidalTract) || ($scope.cerebellum) || ($scope.brainStem) || ($scope.sensory) || ($scope.bowelBladder) ||
            ($scope.visual) || ($scope.neuropsycho)) {
            return true;
        }
        return false;
    };

    var generateCESTDTC = function() {
        var CESTDTC = new Date($scope.CESTDTC);
        return CESTDTC;
    };

    var generateCEENDTC = function(CESTDTC) {
        var today = CESTDTC;
        var tomorrow = new Date(today);
        var durationInDays = $scope.duration*7;
        tomorrow.setDate(today.getDate()+durationInDays);
        return tomorrow;
    };

    $scope.addRelapseProperty = function(propName) {
        var currentCE = clinicalEvents.getCurrentEvent();
        if (currentCE.length > 0) {
            var eventsInGroup = clinicalEvents.getEventsByCatTermAndGroupID(currentCE[0].CECAT, currentCE[0].CETERM, currentCE[0].CEGRPID);
            for (var e = 0; e < eventsInGroup.length; e++) {
                var event = eventsInGroup[e];
                editRelapseProperties(event, propName);
            }
        }
    };

    $rootScope.setNewRelapseDate = function(display, CESTDTC) {
        $scope.CESTDTC_displayDate = display;
        $scope.CESTDTC = CESTDTC;
        $scope.datesValidated = true;
    };

    $scope.addEndDate = function() {
        if (isNaN($scope.duration)) {
            $scope.duration = null;
            return false;
        }
        else
        {
            var currentCE = clinicalEvents.getCurrentEvent();
            for (var r = 0; r < currentCE.length; r++)
            {
                var anEvent = currentCE[r];
                editRelapseProperties(anEvent, 'CEENDTC');
            }
        }
    };

    $scope.addRelapse = function(CEBODYSYS, toAdd) {

        var currentCE = clinicalEvents.getCurrentEvent();
        symptoms.setUSUBJID($scope.USUBJID);
        signs.setUSUBJID($scope.USUBJID);
        var newEvent = null;

        if (currentCE.length == 0) { // if new relapse
            var newCEGRPID = clinicalEvents.getNewCEGRPID();
            newEvent = addEvent(CEBODYSYS, newCEGRPID);
            clinicalEvents.setEvent(newEvent);
        }
        else {  // if there are existing events in this relapse
            var currentCEGRPID = currentCE[0].CEGRPID;
            if (toAdd) { // if functional system is checked
                newEvent = addEvent(CEBODYSYS, currentCEGRPID);
            }
            else { // if functional system is unchecked
                var inFunctionalSys = clinicalEvents.getEventByBodSys(CEBODYSYS, 'Multiple Sclerosis Relapse', currentCEGRPID);
                clinicalEvents.deleteEvent(inFunctionalSys);
                var eventFromSameRelapse = clinicalEvents.getEventsByCatTermAndGroupID(inFunctionalSys.CECAT, inFunctionalSys.CETERM, currentCEGRPID);
                if (eventFromSameRelapse.length > 0)
                    clinicalEvents.setEvent(eventFromSameRelapse[0]);
                else {
                    clinicalEvents.setEvent([]);
                    $scope.CESEV = '';
                    $scope.CEOUT = '';
                }
            }
        }
    };

    var addRelapseFinding = function(CE) {
        var adlFinding = new findingAbout(CE.USUBJID, CE.CETERM, 'Severity Test', 'Impact on ADL');
        adlFinding.FAORES = '';
        adlFinding.FADTC = generateCESTDTC();
        adlFinding.FALNKID = generateCESTDTC()+' Multiple Sclerosis Relapse';
        findingsAbout.addFinding(adlFinding);

        var steroidsFinding = new findingAbout(CE.USUBJID, CE.CETERM, 'Severity Test', 'Corticosteroids prescribed');
        steroidsFinding.FAORES = '';
        steroidsFinding.FADTC = generateCESTDTC();
        steroidsFinding.FALNKID = generateCESTDTC()+' Multiple Sclerosis Relapse';
        findingsAbout.addFinding(steroidsFinding);
    };

    var addEvent = function(CEBODYSYS, CEGRPID) {
        var newEvent = new clinicalEvent($scope.USUBJID, 'Multiple Sclerosis Relapse', 'MS Relapse');
        //console.log($scope.CESTDTC);
        //editRelapse(newRelapse);
        newEvent.CEBODSYS = CEBODYSYS;
        newEvent.CEGRPID = CEGRPID;
        newEvent.CELNKID = generateCESTDTC()+' Multiple Sclerosis Relapse';

        editRelapseProperties(newEvent, 'CESTDTC');
        editRelapseProperties(newEvent, 'CEENDTC');

        symptoms.setDate(newEvent.CESTDTC);
        signs.setDate(newEvent.CESTDTC);
        if ($scope.CESEV != '') {
            editRelapseProperties(newEvent, 'CESEV');
        }

        if ($scope.CEOUT != '') {
            editRelapseProperties(newEvent, 'CEOUT');
        }

        clinicalEvents.addEvent(newEvent);
        addRelapseFinding(newEvent);
        return newEvent;
    };
});

relapseModule.directive('relapseEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/relapse/relapse.html',
        controller: function() {
            /*
            $scope.showThisContent = function() {
                if (viewService.getView().Section=='Relapse')
                    return true;
                else
                    return false;
            }
            */
        }
    };
});
