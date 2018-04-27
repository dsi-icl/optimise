/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:20
 * To change this template use File | Settings | File Templates.
 */

var patientModule = angular.module('Optimise.patient',[]);


patientModule.factory('Patient',function() {
    return function(USUBJID) {
        var demographic = {
            STUDYID :'OPTIMISE',
            DOMAIN :'DM',
            USUBJID :USUBJID,
            SUBJID : USUBJID,
            NHS_USUBJID:'',
            RFICDTC :'',
            DTHDTC:'',
            DTHFL :'',
            SITEID :'',
            INVNAM :'' ,
            SEX:'',
            BRTHDTC:'',
            DOMINANT:'',
            ETHNIC:'',
            COUNTRY:''
        };
        return demographic;
    };
});

patientModule.factory('findingLocationTerms',function() {
    var terms = {};
    terms['msLocated.cerebrum.pe']={FALOC:'Cerebrum', FAMETHOD:'Physical Examination'};
    terms['msLocated.cerebrum.mri']={FALOC:'Cerebrum', FAMETHOD:'MRI'};
    terms['msLocated.cerebrum.symptom']={FALOC:'Cerebrum', FAMETHOD:'Symptom'};

    terms['msLocated.brainStem.pe']={FALOC:'Brain Stem', FAMETHOD:'Physical Examination'};
    terms['msLocated.brainStem.mri']={FALOC:'Brain Stem', FAMETHOD:'MRI'};
    terms['msLocated.brainStem.symptom']={FALOC:'Brain Stem', FAMETHOD:'Symptom'};

    terms['msLocated.opticNerve.pe']={FALOC:'Optic Nerve', FAMETHOD:'Physical Examination'};
    terms['msLocated.opticNerve.mri']={FALOC:'Optic Nerve', FAMETHOD:'MRI'};
    terms['msLocated.opticNerve.symptom']={FALOC:'Optic Nerve', FAMETHOD:'Symptom'};

    terms['msLocated.spinalCord.pe']={FALOC:'Spinal Cord', FAMETHOD:'Physical Examination'};
    terms['msLocated.spinalCord.mri']={FALOC:'Spinal Cord', FAMETHOD:'MRI'};
    terms['msLocated.spinalCord.symptom']={FALOC:'Spinal Cord', FAMETHOD:'Symptom'};

    terms.getTerm = function(modelName) {
        return terms[modelName];
    };

    terms.getScopeVariable = function(FALOC, FAMETHOD) {
        var theKey = '';
        angular.forEach(terms, function(value, key) {
            if ((value.FALOC == FALOC)&&(value.FAMETHOD == FAMETHOD)) {
                theKey = key;
            }
        });
        return theKey;

    };
    return terms;
});

patientModule.factory('genderTerms',function() {
    var terms = ['Male', 'Female', 'Other', 'Unknown'];
    return terms;
});

patientModule.factory('ethnicTerms', function() {
    var terms =['White', 'Black', 'Chinese', 'Other Asian', 'Native American', 'Arab', 'Persian', 'Other Mixed', 'Unknown'];
    return terms;
});

patientModule.factory('initialSymptomsTerms', function() {
    var initialSymptoms = [ 'Blurred Vision',
        'Motor Weakness in Upper Extremities',
        'Paresthesiae',
        'Scotoma',
        'Motor Weakness in Upper Extremities',
        'Paresthesiae',
        'Scotoma',
        'Motor Weakness in Upper Extremities',
        'Paresthesiae',
        'Scotoma',
        'Motor Weakness in Upper Extremities',
        'Paresthesiae',
        'Scotoma',
        'Motor Weakness in Upper Extremities',
        'Paresthesiae',
        'Scotoma',
        'Motor Weakness in Lower Extremities',
        'Vertigo',
        'Defecation Problems',
        'Nystagmus',
        'Sexual Function Problems',
        'Hearing Loss',
        'Trigemial Nerve Involvement',
        'Gait Disturbance: Parasis',
        'Mood Problems',
        'Neuralgia',
        'Gait Disturbance: Ataxia',
        'Cognition Problems',
        'Atypical Pain',
        'Gait Disturbance: Spasticity',
        'Fatigue',
        'Hypoesthesia',
        'Facial Palsy',
        'Tremor',
        'Extra Pyramidal Symptoms',
        'Seizure',
        'Myokymia'];

    return initialSymptoms;
});

