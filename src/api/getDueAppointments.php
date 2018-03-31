<?php

	include 'utilities.php';
	include 'config.php';

	$connection = db_connect('Optimise');
	$optimise = $connection->selectCollection('dataStream');
	$reminders = $connection->selectCollection('reminders');
	
	$subjects = array();
	
	function getDTC($doc, $DOMAIN) {
		 $dateKey = '';
		 if ($DOMAIN=='PR')
		    $dateKey = "PRSTDTC";
		 else if ($DOMAIN=='IS')
		      $dateKey = "ISDTC";
		 else if ($DOMAIN=='LB')
		      $dateKey = "LBDTC";
		 else if ($DOMAIN=='NV')
		      $dateKey = "NVDTC";

		 if ($dateKey != '') {
		    for ($d = 0; $d < count($doc); $d++) {
		     	if ($doc[$d]["fieldName"]==$dateKey)
		     	   return $doc[$d]["value"]; 
		    }
		}
		return '';
	}

	function getAppointmentType($doc, $domain) {
		$type = '';
		if ($domain=="PR")
		    $type = "PRTRT";
		if ($domain=="IS")
		   $type = "IS";
		if ($domain=="LB")
		   $type = "LB";
		if ($domain=="NV")
		   $type = "NV";
		
		if ($type != "PRTRT") {
		   return $type; 
		} 
		else {
		     for ($d = 0; $d < count($doc); $d++) {
                     	 if ($doc[$d]["fieldName"]=="PRTRT") 
		     	    return $doc[$d]["value"]; 	
		     }
		}
		return "";
	}
	

	function getUSUBJID($doc) {
	 	 for ($d = 0; $d < count($doc); $d++) {
                     if	   ($doc[$d]["fieldName"]=="USUBJID")
                     	   return $doc[$d]["value"];
                 }
		 return "empty";
        }

	function getDOMAIN($doc) {
	 	 for ($d = 0; $d < count($doc); $d++) {
                     if	   ($doc[$d]["fieldName"]=="DOMAIN")
                     	   return $doc[$d]["value"];
                 }
		 return "empty";
        }
	

	function sortBySubjects($USUBJID, $type, $DTC) {
		 global $subjects;
		 /*
		 if (!array_key_exists($USUBJID, $subjects)) {
		    $subjecs[$USUBJID][$type]=array();
		}*/
		//print_r($subjects);

		 $subjects[$USUBJID][$type][]= $DTC;
	}
	/*
	$cursor = $optimise->find(array ('$or' => array (0 => array ('PRTRT' => 'MRI'),
		  			1 => array ('PRTRT' => 'Lumbar Puncture'),
    		  			2 => array ('DOMAIN' => 'IS'),
    					3 => array ('DOMAIN' => 'LB'),
					4 => array ('NVCAT' => 'Evoked Potential'))));	
					*/
	
	$reminders_cursor = $reminders->find(array());
	foreach ($reminders_cursor as $reminder) {
	
	}
	//var user_id = myCursor.hasNext() ? myCursor.next() : null;
	//db.posts.find({owner_id : user_id._id});

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
   /*
	 $jsonReturn = json_encode($returnResult);
    echo isset($_GET['callback'])
        ? "{$_GET['callback']}($jsonReturn)"
        : $jsonReturn;
*/
	$jsonReturn = json_encode($returnResult);
    	echo isset($_GET['callback'])
             ? "{$_GET['callback']}($jsonReturn)"
             : $jsonReturn;

?>