/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 23/01/2015
 * Time: 13:09
 * To change this template use File | Settings | File Templates.
 */

var headerModule = angular.module('Optimise.header', ['Optimise.view',
    'Optimise.clinicalEvent',
    'Optimise.medicalHistory',
    'Optimise.questionnaire',
    'Optimise.findingAbout',
    'Optimise.subjectVisit',
    'Optimise.exposure',
    'Optimise.procedure',
    'Optimise.relapse',
    'Optimise.event',
    'Optimise.relationship',
    'Optimise.record',
    'Optimise.patient',
    'Optimise.laboratoryTestResult',
    'Optimise.immunogenicitySpecimenAssessment',
    'Optimise.nervousSystemFindings',
    'Optimise.vitalSign',
    'ui.bootstrap',
    'Optimise.connectivity',
    'Optimise.adverseEvent',
    'Optimise.morphology',
    'Optimise.deviceInUse',
    'Optimise.configurations',
    'ngTable',
    'Optimise.substanceUse',
    'Optimise.subjectCharacteristic'
]);

headerModule.factory('Country', function () {
    return function () {
        return [
            "UNITED KINGDOM",
            "UNITED STATES",
            "ARUBA",
            "AFGHANISTAN",
            "ANGOLA",
            "ANGUILLA",
            "ALAND ISLANDS",
            "ALBANIA",
            "ANDORRA",
            "UNITED ARAB EMIRATES",
            "ARGENTINA",
            "ARMENIA",
            "AMERICAN SAMOA",
            "ANTARCTICA",
            "FRENCH SOUTHERN TERRITORIES",
            "ANTIGUA AND BARBUDA",
            "AUSTRALIA",
            "AUSTRIA",
            "AZERBAIJAN",
            "BURUNDI",
            "BELGIUM",
            "BENIN; BENIN REPUBLIC",
            "BONAIRE, SINT EUSTATIUS AND SABA",
            "BURKINA FASO",
            "BANGLADESH",
            "BULGARIA",
            "BAHRAIN",
            "BAHAMAS",
            "BOSNIA AND HERZEGOVINA; BOSNIA-HERZEGOVINA",
            "SAINT BARTHELEMY",
            "BELARUS",
            "BELIZE",
            "BERMUDA",
            "BOLIVIA; BOLIVIA, PLURINATIONAL STATE OF",
            "BRAZIL",
            "BARBADOS",
            "BRUNEI; BRUNEI DARUSSALAM",
            "BHUTAN",
            "BOUVET ISLAND",
            "BOTSWANA",
            "CENTRAL AFRICAN REPUBLIC",
            "CANADA",
            "COCOS (KEELING) ISLANDS",
            "SWITZERLAND",
            "CHILE",
            "CHINA",
            "COTE D'IVOIRE",
            "CAMEROON",
            "CONGO, THE DEMOCRATIC REPUBLIC OF; DEMOCRATIC REPUBLIC OF THE CONGO",
            "CONGO",
            "COOK ISLANDS",
            "COLOMBIA",
            "COMOROS",
            "CAPE VERDE",
            "COSTA RICA",
            "CUBA",
            "CURACAO",
            "CHRISTMAS ISLAND",
            "CAYMAN ISLANDS",
            "CYPRUS",
            "CZECH REPUBLIC",
            "GERMANY",
            "DJIBOUTI",
            "DOMINICA",
            "DENMARK",
            "DOMINICAN REPUBLIC",
            "ALGERIA",
            "ECUADOR",
            "EGYPT",
            "ERITREA",
            "WESTERN SAHARA",
            "SPAIN",
            "ESTONIA",
            "ETHIOPIA",
            "FINLAND",
            "FIJI",
            "FALKLAND ISLANDS; FALKLAND ISLANDS (MALVINAS)",
            "FRANCE",
            "FAROE ISLANDS",
            "MICRONESIA, FEDERATED STATES OF",
            "GABON",
            "GEORGIA",
            "GUERNSEY",
            "GHANA",
            "GIBRALTAR",
            "GUINEA",
            "GUADELOUPE",
            "GAMBIA",
            "GUINEA-BISSAU",
            "EQUATORIAL GUINEA",
            "GREECE",
            "GRENADA",
            "GREENLAND",
            "GUATEMALA",
            "FRENCH GUIANA",
            "GUAM",
            "GUYANA",
            "HONG KONG",
            "HEARD ISLAND AND MCDONALD ISLANDS",
            "HONDURAS",
            "CROATIA",
            "HAITI",
            "HUNGARY",
            "INDONESIA",
            "ISLE OF MAN",
            "INDIA",
            "BRITISH INDIAN OCEAN TERRITORY",
            "IRELAND",
            "IRAN",
            "IRAQ",
            "ICELAND",
            "ISRAEL",
            "ITALY",
            "JAMAICA",
            "JERSEY",
            "JORDAN",
            "JAPAN",
            "KAZAKHSTAN",
            "KENYA",
            "KYRGYZSTAN",
            "CAMBODIA",
            "KIRIBATI",
            "SAINT KITTS AND NEVIS",
            "KOREA, REPUBLIC OF; SOUTH KOREA",
            "KUWAIT",
            "LAO PEOPLE'S DEMOCRATIC REPUBLIC",
            "LEBANON",
            "LIBERIA",
            "LIBYA",
            "SAINT LUCIA",
            "LIECHTENSTEIN",
            "SRI LANKA",
            "LESOTHO",
            "LITHUANIA",
            "LUXEMBOURG",
            "LATVIA",
            "MACAO",
            "SAINT MARTIN (FRENCH PART); SAINT MARTIN, FRENCH",
            "MOROCCO",
            "MONACO",
            "MOLDOVA, REPUBLIC OF",
            "MADAGASCAR",
            "MALDIVES",
            "MEXICO",
            "MARSHALL ISLANDS",
            "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF; REPUBLIC OF MACEDONIA",
            "MALI",
            "MALTA",
            "MYANMAR",
            "MONTENEGRO",
            "MONGOLIA",
            "NORTHERN MARIANA ISLANDS",
            "MOZAMBIQUE",
            "MAURITANIA",
            "MONTSERRAT",
            "MARTINIQUE",
            "MAURITIUS",
            "MALAWI",
            "MALAYSIA",
            "MAYOTTE",
            "NAMIBIA",
            "NEW CALEDONIA",
            "NIGER",
            "NORFOLK ISLAND",
            "NIGERIA",
            "NICARAGUA",
            "NIUE",
            "NETHERLANDS",
            "NORWAY",
            "NEPAL",
            "NAURU",
            "NEW ZEALAND",
            "OMAN",
            "PAKISTAN",
            "PANAMA",
            "PITCAIRN",
            "PERU",
            "PHILIPPINES",
            "PALAU",
            "PAPUA NEW GUINEA",
            "POLAND",
            "PUERTO RICO",
            "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF; NORTH KOREA",
            "PORTUGAL",
            "PARAGUAY",
            "PALESTINIAN TERRITORY, OCCUPIED",
            "FRENCH POLYNESIA",
            "QATAR",
            "REUNION",
            "ROMANIA",
            "RUSSIAN FEDERATION",
            "RWANDA",
            "SAUDI ARABIA",
            "SUDAN",
            "SENEGAL",
            "SINGAPORE",
            "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS",
            "SAINT HELENA; SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA",
            "SVALBARD AND JAN MAYEN",
            "SOLOMON ISLANDS",
            "SIERRA LEONE",
            "EL SALVADOR",
            "SAN MARINO",
            "SOMALIA",
            "SAINT PIERRE AND MIQUELON",
            "SERBIA",
            "SOUTH SUDAN",
            "SAO TOME AND PRINCIPE",
            "SURINAME",
            "SLOVAKIA",
            "SLOVENIA",
            "SWEDEN",
            "SWAZILAND",
            "SINT MAARTEN (DUTCH PART); SINT MAARTEN (DUTCH)",
            "SEYCHELLES",
            "SYRIAN ARAB REPUBLIC",
            "TURKS AND CAICOS ISLANDS",
            "CHAD",
            "TOGO",
            "THAILAND",
            "TAJIKISTAN",
            "TOKELAU",
            "TURKMENISTAN",
            "TIMOR-LESTE",
            "TONGA",
            "TRINIDAD AND TOBAGO",
            "TUNISIA",
            "TURKEY",
            "TUVALU",
            "TAIWAN",
            "TANZANIA, UNITED REPUBLIC OF",
            "UGANDA",
            "UKRAINE",
            "UNITED STATES MINOR OUTLYING ISLANDS",
            "URUGUAY",
            "UZBEKISTAN",
            "VATICAN CITY STATE",
            "SAINT VINCENT AND THE GRENADINES",
            "VENEZUELA; VENEZUELA, BOLIVARIAN REPUBLIC OF",
            "VIRGIN ISLANDS, BRITISH",
            "VIRGIN ISLANDS, U.S.",
            "VIET NAM; VIETNAM",
            "VANUATU",
            "WALLIS AND FUTUNA",
            "SAMOA",
            "YEMEN",
            "SOUTH AFRICA",
            "ZAMBIA",
            "ZIMBABWE"
        ];
    }
});