patientModule.service('patients',function(medicalHistory, MedicalEvent, Patient, records, viewService) {

    var currentPatient = null;
    var age = '';

    var deleteCurrentPatient = function() {
        currentPatient = null;
    };

    var getAge = function(BRTHDTC) {
        if (BRTHDTC != null){
            if (BRTHDTC != '')
                if (BRTHDTC > 1900)
                {
                    var dayInMilliseconds=1000*60*60*24;
                    var dateEnd = new Date();
                    var dateStart = new Date(BRTHDTC,0,1);
                    var durationInDays = (dateEnd-dateStart)/dayInMilliseconds;
                    return Math.floor(durationInDays/365.25);
                }
        }
        return '';
    };


    var newPatient = function(USUBJID, SITEID, NHS_USUBJID, RFICDTC) {
        currentPatient = new Patient(USUBJID);
        currentPatient.NHS_USUBJID = NHS_USUBJID;
        currentPatient.RFICDTC = RFICDTC;
    };

    var populatePatient = function(RecordItems){
        currentPatient = new Patient();
        for (var i = 0; i < RecordItems.length; i++){
            switch (RecordItems[i].fieldName) {
            case 'STUDYID':{
                currentPatient.STUDYID = RecordItems[i].value;
                break;
            }
            case 'DOMAIN':{
                currentPatient.DOMAIN = RecordItems[i].value;
                break;
            }
            case 'USUBJID':{
                currentPatient.USUBJID = RecordItems[i].value;
                //currentPatient.SUBJID = RecordItems[i].value;
                break;
            }
            case 'RFICDTC':{
                currentPatient.RFICDTC = records.formatStringToDate(RecordItems[i].value);
                break;
            }
            case 'DTHDTC':{
                currentPatient.DTHDTC = RecordItems[i].value;
                break;
            }
            case 'DTHFL':{
                currentPatient.DTHFL = RecordItems[i].value;
                break;
            }
            case 'SITEID':{
                currentPatient.SITEID = RecordItems[i].value;
                break;
            }
            case 'INVNAM':{
                currentPatient.INVNAM = RecordItems[i].value;
                break;
            }
            case 'SEX':{
                currentPatient.SEX = RecordItems[i].value;
                break;
            }
            case 'BRTHDTC':{
                currentPatient.BRTHDTC = records.formatStringToDate(RecordItems[i].value);
                break;
            }
            case 'DOMINANT':{
                currentPatient.DOMINANT = RecordItems[i].value;
                break;
            }
            case 'ETHNIC':{
                currentPatient.ETHNIC = RecordItems[i].value;
                break;
            }
            case 'COUNTRY':{
                currentPatient.COUNTRY = RecordItems[i].value;
                break;
            }
            case 'NHS_USUBJID':{
                currentPatient.NHS_USUBJID = RecordItems[i].value;
                break;
            }
            }
        }
        if (currentPatient.BRTHDTC!= '')
            age = getAge(currentPatient.BRTHDTC.getFullYear());

        if (currentPatient.NHS_USUBJID == '') {
            currentPatient.NHS_USUBJID = currentPatient.USUBJID;
        }
    };

    var patientExists = function() {
        if (currentPatient == null)
            return false;
        else
            return currentPatient;
    };


    var getFileActive = function() {
        if ((currentPatient != null)&&
        (currentPatient.DTHDTC==''))
            return true;
        else
            return false;
    };


    var getCurrentPatient = function() {
        //console.log(currentPatient);
        return currentPatient;
    };

    var getCurrentPatientAge = function() {
        if (currentPatient!=null){
            if (currentPatient.BRTHDTC != ''){
                age = getAge((currentPatient.BRTHDTC.getFullYear()));
                return age;
            }
        }
        else
            return '';
    };

    var getCurrentPatientGender = function() {
        if (currentPatient!=null){
            if (currentPatient.SEX != ''){
                return currentPatient.SEX;
            }
        }
        else
            return '';
    };

    var editDemographic = function(resName, resValue) {
        if (!viewService.workOffline())
        {
            var USUBJID = {fieldName: 'USUBJID', value: currentPatient.USUBJID};
            var SEQ = {fieldName:'DOMAIN', value: currentPatient.DOMAIN};
            var RESTOCHANGE = {fieldName:resName, value: resValue};


            var idRecord = [USUBJID, SEQ];
            var valueRecord = [RESTOCHANGE];
            records.editRecord(idRecord, valueRecord);
        }
    };

    return {
        populatePatient:populatePatient,
        patientExists:patientExists,
        getFileActive:getFileActive,
        newPatient:newPatient,
        getCurrentPatient: getCurrentPatient,
        deleteCurrentPatient: deleteCurrentPatient,
        getCurrentPatientAge: getCurrentPatientAge,
        editDemographic: editDemographic,
        getCurrentPatientGender: getCurrentPatientGender
    };
});

