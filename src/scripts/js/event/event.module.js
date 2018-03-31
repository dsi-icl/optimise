/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 25/01/2015
 * Time: 15:25
 * To change this template use File | Settings | File Templates.
 */
var eventModule = angular.module('Optimise.event', ['Optimise.view',
    'Optimise.clinicalEvent',
    'Optimise.adverseEvent']);

/*
eventModule.service('events', function (clinicalEvent, clinicalEvents, records) {
    var populateManual = function (USUBJID) {
        var event1 = new clinicalEvent();
        event1.CESTDTC = new Date();
        event1.CEENDTC = new Date();
        event1.CETERM = "Hypertension";
        event1.CESEV = "Mild";
        event1.CEOUT = "Ongoing";
        event1.CECAT = "Other";
        event1.USUBJID = USUBJID;
        event1.displayLabel = event1.CETERM + ' - ' +event1.CESEV;
        event1.displayDate = event1.CESTDTC.toDateString();
        clinicalEvents.addEvent(event1);
    };
    return {
        populateManual:populateManual
    };

});
*/

eventModule.controller('eventInfoCtrl', function($rootScope, $scope, $parse,
                                                viewService,
                                                clinicalEvent, clinicalEvents,
                                                adverseEventService, AdverseEvent)
{

    $scope.USUBJID = '';

    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Medical Event') {
            return true;
        }
        else
            return false;
    };

    $scope.getMedicalConditions = function () {
        return clinicalEvents.getMedicalConditions();
    }

    var clearFields = function () {
        $scope.STDTC = '';
        //$scope.CEENDTC = '';
        $scope.TERM = "";
        $scope.SEV = "";
        $scope.OUT = "";
    };

    $rootScope.setEventUSUBJID = function(USUBJID) {
        $scope.USUBJID = USUBJID;
    }

    $rootScope.setNewEventFields = function() {
        clinicalEvents.clearEvent();
        clearFields();
        //$scope.CESTDTC = '';
    };

    $rootScope.displayEvent = function(DOMAIN) {
        clearFields();
        if (DOMAIN == 'CE'){
            $scope.isAdverseEvent = false;
            var currentEvent = clinicalEvents.getCurrentEvent();  // get relapse, with affected functional systems
            //console.log(currentEvent);
            if (currentEvent.length > 0)
            {
                $scope.STDTC = currentEvent[0].CESTDTC;
                //$scope.CEENDTC = currentEvent[0].CEENDTC;
                $scope.SEV = currentEvent[0].CESEV;
                $scope.OUT = currentEvent[0].CEOUT;
                $scope.TERM = currentEvent[0].CETERM;
            }
        }

        if (DOMAIN == 'AE'){
            $scope.isAdverseEvent = true;
            var currentAdverseEvent = adverseEventService.getCurrentEvent();  // get relapse, with affected functional systems
            //console.log(currentAdverseEvent);
            if (currentAdverseEvent != null)
            {
                $scope.STDTC = currentAdverseEvent.AESTDTC;
                $scope.SEV = currentAdverseEvent.AESEV;
                $scope.OUT = currentAdverseEvent.AEOUT;
                $scope.TERM = currentAdverseEvent.AETERM;

                $scope.AESLIFE = currentAdverseEvent.AESLIFE;
                $scope.AESDTH = currentAdverseEvent.AESDTH;
                $scope.AESDISAB = currentAdverseEvent.AESDISAB;
                $scope.AESHOSP = currentAdverseEvent.AESHOSP;
                $scope.AESCONG = currentAdverseEvent.AESCONG;
            }
        }
    };

    /*
    var editEvent = function(oldEvent) {
        oldEvent.STDTC = $scope.CESTDTC;
        //oldEvent.CEENDTC = $scope.CEENDTC;
        oldEvent.SEV = $scope.CESEV;
        oldEvent.OUT = $scope.CEOUT;
        oldEvent.TERM = $scope.CETERM;
        oldEvent.displayLabel = oldEvent.CETERM + ' - ' +oldEvent.CESEV;
        oldEvent.displayDate = oldEvent.CESTDTC.toDateString();
    };*/

    var addClinicalEvent = function() {
        var eventOnDate = clinicalEvents.getEventByTermOnDate($scope.TERM, $scope.STDTC);
        if (eventOnDate.length == 0){
            var newEvent = new clinicalEvent($scope.USUBJID, $scope.TERM, 'Other');
            var newDate = new Date($scope.STDTC);
            newEvent.CESTDTC = $scope.STDTC;
            newEvent.CESEV = $scope.SEV;
            newEvent.CEOUT = $scope.OUT;
            newEvent.displayLabel = $scope.TERM;
            newEvent.displayDate = newDate.toDateString();
            clinicalEvents.addEvent(newEvent);

        }
    }

    $scope.addEvent = function() {
        if (($scope.STDTC != '') && ($scope.TERM != ''))
        {
            if (clinicalEvents.termExists($scope.TERM)) {
                if ($scope.isAdverseEvent) {
                    addAdverseEvent();
                    adverseEventService.print();
                }
                else {
                    addClinicalEvent();
                    clinicalEvents.printEvents();
                }
            }
            else {
                console.log($scope.TERM + " not found");
            }
        }
    };

    var addAdverseEvent = function () {
        var eventDate = new Date($scope.STDTC);
        var event = adverseEventService.getAdverseEventByTermAndDate(eventDate.toDateString(),$scope.TERM);
        if (event == null){
            var newEvent = new AdverseEvent($scope.USUBJID, $scope.TERM);
            newEvent.AESTDTC = eventDate;
            newEvent.AESEV = $scope.AESEV;
            newEvent.AEOUT = $scope.OUT;
            newEvent.displayLabel = $scope.TERM;
            newEvent.displayDate = eventDate.toDateString();
            adverseEventService.addAdverseEvent(newEvent);
            //adverseEventService.print();
        }
    };

    $scope.editEvent = function(ENAME) {
        var eventDate = new Date($scope.STDTC);
        if ($scope.isAdverseEvent) {
            var event = adverseEventService.getAdverseEventByTermAndDate(eventDate.toDateString(),$scope.TERM);
            if (event != null) {
                console.log($scope.SEV);
                if (ENAME == 'SEV') {
                    event.AESEV = $scope.SEV;
                    adverseEventService.editAdverseEvent(event, 'AESEV', $scope.SEV);
                }
                if (ENAME == 'OUT') {
                    event.AEOUT = $scope.OUT;
                    adverseEventService.editAdverseEvent(event, 'AEOUT', $scope.OUT);
                }
            }
        }
        else {
            var eventOnDate = clinicalEvents.getEventByTermOnDate($scope.TERM, $scope.STDTC);
            if (eventOnDate.length == 1){
                switch (ENAME) {
                    case ('SEV'): {
                        eventOnDate.CESEV = $scope.SEV;
                        clinicalEvents.editEvent(eventOnDate[0], 'CESEV', $scope.SEV);
                        break;
                    };
                    case ('OUT'): {
                        eventOnDate.CEOUT = $scope.OUT;
                        clinicalEvents.editEvent(eventOnDate[0], 'CEOUT', $scope.OUT);
                        break;
                    };
                };
            }
        }
    }

    $scope.editAdverseEvent = function (AETermName) {
        var eventDate = new Date($scope.STDTC);
        var event = adverseEventService.getAdverseEventByTermAndDate(eventDate.toDateString(),$scope.TERM);
        switch (AETermName) {
            case 'AESDTH': {
                event.AESDTH = $scope.AESDTH;
                adverseEventService.editAdverseEvent(event, AETermName, $scope.AESDTH);
                break;
            };
            case 'AESLIFE': {
                event.AESLIFE = $scope.AESLIFE;
                adverseEventService.editAdverseEvent(event, AETermName, $scope.AESLIFE);
                break;
            };
            case 'AESDISAB': {
                event.AESDISAB = $scope.AESDISAB;
                adverseEventService.editAdverseEvent(event, AETermName, $scope.AESDISAB);
                break;
            };
            case 'AESHOSP': {
                event.AESDTH = $scope.AESHOSP;
                adverseEventService.editAdverseEvent(event, AETermName, $scope.AESHOSP);
                break;
            };
            case 'AESCONG': {
                event.AESCONG = $scope.AESCONG;
                adverseEventService.editAdverseEvent(event, AETermName, $scope.AESCONG);
                break;
            };
        };
    };


});

eventModule.directive('eventEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: 'scripts/js/event/event.html'
    }
});
