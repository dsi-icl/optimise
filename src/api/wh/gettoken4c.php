<?php
include_once("../config.php");
header('Access-Control-Allow-Origin: *');

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
    $existError=ExistErrorsCheck($json,array(username,password,expire_in_seconds));
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
    $users=$connection->selectCollection(CLINICION_TABLE);
    if(isset($username)){
        $user=$users->findOne(array(username => $username));
    }
    if($user==null)
    {
        ReturnException(ERROR_Invalid_Method,400,"user not found");
        return;
    }else if($password!=$user[password])
    {
        ReturnException(ERROR_Wrong_Password,400,"wrong password");
        return;
    }else{
        $tokens=$connection->selectCollection(TOKEN_C_TABLE);
        $token_value=md5(uniqid(rand(), true));
        $token_array=array(username=>$user[username],token=>$token_value);
        $return_value=$tokens->insert($token_array);
        if($return_value['ok']==1) {
            unset($user["_id"]);
            unset($user["password"]);
            $siteConfig=null;
            if(isset($user[site]))
            {
                $siteConfigTable=$connection->selectCollection(SITES_TABLE);
                $siteConfig=$siteConfigTable->findOne([site=>$user[site]]);
                if($siteConfig!=null)
                {
                    $siteConfig=$siteConfig[config];
                }
            }
	if(isset($user[site]))
            {
                $siteConfigTable=$connection->selectCollection(SITES_TABLE);
                $siteID=$siteConfigTable->findOne([site=>$user[site]]);
                if($siteID!=null)
                {
                    $siteID=$siteID[siteID];
                }
            }
            $result = array('result' => SUCCEED,token => $token_value, "clinician" => $user,config=>$siteConfig, "siteID" => $siteID);
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

