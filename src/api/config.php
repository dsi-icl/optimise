<?php

include_once("constants.php");

define("destinationURL",'');

//error_reporting(0);
define ("DB_HOST", "database");

function db_connect($dbname=null) {
    try {
        $db = new MongoClient("mongodb://" . DB_HOST);
        if($dbname!=null)
        {
            $connection=$db->selectDB($dbname);
        }else{
            $connection=$db->selectDB(DB_NAME);
        }

        $list = $db->listCollections();
        
        return $connection;
    }
    catch (Exception $e)
    {
        $MaxRetries = 5;
        for( $Counts = 1; $Counts <= $MaxRetries; $Counts ++ ) {
            try {
                $db = new MongoClient("mongodb://" . DB_HOST);
                $connection=$db->selectDB(DB_NAME);
                return $connection;
            } catch( Exception $e ) {
                continue;
            }
            $file = 'log.txt';
            file_put_contents($file, $e, FILE_APPEND | LOCK_EX);
            return null;
        }

    }
}
function getNextSequence($name){
    $connection=db_connect();
    if($connection==null)
    {
        return null;
    }
    try {
        $collection = $connection->counters;
        $retval = $collection->findAndModify(
            array('_id' => $name),
            array('$inc' => array("seq" => 1)),
            null,
            array(
                "new" => true,
            )
        );
        if (isset($retval['seq'])) {
//            var_dump($retval['seq']);
            return (string)$retval['seq'];
        }else{
            $collection->insert(array(
                '_id' => $name,
                'seq'  => 10000,
            ));
            return (string)1;
        }
    }catch (Exception $e)
    {
//        var_dump($e);
        return null;
    }

}

function ReturnException($errorCode,$httpCode,$desp="")
{
    $error=array('result'=>'error',"errorCode"=>$errorCode,"desp"=>$desp);

    if(function_exists('http_response_code'))
    {
        http_response_code($httpCode);
    }else{
        header('HTTP/1.1 '.$httpCode.' Unauthorized', true, $httpCode);
    }
    echo json_encode($error);
    return;
}

function ReturnSucceedResult()
{
    $result=array('result'=>SUCCEED);
    echo json_encode($result);
    return;
}
function ExistErrorsCheck($json,$variables)
{
    if($json==null) {
        ReturnException(ERROR_Invalid_Json, 400, "invalid json input");
        return true;
    }
    foreach($variables as $variable)
    {
        if(!isset($json[$variable]))
        {
            ReturnException(ERROR_missing_data,400,$variable." is required");
            return true;
        }
    }
}

