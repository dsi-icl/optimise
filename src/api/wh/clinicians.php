<?php
include_once("../config.php");
header('Access-Control-Allow-Origin: *');
$connection=db_connect();
if($connection==null)
{
    ReturnException(ERROR_Internal_Error,500);
}
$clinicians=$connection->selectCollection(CLINICION_TABLE);

$method = $_SERVER['REQUEST_METHOD'];
if($method=="POST")
{
    $data=file_get_contents('php://input'); //get POST payload
    $json=json_decode($data,true);
    $existError=ExistErrorsCheck($json,array(username,password,group_ids));
    if($existError)
    {
        return;
    }
    $username=$json[username];
    $password=$json[password];
    if(isset($json[email]))
    {
        $email=$json[email];
    }else{
        $email=null;
    }
    $count=$clinicians->count(array(username=>$username)); //counting number of users
    if($count>0)
    {
        ReturnException(ERROR_UsernameExist,400,"user name already exist");
        return;
    }
    $group_ids=$json[group_ids];//should be a list of groups
    if(!is_array($group_ids))
    {
        ReturnException(ERROR_Invalid_Json, 400, group_ids." must be array");
        return;
    }
    $groups = $connection->selectCollection(GROUPS_TABLE);
    foreach($group_ids as $gid)
    {
        $existGroup=$groups->findOne(array(group_id => $gid)); //check exist group name
        if($existGroup==null)
        {
            ReturnException(ERROR_Invalid_groupID, 400, "invalid group ID:" . $group_id);
            return;
        }
    }


    try {
//        $w_id=getNextSequence(w_id);
            $clinicians->insert(array(username => $username, password => $password, email => $email,group_ids=>$group_ids)); //insert record
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
        $allResults=[];
        //pass security return data
        $cursor = $clinicians->find();
        foreach ( $cursor as $id => $value )
        {
//            echo "$id: ";
//            var_dump( $value );
            unset($value["password"]);
            unset($value['_id']);
            $allResults[]=$value;
        }
        $returnResult=array('result'=>SUCCEED,"clinicians"=>$allResults);
        echo json_encode($returnResult);
    }else{
        ReturnException(ERROR_Permission_denied,401,"missing or invalid access token");
        return;
    }
}else{
    ReturnException(ERROR_Invalid_Method,401,"missing input or method is not correct");
    return;
}

/*
if(isset($_REQUEST['action'])&&$_REQUEST['action']=="create")
{
    $username= trim($_REQUEST['username']);
    $password= $_REQUEST['password'];
    $email= trim($_REQUEST['email']);

}*/


