/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 25/02/2015
 * Time: 15:16
 * To change this template use File | Settings | File Templates.
 */

var laboratoryTestResultModule = angular.module('Optimise.laboratoryTestResult', ["ngTable"]);


laboratoryTestResultModule.directive('labEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/laboratoryTests.html'
    };
});


laboratoryTestResultModule.directive('evokedEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/evokedPotentials.html'
    };
});

laboratoryTestResultModule.factory('serologicalTestsVocab', function() {

    var assessmentScopeVariables = [
        {ISORRES: "hbvSurfaceAntigen", ISIND:"hbvPositive", ISTEST:"HBV Surface Antigen"},
        {ISORRES: 'hcv', ISIND: 'hcvPositive', ISTEST: "Anti-HCV Antibody"},
        {ISORRES: 'hiv', ISIND: 'hivPositive', ISTEST: "Anti-HIV Antibody"},
        {ISORRES: 'varicella', ISIND: 'varicellaPositive', ISTEST: "Anti-Varicella Antibody"},
        {ISORRES: 'jc', ISIND: 'jcPositive', ISTEST: "Plasma Anti-JC Virus"},
        {ISORRES: 'ifn', ISIND: 'ifnPositive', ISTEST: "Neutralising Anti-IFN Antibody"},
        {ISORRES: 'natalizumab', ISIND: 'natalizumabPositive', ISTEST: "Neutralising Anti-Natalizumab Antibody"},
        {ISORRES: 'nmo', ISIND: 'nmoPositive', ISTEST: "NMO IgG"},
        {ISORRES: 'ana', ISIND: 'anaPositive', ISTEST: "ANA"},
        {ISORRES: 'antiMitochondrial', ISIND: 'antiMitochondrialPositive', ISTEST: "Anti-Mitochondrial"},
        {ISORRES: 'antiParietalCellAntibodies', ISIND: 'antiParietalCellAntibodiesPositive', ISTEST: "Anti-Parietal Cell Antibodies"},
        {ISORRES: 'asma', ISIND: 'asmaPositive', ISTEST: "Anti-Smooth Muscle"},
        {ISORRES: 'antiRo', ISIND: 'antiRoPositive', ISTEST: "Anti-Ro"},
        {ISORRES: 'la', ISIND: 'laPositive', ISTEST: "LA"},
        {ISORRES: 'sm', ISIND: 'smPositive', ISTEST: "SM"},
        {ISORRES: 'rnp', ISIND: 'rnpPositive', ISTEST: "RNP"},
        {ISORRES: 'scl70', ISIND: 'scl70Positive', ISTEST: "Scl 70"},
        {ISORRES: 'jo1', ISIND: 'jo1Positive', ISTEST: "Jo1"},
        {ISORRES: 'anca', ISIND: 'ancaPositive', ISTEST: "ANCA"},
        {ISORRES: 'antiDNA', ISIND: 'antiDNAPositive', ISTEST: "Anti-DNA"},
        {ISORRES: 'antiLKM', ISIND: 'antiLKMPositive', ISTEST: "Anti-LKM"},
        {ISORRES: 'antiCardiolipin', ISIND: 'antiCardiolipinPositive', ISTEST: "Anti-Cardiolipin"},
        {ISORRES: 'lac', ISIND: 'lacPositive', ISTEST: "LUPUS Anti-coagulant"},
        {ISORRES: 'antiTransglutaminase', ISIND: 'antiTransglutaminasePositive', ISTEST: "Anti-Transglutaminase"},
        {ISORRES: 'mog', ISIND: 'mogPositive', ISTEST: "MOG"},
        {ISORRES: 'aqp4', ISIND: 'aqp4Positive', ISTEST: "AQP4"},
        {ISORRES: 'glyr', ISIND: 'glyrPositive', ISTEST: "Gly R"},
        {ISORRES: 'nmdar', ISIND: 'nmdarPositive', ISTEST: "NMDAR"},
        {ISORRES: 'hepA', ISIND: 'hepAPositive', ISTEST: "Hepatitis A"},
        {ISORRES: 'hepB', ISIND: 'hepBPositive', ISTEST: "Hepatitis B"},
        {ISORRES: 'hepC', ISIND: 'hepCPositive', ISTEST: "Hepatitis C"}];

    var assessment = {assessments:{
        "hbvSurfaceAntigen":"",
        "hcv":"",
        'hiv':"",
        'varicella':"",
        'jc':"",
        'ifn':"",
        'nmo':"",
        'ana':"",
        'antiMitochondrial':"",
        'antiParietalCellAntibodies':"",
        'asma':"",
        'antiRo':"",
        'la':"",
        'sm':"",
        'rnp':"",
        'scl70':"",
        'jo1':"",
        'anca':"",
        'antiDNA':"",
        'antiLKM':"",
        'antiCardiolipin':"",
        'lac':"",
        'antiTransglutaminase':"",
        'mog':"",
        'aqp4':"",
        'glyr':"",
        'nmdar':"",
        'hepA':"",
        'hepB':"",
        'hepC':""
    }};

    var assessmentIndicator = {indicators:{
        "hbvPositive":"",
        "hcvPositive":"",
        'hivPositive':"",
        'varicella':"",
        'varicellaPositive':"",
        'jcPositive':"",
        'ifnPositive':"",
        'anaPositive':"",
        'antiMitochondrialPositive':"",
        'antiParietalCellAntibodiesPositive':"",
        'asmaPositive':"",
        'antiRoPositive':"",
        'laPositive':"",
        'smPositive':"",
        'rnpPositive':"",
        'scl70Positive':"",
        'jo1Positive':"",
        'ancaPositive':"",
        'antiDNAPositive':"",
        'antiLKMPositive':"",
        'antiCardiolipinPositive':"",
        'lacPositive':"",
        'antiTransglutaminasePositive':"",
        'mogPositive': "",
        'aqp4Positive': "",
        'glyrPositive': "",
        'nmdarPositive':"",
        'hepAPositive':"",
        'hepBPositive':"",
        'hepCPositive':""
    }};

    var tests = {scopeVariables: assessmentScopeVariables, assessments: assessment, indicators: assessmentIndicator};

    tests.getAssessmentScopeName = function (ISTEST) {
        for (var n = 0; n < assessmentScopeVariables.length; n++) {
            if (ISTEST==assessmentScopeVariables[n].ISTEST) {
                return assessmentScopeVariables[n];
            }
        }
        return null;
    }
    return tests;
});

