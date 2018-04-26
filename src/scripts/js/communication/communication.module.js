/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 10/03/16
 * Time: 17:29
 * To change this template use File | Settings | File Templates.
 */

var communicationModule = angular.module('Optimise.communication', ['ui.bootstrap']);


communicationModule.factory('monthUtil', function() {
    var month = [];
    month[0] = 'Jan';
    month[1] = 'Feb';
    month[2] = 'Mar';
    month[3] = 'Apr';
    month[4] = 'May';
    month[5] = 'Jun';
    month[6] = 'Jul';
    month[7] = 'Aug';
    month[8] = 'Sep';
    month[9] = 'Oct';
    month[10] = 'Nov';
    month[11] = 'Dec';

    month.getMonthString = function(index) {
        return month[index];
    };

    return month;
});

communicationModule.service('communications', function (patients,
    clinicalEvents,
    medicalHistory,
    laboratoryTestResults, immunogenicitySpecimenAssessments,
    procedures,nervousSystemFindings, vitalSigns,
    exposures,
    monthUtil) {

    var timeSpan = '';

    var setTimeSpan = function(newTimeSpan) {
        timeSpan = newTimeSpan;
        //console.log(timeSpan);
    };

    var getTimeSpan = function() {
        return timeSpan;
    };

    //    var getLastTwoVisitDates = function () {
    //        var visits = subjectVisits.getSubjectVisits();
    //        //console.log(visits);
    //        if (visits.length == 0) {
    //            return {"start":new Date(1990,1,1), 'end':new Date()};
    //        }
    //        else if (visits.length == 1) {
    //            return {"start":new Date(1990,1,1), 'end':visits[visits.length-1].SVSTDTC};
    //        }
    //        else {
    //            return {"start":visits[visits.length-2].SVSTDTC, 'end':visits[visits.length-1].SVSTDTC};
    //
    //
    //    }

    var printDM = function() {
        if (patients.getCurrentPatient()!=null)
            return patients.getCurrentPatient().USUBJID;
        return '';
    };

    var printRelapses = function() {
        var patientClinicalEvents = clinicalEvents.getUniqueDatesFromCategory('MS Relapse');
        var diagnosisText = '<p>';
        if (timeSpan.start.getFullYear() == 1900){
            diagnosisText += 'The patient presented with the following symptoms: ';
        }
        else {
            diagnosisText += 'Since the last visit on ';
            diagnosisText += timeSpan.start.getDate() +' '+monthUtil.getMonthString(timeSpan.start.getMonth())+' '+timeSpan.start.getFullYear();
            diagnosisText +=' the patient has reported ';
        }

        var relapsesText = '';
        var numRelapsesInTimeSpan = 0;
        if (patientClinicalEvents!= null) {
            for (var ce = 0; ce < patientClinicalEvents.length; ce++) {
                var anEvent =  patientClinicalEvents[ce];
                if (((anEvent.CESTDTC >= timeSpan.start)&&(anEvent.CESTDTC <= timeSpan.end))){
                    if (numRelapsesInTimeSpan == 0) {
                        relapsesText += '<ol type=\'1\'>';
                    }
                    numRelapsesInTimeSpan = numRelapsesInTimeSpan+1;
                    relapsesText += '<li>'+ anEvent.CETERM + ' - ' + anEvent.CESEV;
                    relapsesText += ' ('+monthUtil.getMonthString(anEvent.CESTDTC.getMonth())+' '+anEvent.CESTDTC.getFullYear() +')</li>';
                    var relapseSymptoms = clinicalEvents.getEventsFromCategoryAndDate('Symptom', anEvent.CESTDTC);
                    if (relapseSymptoms.length > 0) {
                        //console.log(relapseSymptoms);
                        relapsesText += '<p></p><p> The patient reported symptoms of ';
                        for (var sym = 0; sym < relapseSymptoms.length; sym++){
                            //relapsesText += relapseSymptoms[sym].CETERM.toLowerCase();
                            relapsesText += relapseSymptoms[sym].CETERM.toLowerCase() + ' ';
                            relapsesText += relapseSymptoms[sym].CEBODSYS.toLowerCase() + ' ';
                            relapsesText += relapseSymptoms[sym].CELAT.toLowerCase();
                            if (sym == (relapseSymptoms.length -2)) {
                                relapsesText += ' and ';
                            }
                            else if (sym == (relapseSymptoms.length -1)) {
                                relapsesText += '.';
                            }
                            else {
                                relapsesText += ', ';
                            }
                        }
                    }
                    var relapseSigns = clinicalEvents.getEventsFromCategoryAndDate('Sign', anEvent.CESTDTC);
                    if (relapseSigns.length > 0) {
                        relapsesText += ' Signs observed were ';
                        for (var sig = 0; sig < relapseSigns.length; sig++){
                            relapsesText += relapseSigns[sig].CETERM.toLowerCase();
                            if (sig == (relapseSigns.length -2)) {
                                relapsesText += ' and ';
                            }
                            else if (sig == (relapseSigns.length -1)) {
                                relapsesText += '.</p>';
                            }
                            else {
                                relapsesText += ', ';
                            }
                        }
                    }
                }
            }
        }

        if (numRelapsesInTimeSpan>0){
            if (numRelapsesInTimeSpan == 1)
                diagnosisText += 'an episode of relapse. ';
            else
                diagnosisText += numRelapsesInTimeSpan +' episodes of relapses. ';
            diagnosisText+=relapsesText;
            diagnosisText+='</ol>';
        }
        else
            diagnosisText += 'no relapses.';

        diagnosisText += '</p>';
        return diagnosisText;
    };

    var printDiagnosis = function() {
        var patientMedicalHistory = medicalHistory.getOccurencesInCategory('Primary Diagnosis');
        var diagnosisText = '<p>The patient diagnosis is ';
        if (patientMedicalHistory!= null) {
            for (var ce = 0; ce < patientMedicalHistory.length; ce++) {
                var anEvent =  patientMedicalHistory[ce];
                diagnosisText += anEvent.MHTERM + ' (' + anEvent.MHSTDTC.getFullYear()+')';
                if ((ce != patientMedicalHistory.length-1)
                    &&(ce != patientMedicalHistory.length-2)
                    && (patientMedicalHistory.length>1)) {
                    diagnosisText += ', ';
                }else if (ce == patientMedicalHistory.length-2) {
                    diagnosisText += ' and ';
                }
                else if (ce == patientMedicalHistory.length-1) {
                    diagnosisText += '.';
                }
            }
        }
        return diagnosisText;
    };


    var printExposures = function() {
        var patientPrescriptions = exposures.getExposures();
        var numDiseaseModifyingDrugs = 0;
        var drugsText = '';
        var diagnosisText = '<p>The patient is not currently being treated with any disease modifying drugs. </p>';
        if (patientPrescriptions!= null) {
            for (var ce = 0; ce < patientPrescriptions.length; ce++) {
                var aDrug =  patientPrescriptions[ce];
                if (((aDrug.EXENDTC == '')||(aDrug.EXENDTC >= timeSpan.end))
                    &&(aDrug.EXSTDTC<=timeSpan.end)) {
                    numDiseaseModifyingDrugs++;
                    drugsText += aDrug.EXTRT +',';
                }
            }
        }

        if (numDiseaseModifyingDrugs > 0) {
            diagnosisText = '<p> Current disease modifying treatments include '+ drugsText;
            diagnosisText = diagnosisText.substr(0, diagnosisText.length-1);
            diagnosisText += '.</p>';
        }

        return diagnosisText;
    };

    var printIntro = function() {
        var patient = patients.getCurrentPatient();
        if (patient!=null){
            var diagnosisText = '<p>It was a pleasure to see your ';
            diagnosisText += patients.getCurrentPatientAge();
            diagnosisText += ' year old ';
            if (patient.DOMINANT == 'Right')
                diagnosisText += 'right-handed';
            else if (patient.DOMINANT == 'Left')
                diagnosisText += 'left-handed';
            else if (patient.DOMINANT == 'Ambidextrous')
                diagnosisText += 'ambidextrous';

            diagnosisText += ' patient.</p>';

            return diagnosisText;
        }
        return '';
    };

    var printPatientID = function() {
        var patient = patients.getCurrentPatient();
        if (patient!=null) {
            var diagnosisText = '<br><p><h5>ID: '+patient.NHS_USUBJID+'</h5></p>';
            diagnosisText += '<p align=\'right\'>'+ timeSpan.end.getDate() +' '+monthUtil.getMonthString(timeSpan.end.getMonth());
            diagnosisText +=' '+timeSpan.end.getFullYear() + '</p><br>';
            return diagnosisText;
        }
        return '';
    };

    var printAddress = function() {
        var patient = patients.getCurrentPatient();
        if (patient!=null){
            var diagnosisText = '<p>MRN: <br>';
            diagnosisText += 'NHS Number: '+patient.NHS_USUBJID+'<br>';

            diagnosisText += 'Our Ref:<br></p>';
            diagnosisText += '<p><b>Private and Confidential</b><br></p>';
            diagnosisText += '<p>Dr YY<br>';
            diagnosisText += 'The Surgery<br>';
            diagnosisText += 'Address Line 1<br>';
            diagnosisText += 'Address Line 2<br>';
            diagnosisText += 'Address Line 3<br>';
            diagnosisText += 'Address Postcode<br></p>';

            diagnosisText += '<p align=\'right\'>'+ timeSpan.end.getDate() +' '+monthUtil.getMonthString(timeSpan.end.getMonth());
            diagnosisText +=' '+timeSpan.end.getFullYear() + '</p>';
            diagnosisText += '<p>Dear Dr ,</p>';
            diagnosisText += '<p><strong>Re: </strong></p>';
            return diagnosisText;

        }

        return '';
    };

    var addMonths = function(date, months) {
        date.setMonth(date.getMonth() + months);
        return date;
    };

    var printInvestigations = function() {
        var labResults = laboratoryTestResults.getUniqueDates();
        //console.log(labResults);
        var assessmentResults = immunogenicitySpecimenAssessments.getUniqueDates();
        var labCollectionDates = findUniqueCollectionDates(labResults, assessmentResults);
        var EVPDates = nervousSystemFindings.getUniqueDates();
        var MRIDates = procedures.getProcedureDates('MRI');
        var CSFDates = procedures.getProcedureDates('Lumbar Puncture');

        var startDate = addMonths(new Date(timeSpan.end), -11);
        var specialInvestigations = [];
        for (var labR = 0; labR < labCollectionDates.length; labR++) {
            if ((labCollectionDates[labR].LBDTC >= startDate) &&(labCollectionDates[labR].LBDTC<=timeSpan.end)) {
                specialInvestigations.push({'label': 'Lab Tests', 'date':labCollectionDates[labR].LBDTC});
            }
        }

        for (var evpR = 0; evpR < EVPDates.length; evpR++) {
            if ((EVPDates[evpR].NVDTC >= startDate) &&(EVPDates[evpR].NVDTC<=timeSpan.end)) {
                specialInvestigations.push({'label': 'Evoked Potential Tests', 'date':EVPDates[evpR].NVDTC});
            }
        }

        for (var mriR = 0; mriR < MRIDates.length; mriR++) {
            if ((MRIDates[mriR].PRSTDTC >= startDate) &&(MRIDates[mriR].PRSTDTC<=timeSpan.end)) {

                specialInvestigations.push({'label': 'MRI', 'date':MRIDates[mriR].PRSTDTC});
            }
        }

        for (var csfR = 0; csfR < CSFDates.length; csfR++) {
            if ((CSFDates[csfR].PRSTDTC >= startDate) &&(CSFDates[csfR].PRSTDTC<=timeSpan.end)) {
                specialInvestigations.push({'label': 'CSF', 'date':CSFDates[csfR].PRSTDTC});
            }
        }


        var diagnosisText = '';

        if (specialInvestigations.length > 0) {
            diagnosisText += '<p>In the last six months the following investigations have been performed.</p>';
            diagnosisText += '<ul>';
            for (var si = 0; si < specialInvestigations.length; si++) {
                diagnosisText += '<li>'+specialInvestigations[si].label+' - '+specialInvestigations[si].date.toDateString()+'</li>';
            }
            diagnosisText += '</ul>';
        }
        else {
            diagnosisText += '<p>No investigations were performed during the last six months.</p>';
        }

        return diagnosisText;
    };

    var printVitals = function() {

        var vitalSignsToday = vitalSigns.getSignsByDate(timeSpan.end);

        var diagnosisText = '<p>During today\'s visit, ';
        if (vitalSignsToday.length == 0) {
            diagnosisText += 'no vital signs or measurements were obtained. </p>';
        }
        else {
            diagnosisText += 'the vital signs and measurements obtained are as follow: </p>';
            for (var s = 0; s < vitalSignsToday.length; s++) {
                diagnosisText += '<li> ';
                diagnosisText += vitalSignsToday[s].VSTEST+' '+vitalSignsToday[s].VSORRES+' '+vitalSignsToday[s].VSORRESU;
                diagnosisText += '</li>';
                if (s == vitalSignsToday.length-1) {
                    diagnosisText += '</ol>';
                }
            }
        }

        return diagnosisText;
    };

    var printSymptomsAndSigns = function() {
        var diagnosisText = printDiagnosis();
        var todaysSymptoms = clinicalEvents.getEventsFromCategoryAndDate('Symptom',timeSpan.end);
        var s;

        diagnosisText += '<p>During today\'s visit, ';
        if (todaysSymptoms.length == 0) {
            diagnosisText += 'the patient did not present any symptoms. </p>';
        }
        else {
            diagnosisText += 'the patient presented the following symptoms: </p>';
            // diagnosisText += "<ol type='1'>";
            diagnosisText += '<ul>';
            for (s = 0; s < todaysSymptoms.length; s++) {
                diagnosisText += '<li> ';
                diagnosisText += todaysSymptoms[s].CETERM;
                if (todaysSymptoms[s].CELAT == 'Right')
                    diagnosisText += ' in the right ';
                else if (todaysSymptoms[s].CELAT == 'Left')
                    diagnosisText += ' in the left ';
                else if (todaysSymptoms[s].CELAT == 'Both')
                    diagnosisText += ' in both ';

                if (todaysSymptoms[s].CEBODSYS != '') {
                    diagnosisText += todaysSymptoms[s].CEBODSYS.toLowerCase();
                }

                diagnosisText += '</li>';
                if (s == todaysSymptoms.length-1) {
                    //diagnosisText += "</ol>";
                    diagnosisText += '</ul>';
                }
            }

        }

        var todaysSigns = clinicalEvents.getEventsFromCategoryAndDate('Sign',timeSpan.end);

        if (todaysSigns.length == 0) {
            diagnosisText += '<p>The patient did not exhibit any signs today. </p>';
        }
        else {
            diagnosisText += '<p>The patient presented with the following signs today: </p>';
            //diagnosisText += "<ol type='1'>";
            diagnosisText += '<ul>';
            for (s = 0; s < todaysSigns.length; s++) {
                diagnosisText += '<li> ';
                diagnosisText += todaysSigns[s].CETERM;
                if (todaysSigns[s].CELAT == 'Right')
                    diagnosisText += ' in the right ';
                else if (todaysSigns[s].CELAT == 'Left')
                    diagnosisText += ' in the left ';
                else if (todaysSigns[s].CELAT == 'Both')
                    diagnosisText += ' in both ';

                if (todaysSigns[s].CEBODSYS != '') {
                    diagnosisText += todaysSigns[s].CEBODSYS.toLowerCase();
                }

                diagnosisText += '</li>';
                if (s == todaysSigns.length-1) {
                    //diagnosisText += "</ol>";
                    diagnosisText += '</ul>';
                }
            }

        }
        return diagnosisText;
    };

    var findUniqueCollectionDates = function (labResults, assessmentResults) {
        var uniqueDates = [];
        for (var l = 0; l < labResults.length; l++) {
            if (collectionDateExists(uniqueDates, labResults[l].LBDTC)==false) {
                uniqueDates.push(labResults[l]);
            }
        }

        for (var a = 0; a < assessmentResults.length; a++) {
            if (collectionDateExists(uniqueDates, assessmentResults[a].ISDTC)==false) {
                uniqueDates.push(assessmentResults[a]);
            }
        }
        //console.log(uniqueDates);
        return uniqueDates;
    };

    var collectionDateExists = function (uniqueDates, aDate) {
        for (var d = 0; d < uniqueDates.length; d++) {
            if (uniqueDates[d].DOMAIN == 'IS') {
                if (aDate.toDateString() == uniqueDates[d].ISDTC.toDateString()) {
                    return true;
                }
            }
            else if (uniqueDates[d].DOMAIN == 'LB') {
                if (aDate.toDateString() == uniqueDates[d].LBDTC.toDateString()) {
                    return true;
                }
            }
        }
        //console.log("Returning false");
        return false;
    };

    return {
        printDM: printDM,
        printRelapses: printRelapses,
        //printDiagnosis: printDiagnosis,
        printExposures: printExposures,
        //getLastTwoVisitDates: getLastTwoVisitDates,
        printIntro: printIntro,
        printAddress: printAddress,
        setTimeSpan: setTimeSpan,
        getTimeSpan: getTimeSpan,
        printSymptomsAndSigns:printSymptomsAndSigns,
        printInvestigations: printInvestigations,
        printVitals: printVitals,
        printPatientID: printPatientID
    };
});

