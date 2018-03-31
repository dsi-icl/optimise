/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 12/10/16
 * Time: 15:34
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 24/01/2015
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */

var exporterModule = angular.module('Optimise.exporter', []);

exporterModule.factory('exportID', function () {

    return function() {
        var headers = {"Patient ID":"", "Last Name": "", "First Name":"",
            "Birth Date":"", "Birth Country":"",
            "Gender":"", "Patient Code":"","Ethnic Origin":"",
            "Date of onset":"", "Date Secondary Progressive":"",
            "MSCourse1":"", "MSCourse1Since":"",
            "MSCourse2":"", "MSCourse2Since":"",
            "MSCourse3":"", "MSCourse3Since":""};
        return headers;
    }


});

exporterModule.service('exportService', function (exportID,
                                                    clinicalEvents,
                                                  questionnaires,
                                                  findingsAbout,
                                                  subjectVisits,
                                                  exposures,
                                                  procedures,
                                                  relationships,
                                                  patients,
                                                  laboratoryTestResults,
                                                  immunogenicitySpecimenAssessments,
                                                  nervousSystemFindings,
                                                  vitalSigns,
                                                  medicalHistory,
                                                  associatedPersonMedicalHistories,
                                                  Experiments, Scans, Resources, Snapshots, RawImage,
                                                  adverseEventService,
                                                  morphologyServices, Country,
                                                  substanceUse, subjectCharacteristic,
                                                  deviceInUseServices,
                                                  reminders) {

    var formatDDMMYYYY = function(date) {
        return date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    }

    var exportIDRow = function(printHeaders) {
        // Patient ID,Last Name,First Name,Maiden Name,Birth Date,Birth City,Birth Country,Gender,Patient Code,Address,City,Zip Code,State,Country,Home Phone,Work Phone,Other Number,Email,Doctor in Charge,Deceased,Decease Date,Health Insurance,Health Insurance Code,Keywords,Clinical Study Code,Marital Status,Education,Employment,Entry in the clinic,Referred By Who,Visit Frequency Planned,Nb Relapses since 1st Symptoms,Ethnic Origin,Hla Typing Done,Date of onset,Supratentorial,Optic Pathways,Brainstem-Cerebellum,Spinal Cord,Other Symptoms,Progression From Onset,Diagnosis Date,Clinical Findings,MRI,Evoked Potentials,CSF,Other Confirmation,Poser Classification,McDonald Classification,Date Secondary Progressive,MSCourse1,Since,MSCourse2,Since,MSCourse3,Since,Family History,NMO Classification,A
        var aPatient = patients.patientExists();
        var row = new exportID();
        row['Patient ID'] = aPatient.USUBJID;
        row['Birth Date'] = formatDDMMYYYY(aPatient.BRTHDTC);
        row['Birth Country'] = aPatient.COUNTRY;
        row['Gender'] = aPatient.SEX;
        row['Ethnic Origin'] = aPatient.ETHNIC;

        var msCourse = medicalHistory.getOccurencesInCategory('Primary Diagnosis');
        var numMSCourses = 0;
        for (var c = 0; c < msCourse.length; c++) {
            var mh = msCourse[c];
            if (mh.MHTERM.indexOf("Multiple Sclerosis") > -1) {
                if (mh.MHTERM.indexOf("Secondary")>-1) {
                    row['Date Secondary Progressive'] = formatDDMMYYYY(mh.MHSTDTC);
                }
                numMSCourses = numMSCourses+1;
                var msCourseKey = "MSCourse"+numMSCourses.toString();
                row[msCourseKey] = mh.MHTERM;
                var msCourseKeySince = "MSCourse"+numMSCourses.toString()+"Since";
                row[msCourseKeySince] = formatDDMMYYYY(mh.MHSTDTC);
            }
        }
        return rowToString(row, printHeaders);
    }

    var headerToString = function(headers) {
        var printThis = '';
        for (var k = 0; k<headers.length; k++) {
            if (k != 0)
                printThis += "\t";
            printThis += headers[k];
            if (k == (headers.length -1))
                printThis += "\n";
        }
        return printThis;
    }

    var valueToString = function(headers, row) {
        var printThis = '';
        for (var k = 0; k<headers.length; k++) {
            if (k != 0)
                printThis += "\t";
            printThis += row[headers[k]];
            if (k == (headers.length -1))
                printThis += "\n";
        }
        return printThis;
    }

    var rowToString = function(row, printHeaders) {
        var printThis = "";
        var headers = Object.keys(row);
        if (printHeaders) {
            printThis += headerToString(headers);
        }
        printThis += valueToString(headers, row);
        return printThis;
    }

    var exportIDHeader = function() {
        //var headers = "Patient ID":"",Last Name":"",First Name":"",Maiden Name":"",Birth Date":"",Birth City":"",Birth Country":"",Gender":"",Patient Code":"",Address":"",City":"",Zip Code":"",State":"",Country":"",Home Phone":"",Work Phone":"",Other Number":"",Email":"",Doctor in Charge":"",Deceased":"",Decease Date":"",Health Insurance":"",Health Insurance Code":"",Keywords":"",Clinical Study Code":"",Marital Status":"",Education":"",Employment":"",Entry in the clinic":"",Referred By Who":"",Visit Frequency Planned":"",Nb Relapses since 1st Symptoms":"",Ethnic Origin":"",Hla Typing Done":"",Date of onset":"",Supratentorial":"",Optic Pathways":"",Brainstem-Cerebellum":"",Spinal Cord":"",Other Symptoms":"",Progression From Onset":"",Diagnosis Date":"",Clinical Findings":"",MRI":"",Evoked Potentials":"",CSF":"",Other Confirmation":"",Poser Classification":"",McDonald Classification":"",Date Secondary Progressive":"",MSCourse1":"",Since":"",MSCourse2":"",Since":"",MSCourse3":"",Since":"",Family History":"",NMO Classification":"",Active";
        //headers = headers +"\n";
        //return headers;
        var headers = new exportID();

        headers['Patient ID'] = "test me";
        rowToString();
    }

    return {
        exportIDRow: exportIDRow,
        exportIDHeader: exportIDHeader
    }
});

