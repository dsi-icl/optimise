<?php

//define (DB_USER, "mysql_user");
//define (DB_PASSWORD, "mysql_password");
include_once("contants.php");

define ("PRODUCTION_MODE", true);

define("destinationURL",'http://www.optimise-ms.org/api/OPTIMISE');
if(PRODUCTION_MODE) {
    error_reporting(0);
    define("destinationURL",'http://146.169.35.160/api/OPTIMISE');
    define ("DB_HOST", "146.169.32.150:27017");
}else{
    define("destinationURL",'http://www.optimise-ms.org/api/OPTIMISE');
    define ("DB_HOST", "192.99.243.218:27017");
}
//define ("DB_HOST", "192.99.243.218:27017");
//define ("DB_HOST", "192.168.99.100:27017");
define ("DB_HOST", "146.169.32.150:27017");
//static $db=null;
function db_connect($dbname=null) {
    try {
        $db = new MongoClient("mongodb://" . DB_HOST);
        if($dbname!=null)
        {
            $connection=$db->selectDB($dbname);
        }else{
            $connection=$db->selectDB(DB_NAME);
        }

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