communicationModule.controller('communicationInfoCtrl', function($scope,
    $rootScope,
    viewService,
    communications) {
    var diagnosisText = '';
    var relapsesText = '';
    var exposuresText = '';
    var investigationText = '';
    var vitalsText = '';
    var patientIDDetails = '';

    $scope.includeSymptomsAndSigns = false;
    $scope.includeMedications = false;
    $scope.includeRelapses = false;
    $scope.includeInvestigations = false;
    $scope.includeVitalSigns = false;

    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Communications') {
            return true;
        }
        else
            return false;
    };
    
    $rootScope.clearCommunications = function () {
        diagnosisText = '';
        relapsesText = '';
        exposuresText = '';
        investigationText = '';
        vitalsText = '';
        patientIDDetails = '';

        $scope.includeSymptomsAndSigns = false;
        $scope.includeMedications = false;
        $scope.includeRelapses = false;
        $scope.includeInvestigations = false;
        $scope.includeVitalSigns = false;
    };

    $scope.getDM = function() {
        var dm = communications.printDM();
        return dm;
    };


    $rootScope.generateLetter = function() {
        $scope.editLetterText('');
    };

    $scope.editLetterText = function() {

        //address = communications.printAddress();
        //letterIntro = communications.printIntro();
        patientIDDetails = communications.printPatientID();

        if ($scope.includeVitalSigns) {
            vitalsText = communications.printVitals();
        }
        else {
            vitalsText = '';
        }

        if ($scope.includeSymptomsAndSigns) {
            diagnosisText = communications.printSymptomsAndSigns();
        }
        else {
            diagnosisText = '';
        }

        if ($scope.includeRelapses) {
            relapsesText = communications.printRelapses();
        }
        else {
            relapsesText = '';
        }

        if ($scope.includeMedications) {
            exposuresText = communications.printExposures();
        }
        else {
            exposuresText = '';
        }

        if ($scope.includeInvestigations) {
            investigationText = communications.printInvestigations();
        }
        else {
            investigationText = '';
        }

        $scope.letterText = patientIDDetails+ diagnosisText + vitalsText + relapsesText + investigationText+ exposuresText ;
    };
});

communicationModule.directive('communicationEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: 'scripts/js/communication/communication.html'
    };
});