laboratoryTestResultModule.factory('thyroidVocab', function() {

    var test = {tests: {
        't3':"",
        't4':"",
        'antiThyroidPeroxidase':"",
        'antiThyroglobulinAbnormal':""}}

    var testsScopeVariables = [
        {LBORRES: 't3', LBNRIND: 't3Abnormal', LBTEST: "T3"},
        {LBORRES: 't4', LBNRIND: 't4Abnormal', LBTEST: "Free T4"},
        {LBORRES: 'tsh', LBNRIND: 'tshAbnormal', LBTEST: "TSH"},
        {LBORRES: 'antiTyroidPeroxidase', LBNRIND: 'antiThyroidPeroxidaseAbnormal', LBTEST: "Anti-Thyroid Peroxidase"},
        {LBORRES: 'antiThyroglobulin', LBNRIND: 'antiThyroglobulinAbnormal', LBTEST: "Anti-Thyroglobulin"}];

    var testIndicator = {indicators:{
        't3Abnormal':"",
        't4Abnormal':"",
        'tshAbnormal':"",
        'antiThyroidPeroxidaseAbnormal':'',
        'antiThyroglobulinAbnormal':''}};

    var vocab = {scopeVariables: testsScopeVariables, tests: test, indicators: testIndicator};

    vocab.getLabTestScopeName = function (LBTEST) {
        for (var n = 0; n < testsScopeVariables.length; n++) {
            if (LBTEST==testsScopeVariables[n].LBTEST) {
                return testsScopeVariables[n];
            }
        }
        return null;
    }
    return vocab;
});

laboratoryTestResultModule.factory('bloodChemVocab', function() {

    var test = {tests: {
        'totalProtein':"",
        'albumin':"",
        'calcium':"",
        'urea':"",
        'uricAcid':"",
        'creatinine':"",
        'sgotAst':"",
        'sgptAlt':"",
        'gammaGT':"",
        'bilirubin':"",
        'alkalinePhosphatase':"",
        'amylase':"",
        'lipase':"",
        'vitD':"",
        'tpmt':""}};

    var testsScopeVariables = [
        {LBORRES: 'totalProtein', LBNRIND: 'totalProteinAbnormal', LBTEST: "Total Protein"},
        {LBORRES: 'albumin', LBNRIND: 'albuminAbnormal', LBTEST: "Albumin"},
        {LBORRES: 'calcium', LBNRIND: 'calciumAbnormal', LBTEST: "Calcium"},
        {LBORRES: 'urea', LBNRIND: 'ureaAbnormal', LBTEST: "Urea"},
        {LBORRES: 'uricAcid', LBNRIND: 'uricAcidAbnormal', LBTEST: "Uric Acid"},
        {LBORRES: 'creatinine', LBNRIND: 'creatinineAbnormal', LBTEST: "Creatinine"},
        {LBORRES: 'sgotAst', LBNRIND: 'sgotAstAbnormal', LBTEST: "SGOT/ AST"},
        {LBORRES: 'sgptAlt', LBNRIND: 'sgptAltAbnormal', LBTEST: "SGPT/ ALT"},
        {LBORRES: 'gammaGT', LBNRIND: 'gammaGTAbnormal', LBTEST: "Gamma-GT"},
        {LBORRES: 'bilirubin', LBNRIND: 'bilirubinAbnormal', LBTEST: "Bilirubin"},
        {LBORRES: 'alkalinePhosphatase', LBNRIND: 'alkalinePhosphataseAbnormal', LBTEST: "Alkaline Phosphatase"},
        {LBORRES: 'amylase', LBNRIND: 'amylaseAbnormal', LBTEST: "Amylase"},
        {LBORRES: 'lipase', LBNRIND: 'lipaseAbnormal', LBTEST: "Lipase"},
        {LBORRES: 'vitD', LBNRIND: 'vitDAbnormal', LBTEST: "Vit D"},
        {LBORRES: 'tpmt', LBNRIND: 'tpmtAbnormal', LBTEST: "Thiopurine methyltransferase"}];

    var testIndicator = {indicators:{
        'totalProteinAbnormal':"",
        'albuminAbnormal':"",
        'calciumAbnormal':"",
        'ureaAbnormal':"",
        'uricAcidAbnormal':"",
        'creatinineAbnormal':"",
        'sgotAstAbnormal':"",
        'sgptAltAbnormal':"",
        'gammaGTAbnormal':"",
        'bilirubinAbnormal':"",
        'alkalinePhosphataseAbnormal':"",
        'amylaseAbnormal':"",
        'lipaseAbnormal':"",
        'vitDAbnormal':"",
        'tpmtAbnormal':""}};

    var vocab = {scopeVariables: testsScopeVariables, tests: test, indicators: testIndicator};

    vocab.getLabTestScopeName = function (LBTEST) {
        for (var n = 0; n < testsScopeVariables.length; n++) {
            if (LBTEST==testsScopeVariables[n].LBTEST) {
                return testsScopeVariables[n];
            }
        }
        return null;
    }
    return vocab;
});

