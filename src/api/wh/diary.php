<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 23/09/2015
 * Time: 13:46
 */

include_once("../config.php");
header('Access-Control-Allow-Origin: *');

$method = $_SERVER['REQUEST_METHOD'];
if($method=="POST")
{
    $token=null;
    $headers = apache_request_headers();
    foreach ($headers as $header => $value) {
        if($header=="token")
        {
            $token=$value;
        }
    }
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
    //register user
    $data=file_get_contents('php://input'); //get POST payload
    $json=json_decode($data,true);
    $existError=ExistErrorsCheck($json,array("text"));
    if($existError)
    {
        return;
    }
    $diary_text=$json["text"];

    try {
        $connection=db_connect();
        if($connection==null)
        {
            ReturnException(Internal_Error,500);
            return;
        }
        $diary_table=$connection->selectCollection(DIARY_U_TABLE);
        $diary_table->insert(array(m_id=>$db_token[m_id],"text"=>$diary_text,"created_date"=>new MongoDate())); //insert record
        ReturnSucceedResult();
    }catch (Exception $e)
    {
        ReturnException(ERROR_Internal_Error,500);
        return;
    }

}else if($method=="GET")
{
    $token=null;
    $headers = apache_request_headers();
    foreach ($headers as $header => $value) {
        if($header=="token")
        {
            $token=$value;
        }
    }
    if($token==null&&isset($_REQUEST['token']))
    {
        $token=$_REQUEST['token'];
    }
    if($token!=null)
    {
        $connection=db_connect();
        if($connection==null)
        {
            ReturnException(Internal_Error,500);
            return;
        }
        $tokens=$connection->selectCollection(TOKEN_U_TABLE);
        $db_token=$tokens->findOne(array(token => $token)); //check clinician token
        if($db_token==null)
        {
            ReturnException(ERROR_Permission_denied,401,"invalid user access token:".$token);
            return;
        }
        $limit=null;
        if(isset($_REQUEST[limit])&&is_numeric($_REQUEST[limit])&&$_REQUEST[limit]>=0)
        {
            $limit=$_REQUEST[limit];
        }
        $skip=null;
        if(isset($_REQUEST[skip])&&is_numeric($_REQUEST[skip])&&$_REQUEST[skip]>=0)
        {
            $skip=$_REQUEST[skip];
        }
        $diary_table=$connection->selectCollection(DIARY_U_TABLE);
        $allResults=[];
        $cursor = $diary_table->find(array(m_id=>$db_token[m_id]));
        $cursor->sort(array('created_date'=> -1));
        if($limit!=null&&$skip!=null)
        {
            $cursor->limit($limit);
            $cursor->skip($skip);
        }
        $totalRecords=$cursor->count();

        foreach ( $cursor as $id => $value )
        {

            $newValue=$value;
//            $date1=new MongoDate();
//            echo $date1->usec;
//            $date=date(DATE_ISO8601,$value["created_date"]->sec);
            $date=new DateTime();
            $date->setTimestamp($value["created_date"]->sec);
            $newValue["created_date"]=$date->format(DATE_ISO8601);
            $newValue["created_date_long"]=$date->getTimestamp();
//            echo new Datetime($newValue["created_date"]);
            unset($newValue['_id']);
            unset($newValue['m_id']);
            $allResults[]=$newValue;
        }
        $returnResult=array('result'=>SUCCEED,"totalRecords"=>$totalRecords,"returnedRecords"=>count($allResults),"diaries"=>$allResults);
        echo json_encode($returnResult);
    }else{
        ReturnException(ERROR_Permission_denied,401,"missing or invalid access token");
        return;
    }
}