headerModule.controller('newInterestCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
        var interestDetails = { "name": $scope.interestName, "email": $scope.interestEmail };
        $uibModalInstance.close(interestDetails);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


headerModule.controller('newPatientInstanceCtrl', function ($scope, $uibModalInstance, sourceMode, viewService, records, siteID) {

    $scope.actionMode = "New";
    $scope.sourceMode = sourceMode;
    $scope.newData = {
        search_USUBJID: '',
        recordSet: '',
        NHS_USUBJID: '',
        USUBJID: '',
        RFICDTC: '',
        sourceMode: sourceMode,
        actionMode: $scope.actionMode
    };

    var currentDate = new Date();
    $scope.yearsOption = [];

    for (var y = 1950; y <= currentDate.getFullYear(); y++) {
        $scope.yearsOption.push(y);
    }

    $scope.getYears = function () {
        return $scope.yearsOption;
    }

    $scope.showComputerSource = function () {
        if (sourceMode == 'computer')
            return true;
    };

    $scope.printActionMode = function () {
        console.log($scope.actionMode);
    }

    $scope.showInternetSource = function () {
        if (sourceMode == 'internet')
            return true;
    };

    var selectSubjectsWithPrefix = function (prefix, subjectList) {
        var subjectsWithPrefix = [];
        for (var s = 0; s < subjectList.length; s++) {
            if (subjectList[s].indexOf(prefix) > -1) {
                subjectsWithPrefix.push(subjectList[s]);
            }
        }
        return subjectsWithPrefix;
    }

    var getPrefixPatient = function (anOptimiseID) {
        return parseInt(anOptimiseID.substr(10));
    }

    function sortNumber(a, b) {
        return a - b;
    }

    $scope.generateUSUBJID = function () {
        var prefix = "OPT-" + siteID + "-";
        var newID = "";

        if (sourceMode == 'computer') {
            prefix = prefix + "01-";
            var subjectList = localStorage.getItem('NHS_OPT_Map');

            if (subjectList != null) {
                subjectList = JSON.parse(subjectList);
                var usubjidList = [];
                for (var s = 0; s < subjectList.length; s++) {
                    usubjidList.push(subjectList[s].USUBJID);
                }

                var subjectsWithPrefix = selectSubjectsWithPrefix(prefix, usubjidList);
                if (subjectsWithPrefix.length > 0) {
                    subjectsWithPrefix.sort(sortNumber);
                    var mostRecentPatient = subjectsWithPrefix[subjectsWithPrefix.length - 1];

                    var mostRecentPatientPrefix = getPrefixPatient(mostRecentPatient);
                    var newPatientPrefix = mostRecentPatientPrefix + 1;
                    newID = prefix + newPatientPrefix;
                }
                else {
                    newID = prefix + 0;
                }
            }
            else {
                newID = prefix + "0";
            }
            $scope.USUBJID = newID;
        }
    }

    var is_OPT_USUBJID = function (USUBJID_String) {
        if (USUBJID_String.substr(0, 3) == 'OPT')
            return true;
        else
            return false;
    }

    var get_OPT_USUBJID = function (NHSID) {
        var subjects = JSON.parse(localStorage.getItem("NHS_OPT_Map"));
        if (subjects != null)
            for (var s = 0; s < subjects.length; s++)
                if (subjects[s].NHS_USUBJID == NHSID)
                    return subjects[s].USUBJID;
        return '';
    }

    $scope.subjectFound = false;
    $scope.searchInProgress = false;

    $scope.getSubjectFound = function () {
        if ($scope.subjectFound)
            return true;
        return false;
    }

    $scope.getSearchStatus = function () {
        if ($scope.subjectFound)
            return "Found";

        if ($scope.searchInProgress)
            return "Searching..";
        return "Not Found";
    }

    $scope.checkIfIDExists = function () {
        var lengthToStartSearch = 0;
        lengthToStartSearch = 12;

        if ($scope.NHS_USUBJID.length >= lengthToStartSearch) {
            if (sourceMode == 'computer') {

                var subjectList = localStorage.getItem('NHS_OPT_Map');
                if (subjectList != null) {
                    subjectList = JSON.parse(subjectList);
                    for (var s = 0; s < subjectList.length; s++) {
                        if (subjectList[s].NHS_USUBJID == $scope.NHS_USUBJID) {
                            alert("This subject already exists");
                            $scope.NHS_USUBJID = '';
                            return;
                        }
                    }
                }
            }
            else if (sourceMode == 'internet') {
                var nhsList = records.getNHSIDList();
                nhsList.then(function (data) {
                    if (data.NHS_USUBJID != null) {
                        for (var s = 0; s < data.NHS_USUBJID.length; s++) {
                            if (data.NHS_USUBJID[s] == $scope.NHS_USUBJID) {
                                alert("This subject already exists");
                                $scope.NHS_USUBJID = '';
                                return;
                            }
                        }
                    }
                })
            }
        }
    }

    $scope.fileNameChanged = function (element) {
        $scope.$apply(function () {
            $scope.search_USUBJID = "";
            var sourceFile = element.files[0];
            console.log(sourceFile);
            var textType = /json.*/;
            if (sourceFile.type.match(textType)) {
                var reader = new FileReader();

                reader.onload = (function (e) {
                    var RecordSet = JSON.parse(reader.result.toString());
                    if (RecordSet != null) {
                        $scope.newData.recordSet = RecordSet;
                        $scope.subjectFound = true;
                    }
                });
                reader.readAsText(sourceFile);
                $scope.subjectFound = true;
            } else {
                console.log("File not supported!")
            }
        });
    };

    $scope.recordMade = true;

    $scope.okToProceed = function () {
        if ($scope.actionMode == 'Load') {
            return $scope.subjectFound;
        }
        else if ($scope.actionMode == 'New') {
            return $scope.recordMade;
        }
        return true;
    }

    $scope.startSearch = function () {
        var lengthToStartSearch = 10;

        if ($scope.search_USUBJID.length >= lengthToStartSearch) {
            $scope.searchInProgress = true;
            if (is_OPT_USUBJID($scope.search_USUBJID)) { // use USUBJID to search
                $scope.USUBJID = $scope.search_USUBJID;
                if (sourceMode == 'computer') {
                    var Records = localStorage.getItem($scope.search_USUBJID);
                    if (Records != null) {
                        Records = JSON.parse(Records);
                        $scope.subjectFound = true;
                        $scope.newData.recordSet = Records;
                    }
                    else {
                        $scope.subjectFound = false;
                    }
                }
                else if (sourceMode == 'internet') {
                    var subjectData = records.getSubject($scope.search_USUBJID);
                    subjectData.then(function (data) {
                        $scope.searchInProgress = false;
                        var RecordSet = data.RecordSet;
                        if (RecordSet.length == 0) {
                            $scope.subjectFound = false;
                        } else {
                            $scope.subjectFound = true;
                            $scope.newData.recordSet = RecordSet;
                        }
                    });
                }
            } else {
                if (sourceMode == 'computer') {
                    var USUBJID = get_OPT_USUBJID($scope.search_USUBJID);
                    $scope.USUBJID = USUBJID;
                    $scope.searchInProgress = true;
                    var Records = localStorage.getItem(USUBJID);
                    if (Records != null) {
                        Records = JSON.parse(Records);
                        $scope.subjectFound = true;
                        $scope.newData.recordSet = Records;
                    }
                    else {
                        $scope.subjectFound = false;
                    }
                    $scope.searchInProgress = false;
                }
                else if (sourceMode == 'internet') {
                    var subjectDMData = records.getOptimiseID($scope.search_USUBJID);
                    $scope.searchInProgress = true;
                    subjectDMData.then(function (data) {
                        var RecordSet = data.RecordSet;
                        if (RecordSet.length == 0) {
                            $scope.searchInProgress = false;
                            return '';
                        }
                        else {
                            $scope.recordExistsStatus = $scope.search_USUBJID + " found";
                            for (var recordItem = 0; recordItem < RecordSet.length; recordItem++) {
                                var aRecordItems = RecordSet[recordItem].RecordItems;
                                for (var item = 0; item < aRecordItems.length; item++) {
                                    if (aRecordItems[item].fieldName == "USUBJID") {
                                        $scope.USUBJID = aRecordItems[item].value;
                                        var subjectData = records.getSubject(aRecordItems[item].value);
                                        subjectData.then(function (data) {
                                            $scope.searchInProgress = false;
                                            var RecordSet = data.RecordSet;
                                            if (RecordSet.length == 0) {
                                                $scope.subjectFound = false;
                                            } else {
                                                $scope.subjectFound = true;
                                                $scope.newData.recordSet = RecordSet;

                                            }
                                        });
                                    }
                                }

                            }
                            return '';
                        }
                    })
                }
            }
        }
        else
            $scope.subjectFound = false;
    }

    if ($scope.actionMode == 'New' && (sourceMode == 'computer'))
        $scope.generateUSUBJID();

    $scope.consentGiven = "";

    $scope.ok = function () {
        $scope.newData.search_USUBJID = $scope.search_USUBJID;
        $scope.newData.USUBJID = $scope.USUBJID;
        $scope.newData.NHS_USUBJID = $scope.NHS_USUBJID;
        //        $scope.newData.AGE= $scope.updateAge($scope.BRTHDTC);
        //        if (($scope.BRTHDTC != null)&& ($scope.BRTHDTC != ''))
        //            $scope.newData.BRTHDTC= new Date($scope.BRTHDTC,getMonthIndex(),1);
        //        else
        //            $scope.newData.BRTHDTC = '';
        //        $scope.newData.SEX= $scope.SEX;
        //        $scope.newData.ETHNIC= $scope.ETHNIC;
        $scope.newData.actionMode = $scope.actionMode;
        if ($scope.consentGiven) {
            $scope.newData.RFICDTC = new Date();
        };
        //$scope.newData.primaryDataGroup = $scope.PrimaryDataGroup;
        $uibModalInstance.close($scope.newData);
    };

    //    $scope.updateAge = function() {
    //        if ($scope.BRTHDTC != null){
    //            if ($scope.BRTHDTC != '')
    //                if ($scope.BRTHDTC > 1900)
    //                {
    //                    var dayInMilliseconds=1000*60*60*24;
    //                    var dateEnd = new Date();
    //                    var dateStart = new Date($scope.BRTHDTC,getMonthIndex(),1);
    //                    var durationInDays = Math.round((dateEnd-dateStart)/dayInMilliseconds);
    //                    return (Math.round(durationInDays/365)-1)+" years";
    //                }
    //        }
    //        return '';
    //    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});

headerModule.controller('appointmentsCtrl', function ($scope, $uibModalInstance, records, NgTableParams, sourceMode, remindersForAppointmentsDue) {

    $scope.data = [];

    var makeAppointmentsAPICall = function () {
        var appointments = [];

        if (sourceMode == 'internet') {
            var appointmentsAPICall = records.getDueAppointments();
            appointmentsAPICall.then(function (data) {
                //console.log(data);
                var reminders = data.Reminders;
                if (reminders == null)
                    return;
                var subjectIDs = Object.keys(reminders);

                for (var s = 0; s < subjectIDs.length; s++) {
                    //console.log(subjectIDs[s]);
                    var id = subjectIDs[s];
                    for (var a = 0; a < reminders[id].length; a++) {
                        var anAppointment = reminders[id][a];
                        var lastAppointment = anAppointment['LastAppointment'];
                        var due = anAppointment['DueAppointment'];
                        var notes = anAppointment['Notes'];

                        var aReminder = { 'id': id, 'last': lastAppointment, 'due': due, 'notes': notes };
                        //console.log(aReminder);
                        appointments.push(aReminder);
                    }

                }
                $scope.tableParams.settings({
                    dataset: appointments
                });
                $scope.data = appointments.slice(0);
            });
        }
        else {
            remindersForAppointmentsDue.getAppointments().then(function (reminders) {
                for (var r = 0; r < reminders.length; r++) {
                    appointments.push(reminders[r]);
                }
            });
            $scope.tableParams.settings({
                dataset: appointments
            });
            $scope.data = appointments.slice(0);
        }
    }
    $scope.tableParams = new NgTableParams({}, { dataset: [] });

    makeAppointmentsAPICall();

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

headerModule.controller('configInstanceCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

headerModule.controller('searchCtrl', function ($scope, $uibModalInstance, sourceMode, records, NgTableParams, $timeout) {

    $scope.fieldsList = {
        "USUBJID": {
            "domain": "DM",
            "type": "String",
            "label": "Unique subject identifier",
            "tags": [
                ""
            ],
            "enabled": false
        },
        "BRTHDTC": {
            "domain": "DM",
            "type": "Date",
            "label": "Date/time of birth",
            "tags": [
                "DOB",
                "age"
            ],
            "enabled": true
        },
        "CECAT": {
            "domain": "CE",
            "type": "Categorical",
            "label": "Category of clinical event",
            "tags": [
                ""
            ],
            "values": [
                "Symptom",
                "Sign"
            ],
            "enabled": true
        },
        "QSSTRESN": {
            "domain": "QS",
            "type": "Number",
            "label": "Numeric finding in standard units",
            "tags": [
                ""
            ],
            "enabled": true
        },
        "CESEV": {
            "domain": "CE",
            "type": "Categorical",
            "label": "Severity or intensity of clinical event",
            "tags": [
                ""
            ],
            "values": [
                "Mild",
                "Moderate",
                "Severe"
            ],
            "enabled": true
        },
        "DOMINANT": {
            "domain": "DM",
            "type": "Categorical",
            "label": "Dominant side",
            "tags": [
                ""
            ],
            "values": [
                "Right",
                "Left",
                "Ambidextrous"
            ],
            "enabled": true
        },
        "FAORES": {
            "domain": "FA",
            "type": "Categorical",
            "label": "Presence or absence of disease",
            "tags": [
                ""
            ],
            "values": [
                "Yes",
                "No"
            ],
            "enabled": true
        },
        "QSCAT": {
            "domain": "QS",
            "type": "Categorical",
            "label": "Category of question",
            "tags": [
                ""
            ],
            "values": [
                "EDSS",
                "EDMUS"
            ],
            "enabled": true
        },
        "SUTRT": {
            "domain": "SU",
            "type": "Categorical",
            "label": "Type of substance",
            "tags": [
                ""
            ],
            "values": [
                "ALCOHOL"
            ],
            "enabled": true
        },
        "SCTEST": {
            "domain": "SC",
            "type": "Categorical",
            "label": "",
            "tags": [
                ""
            ],
            "values": [
                "SMOKING HISTORY"
            ],
            "enabled": true
        },
        "CEOUT": {
            "domain": "CE",
            "type": "Categorical",
            "label": "Outcome of clinical event",
            "tags": [
                ""
            ],
            "values": [
                "Complete",
                "Partial",
                "None"
            ],
            "enabled": true
        },
        "SEX": {
            "domain": "DM",
            "type": "Categorical",
            "label": "Sex",
            "tags": [
                "gender"
            ],
            "values": [
                "Female",
                "Male",
                "Other"
            ],
            "enabled": true
        },
        "SUDOSFRQ": {
            "domain": "SU",
            "type": "String",
            "label": "Alcohol consumption",
            "tags": [
                ""
            ],
            "values": [
                "More than 3 units a day",
                "Less than 3 units a day",
                "Less than 3 units a week"
            ],
            "enabled": true
        },
        "ETHNIC": {
            "domain": "DM",
            "type": "Categorical",
            "label": "Ethnicity",
            "tags": [
                ""
            ],
            "values": [
                "White",
                "Black",
                "Chinese",
                "Other Asian",
                "Native American",
                "Arab",
                "Persian",
                "Other Mixed"
            ],
            "enabled": true
        },
        "SCORRES": {
            "domain": "SC",
            "type": "Categorical",
            "label": "Smoking history",
            "tags": [
                ""
            ],
            "values": [
                "Smoker",
                "Ex-smoker",
                "Never smoked"
            ],
            "enabled": true
        },
        "MHENRTPT": {
            "domain": "MH",
            "type": "Categorical",
            "label": "",
            "tags": [
                ""
            ],
            "values": [
                "Ongoing",
                "Resolved",
                "Unknown"
            ],
            "enabled": true
        },
        "SREL": {
            "domain": "",
            "type": "Categorical",
            "label": "",
            "tags": [
                ""
            ],
            "values": [
                "",
                "Mother",
                "Father",
                "Twin",
                "Sister",
                "Brother",
                "Maternal Grandparent",
                "Paternal Grandparent",
                "Maternal Ant/ Uncle",
                "Maternal Cousin",
                "Paternal Ant/ Uncle",
                "Paternal Cousin"
            ],
            "enabled": true
        },
        "MHTERM": {
            "domain": "MH",
            "type": "Mixed",
            "label": "",
            "tags": [
                ""
            ],
            "values": [
                "RIS",
                "CIS",
                "ADEM",
                "MS",
                "NMOSD"
            ],
            "enabled": true
        },
        "VSTEST": {
            "domain": "VS",
            "type": "String",
            "label": "Vital signs test name",
            "tags": [
                ""
            ],
            "values": [
                "Systolic Blood Pressure",
                "Diastolic Blood Pressure",
                "Height",
                "Pulse Rate",
                "Weight"
            ],
            "enabled": true
        },
        "CETERM": {
            "domain": "CE",
            "type": "String",
            "label": "Reported term for the clinical event",
            "tags": [
                ""
            ],
            "values": [
                "Cognitive problems",
                "Emotional lability",
                "Depression",
                "Fatigue",
                ""
            ],
            "enabled": true
        },
        "CEBODSYS": {
            "domain": "CE",
            "type": "Categorical",
            "label": "Body system or organ class involved in the clinical event",
            "tags": [
                ""
            ],
            "values": [
                "Face",
                "Upper Limbs",
                "Lower Limbs",
                "Trunk",
                "Eye",
                "Biceps",
                "Patella",
                "Ankle",
                "Pyramidal Tract",
                "Cerebellum",
                "Brain Stem",
                "Sensory",
                "Bowel Bladder",
                "Visual",
                "Higher Function"
            ],
            "enabled": true
        },
        "EXADJ": {
            "domain": "EX",
            "type": "Categorical",
            "label": "Reason for dose adjustment",
            "tags": [
                "exposure adjustment",
                "change of dose"
            ],
            "values": [
                "Pregnancy",
                "Convenience",
                "Adverse Event",
                "Unknown",
                "Patient Preference",
                "Disease Progression"
            ],
            "enabled": true
        },
        "EXCAT": {
            "domain": "EX",
            "type": "Categorical",
            "label": "Category of treatment",
            "tags": [
                "drug",
                "medical",
                "exposure",
                "group"
            ],
            "values": [
                "Disease Modifying",
                "Symptomatic",
                "Other"
            ],
            "enabled": true
        },
        "EXTRT": {
            "domain": "EX",
            "type": "Categorical",
            "label": "Name of treatment",
            "tags": [
                "drug",
                "medical",
                "exposure"
            ],
            "values": [
                "Alemtuzumab (Lemtrada)",
                "Avonex (Interferon beta-1a)",
                "Azathioprine",
                "Betaferon (Interferon beta-1b)",
                "Cladribine (Mavenclad)",
                "Cyclophosphamide",
                "Daclizumab (Zinbryta)",
                "Dimethyl fumarate (Tecfidera)",
                "Extavia (beta interferon-1b)",
                "Fingolimod (Gilenya)",
                "Glatiramer acetate (Copaxone)",
                "Methotrexate",
                "Mitoxantrone",
                "Natalizumab (Tysabri)",
                "Plegridy (peginterferon beta-1a)",
                "Rebif (beta interferon-1a)",
                "Rituximab",
                "Teriflunomide (Aubagio)",
                "4-aminopyridine",
                "Corticosteroids",
                "Prednisone",
                "Amantadine",
                "Baclofen",
                "IV Methyl-prednisolone",
                "IVIG",
                "Plasma Exchange",
                "Mycophenolic Acid",
                "Neuropsych. Training",
                "Physiotherapy",
                "Cognitive Therapy"
            ],
            "enabled": true
        },
        "MOTEST": {
            "domain": "MO",
            "type": "Categorical",
            "label": "Test or examination name",
            "tags": [
                ""
            ],
            "values": [
                "T1 Lesion Count Summary",
                "Lesion Count Summary",
                "Lesion Count",
                "Lesion Volume",
                "Gd Enhancing Lesion Count Summary",
                "Gd Enhancing Lesion Volume",
                "T2 Lesion",
                "Gd Lesion"
            ],
            "enabled": true
        }
    }

    $scope.criteria = {};
    $scope.criteriaCount = 0;
    $scope.criteriaFiltered

    var filterPatientList = function () {

        $scope.criteriaFiltered = $.extend(true, {}, $scope.flatRecords);
        var shouldKeeps = $('.search-field-criteria').find('input, textarea, select').map((i, e) => $(e).data('shouldKeep'))

        $.each(shouldKeeps, function (i, shouldKeep) {
            Object.keys($scope.criteriaFiltered).forEach(function (key) {
                if (!shouldKeep($scope.criteriaFiltered[key]))
                    delete $scope.criteriaFiltered[key];
            })
        });

        var dmData = []
        Object.keys($scope.criteriaFiltered).forEach(function (key) {
            var row = { opt_id: key, nhs_id: 'nhs_id' };
            dmData.push(row);
        });
        
        $scope.tableParams.settings({
            dataset: dmData
        });

        $scope.tableParams.reload();
        $scope.data = dmData.slice(0);

    }

    var renderCriteria = function () {

        var criteriaTerrain = $('.search-field-criteria');
        var orderedCriteria = [];
        Object.keys($scope.criteria).forEach(function (key) {
            orderedCriteria[$scope.criteria[key].order] = $scope.criteria[key]
        });

        criteriaTerrain.find('div').each(function (i, element) {
            if (orderedCriteria[$(element).attr('data-order')] == undefined)
                $(element).remove();
        })

        $.each(orderedCriteria, function (i, criterion) {
            if (criterion == undefined)
                return;
            if (criteriaTerrain.find('div[data-order=' + criterion.order + ']').length > 0)
                return;
            var criterionBox = $('<div>').attr('data-order', criterion.order);
            criterionBox.append($('<span>').text(criterion.name));
            switch ($scope.fieldsList[criterion.id].type) {
                case "Categorical":
                    var optionSet = $('<select>');
                    $.each($scope.fieldsList[criterion.id].values, function (i, element) {
                        optionSet.append($('<option>').attr('value', i).text(element));
                    })
                    optionSet.data({
                        'fieldID': criterion.id,
                        'shouldKeep': function (patientRecord) {
                            var ret = false;
                            Object.keys(patientRecord).forEach(function (domain) {
                                $.each(patientRecord[domain], function (i, record) {
                                    if (record.hasOwnProperty(optionSet.data('fieldID'))) {
                                        if (record[optionSet.data('fieldID')] === $scope.fieldsList[optionSet.data('fieldID')].values[optionSet.find(":selected")[0].value])
                                            ret = true
                                    }
                                })
                            });
                            return ret;
                        }
                    });
                    criterionBox.append(optionSet);
                break;
                case "String":
                    var inputField = $('<input>');
                    inputField.data({
                        'fieldID': criterion.id,
                        'shouldKeep': function (patientRecord) {
                            var ret = false;
                            Object.keys(patientRecord).forEach(function (domain) {
                                $.each(patientRecord[domain], function (i, record) {
                                    if (record.hasOwnProperty(inputField.data('fieldID'))) {
                                        if (record[inputField.data('fieldID')].includes(inputField.val()))
                                            ret = true
                                    }
                                })
                            });
                            return ret;
                        }
                    });
                    criterionBox.append(inputField);
                break;
                case "Date":
                // TO-DO make datepicker
                break;
                case "Numeric":
                // TO-DO make slider
                break;
            }
            criterionBox.append($('<a>').text(' < Remove this filter').click(function () {
                delete $scope.criteria[criterion.id];
                renderCriteria();
            }))
            criteriaTerrain.append(criterionBox);
        })

        criteriaTerrain.find('input, textarea, select').on('change', function () {
            filterPatientList();
        }).on('keyup', function () {
            filterPatientList();
        });

        filterPatientList();
    }
    
    var addCriterion = function (field, constraint) {
        $scope.criteria[field.id] = {
            id: field.id,
            name: field.text,
            order: $scope.criteriaCount++
        }
        renderCriteria();
    }
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    var saveJSON = function (text, fileID) {
        var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        var url = fileID + '.json';
        saveAs(blob, url);
    };
    
    $scope.export = function () {
        saveJSON(JSON.stringify($scope.criteriaFiltered));
    };

    $uibModalInstance.rendered.then(function () {
        var token = records.getToken()
        if (token == null || token == "")
            return alert('Must log in first!')
        fetch('./api/opt.php?token=' + token).then(function (response) {
            return response.json();
        }).then(function (data) {


            $scope.flatRecords = {};
            $.each(data.RecordSet, function (i, record) {
                var flatItem = {};
                $.each(record.RecordItems, function (j, item) {
                    flatItem[item.fieldName] = item.value;
                })
                delete flatItem._id;
                $scope.flatRecords[flatItem.USUBJID] = $scope.flatRecords[flatItem.USUBJID] || {};
                $scope.flatRecords[flatItem.USUBJID][flatItem.DOMAIN] = $scope.flatRecords[flatItem.USUBJID][flatItem.DOMAIN] || []
                $scope.flatRecords[flatItem.USUBJID][flatItem.DOMAIN].push(flatItem);
            })

            var listSelect = $('.search-field-select')
            listSelect.empty();
            listSelect.append($('<option/>'));
            Object.keys($scope.fieldsList).forEach(function (key) {
                listSelect.append($('<option/>').attr('value', key).text($scope.fieldsList[key].label));
            })
            listSelect.select2({
                placeholder: "Filter on ...",
                allowClear: true
            });
            listSelect.on("select2:select", function (e) {
                addCriterion(e.params.data);
                listSelect.val(null).trigger('change');
            });
            
            $scope.tableParams = new NgTableParams({}, { dataset: [] });

            renderCriteria();
        });
    });

    $scope.selectionData = {
        selectedSubjects: [],
        actionMode: '',
        recordSet: '',
        USUBJID: ''
    };

    $scope.data = [];

    $scope.ok = function () {
        $uibModalInstance.close($scope.selectionData);
    };

    var findSubject = function (identifier) {
        // if (sourceMode == 'computer') {
        //     var Records = localStorage.getItem(identifier);
        //     if (Records != null) {
        //         Records = JSON.parse(Records);
        //         $scope.selectionData.recordSet = Records;
        //         $scope.selectionData.actionMode = 'Load';
        //         $scope.selectionData.USUBJID = identifier;
        //         $scope.ok();
        //     }
        // }
        // else if (sourceMode == 'internet') {
            var subjectData = records.getSubject(identifier);
            subjectData.then(function (data) {
                var RecordSet = data.RecordSet;
                if (RecordSet == null || RecordSet.length == 0) {
                    console.log("Patient not found. An error occured");
                    // $scope.deleteSubject(identifier);
                } else {
                    $scope.selectionData.recordSet = RecordSet;
                    $scope.selectionData.actionMode = 'Load';
                    $scope.selectionData.USUBJID = identifier;
                    $scope.ok();
                }
            });
        // }
    }

    $scope.loadSubjectData = function (identifier) {
        $scope.selectionData.actionMode = 'Load';
        findSubject(identifier);
    }
});

headerModule.controller('depositoryCtrl', function ($scope, $uibModalInstance, sourceMode, records, NgTableParams, $timeout) {

    $scope.selectionData = {
        selectedSubjects: [],
        actionMode: '',
        recordSet: '',
        USUBJID: ''
    };

    $scope.data = [];

    var getAge = function (BRTHDTC) {
        if (BRTHDTC != null) {
            if (BRTHDTC != '')
                var dayInMilliseconds = 1000 * 60 * 60 * 24;
            var dateEnd = new Date();
            var dateStart = new Date(BRTHDTC);
            var durationInDays = Math.round((dateEnd - dateStart) / dayInMilliseconds);
            return Math.round(durationInDays / 365.25);
        }
        return '';
    }

    $scope.deleteSubject = function (subject_usubjid) {
        if (sourceMode == 'internet') {
            var deletionProcess = records.deleteSubject(subject_usubjid);
            deletionProcess.then(function (result) {
                makeDemographicAPICall();
            });
        }
        if (sourceMode == 'computer') {
            localStorage.removeItem(subject_usubjid);
            var subjects = localStorage.getItem("NHS_OPT_Map");
            if (subjects == null)
                subjects = [];
            else
                subjects = JSON.parse(subjects);

            for (var s = 0; s < subjects.length; s++) {
                if (subjects[s].USUBJID == subject_usubjid) {
                    subjects.splice(s, 1);
                    break;
                }
            }
            localStorage.setItem("NHS_OPT_Map", JSON.stringify(subjects));
            makeDemographicAPICall();
        }
    }

    var makeDemographicAPICall = function () {
        if (sourceMode == 'internet') {
            var dmData = [];
            var demographicAPICall = records.getAllDemographics();
            demographicAPICall.then(function (demographics) {
                var dmRecords = demographics.RecordSet;
                for (var dm = 0; dm < dmRecords.length; dm++) {
                    var aRecord = dmRecords[dm];
                    var opt_id = '';
                    var nhs_id = '';
                    var age = '';
                    var sex = '';
                    var rficdtc = '';
                    var aRecordItems = aRecord.RecordItems;
                    for (var item = 0; item < aRecordItems.length; item++) {
                        if (aRecordItems[item].fieldName == 'USUBJID')
                            opt_id = aRecordItems[item].value;
                        else if (aRecordItems[item].fieldName == 'NHS_USUBJID')
                            nhs_id = aRecordItems[item].value;
                        else if (aRecordItems[item].fieldName == 'BRTHDTC')
                            age = getAge(aRecordItems[item].value);
                        else if (aRecordItems[item].fieldName == 'SEX')
                            sex = aRecordItems[item].value;
                        else if (aRecordItems[item].fieldName == 'RFICDTC')
                            rficdtc = aRecordItems[item].value;
                    }
                    var row = { opt_id: opt_id, nhs_id: nhs_id, age: age, sex: sex, rficdtc: rficdtc, selected: false };
                    dmData.push(row);
                }

                $timeout(function () {
                }, 300).then(function () {

                    $scope.tableParams.settings({
                        dataset: dmData
                    });
                    $scope.data = dmData.slice(0);

                });
            })
        }
        else {
            var dmData = [];
            var subjectList = localStorage.getItem('NHS_OPT_Map');
            if (subjectList != null) {
                subjectList = JSON.parse(subjectList);
                for (var s = 0; s < subjectList.length; s++) {
                    var anItem = JSON.parse(localStorage.getItem(subjectList[s].USUBJID));
                    if (anItem == null) {
                        $scope.deleteSubject(subjectList[s].USUBJID);
                        alert(subjectList[s].USUBJID + " removed. Close window and try again.")
                        return;
                    }
                    var RecordSet = JSON.parse(localStorage.getItem(subjectList[s].USUBJID)).RecordSet;
                    var opt_id = '';
                    var nhs_id = '';
                    var age = '';
                    var sex = '';
                    var rficdtc = '';
                    for (var r = 0; r < RecordSet.length; r++) {
                        if (RecordSet[r] != null) {
                            var RecordItem = RecordSet[r].RecordItems;
                            for (var item = 0; item < RecordItem.length; item++) {
                                if ((RecordItem[item].fieldName == "DOMAIN") && (RecordItem[item].value == "DM")) {
                                    for (var i = 0; i < RecordItem.length; i++) {
                                        if (RecordItem[i].fieldName == 'USUBJID')
                                            opt_id = RecordItem[i].value;
                                        else if (RecordItem[i].fieldName == 'NHS_USUBJID')
                                            nhs_id = RecordItem[i].value;
                                        else if (RecordItem[i].fieldName == 'BRTHDTC')
                                            age = getAge(records.formatStringToDate(RecordItem[i].value));
                                        else if (RecordItem[i].fieldName == 'SEX')
                                            sex = RecordItem[i].value;
                                        else if (RecordItem[i].fieldName == 'RFICDTC') {
                                            rficdtc = RecordItem[i].value;
                                        }

                                    }
                                    var row = { opt_id: opt_id, nhs_id: nhs_id, age: age, sex: sex, rficdtc: rficdtc, selected: false };
                                    dmData.push(row);
                                }
                            }
                        }

                    }
                }
                $timeout(function () {
                }, 300).then(function () {
                    $scope.tableParams.settings({
                        dataset: dmData
                    });
                    $scope.data = dmData.slice(0);
                });

            }
        }
    }

    var findSubject = function (identifier) {
        if (sourceMode == 'computer') {
            var Records = localStorage.getItem(identifier);
            if (Records != null) {
                Records = JSON.parse(Records);
                $scope.selectionData.recordSet = Records;
                $scope.selectionData.actionMode = 'Load';
                $scope.selectionData.USUBJID = identifier;
                $scope.ok();
            }
        }
        else if (sourceMode == 'internet') {
            var subjectData = records.getSubject(identifier);
            subjectData.then(function (data) {
                var RecordSet = data.RecordSet;
                if (RecordSet.length == 0) {
                    alert("Patient not found. This record will be removed");
                    $scope.deleteSubject(identifier);
                } else {
                    $scope.selectionData.recordSet = RecordSet;
                    $scope.selectionData.actionMode = 'Load';
                    $scope.selectionData.USUBJID = identifier;
                    $scope.ok();
                }
            });
        }
    }

    $scope.loadSubjectData = function (identifier) {
        $scope.selectionData.actionMode = 'Load';
        findSubject(identifier);
    }

    $scope.tableParams = new NgTableParams({}, { dataset: [] });

    makeDemographicAPICall();

    $scope.ok = function () {

        $uibModalInstance.close($scope.selectionData);
    };

    $scope.export = function () {
        $scope.selectionData.actionMode = 'Export';
        for (var s = 0; s < $scope.data.length; s++) {
            if ($scope.data[s].selected == true) {
                $scope.selectionData.selectedSubjects.push($scope.data[s].opt_id);
                findSubject($scope.data[s].opt_id);
            }
        }
        $scope.ok();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.givenConsent = function (subject) {
        return subject.rficdtc;
    }
});

headerModule.controller('headerCtrl', function ($rootScope,
    $scope,
    $q, $timeout,
    $uibModal,
    viewService,
    clinicalEvents,
    questionnaires,
    findingsAbout,
    subjectVisits,
    exposures,
    USUBJID, USERID, CONFIG, OptimiseDefaultConfig,
    records,
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
    reminders, exportService) {



    var today = new Date();
    var dayMonthYear = angular.element(document.querySelector('#events .input-group.DTC_DayMonthYear'));
    dayMonthYear.datepicker({
        format: "dd/mm/yyyy",
        startView: 1,
        orientation: "top left",
        autoclose: true,
        todayHighlight: true,
        endDate: today.getFullYear().toString()
    });

    var monthYear = angular.element(document.querySelector('#events input.input-group.DTC_MonthYear'));
    monthYear.datepicker({
        format: "mm/yyyy",
        orientation: "top left",
        minViewMode: 1,
        startView: 1,
        autoclose: true,
        todayHighlight: true,
        endDate: today.getFullYear().toString()
    });

    $scope.getCalendarType = function () {

        if ($scope.contentOnDisplay == "Relapse") {
            return "form-control DTC_MonthYear";
        }

        else {
            return "form-control DTC_DayMonthYear";
        }

    }

    $scope.connectionAvailable = function () {
        if ((navigator.onLine) && ($scope.authenticatedStatus == "Logged In")) {

            return true;
        }
        else
            return false;
    }



    var setupConfig = function (config) {
        viewService.setConfiguration(config);
    }

    var pullViewConfiguration = function () {
        if ($scope.sourceMode == 'internet') {
            CONFIG.getOnlineSetting(records.getURL('Config')).get({}, function (data) {
                data.$promise.then(function () {
                    viewService.setConfiguration(data);
                })
            }, function (error) {
                console.log(error);
            });
        }
        else {
            viewService.setConfiguration(OptimiseDefaultConfig);
        }
    }

    $scope.sourceMode = 'computer'; //computer vs internet
    if ($scope.sourceMode == 'internet')
        viewService.setOffline(false);
    else
        viewService.setOffline(true);

    //    viewService.setOffline(false);
    $scope.actionMode = 'New'; // load vs new
    $scope.UserName = "";
    $scope.Password = "";

    if (!$scope.connectionAvailable()) {
        $scope.sourceMode = 'computer';
        viewService.setOffline(true);
    }

    $scope.newInterest = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'newInterest.html',
            controller: 'newInterestCtrl'
        });
        modalInstance.result.then(function (newInterestDetails) {
            records.createNewInterest(newInterestDetails.name, newInterestDetails.email);
        }, function () {
        });
    }
    //
    //    if ($scope.connectionAvailable())
    //        $scope.newInterest();

    $scope.setSourceMode = function (mode) {
        $scope.sourceMode = mode;
        if ($scope.sourceMode == 'internet')
            viewService.setOffline(false);
        else
            viewService.setOffline(true);
        clearCurrentPatientSession();
    }

    $scope.authenticatedStatus = "Log in";
    if ($scope.sourceMode == 'computer') {
        viewService.setAuthenticated(true);
        viewService.setOffline(true);
    }

    $scope.siteID = "DM";

    $scope.navigatorIsOnline = function () {
        return navigator.onLine;
    }

    pullViewConfiguration();

    $scope.authenticate = function () {
        var authenticationDetails = { "username": $scope.UserName, "password": $scope.Password, "expire_in_seconds": 120 };
        if (navigator.onLine) {
            if (($scope.UserName.length > 0) && ($scope.Password.length > 0)) {

                USERID.save(authenticationDetails, function (data) {
                    data.$promise.then(function () {
                        if (data.result == 'succeed') {
                            records.setToken(data.token);
                            setupConfig(data.config);
                            viewService.setAuthenticated(true);
                            $scope.authenticatedStatus = "Logged In";

                            if ((data.siteID != null) && (data.siteID != ''))
                                $scope.siteID = data.siteID;

                            //pullViewConfiguration();
                            setupConfig(data.config);
                            $scope.sourceMode = 'internet';
                            viewService.setOffline(false);
                            clearCurrentPatientSession();
                            $scope.contentOnDisplay = 'Patient';
                            $scope.setContent();
                        }
                    });
                }, function (err) {
                    var errorMsg = "Login Failed: " + err.data.desp;
                    $scope.UserName = "";
                    $scope.Password = "";
                    alert(errorMsg);
                });
            }
            else {
                alert("User name and password please");
            }
        }
    }

    $scope.disableEntry = function () {

        if ($scope.sourceMode == 'internet')
            return !viewService.isAuthenticated();
        else
            return false;
    }

    $scope.showThisPanel = function (term) {
        return viewService.getConfigurationSetting(term);
    }

    var countryList = new Country();
    $scope.getCountries = function () {
        return countryList;
    }


    $scope.openConfig = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'config.html',
            controller: 'configInstanceCtrl',
            windowClass: 'config-modal-window'
        });
    }

    $scope.thereIsAPatient = function () {
        if (patients.getCurrentPatient() == null) {
            return false;
        }
        return true;
    }


    $scope.newPatient = function () {
        clearCurrentPatientSession();

        var modalInstance = $uibModal.open({
            templateUrl: 'newPatient.html',
            controller: 'newPatientInstanceCtrl',
            resolve: {
                sourceMode: function () {
                    return $scope.sourceMode;
                },
                siteID: function () {
                    return $scope.siteID;
                },
                searchCriteria: function () {
                    return $scope.searchCriteria;
                }
            }
        });

        modalInstance.result.then(function (newData) {
            $scope.actionMode = newData.actionMode;

            var prefix = "OPT-" + $scope.siteID + "-02-";
            if ($scope.actionMode == 'New') {
                patients.newPatient(newData.USUBJID,
                    $scope.siteID,
                    newData.NHS_USUBJID,
                    newData.RFICDTC
                );

                if ($scope.sourceMode == 'internet') {
                    var newSubject = records.createNewSubject(patients.getCurrentPatient(), prefix);
                    newSubject.then(function (data) {
                        if (data.result == 'succeed') {
                            $scope.USUBJID = data.w_id;
                            patients.getCurrentPatient().USUBJID = $scope.USUBJID;
                            $scope.setEventUSUBJID($scope.USUBJID);
                            $scope.setExposureUSUBJID($scope.USUBJID);
                            $scope.setLabUSUBJID($scope.USUBJID);
                            $scope.setMRIUSUBJID($scope.USUBJID, ($scope.authenticatedStatus == "Logged In") && ($scope.sourceMode == "internet"));
                            //$scope.setMRIUSUBJID($scope.USUBJID, false);
                            $scope.setVisitUSUBJID($scope.USUBJID);
                            $scope.setRelapseUSUBJID($scope.USUBJID);
                            $scope.setReminderSUBJID($scope.USUBJID, patients.getCurrentPatient().NHS_USUBJID);
                            $scope.setQuestionnaireUSUBJID($scope.USUBJID);
                            displayCurrentPatient();
                        }
                        else {
                            alert("Cannot create patient record");
                        }
                    })
                }
                else if ($scope.sourceMode == 'computer') {
                    $scope.USUBJID = newData.USUBJID;
                    $scope.setEventUSUBJID($scope.USUBJID);
                    $scope.setExposureUSUBJID($scope.USUBJID);
                    $scope.setLabUSUBJID($scope.USUBJID);
                    //$scope.setMRIUSUBJID($scope.USUBJID, $scope.sourceMode=='internet');
                    $scope.setMRIUSUBJID($scope.USUBJID, ($scope.authenticatedStatus == "Logged In") && ($scope.sourceMode == "internet"));
                    //$scope.setMRIUSUBJID($scope.USUBJID, false);
                    $scope.setVisitUSUBJID($scope.USUBJID);
                    $scope.setRelapseUSUBJID($scope.USUBJID);
                    $scope.setQuestionnaireUSUBJID($scope.USUBJID);
                    displayCurrentPatient();
                }
            }
            else if ($scope.actionMode == 'Load') {
                $scope.USUBJID = newData.USUBJID;
                if ($scope.sourceMode == 'internet') {
                    populateFromDB(newData.recordSet);
                }
                else if ($scope.sourceMode == 'computer') {
                    populateFromScriptedFile(newData.recordSet);
                };
            }
            else if ($scope.actionMode == "Delete") {
                $scope.USUBJID = newData.USUBJID;
                if ($scope.sourceMode == 'internet') {
                    deleteThisSubject();
                }
                if ($scope.sourceMode == 'computer') {
                    localStorage.removeItem($scope.USUBJID);
                    var subjects = localStorage.getItem("NHS_OPT_Map");
                    if (subjects == null)
                        subjects = [];
                    else
                        subjects = JSON.parse(subjects);

                    for (var s = 0; s < subjects.length; s++) {
                        if (subjects[s].USUBJID == $scope.USUBJID) {
                            subjects.splice(s, 1);
                            break;
                        }
                    }
                    localStorage.setItem("NHS_OPT_Map", JSON.stringify(subjects));
                }
            }

            //$scope.findToDelete = false;
        }, function () {
            console.log("New Patient Entry Cancelled");
        });

    };

    var getAge = function (BRTHDTC) {
        if (BRTHDTC != null) {
            if (BRTHDTC != '')
                if (BRTHDTC > 1900) {
                    var dayInMilliseconds = 1000 * 60 * 60 * 24;
                    var dateEnd = new Date();
                    var dateStart = new Date(BRTHDTC, 0, 1);
                    var durationInDays = Math.round((dateEnd - dateStart) / dayInMilliseconds);
                    return Math.round(durationInDays / 365.25) + " years";
                }
        }
        return '';
    }

    var populate = function (domain, aRecordItems) {
        switch (domain) {
            case 'SV':
                {
                    subjectVisits.populateSubjectVisits(aRecordItems);
                    break;
                }
            case 'QS':
                {
                    questionnaires.populateQuestionnaires(aRecordItems);
                    break;
                }
            case 'CE':
                {
                    clinicalEvents.populateClinicalEvents(aRecordItems);
                    break;
                }
            case 'FA':
                {
                    findingsAbout.populateFindings(aRecordItems);
                    //$scope.displayPatientFA();
                    break;
                }
            case 'PR':
                {
                    procedures.populateProcedures(aRecordItems);
                    break;
                }
            case 'EX':
                {
                    exposures.populateExposures(aRecordItems);
                    break;
                }
            case 'REL':
                {
                    relationships.populateRelationships(aRecordItems);
                    break;
                }
            case 'DM':
                {
                    patients.populatePatient(aRecordItems);
                    //$scope.displayPatientDM();
                    $scope.USUBJID = patients.getCurrentPatient().USUBJID;
                    $scope.SEX = patients.getCurrentPatient().SEX;
                    if (patients.getCurrentPatient().BRTHDTC != "")
                        $scope.AGE = getAge(patients.getCurrentPatient().BRTHDTC.getFullYear());
                    $scope.ALCOHOL = patients.getCurrentPatient().ALCOHOL;
                    $scope.SMOKER = patients.getCurrentPatient().SMOKER;
                    $scope.DOMINANT = patients.getCurrentPatient().DOMINANT;
                    $scope.ETHNIC = patients.getCurrentPatient().ETHNIC;
                    break;
                }
            case 'VS':
                {
                    vitalSigns.populateVitalSigns(aRecordItems);
                    break;
                }
            case 'LB':
                {
                    laboratoryTestResults.populateLabTestResults(aRecordItems);
                    break;
                }
            case 'IS':
                {
                    immunogenicitySpecimenAssessments.populateISA(aRecordItems);
                    break;
                }
            case 'MH':
                {
                    medicalHistory.populateMedicalHistory(aRecordItems);
                    //$scope.displayPatientMH();
                    break;
                }
            case 'APMH':
                {
                    associatedPersonMedicalHistories.populateAPMH(aRecordItems);
                    break;
                }
            case 'AE':
                {
                    adverseEventService.populateAdverseEvents(aRecordItems);
                    break;
                }
            case 'MO':
                {
                    morphologyServices.populateMorphologicalFindings(aRecordItems);
                    break;
                }
            case 'NV':
                {
                    nervousSystemFindings.populateNervousSystemFindings(aRecordItems);
                    break;
                }
            case 'SU':
                {
                    substanceUse.populateSubstanceUse(aRecordItems);
                    break;
                }
            case 'SC':
                {
                    subjectCharacteristic.populateSubjectCharacteristic(aRecordItems);
                    break;
                }
            case 'DU':
                {
                    deviceInUseServices.populateDeviceInUse(aRecordItems);
                    break;
                }
            case 'REMINDER':
                {
                    reminders.populateReminder(aRecordItems);
                    break;
                }
        }
    }

    var populateFromScriptedFile = function (records) {

        var Records = records;
        //console.log(Records);
        var RecordSet = Records.RecordSet;
        if (Records.RecordSet != null) {
            for (var i = 0; i < RecordSet.length; i++) {
                var RecordItem = RecordSet[i].RecordItems;
                var domain = getDomain(RecordItem);
                populate(domain, RecordItem);
            }
            exposures.populateInterruptions();
            displayCurrentPatient();
        }
    };

    var populateFromDB = function (recordSet) {

        var RecordSet = recordSet;
        if (RecordSet.length == 0) {
            $scope.recordExistsStatus = $scope.USUBJID + " not found";
            alert($scope.recordExistsStatus);
            $scope.USUBJID = '';
            //$scope.findToDelete=true;
            return false;
        }
        else {
            $scope.recordExistsStatus = " found";
            for (var recordItem = 0; recordItem < RecordSet.length; recordItem++) {
                var aRecordItems = RecordSet[recordItem].RecordItems;
                var domain = getDomain(aRecordItems);
                populate(domain, aRecordItems);
            }

            exposures.populateInterruptions();
            displayCurrentPatient();

            return true;
        }

    };

    $scope.overwriteDatabase = function () {
        //deleteThisSubject();
        var USUBJID = patients.getCurrentPatient().USUBJID;
        var jsonBody = angular.toJson(getRecordSet());
        records.overwriteSubject(USUBJID, jsonBody);
    };

    var is_OPT_USUBJID = function (USUBJID_String) {
        if (USUBJID_String.substr(0, 3) == 'OPT')
            return true;
        else
            return false;
    }

    var IDExists = function (OPT_ID) {
        var subjectList = localStorage.getItem('NHS_OPT_Map');
        if (subjectList != null) {
            subjectList = JSON.parse(subjectList);
            for (var s = 0; s < subjectList.length; s++) {
                if (subjectList[s].USUBJID == OPT_ID) {
                    return true;
                }
            }
        }
        return false;
    }

    $scope.downloadToDrive = function () {

        var token = records.getToken()
        if (token == null || token == "")
            return alert('Must log in first!')
        fetch('./api/opt.php?token=' + token).then(function (response) {
            return response.json();
        }).then(function (data) {
            var flatrecords = {};
            $.each(data.RecordSet, function (i, record) {
                var flatItem = {};
                $.each(record.RecordItems, function (j, item) {
                    flatItem[item.fieldName] = item.value;
                })
                delete flatItem._id;
                flatrecords[flatItem.USUBJID] = flatrecords[flatItem.USUBJID] || {};
                flatrecords[flatItem.USUBJID][flatItem.DOMAIN] = flatrecords[flatItem.USUBJID][flatItem.DOMAIN] || []
                flatrecords[flatItem.USUBJID][flatItem.DOMAIN].push(flatItem);
            })
            saveJSON(JSON.stringify(flatrecords));
        });
    }

    var getRecordSet = function () {
        var RecordItems = [];
        var root = { "RecordSet": RecordItems };

        var DM = patients.getCurrentPatient();
        var dmRecordItem = getRecordItem(DM);
        RecordItems.push(dmRecordItem);

        var VS = vitalSigns.getVitalSigns()
        for (var ce = 0; ce < VS.length; ce++) {
            var ceRecordItem = getRecordItem(VS[ce]);
            RecordItems.push(ceRecordItem);
        }

        var MH = medicalHistory.getMedicalHistory();
        for (var ce = 0; ce < MH.length; ce++) {
            var ceRecordItem = getRecordItem(MH[ce]);
            RecordItems.push(ceRecordItem);
        }

        var QS = questionnaires.getQuestionnaires()
        for (var ce = 0; ce < QS.length; ce++) {
            var ceRecordItem = getRecordItem(QS[ce]);
            RecordItems.push(ceRecordItem);
        }

        var CE = clinicalEvents.getClinicalEvents();
        for (var ce = 0; ce < CE.length; ce++) {
            var ceRecordItem = getRecordItem(CE[ce]);

            RecordItems.push(ceRecordItem);
        }

        var EX = exposures.getExposures();
        for (var ex = 0; ex < EX.length; ex++) {
            var exRecordItem = getRecordItem(EX[ex]);
            RecordItems.push(exRecordItem);
        }

        var FA = findingsAbout.getFindings();
        for (var fa = 0; fa < FA.length; fa++) {
            var faRecordItem = getRecordItem(FA[fa]);
            RecordItems.push(faRecordItem);
        }

        var LB = laboratoryTestResults.getLabTestResults();
        for (var lb = 0; lb < LB.length; lb++) {
            var lbRecordItem = getRecordItem(LB[lb]);
            RecordItems.push(lbRecordItem);
        }

        var ISA = immunogenicitySpecimenAssessments.getAssessments();
        for (var isa = 0; isa < ISA.length; isa++) {
            var isaRecordItem = getRecordItem(ISA[isa]);
            RecordItems.push(isaRecordItem);
        }

        var NV = nervousSystemFindings.getNervousSystemFindings();
        for (var nv = 0; nv < NV.length; nv++) {
            var nvRecordItem = getRecordItem(NV[nv]);
            RecordItems.push(nvRecordItem);
        }

        var AE = adverseEventService.getAdverseEvents();
        for (var ae = 0; ae < AE.length; ae++) {
            var aeRecordItem = getRecordItem(AE[ae]);
            RecordItems.push(aeRecordItem);
        }

        var SV = subjectVisits.getSubjectVisits();
        for (var sv = 0; sv < SV.length; sv++) {
            var svRecordItem = getRecordItem(SV[sv]);

            RecordItems.push(svRecordItem);
        }

        var MO = morphologyServices.getMorphologicalFindings();
        for (var mo = 0; mo < MO.length; mo++) {
            var moRecordItem = getRecordItem(MO[mo]);
            RecordItems.push(moRecordItem);
        }

        var PR = procedures.getProcedures();
        for (var pr = 0; pr < PR.length; pr++) {
            var prRecordItem = getRecordItem(PR[pr]);

            RecordItems.push(prRecordItem);
        }

        var SU = substanceUse.getSubstanceUse();
        for (var su = 0; su < SU.length; su++) {
            var suRecordItem = getRecordItem(SU[su]);
            RecordItems.push(suRecordItem);
        }

        var SC = subjectCharacteristic.getSubjectCharacteristics();
        for (var sc = 0; sc < SC.length; sc++) {
            var scRecordItem = getRecordItem(SC[sc]);
            RecordItems.push(scRecordItem);
        }

        var REL = relationships.getRelationships();
        for (var re = 0; re < REL.length; re++) {
            var reRecordItem = getRecordItem(REL[re]);
            RecordItems.push(reRecordItem);
        }

        var DU = deviceInUseServices.getDevicesInUse();
        for (var du = 0; re < DU.length; re++) {
            var duRecordItem = getRecordItem(DU[du]);

            RecordItems.push(duRecordItem);
        }

        var REMINDERS = reminders.getReminders();
        for (var rm = 0; rm < REMINDERS.length; rm++) {
            var rmRecordItem = getRecordItem(REMINDERS[rm]);
            RecordItems.push(rmRecordItem);
        }

        var APMH = associatedPersonMedicalHistories.getAPMHList();
        for (var rm = 0; rm < APMH.length; rm++) {
            var apmhRecordItem = getRecordItem(APMH[rm]);
            RecordItems.push(apmhRecordItem);
        }

        return (root);
    }

    var saveCSV = function (text) {
        var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        var url = 'OPTIMISE_' + new Date().getTime() + '.csv';
        saveAs(blob, url);
    };

    var saveJSON = function (text, fileID) {
        var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        var url = fileID + '.json';
        saveAs(blob, url);
    };

    var savePDF = function () {
        var doc = new jsPDF();
        doc.setFont("helvetica");
        var position = { x: 10, y: 5 };

        var patient = patients.getCurrentPatient();
        printADate(doc, position, patient);

        var position = { x: 20, y: 5 };
        printATitle(doc, position, patient);
        printRecord(doc, position, patient);

        var mh = medicalHistory.getMedicalHistory();
        if (mh.length != 0) {
            printATitle(doc, position, mh[0]);
            for (var r = 0; r < mh.length; r++) {
                printRecord(doc, position, mh[r]);
            }
        }

        addBreak(doc, position, patient);

        var relapses = clinicalEvents.getUniqueDatesFromCategory('MS Relapse');
        if (relapses.length != 0) {
            printATitle(doc, position, relapses[0]);
            for (var r = 0; r < relapses.length; r++) {
                printRecord(doc, position, relapses[r]);
            }
        }

        addBreak(doc, position, patient);

        //var exposures = exposures.getExposures();
        var EX = exposures.getExposures();
        if (EX.length != 0) {
            printATitle(doc, position, EX[0]);
            for (var r = 0; r < EX.length; r++) {
                printRecord(doc, position, EX[r]);
            }
        }

        addBreak(doc, position, patient);

        var AE = adverseEventService.getAdverseEvents();
        if (AE.length != 0) {
            printATitle(doc, position, AE[0]);
            for (var r = 0; r < AE.length; r++) {
                printRecord(doc, position, AE[r]);
            }
        }

        addBreak(doc, position, patient);

        var SV = subjectVisits.getSubjectVisits();
        if (SV.length != 0) {
            printATitle(doc, position, SV[0]);
            for (var r = 0; r < SV.length; r++) {
                printRecord(doc, position, SV[r]);
                var symptoms = clinicalEvents.getEventsFromCategoryAndDate('Symptom', SV[r].SVSTDTC);
                printSymptoms(doc, position, symptoms);
            }
        }

        addBreak(doc, position, patient);

        var PR = procedures.getProcedureDates('MRI');
        if (PR.length != 0) {
            printATitle(doc, position, PR[0]);
            for (var r = 0; r < PR.length; r++) {
                printRecord(doc, position, PR[r]);
                var morphology = morphologyServices.getFindingsByDate(PR[r].PRSTDTC);
                for (var m = 0; m < morphology.length; m++) {
                    printRecord(doc, position, morphology[m]);
                }
            }
        }

        addBreak(doc, position, patient);
        doc.save();
    }

    var addBreak = function (doc, position, patient) {
        if (position.y >= 200) {
            doc.addPage();
            position = { x: 10, y: 5 };
            printADate(doc, position, patient);
            position = { x: 20, y: 5 };
        }
    }

    var displayThis = function (key, value) {
        if ((value != '')
            && (key.indexOf('SEQ') == -1)
            && (key.indexOf('display') == -1)
            && (key.indexOf('$$') == -1)
            && (key.indexOf('STUDYID') == -1)
            && (key.indexOf('DOMAIN') == -1)
            && (key.indexOf('USUBJID') == -1)
            && (key.indexOf('XNAT') == -1)
            && (key.indexOf('MODTC') == -1))
            return true;
        else
            return false;
    }

    var printSymptoms = function (doc, position, symptoms) {
        doc.setFontSize(10);
        doc.setFontType("bold");
        position.y += 5;
        doc.text(position.x, position.y, 'Symptoms:');
        position.x += 25;

        var listOfSymptoms = [];
        for (var s = 0; s < symptoms.length; s++) {
            listOfSymptoms.push(symptoms[s].CETERM);
        }
        doc.setFontType("normal");
        doc.text(position.x, position.y, listOfSymptoms);
        position.x -= 25;
    }

    var printRecord = function (doc, position, record) {
        doc.setFontSize(10);
        var keys = Object.keys(record);
        var numFilledKeys = 0;
        position.y += 5;
        for (var k = 0; k < keys.length; k++) {
            if (displayThis(keys[k], record[keys[k]])) {
                numFilledKeys += 1;
                position.y += 5;

                doc.setFontType("bold");
                doc.text(position.x, position.y, keys[k]);

                position.x = position.x + 25;

                doc.setFontType("normal");
                if ((keys[k].indexOf('DTC') != -1)) {
                    doc.text(position.x, position.y, record[keys[k]].toDateString());
                }
                else {
                    var value = record[keys[k]];
                    if (isNaN(value)) {
                        doc.text(position.x, position.y, value);
                    }
                    else {
                        doc.text(position.x, position.y, value.toString());
                    }

                }
                position.x = position.x - 25;
            }
        }
    }

    var printATitle = function (doc, position, record) {

        doc.setFontSize(12);
        doc.setFontType("bold");
        position.y += 12;

        switch (record.DOMAIN) {
            case 'DM': {
                doc.text(position.x, position.y, 'Demographics');
                break;
            };
            case 'SV': {
                doc.text(position.x, position.y, 'Visits');
                break;
            };
            case 'MH': {
                doc.text(position.x, position.y, 'Medical History');
                break;
            };
            case 'CE': {
                doc.text(position.x, position.y, record.CECAT);
                break;
            };
            case 'EX': {
                doc.text(position.x, position.y, 'Treatments');
                break;
            };
            case 'AE': {
                doc.text(position.x, position.y, 'Adverse Events');
                break;
            };
            case 'SU': {
                doc.text(position.x, position.y, 'Substance Use');
                break;
            };
        }
    }

    var printADate = function (doc, position, patient) {
        //console.log(patient);
        doc.setFontSize(10);
        doc.setFontType("normal");
        position.y += 5;
        var printedOn = new Date();
        doc.text(position.x, position.y, "[Date]: " + printedOn.toDateString());

        position.x += 50;
        doc.text(position.x, position.y, "[Study]: " + patient.STUDYID);

        position.x += 50;
        doc.text(position.x, position.y, "[Subject]: " + patient.USUBJID);

        position.x -= 100;
    }

    var getRecordItem = function (aRecord) {
        var keys = Object.keys(aRecord);
        var keysAndItems = [];
        var newRecordItem = { "RecordItems": keysAndItems };

        for (var k = 0; k < keys.length; k++) {
            var keyAndItem = { "fieldName": keys[k], "value": aRecord[keys[k]] };
            keysAndItems.push(keyAndItem);
        }
        return newRecordItem;
    }

    var clearCurrentPatientSession = function () {

        patients.deleteCurrentPatient();
        subjectCharacteristic.deleteSubjectCharacteristics();
        associatedPersonMedicalHistories.deleteAssociatedPersonMedicalHistories();
        substanceUse.deleteSubstanceUse();
        medicalHistory.deleteMedicalHistory();
        clinicalEvents.deleteClinicalEvents();

        subjectVisits.deleteSubjectVisits();
        vitalSigns.deleteVitalSigns();
        findingsAbout.deleteFindings();
        questionnaires.deleteQuestionnaires();
        relationships.deleteRelationships();

        immunogenicitySpecimenAssessments.deleteISAs();
        laboratoryTestResults.deleteLabTestResults();
        morphologyServices.deleteMorphologicalFindings();
        nervousSystemFindings.deleteNervousSystemFindings();
        procedures.deleteProcedures();

        deviceInUseServices.deleteDevicesInUse();
        exposures.deleteExposures();
        reminders.deleteReminders();

        $scope.setNewPatientFields();
        $scope.setNewEventFields();
        $scope.setNewRelapseFields();
        $scope.setNewExposureFields();
        $scope.setNewVisitFields();
        $scope.setNewResultFields();
        $scope.setNewQuestionnaireFields();
        $scope.setNewReminderFields();
    }

    $scope.deletePatient = function () {
        deleteThisSubject();
        clearCurrentPatientSession();
    }

    var deleteThisSubject = function () {
        if (($scope.USUBJID != null) && ($scope.USUBJID != "")) {
            var deletionProcess = records.deleteSubject($scope.USUBJID);
            deletionProcess.then(function (result) {
                if (result.result == 'succeed') {
                    alert($scope.USUBJID + " has been deleted");
                }
                else {
                    alert($scope.USUBJID + " failed to delete");
                }
            });
        }
        else {
            alert("USUBJID was null");
        }
    }

    $scope.showEventsBar = function () {
        if (($scope.contentOnDisplay == 'Patient') || ($scope.contentOnDisplay == 'Timeline')) {
            return false;
        }
        else {
            return true;
        }
    }

    $scope.newEvent = false;

    $scope.setContent = function () {   // select which panel to display
        $scope.newEvent = false;
        $scope.newEventDate = "";
        switch ($scope.contentOnDisplay) {
            case "Relapse":
                {
                    $scope.setNewRelapseFields();  // set relapse fields to empty
                    $scope.clearRelapseSignFields();
                    $scope.clearRelapseSymptomFields();
                    viewService.setView("Relapse", true); // relapse view, disable input fields = true

                    break;
                }
            case "Exposure":
                {
                    $scope.setNewExposureFields();  // set relapse fields to empty
                    viewService.setView("Exposure", true);// relapse view, disable input fields = true
                    break;
                }
            case "Visit":
                {
                    $scope.setNewVisitFields();
                    $scope.clearVisitSignFields();
                    $scope.clearVisitSymptomFields();
                    viewService.setView("Visit", true);
                    break;
                }
            case "Patient":
                {
                    viewService.setView("Patient", true);
                    break;
                }
            case "Timeline":
                {
                    viewService.setView("Timeline", true);
                    break;
                }
            case 'Test':
                {
                    $scope.setNewResultFields();
                    viewService.setView('Test', true);
                    break;
                }
            case 'Questionnaire':
                {
                    $scope.setNewQuestionnaireFields();
                    viewService.setView('Questionnaire', true);
                    break;
                }
            default:
                {
                    viewService.setView($scope.contentOnDisplay, true);
                }
        }

        var events = $scope.getEventDates();
        if (events.length > 0) {
            var event = events[0];
            $scope.setSelected(event);
            $scope.selectEvent(event);
        }
    }

    $scope.newEventDate = "";

    $scope.enableNewDate = function () {
        return $scope.newEvent;
    }

    $scope.disableChangesToDate = function () {
        if ($scope.newEventDate != "")
            return true;
        return false;
    }


    var isThisADate = function (ddmmyy) {
        if (Object.prototype.toString.call(ddmmyy) === "[object Date]") {
            return true;
        }
        else {
            //console.log("not a date");
            return false;
        }
    }

    $scope.setNewFormDate = function () {
        $scope.newEvent = true;

        switch ($scope.contentOnDisplay) {
            case "Relapse":
                {
                    var relapseDate = new Date($scope.newEventDate.substr(3), parseInt($scope.newEventDate.substr(0, 2)) - 1, 1);
                    if (isThisADate(relapseDate)) {
                        $scope.setNewRelapseDate($scope.newEventDate, relapseDate);
                        viewService.setView("Relapse", false);
                    }
                    break;
                }
            case "Visit":
                {
                    var SVSTDTC = new Date($scope.newEventDate.substr(6), parseInt($scope.newEventDate.substr(3, 2)) - 1, $scope.newEventDate.substr(0, 2));
                    if (isThisADate(SVSTDTC)) {
                        $scope.setNewVisitDate($scope.newEventDate, SVSTDTC);
                        viewService.setView("Visit", false);
                    }
                    break;
                }
            case "Exposure":
                {
                    var EXSTDTC = new Date($scope.newEventDate.substr(6), parseInt($scope.newEventDate.substr(3, 2)) - 1, $scope.newEventDate.substr(0, 2));
                    if (isThisADate(EXSTDTC)) {
                        $scope.setNewExposureStartDate($scope.newEventDate, EXSTDTC);
                        viewService.setView("Exposure", false);
                    }
                    break;
                }
            case 'Test':
                {
                    var LBDTC = new Date($scope.newEventDate.substr(6), parseInt($scope.newEventDate.substr(3, 2)) - 1, $scope.newEventDate.substr(0, 2));
                    if (isThisADate(LBDTC)) {
                        $scope.setNewLabDate($scope.newEventDate, LBDTC);
                        viewService.setView("Test", false);
                    }
                    break;
                }
            case 'Questionnaire':
                {
                    viewService.setView('Questionnaire', false);
                    $scope.setNewQuestionnaireFields();
                    break;
                }
            default:
                viewService.setView($scope.contentOnDisplay, false);
        }
    }

    $scope.setNewForm = function () {
        $scope.newEvent = true;
        $scope.newEventDate = "";
        switch ($scope.contentOnDisplay) {
            case "Relapse":
                {
                    clinicalEvents.setEvent([]);
                    viewService.setView("Relapse", true);// relapse view, disable input fields = false
                    $scope.setNewRelapseFields();  // set relapse fields to empty
                    $scope.clearRelapseSignFields();
                    $scope.clearRelapseSymptomFields();
                    break;
                }
            case "Visit":
                {
                    viewService.setView("Visit", true);// relapse view, disable input fields = false
                    $scope.setNewVisitFields();  // set relapse fields to empty
                    $scope.clearVisitSignFields();
                    $scope.clearVisitSymptomFields();
                    break;
                }
            case "Exposure":
                {
                    viewService.setView("Exposure", true);// relapse view, disable input fields = false
                    $scope.setNewExposureFields();  // set relapse fields to empty
                    break;
                }
            case 'Test':
                {
                    viewService.setView('Test', true);
                    $scope.setNewResultFields();
                    $scope.setNewCSFFields();
                    $scope.setTestIndexForLab($scope.testIndex);
                    $scope.setNewMRIFields();
                    break;
                }
            case 'Questionnaire':
                {
                    viewService.setView('Questionnaire', true);
                    $scope.setNewQuestionnaireFields();
                    break;
                }
            default:
                viewService.setView($scope.contentOnDisplay, true);
        }
    }

    $rootScope.selectEvent = function (event) { // get event given date
        $scope.newEvent = false;

        switch ($scope.contentOnDisplay) {
            case "Relapse":
                {
                    $scope.setNewRelapseDate(event.displayDate, event.CESTDTC);
                    clinicalEvents.setEvent(event);
                    viewService.setView("Relapse", false);
                    $scope.displayRelapse();    // this is in the relapse controller
                    $scope.displayRelapseSymptoms();
                    $scope.displayRelapseSigns();
                    break;
                }
            case "Medical Event":
                {
                    if (event.DOMAIN == "CE")
                        clinicalEvents.setEvent(event);

                    if (event.DOMAIN == "AE")
                        adverseEventService.setEvent(event);

                    viewService.setView("Medical Event", false);
                    $scope.displayEvent(event.DOMAIN);    // this is in the relapse controller
                    break;
                }
            case "Visit":
                {
                    subjectVisits.setCurrentVisit(event);
                    //$scope.setNewVisitDate(event.displayDate, event.SVSTDTC);
                    viewService.setView("Visit", false);// disable = false;
                    $scope.displayVisit();
                    $scope.displayVisitSymptoms();
                    $scope.displayVisitSigns();
                    $scope.generateLetter();
                    break;
                }
            case "Exposure":
                {
                    //console.log("displaying current event");
                    $scope.setNewExposureStartDate(event.displayDate, event.EXSTDTC);
                    exposures.setCurrentExposure(event);
                    viewService.setView("Exposure", false);// disable = false;
                    $scope.displayExposure();
                    break;
                }
            case 'Test':
                {
                    switch (event.DOMAIN) {
                        case 'IS': {
                            $scope.setTestIndex('Laboratory Tests');
                            laboratoryTestResults.setCurrentCollectionDate(event);
                            immunogenicitySpecimenAssessments.setCurrentCollectionDate(event);
                            break;
                        };
                        case 'LB': {
                            $scope.setTestIndex('Laboratory Tests');
                            laboratoryTestResults.setCurrentCollectionDate(event);
                            immunogenicitySpecimenAssessments.setCurrentCollectionDate(event);
                            break;
                        };
                        case 'NV': {
                            nervousSystemFindings.setCurrentCollectionDate(event);
                            $scope.setTestIndex('Evoked Potential');
                            break;
                        };
                        case 'PR': {
                            procedures.setCurrentProcedure(event);
                            if (event.PRTRT == 'MRI')
                                $scope.setTestIndex('Magnetic Resonance Imaging');

                            if (event.PRTRT == 'Lumbar Puncture')
                                $scope.setTestIndex('Cerebrospinal Fluid');
                            break;
                        };

                    };
                    viewService.setView('Test', false);// disable = false;
                    $scope.displayResults(event.DOMAIN);
                    break;
                }
            case 'Questionnaire':
                {
                    switch (event.QSCAT) {
                        case 'PDDS': {
                            questionnaires.setCurrentQuestionnaire(event, 'PDDS');
                            $scope.setQuestionnaireIndex('PDDS');
                            break;
                        }
                        case 'VAS': {
                            questionnaires.setCurrentQuestionnaire(event, 'VAS');
                            $scope.setQuestionnaireIndex('VAS');
                            break;
                        }
                        case 'MSQOL-54': {

                            questionnaires.setCurrentQuestionnaire(event, 'MSQOL-54');
                            $scope.setQuestionnaireIndex('MSQOL-54');
                            break;
                        }
                    }
                    viewService.setView('Questionnaire', false);// disable = false;
                    $scope.displayQuestionnaireResults();
                    break;
                }
            default:
                ;
        }
    }

    $scope.deleteEvent = function (event) {
        $scope.newEvent = false;
        $scope.newEventDate = "";
        switch ($scope.contentOnDisplay) {
            case "Relapse":
                {
                    var symptomsToDeleted = clinicalEvents.getEventsByCatGroupID('Symptom', event.CEGRPID);
                    for (var e = 0; e < symptomsToDeleted.length; e++) {
                        clinicalEvents.deleteEvent(symptomsToDeleted[e]);
                    }

                    var signsToDeleted = clinicalEvents.getEventsByCatGroupID('Sign', event.CEGRPID);
                    for (var e = 0; e < signsToDeleted.length; e++) {
                        clinicalEvents.deleteEvent(signsToDeleted[e]);
                    }

                    var eventsSelectedForDeletion = clinicalEvents.getEventsByCatTermAndGroupID('MS Relapse', event.CETERM, event.CEGRPID);
                    for (var e = 0; e < eventsSelectedForDeletion.length; e++) {
                        clinicalEvents.deleteEvent(eventsSelectedForDeletion[e]);
                    }

                    var findingsSelectedForDeletion = findingsAbout.getFindingsByLNKID(event.CELNKID);
                    for (var e = 0; e < findingsSelectedForDeletion.length; e++) {
                        findingsAbout.deleteFinding(findingsSelectedForDeletion[e]);
                    }

                    $scope.setNewRelapseFields();
                    $scope.clearRelapseSignFields();
                    $scope.clearRelapseSymptomFields();
                    viewService.setView('Relapse', true); // set to disable
                    break;
                }
            case "Visit":
                {
                    var visitsSelectedForDeletion = subjectVisits.getVisitByDate(event.SVSTDTC);
                    for (var v = 0; v < visitsSelectedForDeletion.length; v++) {
                        subjectVisits.deleteVisit(visitsSelectedForDeletion[v]);
                    }

                    var symptomsSelectedForDeletion = clinicalEvents.getEventsByDate(event.SVSTDTC);
                    for (var v = 0; v < symptomsSelectedForDeletion.length; v++) {
                        if ((symptomsSelectedForDeletion[v].CEGRPID == -1) &&
                            ((symptomsSelectedForDeletion[v].CECAT == "Symptom") ||
                                (symptomsSelectedForDeletion[v].CECAT == "Sign")))
                            clinicalEvents.deleteEvent(symptomsSelectedForDeletion[v]);
                    }

                    var questionsForDeletion = questionnaires.getQuestionsByCatOnDate('EDSS', event.SVSTDTC)
                    for (var q = 0; q < questionsForDeletion.length; q++) {
                        questionnaires.deleteQuestion(questionsForDeletion[q]);
                    }

                    var questionsForDeletion = questionnaires.getQuestionsByCatOnDate('EDMUS', event.SVSTDTC)
                    for (var q = 0; q < questionsForDeletion.length; q++) {
                        questionnaires.deleteQuestion(questionsForDeletion[q]);
                    }

                    var proceduresForDeletion = procedures.getVisitProceduresByDate(event.SVSTDTC);
                    for (var p = 0; p < proceduresForDeletion.length; p++) {
                        var findingsForDeletion = findingsAbout.getFindingsByLNKID(proceduresForDeletion[0].PRLNKID);

                        for (var f = 0; f < findingsForDeletion.length; f++) {
                            var relationshipsForDeletion = relationships.getRelationshipByIDVARVAL(findingsForDeletion[f].FALNKID);
                            for (var r = 0; r < relationshipsForDeletion.length; r++) {
                                relationships.deleteRelationship(relationshipsForDeletion[r]);
                            }
                            findingsAbout.deleteFinding(findingsForDeletion[f]);
                        }
                        procedures.deleteProcedure(proceduresForDeletion[p]);
                    }

                    var vitalsForDeletion = vitalSigns.getSignsByDate(event.SVSTDTC);
                    for (var p = 0; p < vitalsForDeletion.length; p++) {
                        vitalSigns.deleteVitalSign(vitalsForDeletion[p]);
                    }

                    $rootScope.setNewVisitFields();
                    $scope.clearVisitSignFields();
                    $scope.clearVisitSymptomFields();
                    viewService.setView('Visit', true); // set to disable

                    break;
                }
            case "Exposure":
                {
                    var exposuresSelectedForDeletion = exposures.getExposure(event.EXTRT);
                    //console.log(event.EXTRT);
                    //console.log(exposuresSelectedForDeletion);
                    for (var v = 0; v < exposuresSelectedForDeletion.length; v++) {
                        exposures.deleteExposure(exposuresSelectedForDeletion[v]);
                    }
                    exposures.deleteInterruptions(event.EXTRT);
                    $rootScope.setNewExposureFields();
                    viewService.setView('Exposure', true); // set to disable
                    break;
                }
            case 'Test':
                {
                    var collectionDate = '';

                    if (event.DOMAIN == "NV") {
                        collectionDate = event.NVDTC;
                        var findingsSelectedForDeletion = nervousSystemFindings.getAssessmentByDate(collectionDate);

                        for (var v = 0; v < findingsSelectedForDeletion.length; v++) {
                            nervousSystemFindings.deleteFinding(findingsSelectedForDeletion[v]);
                            nervousSystemFindings.printNSFindings();
                        }
                    }
                    else if (event.DOMAIN == "PR") {
                        collectionDate = event.PRSTDTC;
                        if (event.PRTRT == 'MRI') {
                            var proceedingsSelectedForDeletion = procedures.getImagingProceduresByDate(collectionDate);
                            for (var v = 0; v < proceedingsSelectedForDeletion.length; v++) {
                                procedures.deleteProcedure(proceedingsSelectedForDeletion[v]);
                            }
                            var morphologyFindingsForDeletion = morphologyServices.getFindingsByDate(collectionDate);
                            for (var f = 0; f < morphologyFindingsForDeletion.length; f++) {
                                morphologyServices.deleteMorphologicalFinding(morphologyFindingsForDeletion[f]);
                            }

                            var devicesForDeletion = deviceInUseServices.getDeviceInUseByTest(collectionDate, 'Weighting');
                            for (var f = 0; f < devicesForDeletion.length; f++) {
                                deviceInUseServices.deleteDeviceInUse(devicesForDeletion[f]);
                            }
                        }
                        else if (event.PRTRT == "Lumbar Puncture") {
                            var proceedingsSelectedForDeletion = procedures.getProcedureByTRTAndDate("Lumbar Puncture", collectionDate);
                            for (var v = 0; v < proceedingsSelectedForDeletion.length; v++) {
                                procedures.deleteProcedure(proceedingsSelectedForDeletion[v]);
                            }
                            var testsSelectedForDeletion = laboratoryTestResults.getTestResultBySpecAndDate(collectionDate, 'CSF');
                            for (var v = 0; v < testsSelectedForDeletion.length; v++) {
                                laboratoryTestResults.deleteResult(testsSelectedForDeletion[v]);
                                laboratoryTestResults.printLabTestResults();
                            }
                            var scansSelectedForDeletion = deviceInUseServices.getScansByDate(collectionDate);
                            for (var v = 0; v < scansSelectedForDeletion.length; v++) {
                                deviceInUseServices.deleteDeviceInUse(scansSelectedForDeletion[v]);
                                deviceInUseServices.print();
                            }
                        }
                    }
                    else {
                        if (event.DOMAIN == "LB")
                            collectionDate = event.LBDTC;
                        else
                            collectionDate = event.ISDTC;

                        var testResultsSelectedForDeletion = laboratoryTestResults.getTestResultByDate(collectionDate);
                        for (var v = 0; v < testResultsSelectedForDeletion.length; v++) {
                            if (testResultsSelectedForDeletion[v].LBSPEC != 'CSF') {
                                laboratoryTestResults.deleteResult(testResultsSelectedForDeletion[v]);
                                laboratoryTestResults.printLabTestResults();
                            }
                        }

                        var assessmentsSelectedForDeletion = immunogenicitySpecimenAssessments.getAssessmentByDate(collectionDate);
                        for (var v = 0; v < assessmentsSelectedForDeletion.length; v++) {
                            immunogenicitySpecimenAssessments.deleteResult(assessmentsSelectedForDeletion[v]);
                            immunogenicitySpecimenAssessments.printISAs();
                        }
                    }

                    viewService.setView('Test', false);
                    $scope.setNewResultFields();
                    $scope.setNewCSFFields();
                    $scope.setNewMRIFields();

                    break;
                }
            case 'Questionnaire':
                {
                    var questionsSelectedForDeletion = questionnaires.getQuestionsByCatOnDate(event.QSCAT, event.QSDTC);
                    for (var v = 0; v < questionsSelectedForDeletion.length; v++) {
                        questionnaires.deleteQuestion(questionsSelectedForDeletion[v]);
                    }
                    $rootScope.setNewQuestionnaireFields();
                    viewService.setView('Questionnaire', true); // set to disable
                    break;
                }
            default:
                ;
        }
    }

    $scope.getNumRelapses = function () {    // used to show number of relapses on header badge
        return clinicalEvents.getUniqueGroupsFromCategory('MS Relapse').length;
    }

    $scope.getNumEvents = function () {    // used to show number of visits on header badge
        return clinicalEvents.getUniqueDatesFromCategory('Other').
            concat(adverseEventService.getAdverseEvents()).
            length;
    }

    $scope.getNumVisits = function () {    // used to show number of visits on header badge
        return subjectVisits.getUniqueDates().length;
    }

    $scope.getNumExposures = function () {    // used to show number of visits on header badge
        return exposures.getUniqueExposures().length;
    }

    $scope.getNumQuestionnaires = function () {    // used to show number of visits on header badge
        return questionnaires.getUniqueDates().length;
    }

    $scope.getNumLab = function () {
        var labResults = laboratoryTestResults.getUniqueDates();
        var assessmentResults = immunogenicitySpecimenAssessments.getUniqueDates();
        var labCollectionDates = findUniqueCollectionDates(labResults, assessmentResults);
        return labCollectionDates.length;
    }

    $scope.getNumMRI = function () {
        var mriExperiments = procedures.getProcedureDates('MRI');
        return mriExperiments.length;
    }

    $scope.getNumVEP = function () {
        var evokedPotentialFindings = nervousSystemFindings.getUniqueDates();
        return evokedPotentialFindings.length;
    }

    $scope.getNumCSF = function () {
        var csfTests = procedures.getProcedureDates('Lumbar Puncture');
        return csfTests.length;
    }

    $scope.getNumCollections = function () {
        var collectionDates = [];
        /*
         var labResults = laboratoryTestResults.getUniqueDates();
         if (labResults.length == 0){
         var assessmentResults = immunogenicitySpecimenAssessments.getUniqueDates();
         if (assessmentResults.length == 0)
         return 0;
         else
         return assessmentResults.length;
         }
         else {
         return labResults.length;
         }*/
        var labResults = laboratoryTestResults.getUniqueDates();
        var assessmentResults = immunogenicitySpecimenAssessments.getUniqueDates();
        var evokedPotentialFindings = nervousSystemFindings.getUniqueDates();
        var labCollectionDates = findUniqueCollectionDates(labResults, assessmentResults);
        var mriExperiments = procedures.getProcedureDates('MRI');
        var csfTests = procedures.getProcedureDates('Lumbar Puncture');
        collectionDates = collectionDates.concat(labCollectionDates);
        collectionDates = collectionDates.concat(evokedPotentialFindings);
        collectionDates = collectionDates.concat(mriExperiments);
        collectionDates = collectionDates.concat(csfTests);

        return collectionDates.length;
    }

    $scope.getEventDates = function () { // get dates of events, used to select event by date in header
        //return viewService.getView().Dates;
        switch ($scope.contentOnDisplay) {
            case "Relapse":
                {
                    //var foo = clinicalEvents.getUniqueGroupsFromCategory('MS Relapse');
                    return clinicalEvents.getUniqueGroupsFromCategory('MS Relapse');
                    //break;
                }
            case "Visit":
                {
                    return subjectVisits.getUniqueDates();
                    //break;
                }
            case "Exposure":
                {
                    return exposures.getUniqueExposures();
                    //break;
                }
            case "Medical Event":
                {
                    return (clinicalEvents.getUniqueDatesFromCategory('Other').concat(adverseEventService.getAdverseEvents()));
                }
            case 'Test':
                {
                    //console.log($scope.testIndex);
                    switch ($scope.testIndex) {
                        case 'Laboratory Tests': {
                            var labResults = laboratoryTestResults.getUniqueDates();
                            var assessmentResults = immunogenicitySpecimenAssessments.getUniqueDates();
                            var labCollectionDates = findUniqueCollectionDates(labResults, assessmentResults);
                            return labCollectionDates;
                        }
                        case 'Evoked Potential': {
                            return nervousSystemFindings.getUniqueDates();
                        }
                        case 'Magnetic Resonance Imaging': {
                            return procedures.getProcedureDates('MRI');
                        }
                        case 'Cerebrospinal Fluid': {
                            return procedures.getProcedureDates('Lumbar Puncture');
                        }
                    }
                }
            case 'Questionnaire':
                {
                    return questionnaires.getUniqueDates();
                }
            default:
                {
                    return [];
                }
        }
    }

    var findUniqueCollectionDates = function (labResults, assessmentResults) {
        var uniqueDates = [];
        for (var l = 0; l < labResults.length; l++) {
            if (collectionDateExists(uniqueDates, labResults[l].LBDTC) == false) {
                uniqueDates.push(labResults[l]);
            }
        }

        for (var a = 0; a < assessmentResults.length; a++) {
            if (collectionDateExists(uniqueDates, assessmentResults[a].ISDTC) == false) {
                uniqueDates.push(assessmentResults[a]);
            }
        }
        //console.log(uniqueDates);
        return uniqueDates;
    }

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
    }

    $scope.seqSelectedEvent = null;
    $scope.domainSelectedVote = null;

    $scope.setSelected = function (event) {
        $scope.seqSelectedEvent = getSeqValue(event, event.DOMAIN);
        $scope.domainSelectedVote = event.DOMAIN;
    };

    $scope.isSelected = function (event, numEvents) {

        if (!$scope.newEvent) {
            // if user has not selected an event
            if (($scope.seqSelectedEvent == null) && ($scope.domainSelectedVote == null)) {
                // if this is most recent event
                //console.log(getSeqValue(event, event.DOMAIN));
                if (getSeqValue(event, event.DOMAIN) == (numEvents - 1)) {
                    //console.log("is selected");
                    //console.log(event);
                    $scope.selectEvent(event); // tmp taken out?
                    return true;
                }
                else {
                    return false;
                }

                if (numEvents == 1)
                    return true;
            }
            else {
                if ((getSeqValue(event, event.DOMAIN) == $scope.seqSelectedEvent)
                    && (event.DOMAIN == $scope.domainSelectedVote)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };

    var getDomain = function (items) {
        var domain = '';
        for (var i = 0; i < items.length; i++) {
            if (items[i].fieldName == 'DOMAIN') {
                return items[i].value;
            }
        }
        return domain;
    }


    var getSeqValue = function (event, DOMAIN) {
        var seqFieldName = '';
        switch (DOMAIN) {
            case 'QS':
                {
                    seqFieldName = event.QSSEQ;
                    break;
                }
            case 'SV':
                {
                    seqFieldName = event.VISITNUM;
                    break;
                }
            case 'FA':
                {
                    seqFieldName = event.FASEQ;
                    break;
                }
            case 'CE':
                {
                    seqFieldName = event.CESEQ;
                    break;
                }
            case 'PR':
                {
                    seqFieldName = event.PRSEQ;
                    break;
                }
            case 'EX':
                {
                    seqFieldName = event.EXSEQ;
                    break;
                }
            case 'REL':
                {
                    seqFieldName = event.RELID;
                    break;
                }
            case 'DM':
                {
                    seqFieldName = event.USUBJID;
                    break;
                }
            case 'LB':
                {
                    seqFieldName = event.LBSEQ;
                    break;
                }
            case 'IS':
                {
                    seqFieldName = event.ISSEQ;
                    break;
                }
            case 'NV':
                {
                    seqFieldName = event.NVSEQ;
                    break;
                }
            case 'VS':
                {
                    seqFieldName = event.VSSEQ;
                    break;
                }
            case 'APMH':
                {
                    seqFieldName = event.APMHSEQ;
                    break;
                }
        }
        ;
        return seqFieldName;
    }

    var displayCurrentPatient = function () {
        var aPatient = patients.patientExists();

        if (aPatient != null) {
            $scope.displayPatientDM();
            $scope.displayPatientMH();
            $scope.displayPatientFA();

            $scope.setEventUSUBJID($scope.USUBJID);
            $scope.setExposureUSUBJID($scope.USUBJID);
            $scope.setLabUSUBJID($scope.USUBJID);
            $scope.setMRIUSUBJID($scope.USUBJID, ($scope.authenticatedStatus == "Logged In") && ($scope.sourceMode == "internet"));
            //$scope.setMRIUSUBJID($scope.USUBJID, $scope.sourceMode=='internet');
            $scope.setMRIUSUBJID($scope.USUBJID, false);
            $scope.setVisitUSUBJID($scope.USUBJID);
            $scope.setRelapseUSUBJID($scope.USUBJID);
            $scope.setQuestionnaireUSUBJID($scope.USUBJID);
            $scope.setReminderSUBJID($scope.USUBJID, aPatient.NHS_USUBJID);
        }
        //console.log(patients.getCurrentPatient());
    }

    $scope.updateAge = function (BRTHDTC) {
        if (BRTHDTC != null) {
            if (BRTHDTC != '')
                if (BRTHDTC.getFullYear() > 1900) {
                    var dayInMilliseconds = 1000 * 60 * 60 * 24;
                    var dateEnd = new Date();
                    var dateStart = BRTHDTC;
                    var durationInDays = Math.round((dateEnd - dateStart) / dayInMilliseconds);
                    return Math.round(durationInDays / 365.25);
                }
        }
        return '';

    }

    //    $scope.hideDOD = function () {
    //        if ($scope.fileActive != null) {
    //            if ($scope.fileActive) // file is active, therefore hide this field
    //                return true;
    //        }
    //        else
    //            return false;
    //    }

    $scope.toggleTimeline = function (dataToToggle) {

        if ($scope.toggleTimelineData)
            $scope.toggleTimelineData(dataToToggle);
    }

    $scope.showTreatments = true;
    $scope.showVisits = true;
    $scope.showRelapses = true;
    $scope.showTests = false;
    $scope.showEDSS = true;
    $scope.showMSQOL = false;
    $scope.showVAS = false;
    //$scope.showPROMIS = false;
    $scope.showLesionVolume = true;
    $scope.showPDDS = false;
    $scope.testIndex = "";
    $scope.testIndex = "";
    $scope.contentOnDisplay = 'Patient';

    $scope.$watch("showTreatments", function (newValue, oldValue) {
        $scope.toggleTimeline('Treatments');
    });

    $scope.$watch("showVisits", function (newValue, oldValue) {
        $scope.toggleTimeline('Visits');
    });

    $scope.$watch("showTests", function (newValue, oldValue) {
        $scope.toggleTimeline('Monitoring');
    });

    $scope.$watch("showRelapses", function (newValue, oldValue) {
        $scope.toggleTimeline('Relapses');
    });

    $scope.$watch("showEDSS", function (newValue, oldValue) {
        $scope.toggleTimeline('EDSS');
    });

    $scope.$watch("showMSQOL", function (newValue, oldValue) {
        $scope.toggleTimeline('MSQOL');
    });

    $scope.setTestIndexForLab = function (type) {
        $scope.testIndex = type;
        $scope.setTestIndex(type);
    }

    $scope.isActiveTest = function (test) {
        if (test == $scope.testIndex) {
            //console.log($scope.testIndex + " vs " +test+ " :active");
            return true;
        }
        else
            //console.log($scope.testIndex + " vs " +test+ " :inactive");
            return false;
    }

    $scope.isActiveContent = function (content) {
        if ($scope.contentOnDisplay == content) {
            return true;
        }
        else
            return false;
    }

    $scope.openAppointments = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'appointments.html',
            controller: 'appointmentsCtrl',
            resolve: {
                sourceMode: function () {
                    return $scope.sourceMode;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log("ok");
        }, function () {
            console.log("cancelled")
        })
    }

    var populateReminders = function () {
        if ($scope.sourceMode == 'internet') {
            var reminderForPatient = records.getReminder(patients.getCurrentPatient().USUBJID);
            reminderForPatient.then(function (reminderData) {
                if ((reminderData.RecordSet != null) && (reminderData.RecordSet.length > 0)) {
                    //console.log(reminderData.RecordSet[0]);
                    for (var rm = 0; rm < reminderData.RecordSet.length; rm++) {
                        reminders.populateReminder(reminderData.RecordSet[rm]);
                    }
                    $scope.displayReminder();
                }
            });
        }
    }

    $scope.openDepository = function () {
        clearCurrentPatientSession();

        var modalInstance = $uibModal.open({
            templateUrl: 'depository.html',
            controller: 'depositoryCtrl',
            resolve: {
                sourceMode: function () {
                    return $scope.sourceMode;
                }
            }
        });

        modalInstance.result.then(function (selectionData) {
            if (selectionData.actionMode == 'Load') {
                $scope.USUBJID = selectionData.USUBJID;
                console.log($scope.USUBJID);

                if ($scope.sourceMode == 'internet') {
                    if (selectionData.recordSet.length > 0) {
                        populateFromDB(selectionData.recordSet);
                        populateReminders();
                    }
                }
                else if ($scope.sourceMode == 'computer') {
                    //if (selectionData.recordSet.length >0 ) {
                    populateFromScriptedFile(selectionData.recordSet);
                    //}
                };
            }


        }, function () {
            console.log("Cancelled");
        });
    };


    $scope.openSearch = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'search.html',
            controller: 'searchCtrl',
            resolve: {
                sourceMode: function () {
                    return $scope.sourceMode;
                }
            }
        });

        modalInstance.result.then(function (selectionData) {
            if (selectionData.actionMode == 'Load') {
                
                clearCurrentPatientSession();
                $scope.USUBJID = selectionData.USUBJID;
                console.log($scope.USUBJID);

                if ($scope.sourceMode == 'internet') {
                    if (selectionData.recordSet.length > 0) {
                        populateFromDB(selectionData.recordSet);
                        populateReminders();
                    }
                }
                else if ($scope.sourceMode == 'computer') {
                    //if (selectionData.recordSet.length >0 ) {
                    populateFromScriptedFile(selectionData.recordSet);
                    //}
                };
                $scope.contentOnDisplay='Patient';
                $scope.setContent();
            }

        }, function () {
            console.log("Cancelled");
        });
    };

});
