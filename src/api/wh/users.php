<?php
include_once("../config.php");
header('Access-Control-Allow-Origin: *');
$setting=1; //1 enable Auth


$method = $_SERVER['REQUEST_METHOD'];
if($method=="POST")
{
    $connection=db_connect();
    if($connection==null)
    {
        ReturnException(ERROR_Internal_Error,500);
        return;
    }
    $users=$connection->selectCollection(USER_TABLE);
    //register user
    $data=file_get_contents('php://input'); //get POST payload
    $json=json_decode($data,true);
    $existError=ExistErrorsCheck($json,array(username,password,email));
    if($existError)
    {
        return;
    }
    $username=$json[username];
    $password=$json[password];
    $email=$json[email];
    $count=$users->count(array(username=>$username)); //counting number of users
    if($count>0)
    {
        ReturnException(ERROR_UsernameExist,400,"user name already exist");
        return;
    }
    try {
        $w_id=getNextSequence(w_id);
        if($w_id==null)
        {
            ReturnException(ERROR_Internal_Error,500,"w_id is null");
            return;
        }else {
            $users->insert(array(username => $username, password => $password, email => $email, w_id => (string) $w_id,"created_date"=>new MongoDate())); //insert record
            ReturnSucceedResult();
        }
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
            ReturnException(ERROR_Internal_Error,500);
            return;
        }
        $tokens=$connection->selectCollection(TOKEN_C_TABLE);
        $db_token=$tokens->findOne(array(token => $token)); //check clinician token
        if($db_token==null)
        {
            ReturnException(ERROR_Permission_denied,401,"invalid clinician access token:".$token);
            return;
        }
        $users=$connection->selectCollection(USER_TABLE);
        $allResults=[];
        //pass security return data
        $searchQuery=null;
        if(isset($_REQUEST["query"])&&strlen($_REQUEST["query"])>0)
        {
            $searchQuery=new MongoRegex("/".$_REQUEST["query"]."/i");
            $cursor = $users->find(array(w_id=>$searchQuery));
        }else{
            $cursor = $users->find();
        }

        foreach ( $cursor as $id => $value )
        {
//            echo "$id: ";
//            var_dump( $value );
            unset($value["password"]);
            unset($value['_id']);
            $allResults[]=$value;
        }
        $returnResult=array('result'=>SUCCEED,"users"=>$allResults);
        echo json_encode($returnResult);
    }else{
        ReturnException(ERROR_Permission_denied,401,"missing or invalid access token");
        return;
    }
}

/*
if(isset($_REQUEST['action'])&&$_REQUEST['action']=="create")
{
    $username= trim($_REQUEST['username']);
    $password= $_REQUEST['password'];
    $email= trim($_REQUEST['email']);

}*/


