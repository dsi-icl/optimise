<?php

include 'utilities.php';
include 'config.php';
//headers function
$server=$_SERVER;
//var_dump($server);
$setting=2; //1 enable Auth

/*
if(!isset($_REQUEST['USUBJID'])||$_REQUEST['USUBJID']==null||strlen($_REQUEST['USUBJID'])<2)
{
    ReturnException(ERROR_MISSING_USUBJID,401,"missing USUBJID field");
    return;
}*/

if($setting==1)
{
    $token=null;
    $headers = apache_request_headers();
    foreach ($headers as $header => $value) {
        if($header=="token")
        {
            $token=$value;
        }
	//echo $header;
    }
    echo $token;

    if($token==null&&isset($_REQUEST['token']))
    {
        $token=$_REQUEST['token'];
    }
    if($token==null){
        ReturnException(ERROR_Permission_denied,401,"missing or invalid access token");
        return;
    }else{
        $connection=db_connect();
        if($connection==null)
        {
            ReturnException(Internal_Error,500);
            return;
        }
        $tokens=$connection->selectCollection(TOKEN_U_TABLE);
        $db_token=$tokens->findOne(array(token => $token));
        if($db_token==null)
        {
            ReturnException(ERROR_Permission_denied,401,"invalid access token:".$token);
            return;
        }

    }
    echo "token accepted";
}


if($setting==1)
{
    $method = $_SERVER['REQUEST_METHOD'];
    if($method=="POST")
    {
        $data=file_get_contents('php://input'); //get POST payload
        $jsonData=json_decode($data,true);

        if(isset($_REQUEST['OID'])&&$_REQUEST['OID']==2)
        {
            //updating existing record
            $currentRecord=$jsonData['CurrentRecord'];
            $newRecord=$jsonData['NewRecord'];

            $existUSUBJID=false;
            $targetUSUBJID=null;
            for($i=0;$i<count($currentRecord);$i++) {
                $currentRecordEntry=$currentRecord[$i];
                if($currentRecordEntry['fieldName']=="USUBJID")
                {
//               echo $currentRecordEntry['value'];
                    $targetUSUBJID=$currentRecordEntry['value'];
                    if(isset($targetUSUBJID)&&strlen($targetUSUBJID)>2)
                    {
                        if(1==1) //need to check ID exist
                        {
                            $existUSUBJID=true;
                        }

                    }
                }
            }
            if($existUSUBJID==false)
            {
                ReturnException(ERROR_Permission_denied,401,"USUBJID is required to update a record");
                return;
            }
            for($i=0;$i<count($newRecord);$i++) {
                $newRecordEntry=$newRecord[$i];
                if($newRecordEntry['fieldName']=="USUBJID")
                {
//               echo $currentRecordEntry['value'];
                    $toCheckUSUBJID=$newRecordEntry['value'];
                    if($toCheckUSUBJID!=$targetUSUBJID)
                    {
                        ReturnException(ERROR_Permission_denied,401,"access to another USUBJID is not permitted:".$toCheckUSUBJID);
                        return;
                    }
                }
            }
        }else{
            //adding new record
            $recordSet=$jsonData['RecordSet'];

            $recordItems=$recordSet[0]['RecordItems'];

            $existUSUBJID=false;
            $targetUSUBJID=null;
            for($i=0;$i<count($recordItems);$i++) {
                $RecordEntry=$recordItems[$i];
                if($RecordEntry['fieldName']=="USUBJID")
                {
//               echo $currentRecordEntry['value'];
                    $targetUSUBJID=$RecordEntry['value'];
                    if(isset($targetUSUBJID)&&strlen($targetUSUBJID)>2)
                    {
                        if(1==1) //need to check ID exist
                        {
                            $existUSUBJID=true;
                        }

                    }
                }
            }
            if($existUSUBJID==false)
            {
                ReturnException(ERROR_Permission_denied,401,"USUBJID is required to update a record");
                return;
            }
            if($targetUSUBJID!=$db_token[w_id])
            {
                ReturnException(ERROR_Permission_denied,401,"you can not access data that not belong to you");
                return;
            }
        }
    }
    else if($method=="GET")
    {
//        $data=$_GET; //get GET parameters
        if(!isset($_REQUEST['USUBJID'])||$_REQUEST['USUBJID']==null||strlen($_REQUEST['USUBJID'])<2)
        {
            ReturnException(ERROR_MISSING_USUBJID,401,"missing USUBJID field");
            return;
        }

        if($_REQUEST['USUBJID']!=$db_token[w_id])
        {
            ReturnException(ERROR_Permission_denied,401,"you can not access data that not belong to you");
            return;
        }
    }else if($method=="DELETE")
    {
        $data=file_get_contents('php://input'); //get DELETE payload
        $jsonData=json_decode($data,true);
        $recordItems=$jsonData['RecordItems'];

        $existUSUBJID=false;
        $targetUSUBJID=null;
        for($i=0;$i<count($recordItems);$i++) {
            $$recordItemsEntry=$recordItems[$i];
            if($recordItemsEntry['fieldName']=="USUBJID")
            {
//               echo $currentRecordEntry['value'];
                $targetUSUBJID=$currentRecordEntry['value'];
                if(isset($targetUSUBJID)&&strlen($targetUSUBJID)>2)
                {
                    if(1==1) //need to check ID exist
                    {
                        $existUSUBJID=true;
                    }
                }
            }
        }
        if($existUSUBJID==false)
        {
            ReturnException(ERROR_Permission_denied,401,"USUBJID is required to delete a record");
            return;
        }
    }
}



if(isset($_REQUEST['token']))
{
    unset($_REQUEST['token']);  //remove token from parameters
    unset($_GET['token']);//remove token from parameters
    unset($_POST['token']);//remove token from parameters
}

//echo 'here';
$response = proxy_request($server,destinationURL); //raw response


/*$file = 'log.txt';

file_put_contents($file, $log, FILE_APPEND | LOCK_EX);*/


$headerArray = explode("\r\n", $response['header']);
foreach($headerArray as $headerLine) {
    header($headerLine); //handle header
}
$finalReturn=$response['content'];
header('Access-Control-Allow-Origin: *');
echo isset($_GET['callback'])
    ? "{$_GET['callback']}($finalReturn)"
    : $finalReturn;
