<?php

	include 'utilities.php';
	include 'config.php';

	$connection = db_connect('Optimise');
	$optimise = $connection->selectCollection('dataStream');
	$reminders = $connection->selectCollection('reminders');
	
	$subjects = array();
	$listReminders = array();
	
	function getLatestAppointment ($USUBJID, $CATEGORY) {
		global $optimise;
		$subjectCriteria  = array(0=>array('USUBJID'=>$USUBJID));

		if ($CATEGORY == "MRI"){
		   $subjectCriteria[] = array('DOMAIN'=>'PR');
		   $subjectCriteria[] = array('PRTRT'=>'MRI'); 
		}
		else {
		     $subjectCriteria[] = array('DOMAIN'=>$CATEGORY); 
		}
		
		$query = array('$and'=>$subjectCriteria);
		//echo "\n".json_encode($query);
		$cursor = $optimise->find($query);
	
		$testDates = array();
		foreach ($cursor as $labReport){
			if ($CATEGORY=='LB')
			   $testDates[] = $labReport['LBDTC'];
			if ($CATEGORY=='IS')
			   $testDates[] = $labReport['ISDTC'];
			if ($CATEGORY=='MRI')
			   $testDates[] = $labReport['PRSTDTC'];
		}
		
		sort($testDates);
		//print_r($testDates);
		$mostRecent = strtotime(array_pop($testDates));
		//echo "\nMostRecent: ".$mostRecent;
		return $mostRecent;
	}
	
	$todayTimeStamp = date_timestamp_get(date_create());
//	echo "\nToday: ".date("c",$todayTimeStamp);
	$weekAdvance = 604800;

	$reminders_cursor = $reminders->find(array());
	foreach ($reminders_cursor as $reminder) {
		//echo "\n".$reminder['USUBJID'].": ".$reminder['REMINDERFREQUENCY'];
		//echo "\n".$reminder['USUBJID'].": ".$reminder['REMINDERCATEGORY'];
		$interval = intval($reminder['REMINDERFREQUENCY']);
		$mostRecent = getLatestAppointment($reminder['USUBJID'],$reminder['REMINDERCATEGORY']);
		//echo "\nRecent: ".date("c", $mostRecent);
		//echo "\nInterval: ".$interval;
		if ($mostRecent != '') {
		   $dueDateTimeStamp = $mostRecent + $interval - $weekAdvance;
		   //echo "\nDue: ".date("c",$dueDateTimeStamp);
		
		   $overdueSeconds = $todayTimeStamp - $dueDateTimeStamp;
		   $overdueMinutes = $overdueSeconds/60;
		   $overdueHours = $overdueMinutes/60;
		   $overdueDays = $overdueHours/24;
		   //echo "\nOverdueDays".$overdueDays;
	
			if ($overdueDays > 0) {
		     	   $listReminders[$reminder['USUBJID']][] = array('LastAppointment'=>date("c", $mostRecent),
					      	    'DueAppointment'=>date("c", ($dueDateTimeStamp+$weekAdvance)),
						    'Notes'=>$reminder['REMINDERNOTES']);
		 	}
		 }
		
	}

	$returnResult = array('Reminders' => $listReminders);
        $jsonReturn = json_encode($returnResult);
        echo isset($_GET['callback'])
             ? "{$_GET['callback']}($jsonReturn)"
             : $jsonReturn;
	
?>