laboratoryTestResultModule.factory('haematologyVocab', function() {

    var test = {tests: {
        'whiteCellCount':"",
        'redCellCount':"",
        'lymphocyteCount':"",
        'tCellCount':"",
        'cd4tCellCount':"",
        'cd8tCellCount':"",
        'cd19bCellCount':"",
        'nkCellCount':"",
        'neutrophilCount':"",
        'monocyteCount':"",
        'eosinophilCount':"",
        'basophilCount':"",
        'plateletCount':"",
        'haemoglobinCount':""}}

    var testsScopeVariables = [
        {LBORRES: 'whiteCellCount', LBNRIND: 'whiteCellCountAbnormal', LBTEST: "White Cell Count"},
        {LBORRES: 'redCellCount', LBNRIND: 'redCellCountAbnormal', LBTEST: "Red Cell Count"},
        {LBORRES: 'lymphocyteCount', LBNRIND: 'lymphocyteCountAbnormal', LBTEST: "Lymphocyte Count"},
        {LBORRES: 'tCellCount', LBNRIND: 'tCellCountAbnormal', LBTEST: "T Cell Count"},
        {LBORRES: 'cd4tCellCount', LBNRIND: 'cd4tCellCountAbnormal', LBTEST: "CD4 T Cell Count"},
        {LBORRES: 'cd8tCellCount', LBNRIND: 'cd8tCellCountAbnormal', LBTEST: "CD8 T Cell Count"},
        {LBORRES: 'cd19bCellCount', LBNRIND: 'cd19bCellCountAbnormal', LBTEST: "CD19 B Cell Count"},
        {LBORRES: 'nkCellCount', LBNRIND: 'nkCellCountAbnormal', LBTEST: "NK Cell Count"},
        {LBORRES: 'neutrophilCount', LBNRIND: 'neutrophilCountAbnormal', LBTEST: "Neutrophil Count"},
        {LBORRES: 'monocyteCount', LBNRIND: 'monocyteCountAbnormal', LBTEST: "Monocyte Count"},
        {LBORRES: 'eosinophilCount', LBNRIND: 'eosinophilCountAbnormal', LBTEST: "Eosinophil Count"},
        {LBORRES: 'basophilCount', LBNRIND: 'basophilCountAbnormal', LBTEST: "Basophil Count"},
        {LBORRES: 'plateletCount', LBNRIND: 'plateletCountAbnormal', LBTEST: "Platelet Count"},
        {LBORRES: 'haemoglobinCount', LBNRIND: 'haemoglobinCountAbnormal', LBTEST: "Haemoglobin"}];

    var testIndicator = {indicators:{
        'whiteCellCountAbnormal':"",
        'redCellCountAbnormal':'',
        'lymphocyteCountAbnormal':"",
        'tCellCountAbnormal':"",
        'cd4tCellCountAbnormal':"",
        'cd8tCellCountAbnormal':"",
        'cd19bCellCountAbnormal':"",
        'nkCellCountAbnormal':"",
        'neutrophilCountAbnormal':"",
        'monocyteCountAbnormal':"",
        'eosinophilCountAbnormal':"",
        'basophilCountAbnormal':"",
        'plateletCountAbnormal':"",
        'haemoglobinCountAbnormal':""}};

    var vocab = {scopeVariables: testsScopeVariables, tests: test, indicators: testIndicator};

    vocab.getLabTestScopeName = function (LBTEST) {
        for (var n = 0; n < testsScopeVariables.length; n++) {
            if (LBTEST==testsScopeVariables[n].LBTEST) {
                return testsScopeVariables[n];
            }
        }
        return null;
    }

    return vocab;
});

laboratoryTestResultModule.factory('LaboratoryTestResult', function() {
    return function(USUBJID, LBTEST) {
        var testResult = {
            STUDYID :"OPTIMISE",
            DOMAIN :"LB",
            USUBJID :USUBJID,
            LBSEQ : 0,
            LBREFID :"",    //Specimen ID
            LBTESTCD :"",   //Lab Test Short Name
            LBTEST :LBTEST,     //Lab Test or Examination Name
            LBCAT :"",      //HEMATOLOGY, URINALYSIS, CHEMISTRY.
            LBORRES :"",//Result or Finding in Original Units
            LBORRESU :"", //Original Units
            LBORNRLO :"",//Reference Range Lower Limit in Orig Unit
            LBORNRHI :"",//Reference Range Upper Limit in Orig Unit
            LBSTRESC :"",//Character Result/Finding in Std Format
            LBSTRESN :"",//Numeric Result/Finding in Standard Units
            LBSTRESU :"",//Standard Units
            LBSTNRLO :"",
            LBSTNRHI :"",
            LBNRIND :"",//Reference Range Indicator
            LBSPEC :"",//Specimen Type
            LBBLFL :"Y",//Baseline Flag
            LBFAST :"",//Fasting status
            //VISITNUM :"",//Visit Number
            VISIT :"",//Visit Name
            VISITDY :"",//Planned Study Day of Visit
            LBDTC :"",//Date/Time of Specimen Collection
            LBDY :"",//Study Day of Specimen Collection
            displayDate:'',
            displayLabel:''
        }
        return testResult;
    }
})

