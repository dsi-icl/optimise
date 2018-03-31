/**
* Created with IntelliJ IDEA.
* User: myyong
* Date: 24/01/2015
* Time: 16:31
* To change this template use File | Settings | File Templates.
*/

var interventionModule = angular.module('Optimise.exposure', ['Optimise.view', 'Optimise.record']);

interventionModule.factory('Exposure', function () {
  return function (USUBJID, extrt) {
    var Exposure = {
      USUBJID : USUBJID,
      STUDYID : 'OPTIMISE',
      DOMAIN:'EX',
      EXSEQ :'',
      EXTRT:extrt,
      EXDOSE:'',
      EXDOSU:'',
      EXDOSFRM:'',
      EXDOSFRQ:'',
      EXSTDTC: new Date(),
      EXENDTC: '',
      EXADJ: '',
      displayLabel:'',
      displayDate:''
    }
    return Exposure;
  }
});

interventionModule.factory('DrugFactory', function () {

  var drugs = [
    {name: 'Alemtuzumab (Lemtrada)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'IV', frequency:'1 / year'}]},
    {name: 'Avonex (Interferon beta-1a)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'SC', frequency:''}]},
    {name: 'Azathioprine', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'MIU', form:'', frequency:''}]},
    {name: 'Betaferon (Interferon beta-1b)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'SC', frequency:''}]},
    {name: 'Cladribine (Mavenclad)', cat:'Disease Modifying',
    posology:[{dose:'', unit:'', form:'Oral', frequency:''}]},
    {name: 'Cyclophosphamide', cat: 'Disease Modifying',
    posology:[{dose:'00.00', unit:'MIU', form:'00.00', frequency:'00.00'}]},
    {name: 'Daclizumab (Zinbryta)', cat:'Disease Modifying',
    posology:[{dose:'', unit:'', form:'SC', frequency:'Every 4 weeks'}]},
    {name: 'Dimethyl fumarate (Tecfidera)', cat:'Disease Modifying',
    posology:[{dose:'', unit:'', form:'Oral', frequency:'2 / day'}]},
    {name: 'Extavia (beta interferon-1b)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'SC', frequency:'Every other day'}]},
    {name: 'Fingolimod (Gilenya)', cat:'Disease Modifying',
    posology:[{dose:'', unit:'', form:'Oral', frequency:'1 / day'}]},
    {name: 'Glatiramer acetate (Copaxone)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'Oral', frequency:'1 / day or 3 / week'}]},
    {name: 'Methotrexate', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'', frequency:''}]},
    {name: 'Mitoxantrone', cat: 'Disease Modifying',
    posology:[{dose:'12.00', unit:'mcg', form:'IV', frequency:'3 / Month'}]},
    {name: 'Natalizumab (Tysabri)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'IV', frequency:'Every 4 weeks'}]},
    {name: 'Plegridy (peginterferon beta-1a)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'SC', frequency:'Every 2 weeks'}]},
    {name: 'Rebif (beta interferon-1a)', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'SC', frequency:'3 / week'}]},
    {name: 'Rituximab', cat: 'Disease Modifying',
    posology:[{dose:'', unit:'', form:'IV', frequency:''}]},
    {name: 'Teriflunomide (Aubagio)', cat:'Disease Modifying',
    posology:[{dose:'', unit:'', form:'Oral', frequency:'1 / day'}]},

    {name: '4-aminopyridine', cat: 'Symptomatic',
    posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
    {name: 'Corticosteroids', cat: 'Symptomatic',
    posology:[{dose:'', unit:'', form:'', frequency:''}]},
    {name: 'Prednisone', cat: 'Symptomatic',
    posology:[{dose:'', unit:'', form:'', frequency:''}]},
    {name: 'Amantadine', cat: 'Symptomatic',
    posology:[{dose:'200.00', unit:'mg', form:'IV', frequency:'/ Day'}]},
    {name: 'Baclofen', cat: 'Symptomatic',
    posology:[{dose:'30.00', unit:'mg', form:'IV', frequency:'/ Day'}]},
    {name: 'IV Methyl-prednisolone', cat: 'Symptomatic',
    posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
    {name: 'IVIG', cat: 'Symptomatic',
    posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
    {name: 'Plasma Exchange', cat: 'Symptomatic',
    posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
    {name: 'Mycophenolic Acid', cat: 'Symptomatic',
    posology:[{dose:'500', unit:'mg', form:'IV', frequency:'1/ Day'},
    {dose:'1000', unit:'mg', form:'IV', frequency:'1/ Day'}]},

    {name: 'Neuropsych. Training', cat: 'Others',
    posology:[{dose:'', unit:'', form:'', frequency:''}]},
    {name: 'Physiotherapy', cat: 'Others',
    posology:[{dose:'', unit:'', form:'', frequency:''}]},
    {name: 'Cognitive Therapy', cat: 'Others',
    posology:[{dose:'', unit:'', form:'', frequency:''}]}


  ];

  drugs.isKnown = function (EXTRT) {
    for (var n = 0; n < drugs.length; n++) {
      if (EXTRT==drugs[n].name) {
        return true;
      }
    }
    return false;
  }

  drugs.names = function (EXCAT) {
    var names = [];
    for (var n = 0; n < drugs.length; n++) {
      if (drugs[n].cat == EXCAT)
      names.push(drugs[n].name);
    }
    return names;
  }

  drugs.category = function (EXTRT) {
    for (var n = 0; n < drugs.length; n++) {
      if (EXTRT==drugs[n].name) {
        return drugs[n].cat;
      }
    }
    return "";
  }

  drugs.posology = function (EXTRT) {
    for (var n = 0; n < drugs.length; n++) {
      if (EXTRT==drugs[n].name) {
        return drugs[n].posology;
      }
    }
    return "";
  }

  return drugs;
});

interventionModule.service('exposures', function (Exposure, records, viewService) {
  var exposures = [];
  var currentExposure = null;
  var interruptions = [];
  var today = new Date();

  var deleteExposures = function () {
    exposures = [];
    interruptions = [];
    currentExposure = null;
  }

  var populateExposures = function (RecordItems) {
    var newEvent = new Exposure();
    for (var i = 0; i < RecordItems.length; i++){

      switch (RecordItems[i].fieldName) {
        case 'STUDYID':{
          newEvent.STUDYID = RecordItems[i].value;
          break;
        }
        case 'DOMAIN':{
          newEvent.DOMAIN = RecordItems[i].value;
          break;
        }
        case 'USUBJID':{
          newEvent.USUBJID = RecordItems[i].value;
          break;
        }
        case 'EXSEQ':{
          newEvent.EXSEQ = parseInt(RecordItems[i].value);
          break;
        }
        case 'EXADJ':{
          newEvent.EXADJ = RecordItems[i].value;
          break;
        }
        case 'EXSTDTC':{
          newEvent.EXSTDTC = records.formatStringToDate(RecordItems[i].value);
          break;
        }
        case 'EXTRT':{
          newEvent.EXTRT = RecordItems[i].value;
          break;
        }
        case 'EXDOSE':{
          newEvent.EXDOSE = RecordItems[i].value;
          break;
        }
        case 'EXDOSU':{
          newEvent.EXDOSU = RecordItems[i].value;
          break;
        }
        case 'EXDOSFRM':{
          newEvent.EXDOSFRM = RecordItems[i].value;
          break;
        }
        case 'EXDOSFRQ':{
          newEvent.EXDOSFRQ = RecordItems[i].value;
          break;
        }
        case 'EXENDTC':{
          newEvent.EXENDTC = records.formatStringToDate(RecordItems[i].value);
          break;
        }
        case 'displayLabel':{
          newEvent.displayLabel = RecordItems[i].value;
          break;
        }
        case 'displayDate':{
          newEvent.displayDate = RecordItems[i].value;
          break;
        }
        case 'EXCAT':{
          newEvent.EXCAT = RecordItems[i].value;
          break;
        }

      }
    }
    exposures.push(newEvent);
  }

  var addExposure = function (EX){
    EX.EXSEQ = generateEXSEQ();
    exposures.push(EX);
    if (!viewService.workOffline())
    records.saveRecord(EX);
  }

  var compileExposureSeq = function () {
    var seq = [];
    for (var e = 0; e < exposures.length; e++) {
      seq.push(exposures[e].EXSEQ);
    }
    return seq;
  }

  var generateEXSEQ = function () {
    var EXSEQs = compileExposureSeq();
    if (EXSEQs.length > 0) {
      EXSEQs.sort();
      return (EXSEQs[EXSEQs.length-1]+1);
    }
    else {
      return 0;
    }
  }

  var editExposure = function(exposure, resName, resValue) {
    if (!viewService.workOffline())
    {
      var USUBJID = {fieldName: "USUBJID", value: exposure.USUBJID};
      var SEQ = {fieldName:"EXSEQ", value: exposure.EXSEQ};
      var RESTOCHANGE = {fieldName:resName, value: resValue};
      var idRecord = [USUBJID, SEQ];
      var valueRecord = [RESTOCHANGE];
      records.editRecord(idRecord, valueRecord);
    }
  };

  var setCurrentExposure = function (ex) {
    currentExposure = ex;
  }

  var deleteExposure = function (EX){
    console.log(EX);
    var index = exposures.indexOf(EX);
    if (index > -1) {
      exposures.splice(index, 1);
    }
    if (!viewService.workOffline())
    records.deleteRecord(EX);
  }

  var getExposure = function (EXTRT) {
    var exposureToTreatment = [];
    for (var e = 0; e < exposures.length; e++)
    {
      if (exposures[e].EXTRT == EXTRT){
        exposureToTreatment.push(exposures[e]);
      }
    }
    return exposureToTreatment;
  }

  var getExposuresAscending = function (EXTRT) {
    var exposures = getExposure(EXTRT);
    var STDTCs = compileExposureStartDates(exposures);
    STDTCs.sort(sortAscending);
    var sortedExposures = [];
    for (var d = 0; d < STDTCs.length; d++) {
      sortedExposures.push(getExposureByDate(EXTRT, STDTCs[d]))
    }
    return exposures;
  }

  var sortAscending = function (date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  }

  var compileExposureStartDates = function (exposures) {
    var startDates = [];
    for (var e = 0; e < exposures.length; e++) {
      startDates.push(exposures[e].EXSTDTC);
    }
    return startDates;
  }

  var getExposureByDate = function (EXTRT, EXSTDTC) {
    for (var e = 0; e < exposures.length; e++)
    {
      if (exposures[e].EXTRT == EXTRT){
        if (exposures[e].EXSTDTC.toDateString() == EXSTDTC.toDateString())
        {
          return exposures[e];
        }
      }
    }
    return null;
  }

  var getExposureByDisplay = function (displayLabel, EXTRT) {
    var exposuresMeetingCriteria = [];
    if (displayLabel.indexOf('Dose Change') > -1) // if a dose change is to be deleted
    {
      for (var e = 0; e < exposures.length; e++)
      {
        if (exposures[e].displayLabel==displayLabel)
        exposuresMeetingCriteria.push(exposures[e]);
      }
    }
    else {
      for (var e = 0; e < exposures.length; e++)
      {
        if (exposures[e].EXTRT == EXTRT){
          exposuresMeetingCriteria.push(exposures[e]);
        }
      }
    }

    return exposuresMeetingCriteria;
  }

  var clearExposure = function () {
    currentExposure=null;
  }

  var getCurrentExposure = function () {
    return currentExposure;
  }

  var getUniqueExposures = function () {
    var uniqueExposures = [];
    for (var d = 0; d < exposures.length; d++){   // select events that happened on different days
      if (!exposureExists(uniqueExposures, exposures[d].EXTRT)){
        uniqueExposures.push(exposures[d]);
      }
    }
    return uniqueExposures;
  }

  var exposureExists = function (uniqueExposures, EXTRT){
    for (var d = 0; d < uniqueExposures.length; d++) {
      if (uniqueExposures[d].EXTRT == EXTRT) {
        return true;
      }
    }
    return false;
  }

  var getExposuresForTimeLine = function () {
    //var today = new Date();
    /*
    var exposuresForTimeline = [];
    exposuresForTimeline = exposures.slice();
    for (var e = 0; e < exposuresForTimeline.length; e++){
    if ((exposuresForTimeline[e].EXENDTC == null)||(exposuresForTimeline[e].EXENDTC == '')){
    exposuresForTimeline[e].EXENDTC = new Date();
  }
}
return exposuresForTimeline;  */
return today;
}

var getExposures = function() {
  return exposures;
}

var populateInterruptions = function() {
  var uniqueEXTRTs = getUniqueExposures();
  for (var e = 0; e < uniqueEXTRTs.length; e++) { // for every drug
    var sortedExposures = getExposuresAscending(uniqueEXTRTs[e].EXTRT);
    for (var se = 0; se < sortedExposures.length-1; se++) {
      var endOfFirst = sortedExposures[se];
      var startOfSecond = sortedExposures[se+1];

      var interruptionsForEXTRT = getInterruptionsForDrug(uniqueEXTRTs[e].EXTRT);
      if (interruptionsForEXTRT == null) {
        var interruption = {drug:uniqueEXTRTs[e].EXTRT,
          dates:[{   endOfFirst: endOfFirst,
            startOfSecond: startOfSecond}]};
            addInterruption(interruption);
          }
          else {
            addInterruptionDate(uniqueEXTRTs[e].EXTRT, endOfFirst, startOfSecond);
          }
        }
      }
    }

    var deleteInterruptions = function(EXTRT) {
      var interruptionsForEXTRT = getInterruptionsForDrug(EXTRT);
      var index = interruptions.indexOf(interruptionsForEXTRT);
      if (index > -1) {
        interruptions.splice(index, 1);
      }
      //console.log(interruptions);
    }

    var getInterruptions = function() {
      return interruptions;
    }

    var addInterruptionDate = function(EXTRT, EX1End, EX2Start) {
      getInterruptionsForDrug(EXTRT).dates.push({endOfFirst: EX1End,
        startOfSecond: EX2Start});
      }


      var addInterruption = function(newInterruption) {
        interruptions.push(newInterruption);
      }

      var getInterruptionDatesForDrug = function(EXTRT) {
        for (var i = 0; i < interruptions.length; i++) {
          if (interruptions[i].drug == EXTRT) {
            return interruptions[i].dates;
          }
        }
        return [];
      }

      var getInterruptionsForDrug = function(EXTRT) {
        for (var i = 0; i < interruptions.length; i++) {
          if (interruptions[i].drug == EXTRT) {
            return interruptions[i];
          }
        }
        return null;
      }

      /*
      var addInterruptionDate = function(EXTRT, newDates) {
      for (var i = 0; i < interruptions.length; i++) {
      if (interruptions[i].drug == EXTRT) {
      interruptions[i].dates.push(newDates);
    }
  }
}*/

return {
  editExposure: editExposure,
  addExposure: addExposure,
  deleteExposure: deleteExposure,
  getExposure: getExposure,
  getExposureByDate: getExposureByDate,
  getExposureByDisplay: getExposureByDisplay,
  clearExposure: clearExposure,
  getCurrentExposure: getCurrentExposure,
  setCurrentExposure: setCurrentExposure,
  getUniqueExposures: getUniqueExposures,
  populateExposures:populateExposures,
  getExposuresForTimeLine: getExposuresForTimeLine,
  getExposures: getExposures,
  getExposuresAscending:getExposuresAscending,
  getInterruptions: getInterruptions,
  addInterruption: addInterruption,
  addInterruptionDate: addInterruptionDate,
  getInterruptionDatesForDrug:getInterruptionDatesForDrug,
  getInterruptionsForDrug: getInterruptionsForDrug,
  populateInterruptions: populateInterruptions,
  deleteInterruptions: deleteInterruptions,
  deleteExposures:deleteExposures
}
});

interventionModule.controller('exposureInfoCtrl', function($scope,
  $rootScope,
  viewService,
  Exposure, exposures,
  DrugFactory) {
    $scope.showThisContent = function() {
      if (viewService.getView().Section=='Exposure') {
        return true;
      }
      else
      return false;
    }

    var currentDate = new Date();
    var extrtRecorded = false;

    var dayMonthYear = angular.element(document.querySelectorAll('.DTC_DayMonthYear'));
    dayMonthYear.datepicker({
      format: "dd/mm/yyyy",
      endDate: currentDate.getFullYear().toString(),
      startView: 1,
      orientation: "auto",
      autoclose: true,
      todayHighlight: true
    });

    $rootScope.setNewExposureStartDate = function(display, EXSTDTC) {
      $scope.EXSTDTC_displayDate = display;
      $scope.EXSTDTC = EXSTDTC;
      //$scope.EXSTDTC = new Date($scope.EXSTDTC_displayDate.substr(6), parseInt($scope.EXSTDTC_displayDate.substr(3,2))-1, $scope.EXSTDTC_displayDate.substr(0,2));
      $scope.dateValidated = true;
    }

    $scope.setEXSTDTC_Interruption = function() {
      $scope.EXSTDTC_Interruption = new Date($scope.EXSTDTC_Interruption_display.substr(6), parseInt($scope.EXSTDTC_Interruption_display.substr(3,2))-1, $scope.EXSTDTC_Interruption_display.substr(0,2));
      if (thisIsADate($scope.EXENDTC_Interruption) && (thisIsADate($scope.EXSTDTC_Interruption))) {
        $scope.interruptionDateValidated = true;
      }
    }

    var thisIsADate = function(ddmmyy) {
      if ( Object.prototype.toString.call(ddmmyy) === "[object Date]" ) {
        return true;
      }
      else {
        return false;
      }
    }

    $scope.setEXENDTC = function() {
      $scope.EXENDTC = new Date($scope.EXENDTC_displayDate.substr(6),
      parseInt($scope.EXENDTC_displayDate.substr(3,2))-1,
      $scope.EXENDTC_displayDate.substr(0,2));
      if (thisIsADate($scope.EXENDTC)) {
        var thisExposure = exposures.getExposuresAscending(exposures.getCurrentExposure().EXTRT);
        if (thisExposure.length > 0) {
          var lastExposure = thisExposure[thisExposure.length -1];
          lastExposure.EXENDTC =  $scope.EXENDTC;
          exposures.editExposure(lastExposure, 'EXENDTC', $scope.EXENDTC);
        }
      }
    }

    $scope.setEXENDTC_Interruption = function() {
      $scope.EXENDTC_Interruption = new Date($scope.EXENDTC_Interruption_display.substr(6), parseInt($scope.EXENDTC_Interruption_display.substr(3,2))-1, $scope.EXENDTC_Interruption_display.substr(0,2));
      if (thisIsADate($scope.EXENDTC_Interruption) && (thisIsADate($scope.EXSTDTC_Interruption))) {
        $scope.interruptionDateValidated = true;
      }
    }

    $scope.disableDoseProperty = function() {
      if ($scope.dateValidated == false)
      return true;
      else
      return false;
    }

    $scope.disableInterruptionProperty = function() {
      if ($scope.interruptionDateValidated == false)
      return true;
      else
      return false;
    }

    $scope.disableTreatmentProperty = function() {
      if ($scope.getDisabledFields())
      return true;

      if ($scope.dateValidated == false)
      return true;

      if ($scope.EXCAT == "")
      return true;

      return false;
    }

    $scope.disableDatabaseTreatmentDoseOptions = function() {
      return (($scope.dateValidated==false)||(extrtRecorded == false));
    }

    $scope.getDisabledFields = function() {
      return (viewService.getView().DisableInputFields);
    }

    $scope.USUBJID = '';
    $scope.dateValidated = false;
    $scope.interruptionDateValidated = false;

    $rootScope.setExposureUSUBJID = function(USUBJID) {
      $scope.USUBJID = USUBJID;
    }

    $rootScope.setNewExposureFields = function () {
      exposures.clearExposure();
      $scope.dateValidated = false;
      clearFields();
    }

    var clearFields = function () {
      $scope.EXSTDTC = "";
      $scope.EXSTDTC_displayDate = "";

      $scope.EXADJ_Discontinuation = "";
      $scope.EXENDTC = "";
      $scope.EXENDTC_displayDate = "";

      $scope.EXDOSE = "";
      $scope.EXTRT = "";
      $scope.EXDOSU = "";
      $scope.EXDOSFRM = "";
      $scope.EXDOSFRQ = "";
      $scope.EXCAT = "";

      //clearOtherFields();
      extrtRecorded = false;

      $scope.EXSTDTC_Interruption_display='';
      $scope.EXENDTC_Interruption_display='';
      $scope.EXADJ_Interruption='';
    }


    $rootScope.displayExposure = function() {
      clearFields();

      var exposureForDisplay = exposures.getCurrentExposure();
      var sortedExposures = exposures.getExposuresAscending(exposureForDisplay.EXTRT);

      $scope.dateValidated = true;
      $scope.EXSTDTC = sortedExposures[0].EXSTDTC;
      $scope.EXSTDTC_displayDate = $scope.EXSTDTC.getDate()+"/"+(parseInt($scope.EXSTDTC.getMonth()+1))+"/"+$scope.EXSTDTC.getFullYear();// set date

      $scope.EXTRT = sortedExposures[0].EXTRT;
      $scope.EXDOSE = sortedExposures[0].EXDOSE;
      $scope.EXDOSU = sortedExposures[0].EXDOSU;
      $scope.EXDOSFRM = sortedExposures[0].EXDOSFRM;
      $scope.EXDOSFRQ = sortedExposures[0].EXDOSFRQ;
      $scope.EXCAT = sortedExposures[0].EXCAT;


      $scope.EXENDTC = sortedExposures[sortedExposures.length-1].EXENDTC;
      if (($scope.EXENDTC!= null)&&($scope.EXENDTC!= ''))
      $scope.EXENDTC_displayDate = $scope.EXENDTC.getDate()+"/"+(parseInt($scope.EXENDTC.getMonth()+1))+"/"+$scope.EXENDTC.getFullYear();// set date
      else
      $scope.EXENDTC_displayDate = '';
      $scope.EXADJ_Discontinuation = sortedExposures[sortedExposures.length-1].EXADJ;
    }

    $scope.addDoseProperty = function (propertyName) {

      var exposuresToTrt = exposures.getExposureByDate($scope.EXTRT, $scope.EXSTDTC);

      if (exposuresToTrt != null) {
        switch (propertyName) {
          case 'EXDOSU': {
            exposuresToTrt.EXDOSU = $scope.EXDOSU;
            exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSU);
            break;
          }
          case 'EXDOSE': {
            exposuresToTrt.EXDOSE = $scope.EXDOSE;
            exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSE);
            break;
          }
          case 'EXDOSFRM': {
            exposuresToTrt.EXDOSFRM = $scope.EXDOSFRM;
            exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRM);

            break;
          }
          case 'EXDOSFRQ': {
            exposuresToTrt.EXDOSFRQ = $scope.EXDOSFRQ;
            exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRQ);
            break;
          }
          case 'EXCAT': {
            exposuresToTrt.EXCAT = $scope.EXCAT;
            exposures.editExposure(exposuresToTrt, propertyName, $scope.EXCAT);
            break;
          }
        }
        console.log(exposuresToTrt);
      }
      else {
        if (propertyName=="EXCAT") {
          $scope.data = {drugs: DrugFactory};
          $scope.drugsFactory = DrugFactory.names($scope.EXCAT);
        }
      }
    }

    $scope.addExposure = function () {
      if ($scope.EXTRT != '') {
        var currentExposure = exposures.getCurrentExposure();
        if (currentExposure != null) { // currently a treatment already
          if (currentExposure.EXTRT != $scope.EXTRT) {    // new name different from current treatment
            console.log(currentExposure);
            exposures.deleteExposure(currentExposure); // delete previous treatment
            $scope.EXDOSE = "";
            $scope.EXDOSU = "";
            $scope.EXDOSFRM = "";
            $scope.EXDOSFRQ = "";
            //$scope.EXCAT = DrugFactory.category($scope.EXTRT);

            var newExposure = new Exposure ($scope.USUBJID, $scope.EXTRT);
            newExposure.EXSTDTC = $scope.EXSTDTC;
            newExposure.displayDate = newExposure.EXSTDTC.toDateString();
            newExposure.displayLabel = newExposure.EXTRT;
            newExposure.EXCAT = $scope.EXCAT;
            exposures.addExposure(newExposure);
            exposures.setCurrentExposure(newExposure);
            extrtRecorded = true;
          }
        }
        else {
          var newExposure = new Exposure ($scope.USUBJID, $scope.EXTRT);
          newExposure.EXSTDTC = $scope.EXSTDTC;
          newExposure.displayDate = newExposure.EXSTDTC.toDateString();
          newExposure.displayLabel = newExposure.EXTRT;

          if (DrugFactory.isKnown($scope.EXTRT)) {
            var EXCAT = DrugFactory.category($scope.EXTRT);
            newExposure.EXCAT = EXCAT;
            $scope.EXCAT = EXCAT;
          }
          else
          newExposure.EXCAT = $scope.EXCAT;

          exposures.addExposure(newExposure);
          exposures.setCurrentExposure(newExposure);
          extrtRecorded = true;
        }
      }
      else {
        var currentExposure = exposures.getCurrentExposure();
        console.log(currentExposure);
        if ((exposures.getCurrentExposure() != null)) { // changing treatment name
          exposures.deleteExposure(exposures.getCurrentExposure()); // delete previous treatment
          $scope.EXDOSE = "";
          $scope.EXDOSU = "";
          $scope.EXDOSFRM = "";
          $scope.EXDOSFRQ = "";
          $scope.EXCAT = "";
          extrtRecorded = false;
        }
      }
    }

    $scope.addEXADJ_Discontinuation = function() {
      if ($scope.EXENDTC_displayDate == null) {
        alert("Date null");
        $scope.EXADJ_Discontinuation = '';
      } else {
        var sortedExposures = exposures.getExposuresAscending(exposures.getCurrentExposure().EXTRT);

        sortedExposures[sortedExposures.length-1].EXENDTC = $scope.EXENDTC;
        exposures.editExposure(sortedExposures[sortedExposures.length-1], "EXENDTC", $scope.EXENDTC);

        sortedExposures[sortedExposures.length-1].EXADJ = $scope.EXADJ_Discontinuation;
        exposures.editExposure(sortedExposures[sortedExposures.length-1], "EXADJ", $scope.EXADJ_Discontinuation);

        console.log(sortedExposures);
      }
    }

    $scope.getInterruptions = function() {
      var currentExposure = exposures.getCurrentExposure();
      if (currentExposure != null)
      {
        var foo = exposures.getInterruptionDatesForDrug(currentExposure.EXTRT);

        for (var f = 0; f < foo.length; f++)
        {
          var endOfFirst_display = foo[f].endOfFirst.EXENDTC.getDate()+"/"+(parseInt(foo[f].endOfFirst.EXENDTC.getMonth()+1))+"/"+foo[f].endOfFirst.EXENDTC.getFullYear();// set date
          foo[f].endOfFirst.EXENDTC_display = endOfFirst_display;

          var startOfSecond_display = foo[f].startOfSecond.EXSTDTC.getDate()+"/"+(parseInt(foo[f].startOfSecond.EXSTDTC.getMonth()+1))+"/"+foo[f].startOfSecond.EXSTDTC.getFullYear();// set date
          foo[f].startOfSecond.EXSTDTC_display = startOfSecond_display;
        }

        return foo;
      }
      else {
        return [];
      }
    }

    $scope.addInterruption = function() {
      if (($scope.EXSTDTC_Interruption_display =='')||($scope.EXENDTC_Interruption_display == '')) {
        alert ("Date null?");
        $scope.EXADJ_Interruption = '';
        return;
      }
      else {
        $scope.EXTRT = exposures.getCurrentExposure().EXTRT;
        var sortedExposures = exposures.getExposuresAscending(exposures.getCurrentExposure().EXTRT);
        sortedExposures[sortedExposures.length-1].EXENDTC = $scope.EXENDTC_Interruption;
        sortedExposures[sortedExposures.length-1].EXADJ = $scope.EXADJ_Interruption;
        exposures.editExposure(sortedExposures[sortedExposures.length-1], 'EXENDTC', $scope.EXENDTC_Interruption);
        exposures.editExposure(sortedExposures[sortedExposures.length-1], 'EXADJ', $scope.EXADJ_Interruption);
        console.log(sortedExposures[sortedExposures.length-1]);

        var newExposure = new Exposure ($scope.USUBJID, exposures.getCurrentExposure().EXTRT);
        newExposure.EXSTDTC = new Date($scope.EXSTDTC_Interruption);
        newExposure.EXCAT =  $scope.EXCAT;
        newExposure.displayDate = newExposure.EXSTDTC.toDateString();
        newExposure.displayLabel = newExposure.EXTRT;
        exposures.addExposure(newExposure);

        $scope.EXENDTC_Interruption_display = '';
        $scope.EXSTDTC_Interruption_display = '';
        $scope.EXADJ_Interruption = '';

        var interruptionsForEXTRT = exposures.getInterruptionsForDrug($scope.EXTRT);
        if (interruptionsForEXTRT == null) {
          var interruption = {drug:$scope.EXTRT,
            dates:[{   endOfFirst: sortedExposures[sortedExposures.length-1],
              startOfSecond: newExposure}]};
              exposures.addInterruption(interruption);
            }
            else {
              exposures.addInterruptionDate($scope.EXTRT, sortedExposures[sortedExposures.length-1], newExposure);
            }
          }
        }

        $scope.data = {drugs: DrugFactory};
        $scope.drugsFactory = DrugFactory.names($scope.EXCAT);

      })

      interventionModule.directive('exposureEntry', function() {
        return {
          restrict: 'AE',
          replace: 'true',
          templateUrl: 'scripts/js/exposure/exposure.html'
        };
      })