patientModule.controller('patientInfoCtrl', function ( $rootScope, $parse, $q,
    $scope, $timeout,
    patients, genderTerms, ethnicTerms,
    findingAbout,
    findingsAbout,
    MedicalEvent, medicalHistory,
    clinicalEvents, clinicalEvent,
    viewService,
    associatedPersonMedicalHistories,
    substanceUse, SubstanceUse,
    subjectCharacteristic, SubjectCharacteristic,
    initialSymptomsTerms, findingLocationTerms) {



    $scope.initialSymptoms = initialSymptomsTerms;
    $scope.ethnicOptions = ethnicTerms;
    $scope.genderOptions = genderTerms;

    $scope.newDiagnosis = '';
    $scope.newDiagnosis.MHTERM = '';
    $scope.newDiagnosis.MHSTDTC = '';
    $scope.newDiagnosis.displayNote = '';
    $scope.PregnancyTERM = 'Pregnancy';


    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Patient')
        {
            return true;
        }
        else
            return false;
    };

    $scope.thereIsAPatient = function () {
        if (patients.getCurrentPatient()== null) {
            return false;
        }
        return true;
    };

    $scope.showMSInFamilyPanel = function() {
        if (associatedPersonMedicalHistories.APMHWithMSExists())
            $scope.MSInFamily=true;

        return $scope.MSInFamily;
    };

    $scope.addImmunisation = function() {
        var vaccine = new MedicalEvent(patients.getCurrentPatient().USUBJID, 'Immunisation');
        vaccine.MHTERM = $scope.ImmunisationTERM;
        vaccine.MHSTDTC = new Date($scope.ImmunisationSTDTC.substr(6), parseInt($scope.ImmunisationSTDTC.substr(3,2))-1, $scope.ImmunisationSTDTC.substr(0,2));
        vaccine.displaySTDTC = $scope.ImmunisationSTDTC;
        medicalHistory.addOccurence(vaccine);

        clearImmunisationFields();
    };

    $scope.addPregnancy = function() {
        var pregnancy = new MedicalEvent(patients.getCurrentPatient().USUBJID, 'Pregnancy');
        pregnancy.MHTERM = 'Pregnancy';
        pregnancy.MHSTDTC = new Date($scope.PregnancySTDTC, 0, 1);
        pregnancy.MHENDTC = new Date($scope.PregnancyENDTC, 0, 1);
        pregnancy.displaySTDTC = $scope.PregnancySTDTC;
        pregnancy.displayENDTC = $scope.PregnancyENDTC;
        pregnancy.MHENRTPT = $scope.PregnancyENRTPT;
        medicalHistory.addOccurence(pregnancy);
        medicalHistory.printMedicalHistory();
        clearPregnancyFields();
    };

    $scope.showPregnancyTable = function() {
        if (!$scope.isUnder18()&&$scope.isFemale()) {
            return true;
        }
        return false;
    };

    var immunisationDataExists = function() {
        var immunisations = medicalHistory.getOccurencesInCategory('Immunisation');
        if (immunisations.length > 0)
            return true;
        else
            return false;
    };

    $scope.showImmunisationTable = function() {
        if ($scope.isUnder18() || (immunisationDataExists())) {
            return true;
        }
        return false;
    };

    $scope.getPregnancies = function() {
        return clinicalEvents.getEvents('Pregnancy');
    };


    $scope.getMedicalHistory = function(MHCAT) {
        if (MHCAT=='General Medical History') {
            setDateElements();
        }
        return medicalHistory.getOccurencesInCategory(MHCAT);
    };


    $scope.deleteOccurence = function(occurence) {
        medicalHistory.deleteOccurence(occurence);
    };

    $scope.addGeneralOccurence = function() {
        var mh = new MedicalEvent(patients.getCurrentPatient().USUBJID, 'General Medical History'); // MHCAT = General, Primary, Cardiac
        //var mh = new MedicalEvent('OPT001', 'General Medical History');
        mh.MHTERM= $scope.GenMHTERM;      //Visit Name
        mh.MHSTDTC = new Date($scope.GenMHSTDTC,0,1);    //End Date/Time of Visit
        mh.displaySTDTC = $scope.GenMHSTDTC;
        mh.MHENRTPT= $scope.GenMHENRTPT;

        if (mh.MHENRTPT=='Resolved')
        {
            mh.MHENDTC= new Date($scope.GenMHENDTC,0,1);
            mh.displayENDTC = $scope.GenMHENDTC;
        }

        mh.MHSCAT= 'Other'; // MHSCAT = Respiratory, CNS, Others

        medicalHistory.addOccurence(mh);
        clearGHFields();
        setDateElements();
    };

    $scope.editGeneralOccurence = function(occurence, propertyName) {
        var display = null;
        switch (propertyName) {
        case 'MHTERM':
            medicalHistory.editOccurence(occurence, propertyName, occurence.MHTERM);
            break;

        case 'MHSTDTC':
            var MHSTDTC = new Date(occurence.displaySTDTC,0,1);
            medicalHistory.editOccurence(occurence, propertyName, MHSTDTC);

            display = occurence.displaySTDTC;
            medicalHistory.editOccurence(occurence, 'displaySTDTC', display);
            break;

        case 'MHENRTPT':
            medicalHistory.editOccurence(occurence, propertyName, occurence.MHENRTPT);
            break;

        case 'displayNote':
            medicalHistory.editOccurence(occurence, propertyName, occurence.displayNote);
            break;

        case 'MHENDTC':
            var MHENDTC = new Date(occurence.displayENDTC,0,1);
            medicalHistory.editOccurence(occurence, propertyName, MHENDTC);

            display = occurence.displayENDTC;
            medicalHistory.editOccurence(occurence, 'displayENDTC', display);
            break;
        }
        medicalHistory.printMedicalHistory();
    };

    $scope.getDateYear = function(MHSTDC) {
        return MHSTDC.getFullYear();
    };

    $scope.validateMHENDTC = function() {
        if ($scope.GenMHENRTPT < $scope.GenMHSTDTC) {
            alert('Error: Resolved date before start date.');
            $scope.GenMHENRTPT = '';
        }
    };

    $scope.editSubstanceUse = function(propertyName, propertyValue) {

        switch (propertyName) {
        case 'ALCOHOL': {
            $scope.ALCOHOL = propertyValue;
            break;
        }
        }
        var aUse = substanceUse.getThisSubstanceUse(propertyName);
        if ((aUse == null)||(aUse.length == 0)){
            var newSubstance = new SubstanceUse(patients.getCurrentPatient().USUBJID, propertyName);
            newSubstance.SUDOSFRQ = propertyValue;
            substanceUse.addSubstanceUse(newSubstance);
        }
        else {
            aUse.SUDOSFRQ = propertyValue;
            substanceUse.editSubstanceUse(aUse[0], propertyName, propertyValue);
        }
    };

    $scope.editDemographic = function(propertyName, propertyValue) {
        var currentPatient = patients.getCurrentPatient();
        switch (propertyName) {
        case 'SEX': {
            currentPatient.SEX = propertyValue;
            $scope.SEX = propertyValue;
            patients.editDemographic(propertyName, propertyValue);
            break;
        }
        case 'ETHNIC': {
            currentPatient.ETHNIC = propertyValue;
            $scope.ETHNIC = propertyValue;
            patients.editDemographic(propertyName, propertyValue);
            break;
        }
        case 'DOMINANT': {
            currentPatient.DOMINANT = propertyValue;
            $scope.DOMINANT = propertyValue;
            patients.editDemographic(propertyName, propertyValue);
            break;
        }
        case 'COUNTRY': {
            currentPatient.COUNTRY = propertyValue;
            $scope.COUNTRY = propertyValue;
            patients.editDemographic(propertyName, propertyValue);
            break;
        }
        case 'BRTHDTC': {
            currentPatient.BRTHDTC = new Date(propertyValue.substr(3), parseInt(propertyValue.substr(0,2))-1, 1);
            $scope.BRTHDTC = currentPatient.BRTHDTC.toDateString();
            $scope.DM_displayDate = patients.getCurrentPatientAge();
            patients.editDemographic(propertyName, currentPatient.BRTHDTC);
            break;
        }
        }
    };

    $rootScope.displayPatientDM = function() {
        var aPatient=patients.getCurrentPatient();
        $scope.USUBJID = aPatient.USUBJID;
        $scope.NHS_USUBJID = aPatient.NHS_USUBJID;
        $scope.SEX = aPatient.SEX;
        $scope.BRTHDTC = aPatient.BRTHDTC;
        if ($scope.BRTHDTC=='')
            $scope.BRTHDTC_display='';
        else
            $scope.BRTHDTC_display = parseInt(aPatient.BRTHDTC.getMonth())+1+'/'+aPatient.BRTHDTC.getFullYear();
        $scope.DM_displayDate = patients.getCurrentPatientAge();//getAge(aPatient.BRTHDTC.getFullYear());
        $scope.DOMINANT = aPatient.DOMINANT;
        $scope.ETHNIC = aPatient.ETHNIC;
        $scope.COUNTRY = aPatient.COUNTRY;

        var aUse = substanceUse.getThisSubstanceUse('ALCOHOL');
        if ((aUse != null) &&(aUse.length > 0))
            $scope.ALCOHOL = aUse[0].SUDOSFRQ;
        else
            $scope.ALCOHOL = '';


        var aChar = subjectCharacteristic.getThisSubjectCharacteristic('SMOKING HISTORY');
        if (aChar != null)
            $scope.SMOKING = aChar.SCORRES;
        else
            $scope.SMOKING = '';

    };

    var clearFindingsInLocation = function() {
        angular.forEach(findingLocationTerms, function(value, key) {
            var model = $parse(key);
            model.assign($scope,'');
        });

        $scope.progressiveMHSTDTC_display = '';
    };

    var clearSymptomFields = function () {
        $scope.symptomMHTERM= '';      //Visit Name
        $scope.symptomMHLAT= '';     //Date/Time of History Collection
        $scope.symptomMHLOC= '';    //End Date/Time of Visit
        $scope.symptomMHSTDTC='';
    };

    var clearGHFields = function () {
        $scope.GenMHTERM= '';      //Visit Name
        $scope.GenMHDTC= '';     //Date/Time of History Collection
        $scope.GenMHSTDTC= '';    //End Date/Time of Visit
        $scope.GenMHENDTC= '';    //End Date/Time of Visit
        $scope.GenMHENRTPT='Unknown';
    };

    var clearImmunisationFields = function() {
        $scope.ImmunisationTERM = '';
        $scope.ImmunisationSTDTC ='';
    };

    var clearAPMHFields = function () {
        $scope.APMHTERM = '';
        $scope.APMHIncludesMS = '';
        $scope.SREL = '';
    };

    var clearPregnancyFields = function () {
        $scope.PregnancyTERM = '';
        $scope.PregnancySTDTC = '';
        $scope.PregnancyENDTC = '';
        $scope.PregnancyENRTPT = '';
    };

    var clearDemographicFields = function () {
        $scope.USUBJID = '';
        $scope.NHS_USUBJID = '';
        $scope.DM_displayDate = '';
        $scope.BRTHDTC = '';
        $scope.BRTHDTC_display = '';
        $scope.SEX = '';
        $scope.DOMINANT= '';
        $scope.ALCOHOL= '';
        $scope.SMOKING= '';
        $scope.ETHNIC= '';
        $scope.COUNTRY= '';
    };

    var clearMedicalHistoryFields = function() {
        $scope.newDiagnosis.MHTERM = '';
        $scope.newDiagnosis.MHSTDTC = '';
        $scope.newDiagnosis.displayNote = '';
    };

    $rootScope.setNewPatientFields = function () {
        clearDemographicFields();
        clearPregnancyFields();
        clearGHFields();
        clearSymptomFields();
        clearAPMHFields();
        clearImmunisationFields();
        clearFindingsInLocation();
        clearMedicalHistoryFields();
    };

    $rootScope.setNewPatientFields();

    $scope.editSubjectCharacteristic = function(propertyName, propertyValue) {
        switch (propertyName) {
        case 'SMOKING HISTORY': {
            $scope.SMOKING = propertyValue;
            break;
        }
        }

        var aChar = subjectCharacteristic.getThisSubjectCharacteristic(propertyName);
        if ((aChar == null)){
            var newChar = new SubjectCharacteristic(patients.getCurrentPatient().USUBJID, propertyName);
            newChar.SCORRES = propertyValue;
            subjectCharacteristic.addSubjectCharacteristic(newChar);
        }
        else {
            aChar.SCORRES = propertyValue;
            subjectCharacteristic.editSubjectCharacteristic(aChar, propertyName, propertyValue);
        }

    };

    $scope.getPrimaryDiagnosis = function() {
        var mh = medicalHistory.getOccurencesInCategory('Primary Diagnosis');
        var diagnoses = [];
        for (var d=0; d < mh.length; d++){
            if (mh[d].MHSCAT != 'Progressive Course')
                diagnoses.push(mh[d]);
        }
        return diagnoses;
    };

    $scope.isMSCategory = function() {
        if (($scope.newDiagnosis != null)&&($scope.newDiagnosis.MHTERM!=null)){
            if ($scope.newDiagnosis.MHTERM.indexOf('Multiple Sclerosis')>-1) {

                return true;
            }
        }
        return false;
    };

    $scope.isNMOCategory = function() {
        if (($scope.newDiagnosis != null)&&($scope.newDiagnosis.MHTERM!=null)){
            var MHTERM = $scope.newDiagnosis.MHTERM;
            if ((MHTERM.indexOf('Transverse Myelitis') >-1) ||
                (MHTERM.indexOf('Optic Neuritis')>-1)||
                (MHTERM.indexOf('NMOSD')>-1)) {
                return true;
            }
        }
        return false;
    };

    $scope.isMSPatient = function() {
        var mh = medicalHistory.getOccurencesInCategory('Primary Diagnosis');
        for (var e = 0; e < mh.length; e++) {
            if (mh[e].MHTERM.indexOf('Multiple Sclerosis')> -1) {
                if (mh[e].MHSCAT == 'Onset Course')
                    return true;
            }
        }
        return false;
    };

    $scope.addPrimaryDiagnosis = function() {
        var mh = new MedicalEvent(patients.getCurrentPatient().USUBJID, 'Primary Diagnosis');
        mh.MHTERM= $scope.newDiagnosis.MHTERM;      //Visit Name
        if (mh.MHTERM.indexOf('Multiple Sclerosis') > -1)
            mh.MHSCAT = 'Onset Course';
        mh.MHSTDTC = new Date($scope.newDiagnosis.MHSTDTC,0,1);
        mh.displaySTDTC = mh.MHSTDTC.getFullYear();
        mh.displayDate = mh.MHSTDTC.getFullYear();
        mh.displayNote = $scope.newDiagnosis.displayNote;

        medicalHistory.addOccurence(mh);

        $scope.newDiagnosis.MHTERM = '';
        $scope.newDiagnosis.MHSTDTC = '';
        $scope.newDiagnosis.displayNote = '';
    };

    $scope.deletePrimaryDiagnosis = function(diagnosis) {
        //console.log(diagnosis);
        if (diagnosis.MHTERM.indexOf('Multiple Sclerosis')>-1){

            var faList = findingsAbout.FASCATExists('Onset Course');
            for (var f = 0; f < faList.length; f++){
                findingsAbout.deleteFinding(faList[f]);
            }
            clearFindingsInLocation();
            $scope.editProgressiveCourse();
        }
        medicalHistory.deleteOccurence(diagnosis);
        //var faList = findingsAbout.FASCATExists('Onset Course');
        //console.log(faList);
    };

    $scope.addInitialSymptom = function() {
        var mh = new MedicalEvent(patients.getCurrentPatient().USUBJID, 'Initial Symptom');
        mh.MHSCAT= 'Initial Symptom';// MHSCAT = Onset, Initial Current
        mh.MHSTDTC= new Date($scope.symptomMHSTDTC,0,1);    //End Date/Time of Visit
        mh.displaySTDTC= $scope.symptomMHSTDTC;    //End Date/Time of Visit
        mh.MHTERM= $scope.symptomMHTERM;      //Visit Name
        mh.MHLOC= $scope.symptomMHLOC;
        mh.MHLAT= $scope.symptomMHLAT;
        clearSymptomFields();
        medicalHistory.addOccurence(mh);
    };

    $scope.getOccurencesInSubCategory = function (mhscat){
        return medicalHistory.getOccurencesInSubCategory(mhscat);
    };


    var currentDate = new Date();

    var dayMonthYear = angular.element(document.querySelector('#collapseDM .DTC_DayMonthYear'));
    dayMonthYear.datepicker({
        format: 'dd/mm/yyyy',
        endDate: currentDate.getFullYear().toString(),
        startView: 1,
        orientation: 'top left',
        autoclose: true,
        todayHighlight: true
    });

    var monthYear = angular.element(document.querySelectorAll('input.form-control.DTC_MonthYear'));
    monthYear.datepicker({
        format: 'mm/yyyy',
        endDate: currentDate.getFullYear().toString(),
        startView: 2,
        minViewMode: 1,
        orientation: 'top left',
        autoclose: true,
        todayHighlight: true
    });

    var setDateElements = function() {
        var dateYear = angular.element(document.querySelectorAll('input.form-control.DTC_Year'));
        dateYear.datepicker({
            format: 'yyyy',
            endDate: currentDate.getFullYear().toString(),
            startView: 2,
            minViewMode: 2,
            orientation: 'top left',
            autoclose: true,
            todayHighlight: true
        });
    };

    setDateElements();

    $scope.isUnder18 = function() {
        if (patients.getCurrentPatientAge() <= 18)
            return true;
        return false;
    };

    $scope.isFemale= function() {
        if (patients.getCurrentPatientGender() == 'Female')
            return true;
        return false;
    };

    $scope.editProgressiveCourse = function() {
        var progressive = medicalHistory.occurenceExists('Progressive Course');
        if (($scope.progressiveMHSTDTC_display==null) || ($scope.progressiveMHSTDTC_display=='')){ // if user removed date
            if (progressive != null){
                medicalHistory.deleteOccurence(progressive);
                //medicalHistory.printMedicalHistory();
            }
        }
        else
        {
            var progressiveMHSTDTC = new Date($scope.progressiveMHSTDTC_display, 0, 1);
            if (progressive == null)
            {
                var mh = new MedicalEvent(patients.getCurrentPatient().USUBJID, 'Primary Diagnosis');
                mh.MHSCAT= 'Progressive Course';
                mh.MHTERM= 'Secondary Progressive Multiple Sclerosis';
                mh.MHSTDTC = progressiveMHSTDTC;
                medicalHistory.addOccurence(mh);
            }
            else
            {
                progressive.MHSTDTC = progressiveMHSTDTC;
                medicalHistory.editOccurence(progressive, 'MHSTDTC', progressiveMHSTDTC);
            }
        }
    };

    $rootScope.displayPatientMH = function() {
        var primaryDiagnosis = medicalHistory.getOccurencesInCategory('Primary Diagnosis');
        if (primaryDiagnosis.length > 0) {
            for (var p = 0; p < primaryDiagnosis.length; p++) {
                if (primaryDiagnosis[p].MHTERM.indexOf('Multiple Sclerosis') > -1) {
                    var progressive = medicalHistory.occurenceExists('Progressive Course');
                    if (progressive != null) {
                        $scope.progressiveMHSTDTC_display = progressive.MHSTDTC.getFullYear();
                    }
                }
            }
        }
    };

    $rootScope.displayPatientFA = function() {
        var faList = findingsAbout.FASCATExists('Onset Course');
        if (faList.length > 0) {
            for (var f = 0; f < faList.length; f++) {
                var FALOC = faList[f].FALOC;
                var FAMETHOD = faList[f].FAMETHOD;
                var modelName = findingLocationTerms.getScopeVariable(FALOC, FAMETHOD);
                var model = $parse(modelName);
                model.assign($scope, true);
            }
        }
    };

    var getOnsetCourse = function() {
        var onset = medicalHistory.occurenceExists('Onset Course');
        if (onset == null)
            return '';
        else
            return onset.MHTERM;
    };

    $scope.editOnsetFinding = function(modelName) {
        var FALOC = findingLocationTerms.getTerm(modelName).FALOC;
        var FAMETHOD = findingLocationTerms.getTerm(modelName).FAMETHOD;

        var finding = findingsAbout.findingsByLocAndMet(FALOC, FAMETHOD);
        if (finding == null) {
            //if (onsetIsFoundViaMethod)  // add finding
            {
                var newFinding = new findingAbout(patients.getCurrentPatient().USUBJID,
                    getOnsetCourse(), 'Primary Diagnosis', 'Onset Course');
                newFinding.FALOC = FALOC;
                newFinding.FAMETHOD = FAMETHOD;
                findingsAbout.addFinding(newFinding);
            }
        }
        else { // if found, and user has UNchecked method
            //if (!onsetIsFoundViaMethod)
            findingsAbout.deleteFinding(finding);
        }
    };

    $scope.editAssociatedPersonMedicalHistory = function(apmh, propertyName) {

        var APMH = associatedPersonMedicalHistories.getAPMHByRel(apmh.SREL, apmh.MHTERM);

        if (APMH != null) {
            switch (propertyName) {
            case 'SREL': {
                associatedPersonMedicalHistories.editAPMH(APMH, 'SREL', apmh.SREL);
                break;
            }
            case 'MHTERM': {
                APMH.MHTERM = $scope.APMHTERM;
                associatedPersonMedicalHistories.editAPMH(APMH, 'MHTERM', apmh.APMHTERM);
                break;
            }
            case 'hasMS': {
                APMH.hasMS = $scope.APMHIncludesMS;
                associatedPersonMedicalHistories.editAPMH(APMH, 'hasMS', apmh.APMHIncludesMS);
                break;
            }
            }
        }
    };

    $scope.checkboxIfApmhIncludesMS = function () {
        if ($scope.SREL != null) {
            var withMS = associatedPersonMedicalHistories.getAPMHWithMS($scope.SREL);
            if ((withMS!= null)&&(withMS.length > 0)){
                $scope.APMHIncludesMS = true;
            }
            else
                $scope.APMHIncludesMS = false;
        }
        else
            $scope.APMHIncludesMS = false;
    };

    $scope.doesApmhIncludeMS = function () {
        if ($scope.SREL != null) {
            var withMS = associatedPersonMedicalHistories.getAPMHWithMS($scope.SREL);
            if (withMS!= null)
                return true;
        }
        return false;
    };

    $scope.addAssociatedPersonMedicalHistory = function() {
        if ($scope.SREL != null){
            if ($scope.APMHTERM != '')
            {
                if ($scope.APMHTERM.toLowerCase() == 'ms')
                    $scope.APMHTERM = 'Multiple Sclerosis';
                associatedPersonMedicalHistories.addAPMH(patients.getCurrentPatient().USUBJID, $scope.APMHTERM, $scope.SREL);
            }
        }
        clearAPMHFields();
    };

    $scope.deleteAssociatedPersonMedicalHistory = function(occurence) {
        associatedPersonMedicalHistories.deleteAPMH(occurence);
        clearAPMHFields();
    };

    $scope.getAssociatedPersonMedicalHistories = function() {
        return associatedPersonMedicalHistories.getAPMHList();
    };

    var getPIIData = function (sourceFile) {
        return $q(function(resolve, reject) {
            var textType = /csv.*/;
            if (sourceFile.type.match(textType)) {
                var reader = new FileReader();
                reader.onloadend = (function (e) {
                    resolve(e.target.result);
                });
                reader.readAsText(sourceFile);
            } else {
                reject();
            }
        });
    };

    $scope.readPII = function() {
        var file = document.getElementById('piiFile').files;
        if (file[0] != undefined) {
            var urlData = getPIIData(file[0]);

            urlData.then(function (data) {
                var piiObjects = $.csv.toObjects(data);
                $scope.piiNote = Object.keys(piiObjects[0]);

            });
        }
    };


});

patientModule.directive('patientEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl:'scripts/js/patient/patient.html'
    };
});
