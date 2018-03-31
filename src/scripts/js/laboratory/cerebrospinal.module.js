var csfModule = angular.module('Optimise.csf',[]);

csfModule.directive('csfEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/cerebrospinal.html'
    };
});

csfModule.factory('csfVocab', function() {
    var csfTests = {}
    csfTests['csf.totalProtein'] = {LBTEST: 'Total Protein'};
    csfTests['csf.glucose'] = {LBTEST: 'Glucose'};
    csfTests['csf.albumin'] = {LBTEST: 'Albumin'};
    csfTests['csf.qAlbumin'] = {LBTEST: 'Q Albumin'};
    csfTests['csf.igG'] = {LBTEST: 'IgG'};
    csfTests['csf.igGIndex'] = {LBTEST: 'IgG Index'};
    csfTests['csf.whiteCellCount'] = {LBTEST: 'White Cell Count'};
    csfTests['csf.lymphocytes'] = {LBTEST: 'Lymphocytes'};

    csfTests.getTerm = function(modelName) {
        return csfTests[modelName];
    }

    csfTests.getScopeVariable = function(csfTest) {
        var theKey = '';
        angular.forEach(csfTests, function(value, key) {
            if (value.LBTEST == csfTest) {
                theKey = key;
            }
        });
        return theKey;
    }

    return csfTests;
});

csfModule.service('csfService', function(laboratoryTestResults, procedures, procedure) {
    var LBDTC = '';
    var USUBJID = '';

    var setDate = function() {
        LBDTC = procedures.getCurrentProcedure().PRSTDTC;
    }

    var setUSUBJID = function(currentUSUBJID) {
        USUBJID = currentUSUBJID;
    }

    var getDate = function() {
        return LBDTC;
    }

    var addProcedure = function(USUBJID, LBDTC) {
        if (procedures.getProcedureByTRTAndDate('Lumbar Puncture',  LBDTC).length == 0){
            var aProcedure = new procedure(USUBJID, 'Lumbar Puncture');
            aProcedure.PRLOC = 'Intervertebral Space';
            aProcedure.PRSTDTC = LBDTC;
            aProcedure.displayLabel = 'Lumbar Puncture';
            aProcedure.displayDate = LBDTC.toDateString();
            procedures.addProcedure(aProcedure);
        }
    }

    return {
        //setDate: setDate,
        //getDate: getDate,
        addProcedure: addProcedure
    }
});

csfModule.controller('csfInfoCtrl', function ($scope, $rootScope, $parse, viewService,
                                              csfVocab, csfService,
                                              laboratoryTestResults,LaboratoryTestResult,
                                              procedures) {
    //$scope.USUBJID = '';

    $scope.lbrind = "";
    $scope.bandIndicator = "";

    $scope.getDisabledFields = function() {
        return viewService.getView().DisableInputFields;
    }

    var clearFields = function() {
        angular.forEach(csfVocab, function(value, key) {
            var model = $parse(key);
            model.assign($scope,'');
        });
        $scope.lbrind = "";
        $scope.bandIndicator = "";
    };

    $rootScope.displayCSF = function() {
        clearFields();
        var LBDTC = procedures.getCurrentProcedure().PRSTDTC;
        var results = laboratoryTestResults.getTestResultBySpecAndDate(LBDTC, 'CSF');
        if (results.length > 0) {
            for (var r = 0; r < results.length; r++) {
                if (results[r].LBTEST == 'Oligoclonal Bands') {
                    $scope.bandIndicator = results[r].LBNRIND;
                }
                else if (results[r].LBTEST == "Summary")
                    $scope.lbrind = results[r].LBNRIND;
                else {
                    var modelName = csfVocab.getScopeVariable(results[r].LBTEST);
                    var model = $parse(modelName);
                    model.assign($scope, results[r].LBORRES);
                }
            }
        }

    }

    $rootScope.setNewCSFFields = function() {
        clearFields();
    }

    $scope.editIndicators = function(indicatorName, indicatorResult) {
        console.log($scope.LBDTC);
        csfService.addProcedure($scope.USUBJID, $scope.LBDTC);
        var LBTEST = indicatorName;
        var LBNRIND = indicatorResult;
        console.log(LBTEST);
        console.log(LBNRIND);

        var aTestResult = laboratoryTestResults.getTestResult(LBTEST, $scope.LBDTC);
        if (aTestResult != null) {
            aTestResult.LBNRIND = LBNRIND;
            laboratoryTestResults.editResult(aTestResult,'LBNRIND',aTestResult.LBNRIND);
        }
        else {
            var newTestResult = new LaboratoryTestResult($scope.USUBJID, LBTEST);
            newTestResult.LBNRIND = indicatorResult;
            newTestResult.LBDTC = $scope.LBDTC;
            newTestResult.LBSPEC = "CSF";
            newTestResult.displayLabel = "CSF";
            newTestResult.displayDate = $scope.LBDTC.toDateString();

            laboratoryTestResults.addResult(newTestResult);
        }
        laboratoryTestResults.printLabTestResults();
    }

    $scope.editCSFResult = function(modelName){
        csfService.addProcedure($scope.USUBJID, $scope.LBDTC);
        var LBTEST = csfVocab.getTerm(modelName).LBTEST;
        var model = $parse(modelName);
        var LBORRES = model($scope);

        if (LBORRES != null) {
            var aTestResult = laboratoryTestResults.getTestResult(LBTEST, $scope.LBDTC);
            if ((aTestResult != null) && (aTestResult.length > 0)&&(aTestResult[0].LBSPEC='CSF')) {
                if (LBORRES=="") {
                    laboratoryTestResults.deleteResult(aTestResult);
                }
                else {
                    aTestResult.LBORRES = LBORRES;
                    laboratoryTestResults.editResult(aTestResult,'LBORRES',aTestResult.LBORRES);
                }
            }
            else {
                if (LBORRES!=""){

                    var newTestResult = new LaboratoryTestResult($scope.USUBJID, LBTEST);
                    newTestResult.LBORRES = LBORRES;
                    newTestResult.LBDTC = $scope.LBDTC;
                    newTestResult.LBSPEC = "CSF";
                    newTestResult.displayLabel = "CSF";
                    newTestResult.displayDate = $scope.LBDTC.toDateString();

                    laboratoryTestResults.addResult(newTestResult);
                }
            }
        }
    }

    $scope.editBand = function(){
        csfService.addProcedure($scope.USUBJID, $scope.LBDTC);
        var LBTEST = "Oligoclonal Bands";
        var LBNRIND = $scope.bandIndicator;

        if (LBNRIND != null) {
            var aTestResult = laboratoryTestResults.getTestResult(LBTEST, $scope.LBDTC);
            if (aTestResult != null) {
                aTestResult.LBNRIND = LBNRIND;
                laboratoryTestResults.editResult(aTestResult,'LBNRIND',aTestResult.LBNRIND);
            }
            else {
                if (LBNRIND!=""){

                    var newTestResult = new LaboratoryTestResult($scope.USUBJID, LBTEST);
                    newTestResult.LBNRIND = $scope.bandIndicator;
                    newTestResult.LBDTC = $scope.LBDTC;
                    newTestResult.LBSPEC = "CSF";
                    newTestResult.displayLabel = "CSF";
                    newTestResult.displayDate = $scope.LBDTC.toDateString();

                    laboratoryTestResults.addResult(newTestResult);
                }
            }
        }
        laboratoryTestResults.printLabTestResults();
    }
});
