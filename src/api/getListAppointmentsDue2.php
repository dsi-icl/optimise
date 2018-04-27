<?php

	include 'utilities.php';
	include 'config.php';

	$connection = db_connect(OPTIMISE_DB);
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

		$interval = intval($reminder['REMINDERFREQUENCY']);
		$mostRecent = getLatestAppointment($reminder['USUBJID'],$reminder['REMINDERCATEGORY']);

		if ($mostRecent != '') {
			
			$dueDateTimeStamp = $mostRecent + $interval - $weekAdvance;
			$lastAppointment = date('d-m-Y', $mostRecent);

		 } else {
			 
			$dueDateTimeStamp = strtotime($reminder['REMINDERSTDTC']) + $interval - $weekAdvance;
			$lastAppointment = "None recorded. Reminder created on " . date('d-m-Y', strtotime($reminder['REMINDERSTDTC']));

		}

		$overdueSeconds = $todayTimeStamp - $dueDateTimeStamp;
		$overdueMinutes = $overdueSeconds/60;
		$overdueHours = $overdueMinutes/60;
		$overdueDays = $overdueHours/24;
	
		if ($overdueDays > 7) {
		    $listReminders[$reminder['USUBJID']][] = array('LastAppointment'=>$lastAppointment,
					      	    							'DueAppointment'=>date("d-m-Y", $dueDateTimeStamp+$weekAdvance),
						    								'Notes'=>$reminder['REMINDERNOTES'] . "Overdue " . intval($overdueDays-7) . " days");
		} else {
			$listReminders[$reminder['USUBJID']][] = array('LastAppointment'=>$lastAppointment,
															'DueAppointment'=>date("d-m-Y", $dueDateTimeStamp+$weekAdvance),
			  												'Notes'=>$reminder['REMINDERNOTES']);
		}
		
	}

	$returnResult = array('Reminders' => $listReminders);
        $jsonReturn = json_encode($returnResult);
        echo isset($_GET['callback'])
             ? "{$_GET['callback']}($jsonReturn)"
             : $jsonReturn;
	
?>