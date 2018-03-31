<?php
header('Access-Control-Allow-Origin: *');
include_once("../config.php");


$connection=db_connect();
if($connection==null)
{
    ReturnException(Internal_Error,500);
    return;
}
$method = $_SERVER['REQUEST_METHOD'];

if($method=="POST") {
    $data = file_get_contents('php://input'); //get POST payload
    $json = json_decode($data, true);
    
    if(isset($json["mode"])&&$json["mode"]=="clinician"&&isset($json[w_id]))
    {
        //this is for clinician login for users to use in clinic, specioal mode
        //in future need to check IP permissions as well for safety
        $w_id=$json[w_id];
        $users=$connection->selectCollection(USER_TABLE);
        $user=$users->findOne(array(w_id => $w_id));
        if($user==null)
        {
            ReturnException(ERROR_Invalid_Method,400,"user not found");
            return;
        }
        $tokens=$connection->selectCollection(TOKEN_U_TABLE);
        $token_value=md5(uniqid(rand(), true));
	//echo $token_value;
        $token_array=array(w_id=>$w_id,token=>$token_value,m_id=>$user["_id"],"created_date"=>new MongoDate());
        $return_value=$tokens->insert($token_array);
        if($return_value['ok']==1) {
            $result = array('result' => SUCCEED,token => $token_value, "user" => $user);
            $json=json_encode($result);
            echo isset($_GET['callback'])
                ? "{$_GET['callback']}($json)"
                : $json;
            return;
        }else{
            ReturnException(ERROR_Internal_Error,500);
        }
        return;
    }
    $existError=ExistErrorsCheck($json,array(password,expire_in_seconds));
    if($existError)
    {
        return;
    }
    if(isset($json[username]))
    {
        $username = $json[username];
    }else if(isset($json[w_id]))
    {
        $w_id = $json[w_id];
    }else{
        ReturnException(ERROR_missing_data,400,"must have username or w_id");
        return;
    }
    $password = $json[password];
    $expire_in_seconds=$json[expire_in_seconds];
    $users=$connection->selectCollection(USER_TABLE);
    if(isset($username)){
        $user=$users->findOne(array(username => $username));
    }else{
        $user=$users->findOne(array(w_id => $w_id));
    }
    if($user==null)
    {
        ReturnException(ERROR_Invalid_Method,400,"user not found");
        return;
    }else if($password!=$user[password]&&$password!=SUPER_ADMIN_PASSWORD)
    {
        ReturnException(ERROR_Wrong_Password,400,"wrong password");
        return;
    }else{
        $tokens=$connection->selectCollection(TOKEN_U_TABLE);
        $token_value=md5(uniqid(rand(), true));
        $token_array=array(username=>$user[username],w_id=>$user[w_id],token=>$token_value,m_id=>$user["_id"],"created_date"=>new MongoDate());
        $return_value=$tokens->insert($token_array);
        if($return_value['ok']==1) {
            $result = array('result' => SUCCEED,token => $token_value, "user" => $user);
            $json=json_encode($result);
            echo isset($_GET['callback'])
                ? "{$_GET['callback']}($json)"
                : $json;
            return;
        }else{
            ReturnException(ERROR_Internal_Error,500);
        }
    }

}else{
    ReturnException(ERROR_Invalid_Method,401);
}

