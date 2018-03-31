<?php

include 'utilities.php';
include 'config.php';

$connection = db_connect(OPTIMISE_DB);
$optimise = $connection->selectCollection(OPTIMISE_TABLE);
if ($_SERVER['REQUEST_METHOD'] == "GET") {

	$criteria = array(0=>array('DOMAIN'=>'DM'),
			  1=>array('RFICDTC'=> array('$ne'=>"")),
			  2=>array('INVNAM'=> array('$ne'=>"")),
			  3=>array('INVNAM'=> array('$ne'=>"")));

	$query = array('$and'=>$criteria);

	$cursor = $optimise-> find($query);
	$Recordset = array();
	$subjects = array();
	foreach ($cursor as $id => $valueRoot) {

		$USUBJID = $valueRoot['USUBJID'];
		//$subjects[] = array('USUBJID'=>$USUBJID);
		$msRegCriteria = array(0=>array('DOMAIN'=>'EX'),
					1=>array('MHTERM'=>'Secondary Progressive Multiple Sclerosis'),
					2=>array('MHTERM'=>'Relapsing Remitting Multiple Sclerosis'),
					3=>array('QSTEST'=>'EDSS-Total Human'),
					4=>array('CETERM'=>'Multiple Sclerosis Relapse'),
					5=>array('FAOBJ'=>'Mobility'));

		$subjectCriteria = array('USUBJID'=>$USUBJID);
		$queryRegistrySubject = array('$and'=>array(0=>$subjectCriteria,
							    1=>array('$or'=>$msRegCriteria)));

		//var_dump($queryRegistrySubject);
		//echo json_encode($queryRegistrySubject);
		$cursorRegistry = $optimise->find($queryRegistrySubject);
		//$cursorRegistries[] = $cursorRegistry;
		foreach ($cursorRegistry as $key => $value) {
			if ($value['DOMAIN'] == "EX") {
			   $subjects[$USUBJID]['Treatments'][] = $value;
			}
			else if ($value['DOMAIN']=='MH'){
			     $subjects[$USUBJID]['Medical History'][]= $value;
			}
			else if ($value['DOMAIN']=='CE'){
			     $subjects[$USUBJID]['Relapses'][]= $value;
			}
			else if ($value['DOMAIN']=='QS'){
			     $subjects[$USUBJID]['EDSS'][]= $value;
			}
			else if ($value['DOMAIN']=='FA'){
			     $subjects[$USUBJID]['8MWalk'][]=$value;
			}


			//$Recordset[] = array(0=>array('USUBJID'=>$USUBJID),
			//			1=>array('Records'=>$value));
			//var_dump($subjects[$]);
		}
	}
	//print_r($subjects);

	$returnResult = array('RecordSet' => $subjects);
    	$jsonReturn = json_encode($returnResult);
    	echo isset($_GET['callback'])
        ? "{$_GET['callback']}($jsonReturn)"
        : $jsonReturn;



/*
	echo count($cursorRegistries);

	for ($r = 0; $r < count($cursorRegistries); $r++) {
	    var_dump($cursorRegistries[$r]);
	    foreach($cursorRegistries[$r] as $key => $value) {
	    	echo 'test';
	    }
	}*/
}

/*
{"USUBJID": ""}]}
		 {"DOMAIN": "DM"},
		 {"RFICDTC": {"$ne": ""}}
		 ]}';

$cursor = $optimise->find(array ('$or' => array (0 => array ('PRTRT' => 'MRI'),
                                        1 => array ('PRTRT' => 'Lumbar Puncture'),
                                        2 => array ('DOMAIN' => 'IS'),
                                        3 => array ('DOMAIN' => 'LB'),
                                        4 => array ('NVCAT' => 'Evoked Potential'))));
    //$arrayQuery = json_decode($jsonQuery, true, 1);//mongoDB query list

      $RecordSet = [];
    var_dump($query);

    $cursor = $optimise->find($mQuery);
    foreach ($cursor as $id => $valueRoot) {
    var_dump($valueRoot);
        $recordItems = array();
        foreach ($valueRoot as $key => $value) {
        var_dump($value);
            $recordItems[] = array('fieldName' => $key, 'value' => $value);
        }
        $RecordSet[] = array('RecordItems' => $recordItems);
    }
    $returnResult = array('RecordSet' => $RecordSet);
    $jsonReturn = json_encode($returnResult);
    echo isset($_GET['callback'])
        ? "{$_GET['callback']}($jsonReturn)"
        : $jsonReturn;
*/