laboratoryTestResultModule.service('laboratoryTestResults', function(LaboratoryTestResult, records, viewService){
    var labTestResults = [];

    var deleteLabTestResults = function() {
        labTestResults = [];
    }
    var currentCollectionDate = new Date();

    var getLabTestResults = function() {
        return labTestResults;
    }

    var printLabTestResults = function () {
        console.log(labTestResults);
    }

    var createNewLabTestResult = function(RecordItems) {
        var newTestResult = new LaboratoryTestResult();
        for (var i = 0; i < RecordItems.length; i++){

            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    newTestResult.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    newTestResult.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    newTestResult.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'LBSEQ':{
                    newTestResult.LBSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'LBREFID':{
                    newTestResult.LBREFID = RecordItems[i].value;
                    break;
                }
                case 'LBTESTCD':{
                    newTestResult.LBTESTCD = RecordItems[i].value;
                    break;
                }
                case 'LBTEST':{
                    newTestResult.LBTEST = RecordItems[i].value;
                    break;
                }
                case 'LBCAT':{
                    newTestResult.LBCAT = RecordItems[i].value;
                    break;
                }
                case 'LBORRES':{
                    newTestResult.LBORRES = RecordItems[i].value;
                    break;
                }
                case 'LBSTRESU':{
                    newTestResult.LBSTRESU = RecordItems[i].value;
                    break;
                }
                case 'LBSTNRLO':{
                    newTestResult.LBSTNRLO = RecordItems[i].value;
                    break;
                }
                case 'LBSTNRHI':{
                    newTestResult.LBSTNRHI = RecordItems[i].value;
                    break;
                }
                case 'LBNRIND':{
                    newTestResult.LBNRIND = RecordItems[i].value;
                    break;
                }
                case 'LBSPEC':{
                    newTestResult.LBSPEC = RecordItems[i].value;
                    break;
                }
                case 'LBBLFL':{
                    newTestResult.LBBLFL = RecordItems[i].value;
                    break;
                }
                case 'LBFAST':{
                    newTestResult.LBFAST = RecordItems[i].value;
                    break;
                }
//                case 'VISITNUM':{
//                    newTestResult.VISITNUM = RecordItems[i].value;
//                    break;
//                }
                case 'VISIT':{
                    newTestResult.VISIT = RecordItems[i].value;
                    break;
                }
                case 'LBDTC':{
                    newTestResult.LBDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'displayLabel':{
                    newTestResult.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    newTestResult.displayDate= RecordItems[i].value;
                    break;
                }
            }
        }
        return newTestResult;
    }

    var populateLabTestResults = function (RecordItems) {
        labTestResults.push(createNewLabTestResult(RecordItems));
    }

    var generateSEQ = function () {
        var SEQs = compileResults();
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

    var compileResults = function () {
        var seq = [];
        for (var e = 0; e < labTestResults.length; e++) {
            seq.push(labTestResults[e].LBSEQ);
        }
        return seq;
    }

    var addResult = function (result){
        result.LBSEQ = generateSEQ();
        labTestResults.push(result);
        if (!viewService.workOffline())
            records.saveRecord(result);
    }

    var editResult = function (res, recordToChange, valueToChange){
        var USUBJID = {fieldName: "USUBJID", value: res.USUBJID};
        var LBSEQ = {fieldName:"LBSEQ", value: res.LBSEQ};

        var RECTOCHANGE = {fieldName:recordToChange, value: valueToChange};
        var idRecord = [USUBJID, LBSEQ];
        var valueRecord = [RECTOCHANGE];
        if (!viewService.workOffline())
            records.editRecord(idRecord, valueRecord);
    }

    var deleteResult = function (result){
        var index = labTestResults.indexOf(result);
        if (index > -1) {
            labTestResults.splice(index, 1);
            if (!viewService.workOffline())
                records.deleteRecord(result);
        }
    }

    var getTestResult = function(LBTEST,LBDTC) {
        var dateCriteria = LBDTC.toDateString();
        for (var t = 0; t < labTestResults.length; t++){
            if (dateCriteria==labTestResults[t].LBDTC.toDateString()){
                if (LBTEST==labTestResults[t].LBTEST) {
                    return labTestResults[t];
                }
            }
        }
        return null;
    }

    var getTestResultByDate = function (LBDTC) {
        var testsOnDate = [];
        var dateCriteria = LBDTC.toDateString();
        for (var t = 0; t < labTestResults.length; t++){
            if (dateCriteria==labTestResults[t].LBDTC.toDateString()){
                testsOnDate.push(labTestResults[t]);
            }
        }
        return testsOnDate;
    };

    var getTestResultBySpecAndDate = function (LBDTC, LBSPEC) {
        var testsOnDate = [];
        var dateCriteria = LBDTC.toDateString();
        for (var t = 0; t < labTestResults.length; t++){
            if ((dateCriteria==labTestResults[t].LBDTC.toDateString())
                &&(labTestResults[t].LBSPEC == LBSPEC)){
                testsOnDate.push(labTestResults[t]);
            }
        }
        return testsOnDate;
    };

    var getUniqueDates = function () {
        var uniqueDates = [];
        for (var d = 0; d < labTestResults.length; d++){   // select events that happened on different days
            if (!dateExists(uniqueDates, labTestResults[d].LBDTC.toDateString())){
                if (labTestResults[d].LBSPEC != 'CSF')
                    uniqueDates.push(labTestResults[d]);
            }
        }
        return uniqueDates;
    }

    var getUniqueDatesGivenList = function (labTestList) {
        var uniqueDates = [];
        for (var d = 0; d < labTestList.length; d++){   // select events that happened on different days
            if (!dateExists(uniqueDates, labTestList[d].LBDTC.toDateString())){
                if (labTestList[d].LBSPEC != 'CSF')
                    uniqueDates.push(labTestList[d]);
            }
        }
        return uniqueDates;
    }

    var dateExists = function (uniqueDates, LBDTC){
        for (var d = 0; d < uniqueDates.length; d++) {
            if (uniqueDates[d].LBDTC.toDateString() == LBDTC) {
                return true;
            }
        }
        return false;
    }

    var setCurrentCollectionDate = function(event) {
        if (event.DOMAIN=='IS') {
            currentCollectionDate = event.ISDTC;
        }
        else if (event.DOMAIN=='LB'){
            currentCollectionDate = event.LBDTC;
        }
        else  {
            currentCollectionDate = event.NVDTC;
        }
    }

    var getResultsOfCurrentDate = function() {
        return getTestResultByDate(currentCollectionDate);
    }

    return {
        printLabTestResults:printLabTestResults,
        //populateManual: populateManual,
        populateLabTestResults: populateLabTestResults,
        getTestResult:getTestResult,
        deleteResult:deleteResult,
        addResult:addResult,
        getUniqueDates: getUniqueDates,
        setCurrentCollectionDate: setCurrentCollectionDate,
        //clearCurrentCollectionDate:clearCurrentCollectionDate,
        getResultsOfCurrentDate: getResultsOfCurrentDate,
        getTestResultByDate:getTestResultByDate,
        getLabTestResults: getLabTestResults,
        editResult:editResult,
        deleteLabTestResults: deleteLabTestResults,
        getTestResultBySpecAndDate: getTestResultBySpecAndDate,
        createNewLabTestResult: createNewLabTestResult,
        getUniqueDatesGivenList: getUniqueDatesGivenList
    };
});

laboratoryTestResultModule.controller('laboratoryInfoCtrl', function($scope, $rootScope, $filter, NgTableParams,
                                                                     $parse, $uibModal,
                                                                     laboratoryTestResults, LaboratoryTestResult,
                                                                     viewService,
                                                                     immunogenicitySpecimenAssessments, ImmunogenicitySpecimenAssessment,
                                                                    nervousSystemFindings, NervousSystemFinding,
                                                                    morphologyServices, Morphology, procedures, procedure,
                                                                    serologicalTestsVocab, thyroidVocab,
                                                                    bloodChemVocab, haematologyVocab) {

    $scope.USUBJID = '';
    $rootScope.setLabUSUBJID = function(USUBJID) {
        $scope.USUBJID = USUBJID;
    }

    $scope.testIndex = "";


    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Test') {
            return true;
        }
        else
            return false;
    };

    $scope.getDisabledFields = function() {
        return viewService.getView().DisableInputFields;
    }


    $rootScope.setNewResultFields = function() {
        clearFields();
    };

    $rootScope.setTestIndex = function(testIndex) {
        $scope.testIndex = testIndex;
    }

    $rootScope.getTestIndex = function() {
        return $scope.testIndex;
    }

    $scope.assessmentScopeVariables = serologicalTestsVocab.scopeVariables;
    $scope.assessment = {assessments: serologicalTestsVocab.assessments};
    $scope.assessmentIndicator = {indicators: serologicalTestsVocab.indicators};

    $scope.haematologyScopeVariables = haematologyVocab.scopeVariables;
    $scope.haematology = {tests: haematologyVocab.tests};
    $scope.haematologyIndicator = {indicators: haematologyVocab.indicators};

    $scope.bloodChemScopeVariables = bloodChemVocab.scopeVariables;
    $scope.bloodChem = {tests: bloodChemVocab.tests};
    $scope.bloodChemIndicator = {indicators: bloodChemVocab.indicators};

    $scope.thyroidScopeVariables = thyroidVocab.scopeVariables;
    $scope.thyroid = {tests: thyroidVocab.tests};
    $scope.thyroidIndicator = {indicators: thyroidVocab.indicators};

    var getVEPScopeName= function(NVTEST, NVLAT) {
        var vepKeys = [{scopeVariable: 'vepLeftAmplitude', testName: "P100 Amplitude", laterality:"Left"},
            {scopeVariable: 'vepRightAmplitude', testName: "P100 Amplitude", laterality:"Right"},
            {scopeVariable: 'vepLeftLatency', testName: "P100 Latency", laterality:"Left"},
            {scopeVariable: 'vepRightLatency', testName: "P100 Latency", laterality:"Right"},
            {scopeVariable: 'vepLeftAbnormal', testName: "Intepretation", laterality:"Left"},
            {scopeVariable: 'vepRightAbnormal', testName: "Intepretation", laterality:"Right"}];

        for (var n = 0; n < vepKeys.length; n++) {
            if ((NVTEST==vepKeys[n].testName)&&(NVLAT==vepKeys[n].laterality)) {
                return vepKeys[n];
            }
        }
        return null;
    }

    var getSEPScopeName= function(NVTEST, NVLAT, NVLOC) {
        var sepKeys = [{scopeVariable: 'SEPLeftUpperAbnormal', laterality:"Left", location:"Upper"},
            {scopeVariable: 'SEPLeftLowerAbnormal', laterality:"Left", location:"Lower"},
            {scopeVariable: 'SEPRightUpperAbnormal', laterality:"Right", location:"Upper"},
            {scopeVariable: 'SEPRightLowerAbnormal', laterality:"Right", location:"Lower"}];

        for (var n = 0; n < sepKeys.length; n++) {
            if ((NVTEST=="SEP")
                &&(NVLAT==sepKeys[n].laterality)
                &&(NVLOC==sepKeys[n].location)) {
                return sepKeys[n];
            }
        }
        return null;
    }

    $rootScope.displayResults = function(DOMAIN) {
        clearFields();
        if (DOMAIN == 'PR') {
            if ($scope.testIndex == "Magnetic Resonance Imaging")
                $rootScope.displayMRI();

            else if ($scope.testIndex == "Cerebrospinal Fluid")
                $rootScope.displayCSF();

            $scope.LBDTC = procedures.getCurrentProcedure().PRSTDTC;
            $scope.displayDate = procedures.getCurrentProcedure().displayDate;
            //$scope.LBDTC_displayDate = $scope.LBDTC.getDate()+"/"+(parseInt($scope.LBDTC.getMonth()+1))+"/"+$scope.LBDTC.getFullYear();// set date
        }
        else
        {
            var resultsOfDTC = laboratoryTestResults.getResultsOfCurrentDate();
            if (resultsOfDTC.length > 0)
            {
                $scope.LBDTC = resultsOfDTC[0].LBDTC;
                $scope.displayDate = resultsOfDTC[0].displayDate;
                //$scope.LBDTC_displayDate = $scope.LBDTC.getDate()+"/"+(parseInt($scope.LBDTC.getMonth()+1))+"/"+$scope.LBDTC.getFullYear();// set date
                for (var r = 0; r < resultsOfDTC.length; r++){
                    var scopeVariables = haematologyVocab.getLabTestScopeName(resultsOfDTC[r].LBTEST);
                    if (scopeVariables != null) {
                        $scope.haematology.tests[scopeVariables.LBORRES] = resultsOfDTC[r].LBORRES;
                        $scope.haematologyIndicator.indicators[scopeVariables.LBNRIND] = resultsOfDTC[r].LBNRIND;
                    }

                    scopeVariables = bloodChemVocab.getLabTestScopeName(resultsOfDTC[r].LBTEST);
                    if (scopeVariables != null) {
                        $scope.bloodChem.tests[scopeVariables.LBORRES] = resultsOfDTC[r].LBORRES;
                        $scope.bloodChemIndicator.indicators[scopeVariables.LBNRIND] = resultsOfDTC[r].LBNRIND;
                    }

                    scopeVariables = thyroidVocab.getLabTestScopeName(resultsOfDTC[r].LBTEST);
                    if (scopeVariables != null) {
                        $scope.thyroid.tests[scopeVariables.LBORRES] = resultsOfDTC[r].LBORRES;
                        $scope.thyroidIndicator.indicators[scopeVariables.LBNRIND] = resultsOfDTC[r].LBNRIND;
                    }
                }
            }

            var assessmentOfDTC = immunogenicitySpecimenAssessments.getAssessmentsOfCurrentDate();
            if (assessmentOfDTC.length > 0)
            {
                $scope.LBDTC = assessmentOfDTC[0].ISDTC;
                $scope.displayDate = assessmentOfDTC[0].displayDate;
                //$scope.LBDTC_displayDate = $scope.LBDTC.getDate()+"/"+(parseInt($scope.LBDTC.getMonth()+1))+"/"+$scope.LBDTC.getFullYear();// set date

                for (var r = 0; r < assessmentOfDTC.length; r++){
                    var scopeVariables = serologicalTestsVocab.getAssessmentScopeName(assessmentOfDTC[r].ISTEST);

                    if (scopeVariables!=null){
                        $scope.assessment.assessments[scopeVariables.ISORRES] = assessmentOfDTC[r].ISORRES;
                        $scope.assessmentIndicator.indicators[scopeVariables.ISIND] = assessmentOfDTC[r].ISIND;
                    }
                }
            }

            var nsFindingsOfDTC = nervousSystemFindings.getFindingsOfCurrentDate();
            if (nsFindingsOfDTC.length > 0)
            {
                $scope.LBDTC = nsFindingsOfDTC[0].NVDTC;
                $scope.displayDate = nsFindingsOfDTC[0].displayDate;

                for (var r = 0; r < nsFindingsOfDTC.length; r++){
                    if (nsFindingsOfDTC[r].NVLOC == ""){
                        //console.log(nsFindingsOfDTC[r]);
                        var scopeVariables = getVEPScopeName(nsFindingsOfDTC[r].NVTEST, nsFindingsOfDTC[r].NVLAT);
                        if (scopeVariables != null) {
                            var modelTestValue = $parse(scopeVariables.scopeVariable);
                            modelTestValue.assign($scope, nsFindingsOfDTC[r].NVORRES);
                        }
                    }
                    else {
                        scopeVariables = getSEPScopeName(nsFindingsOfDTC[r].NVTEST, nsFindingsOfDTC[r].NVLAT, nsFindingsOfDTC[r].NVLOC);
                        if (scopeVariables != null) {
                            var modelTestValue = $parse(scopeVariables.scopeVariable);
                            modelTestValue.assign($scope, nsFindingsOfDTC[r].NVORRES);
                        }
                    }
                }
            }
        }

    }

    $scope.getDisabledFields = function() {
        return viewService.getView().DisableInputFields;
    }

    var clearFields = function() {
        $scope.LBDTC = '';
        //$scope.LBDTC_displayDate = '';
        $scope.displayDate = '';

        for (var k = 0; k < $scope.haematologyScopeVariables.length; k++){
            $scope.haematology.tests[$scope.haematologyScopeVariables[k].LBORRES] = "";
            $scope.haematologyIndicator.indicators[$scope.haematologyScopeVariables[k].LBNRIND] = "";
        }

        for (var k = 0; k < $scope.assessmentScopeVariables.length; k++){
            $scope.assessment.assessments[$scope.assessmentScopeVariables[k].ISORRES] = "";
            $scope.assessmentIndicator.indicators[$scope.assessmentScopeVariables[k].ISIND] = "";
        }

        for (var k = 0; k < $scope.bloodChemScopeVariables.length; k++){
            $scope.bloodChem.tests[$scope.bloodChemScopeVariables[k].LBORRES] = "";
            $scope.bloodChemIndicator.indicators[$scope.bloodChemScopeVariables[k].LBNRIND] = "";
        }

        for (var k = 0; k < $scope.thyroidScopeVariables.length; k++){
            $scope.thyroid.tests[$scope.thyroidScopeVariables[k].LBORRES] = "";
            $scope.thyroidIndicator.indicators[$scope.thyroidScopeVariables[k].LBNRIND] = "";
        }

        var vepKeys = [{scopeVariable: 'vepLeftAmplitude'},
                        {scopeVariable: 'vepRightAmplitude'},
                        {scopeVariable: 'vepLeftLatency'},
                        {scopeVariable: 'vepRightLatency'},
                        {scopeVariable: 'vepLeftAbnormal'},
                        {scopeVariable: 'vepRightAbnormal'},
            {scopeVariable: 'SEPLeftUpperAbnormal'},
            {scopeVariable: 'SEPLeftLowerAbnormal'},
            {scopeVariable: 'SEPRightUpperAbnormal'},
            {scopeVariable: 'SEPRightLowerAbnormal'}];

        for (var k = 0; k < vepKeys.length; k++){
            // Get the model
            var modelValue = $parse(vepKeys[k].scopeVariable);
            // Assigns a value to vepKeys
            modelValue.assign($scope, '');
        }

        $scope.setNewMRIFields();

    }

    $rootScope.setNewLabDate = function (display, LBDTC) {
        $scope.LBDTC = LBDTC;
        //$scope.LBDTC = new Date(LBDTC.substr(6), parseInt(LBDTC.substr(3,2))-1, LBDTC.substr(0,2));
        $scope.displayDate = display;

        console.log($scope.testIndex);
        if ($scope.testIndex=='Magnetic Resonance Imaging') {
            if (procedures.getProcedureByTRTAndDate('MRI',  $scope.LBDTC).length == 0){
                var aProcedure = new procedure($scope.USUBJID, 'MRI');
                aProcedure.PRLOC = 'Head';
                aProcedure.PRSTDTC = $scope.LBDTC;
                aProcedure.displayLabel = 'MRI';
                aProcedure.displayDate = $scope.LBDTC.toDateString();
                //aProcedure.XNATExperimentID = experiments[e].id;
                //aProcedure.XNATExperimentURI = experiments[e].uri;

                //procedures.push(aProcedure);
                procedures.addProcedure(aProcedure);
                procedures.setCurrentProcedure(aProcedure);
                $scope.setNewMRIDTC(display, $scope.LBDTC);
            }
        }
    }

    $scope.showThisPanel = function(term) {
        return viewService.getConfigurationSetting(term);
    }

    $scope.saveAssessmentResult = function(ISTEST, ISORRES) {
        var collectionDate = $scope.LBDTC;
        var anAssessmentResult = immunogenicitySpecimenAssessments.getAssessmentResult(ISTEST, collectionDate);
        if (anAssessmentResult!=null) {
            if (ISORRES=="") {
                immunogenicitySpecimenAssessments.deleteResult(anAssessmentResult);
            }
            else {
                anAssessmentResult.ISORRES = ISORRES;
                immunogenicitySpecimenAssessments.editResult(anAssessmentResult,'ISORRES', anAssessmentResult.ISORRES);
            }
        }
        else {
            if (ISORRES!=""){
                var newAssessmentResult = new ImmunogenicitySpecimenAssessment($scope.USUBJID, ISTEST);
                newAssessmentResult.ISDTC = collectionDate;
                newAssessmentResult.ISORRES = ISORRES;
                newAssessmentResult.displayLabel = $scope.testIndex;
                //newAssessmentResult.displayDate = collectionDate.toDateString();
                newAssessmentResult.displayDate = $scope.displayDate;
                newAssessmentResult.displayLabel = "Lab Tests";
                immunogenicitySpecimenAssessments.addResult(newAssessmentResult);
            }
        }
    };

    $scope.saveAssessmentIndicator = function(ISTEST, ISIND) {
        var collectionDate = $scope.LBDTC;
        var anAssessment = immunogenicitySpecimenAssessments.getAssessmentResult(ISTEST, collectionDate);

        if (anAssessment!=null) {
            anAssessment.ISIND = ISIND;
            immunogenicitySpecimenAssessments.editResult(anAssessment,'ISIND', anAssessment.ISIND);
        }
        else {
            var newAssessmentResult = new ImmunogenicitySpecimenAssessment($scope.USUBJID, ISTEST);
            newAssessmentResult.ISIND = ISIND;
            newAssessmentResult.ISDTC = collectionDate;
            newAssessmentResult.displayLabel = $scope.testIndex;
//            newAssessmentResult.displayDate = collectionDate.toDateString();
            newAssessmentResult.displayDate = $scope.displayDate;
            newAssessmentResult.displayLabel = "Lab Tests";

            immunogenicitySpecimenAssessments.addResult(newAssessmentResult);
        }
    };

    $scope.saveResultIndicator = function(LBTEST, LBNRIND) {
        var collectionDate = $scope.LBDTC;
        var aTestResult = laboratoryTestResults.getTestResult(LBTEST, collectionDate);

        if (aTestResult!=null) {
            aTestResult.LBNRIND = LBNRIND;
            laboratoryTestResults.editResult(aTestResult,'LBNRIND',aTestResult.LBNRIND);
        }
        else {
            var newTestResult = new LaboratoryTestResult($scope.USUBJID,LBTEST);
            newTestResult.LBNRIND = LBNRIND;
            newTestResult.LBDTC = collectionDate;
            newTestResult.displayLabel = $scope.testIndex;
//            newTestResult.displayDate = collectionDate.toDateString();
            newTestResult.displayLabel = "Lab Tests";
            newTestResult.displayDate = $scope.displayDate;
            laboratoryTestResults.addResult(newTestResult);
        }
    };

    $scope.saveLabResult = function(LBTEST, LBORRES){
        var collectionDate = $scope.LBDTC;
        var aTestResult = laboratoryTestResults.getTestResult(LBTEST, collectionDate);
        if (aTestResult!=null) {
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
                newTestResult.LBDTC = collectionDate;
//                newTestResult.displayLabel = $scope.testIndex;
//                newTestResult.displayDate = collectionDate.toDateString();
                newTestResult.displayLabel = "Lab Tests";
                newTestResult.displayDate = $scope.displayDate;
                laboratoryTestResults.addResult(newTestResult);
            }
        }
    }

    var getVEPScopeVariable = function(NVTEST, NVLAT) {
        var vepFindingNames = [{scopeVariable: $scope.vepLeftAmplitude, testName: "P100 Amplitude", laterality:"Left"},
            {scopeVariable: $scope.vepRightAmplitude, testName: "P100 Amplitude", laterality:"Right"},
            {scopeVariable: $scope.vepLeftLatency, testName: "P100 Latency", laterality:"Left"},
            {scopeVariable: $scope.vepRightLatency, testName: "P100 Latency", laterality:"Right"},
            {scopeVariable: $scope.vepLeftAbnormal, testName: "Intepretation", laterality:"Left"},
            {scopeVariable: $scope.vepRightAbnormal, testName: "Intepretation", laterality:"Right"}];

        for (var t = 0; t < vepFindingNames.length; t++)
        {
            if ((NVTEST == vepFindingNames[t].testName)
                &&(NVLAT==vepFindingNames[t].laterality)) {
                return vepFindingNames[t];
            }
        }
        return null;

    }

    $scope.saveVEPFinding = function(NVTEST, NVLAT) {
        var collectionDate = $scope.LBDTC;
        var scopeVariable = getVEPScopeVariable(NVTEST, NVLAT).scopeVariable;
        var aFinding = nervousSystemFindings.getVEPFinding(NVTEST, NVLAT, collectionDate);
        if (aFinding!=null) {
            if (scopeVariable=="") {
                nervousSystemFindings.deleteFinding(aFinding);
            }
            else {
                aFinding.NVORRES = scopeVariable;
                nervousSystemFindings.edit
            }
        }
        else {
            if (scopeVariable!=""){
                var newFinding = new NervousSystemFinding($scope.USUBJID, NVTEST);
                newFinding.NVORRES = scopeVariable;
                newFinding.NVDTC = collectionDate;
                newFinding.NVLAT = NVLAT;
                newFinding.displayLabel = 'Evoked Potential';
                newFinding.NVCAT = "Evoked Potential";
//                newFinding.displayDate = collectionDate.toDateString();
                newFinding.displayDate = $scope.displayDate;

                nervousSystemFindings.addFinding(newFinding);
            }
        }
    }

    $scope.saveSEPFinding = function(NVTEST, NVLAT, NVLOC, NVORRES) {
        var collectionDate = $scope.LBDTC;
        var aFinding = nervousSystemFindings.getSEPFinding(NVTEST, NVLAT, collectionDate, NVLOC);
        //console.log(aFinding);
        if (aFinding!=null) {
            aFinding.NVORRES = NVORRES;
            nervousSystemFindings.editFinding(aFinding, NVORRES);
        }
        else {

            var newFinding = new NervousSystemFinding($scope.USUBJID, NVTEST);
            newFinding.NVORRES = NVORRES;
            newFinding.NVDTC = collectionDate;
            newFinding.NVLAT = NVLAT;
            newFinding.NVLOC = NVLOC;
            newFinding.NVCAT = "Evoked Potential";
            newFinding.displayLabel = 'Evoked Potential';
            newFinding.displayDate = $scope.displayDate;

            nervousSystemFindings.addFinding(newFinding);
        }
        nervousSystemFindings.printNSFindings();
    }
});


laboratoryTestResultModule.directive('laboratoryEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/laboratory.html'
    };
});

laboratoryTestResultModule.directive('haematologyEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/haematology.html'
    };
});

laboratoryTestResultModule.controller('haematologyCtrl', function($scope, haematologyVocab, NgTableParams) {
    var data = haematologyVocab.scopeVariables;
    $scope.tableParams = new NgTableParams({count: 50}, { dataset: data});
});


laboratoryTestResultModule.directive('bloodEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/bloodChemistry.html'
    };
});

laboratoryTestResultModule.controller('bloodChemistryCtrl', function($scope, bloodChemVocab, NgTableParams) {
    var data = bloodChemVocab.scopeVariables;
    $scope.tableParams = new NgTableParams({count: 50}, { dataset: data});
});

laboratoryTestResultModule.directive('serologicalEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/laboratory/serological.html'
    };
});

laboratoryTestResultModule.controller('serologicalCtrl', function($scope, serologicalTestsVocab, NgTableParams) {
    var data = serologicalTestsVocab.scopeVariables;
    $scope.tableParams = new NgTableParams({ count: 50 }, { dataset: data});
});
