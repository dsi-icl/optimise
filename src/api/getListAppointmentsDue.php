<?php

	include 'utilities.php';
	include 'config.php';

	$connection = db_connect('Optimise');
	$optimise = $connection->selectCollection('dataStream');
	$reminders = $connection->selectCollection('reminders');
	
	$subjects = array();
	$listReminders = array();
	
	function getLatestAppointment ($USUBJID) {
		global $optimise;
		$subjectCriteria  = array(0=>array('USUBJID'=>$USUBJID),
					1=>array('DOMAIN'=>'IS'));
		
		$query = array('$and'=>$subjectCriteria);
		//echo json_encode($query);
		$cursor = $optimise->find($query);
		
		$testDates = array();
		foreach ($cursor as $labReport){
			$testDates[] = $labReport['ISDTC'];
		}
		
		sort($testDates);
//		print_r($testDates);
		$mostRecent = strtotime(array_pop($testDates));
		return $mostRecent;
	}
	
	$todayTimeStamp = date_timestamp_get(date_create());
//	echo "\nToday: ".date("c",$todayTimeStamp);
	$weekAdvance = 604800;

	$reminders_cursor = $reminders->find(array());
	foreach ($reminders_cursor as $reminder) {
//		echo "\n".$reminder['USUBJID'].": ".$reminder['REMINDERFREQUENCY'];
		$interval = intval($reminder['REMINDERFREQUENCY']);
		$mostRecent = getLatestAppointment($reminder['USUBJID']);
		//echo "\nRecent: ".date("c", $mostRecent);
		//echo "\nInterval: ".$interval;
		
		$dueDateTimeStamp = $mostRecent + $interval - $weekAdvance;
		//echo "\nDue: ".date("c",$dueDateTimeStamp);
		
		$overdueSeconds = $todayTimeStamp - $dueDateTimeStamp;
		$overdueMinutes = $overdueSeconds/60;
		$overdueHours = $overdueMinutes/60;
		$overdueDays = $overdueHours/24;
		//echo "\n".$overdueDays;

	//	$listReminders[$reminder['USUBJID']] = array(0=>array('LastAppointment'=>date("c", $mostRecent)),
	//				      	    1=>array('DueAppointment'=>date("c", ($dueDateTimeStamp+$weekAdvance))));
	
		if ($overdueDays > 0) {
		  $listReminders[$reminder['USUBJID']] = array('LastAppointment'=>date("c", $mostRecent),
					      	    'DueAppointment'=>date("c", ($dueDateTimeStamp+$weekAdvance)),
						    'Notes'=>$reminder['REMINDERNOTES']);
		}
		
	}

	$returnResult = array('Reminders' => $listReminders);
        $jsonReturn = json_encode($returnResult);
        echo isset($_GET['callback'])
             ? "{$_GET['callback']}($jsonReturn)"
             : $jsonReturn;
	
	

	/*
	$cursor = $optimise->find(array ('$or' => array (0 => array ('DOMAIN' => 'IS'),
		  			1 => array ('DOMAIN' => 'LB'))));	
	
	//$remindersList = $reminders 
	foreach ($cursor as $id => $valueRoot) {
	        $recordItems = array();
        	foreach ($valueRoot as $key => $value) {
            		$recordItems[] = array('fieldName' => $key, 'value' => $value);
        	}
       		$RecordSet[] = array('RecordItems' => $recordItems);
    	}

    	$scheduledDates = array('RecordSet' => $RecordSet);
		
	// assign procedures to respective subjects
	for ($d = 0; $d < count($scheduledDates['RecordSet']); $d++) {
	    $USUBJID =  getUSUBJID($scheduledDates['RecordSet'][$d]['RecordItems']);
	    $DOMAIN = getDomain($scheduledDates['RecordSet'][$d]['RecordItems']);
	    
	    $type = getAppointmentType($scheduledDates['RecordSet'][$d]['RecordItems'], $DOMAIN);
	    
	    if ($type != '') {
	       $DTC = getDTC($scheduledDates['RecordSet'][$d]['RecordItems'],$DOMAIN);
	       sortBySubjects($USUBJID, $type, $DTC);
	    }
	}

	$today = date_timestamp_get(date_create());
	//echo (date_format(date_create(), 'U = Y-m-d H:i:s'))."\n";
	//$appointmentsDue[] = array();

	function makeNewAppointment($type, $subject) {
		 global $today;
		 if (array_key_exists($type, $subject)){
	      	    sort($subject[$type]);
	  
			$mostRecent = strtotime(array_pop($subject[$type]));
	      		$due = strtotime('+6 month', $mostRecent);

	      		$mostRecentDate = new DateTime();
			$mostRecentDate -> setTimestamp($mostRecent);
			//echo (date_format($mostRecentDate, 'U = Y-m-d H:i:s'))."\n";
			
			$mostDueDate = new DateTime();
	   		$mostDueDate -> setTimestamp($due);
			//echo (date_format($mostDueDate, 'U = Y-m-d H:i:s'))."\n";
	  
			// if due before today
	   		if ($due <= $today){
	      	   	   return array("Procedure"=>$type, 
	      				 "lastAppointment"=>date_format($mostRecentDate, 'U = Y-m-d H:i:s'), 
					 "dueDate"=>date_format($mostDueDate, 'U = Y-m-d H:i:s')); 
			}
			else 
		     	     return '';
		     
	   	     }
		     return '';	
	}
	
	foreach ($subjects as $subjectid => $subject) {
		
		$type = 'MRI';
	   	$mriDue = makeNewAppointment($type,$subject);
		if (is_array($mriDue))
	      	   $appointmentsDue[$subjectid][$type][] = $mriDue;
		  
		$type = 'Lumbar Puncture';
	   	$LPDue = makeNewAppointment($type,$subject);
	   	if (is_array($LPDue))
	      	   $appointmentsDue[$subjectid][$type][] = $LPDue;

		$type = 'IS';
	   	$ISDue = makeNewAppointment($type,$subject);
		if (is_array($ISDue))
	      	   $appointmentsDue[$subjectid][$type][] = $ISDue;

		$type = 'LB';
	   	$LBDue = makeNewAppointment($type,$subject);
	   	if (is_array($LBDue))
	      	   $appointmentsDue[$subjectid][$type][] = $LBDue;

		$type = 'NV';
	   	$NVDue = makeNewAppointment($type,$subject);
	   	if (is_array($NVDue))
	      	   $appointmentsDue[$subjectid][$type][] = $NVDue;
   	 }
	  
	//print_r($appointmentsDue);

	$returnResult = array('RecordSet' => $appointmentsDue);
	$jsonReturn = json_encode($returnResult);
    	echo isset($_GET['callback'])
             ? "{$_GET['callback']}($jsonReturn)"
             : $jsonReturn;
*/
?>