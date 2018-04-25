<?php
include_once ("../config.php");

header('Access-Control-Allow-Origin: *');
$connection = db_connect();

if ($connection == null) {
    ReturnException(ERROR_Internal_Error, 500, error_get_last()['message']);
    return;
}

$uadm = array(
    "username" => "admin"
);
$cursor = $connection->clinicians->find($uadm);

if ($cursor->count() <= 0) {
    $options = ['cost' => 10, ];
    $connection->clinicians->createIndex(array(
        'username' => 1
    ) , array(
        'unique' => 1,
        'dropDups' => 1
    ));
    $connection->clinicians->insert(json_decode('{"username" : "admin", "password" : "' . password_hash("letmein", PASSWORD_BCRYPT, $options) . '", "email" : "", "group_ids" : [], "site" : "local"}'));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "POST") {

    if (!isset($_SESSION["user"])) {

        session_unset();
        $data = file_get_contents('php://input'); //get POST payload
        $json = json_decode($data, true);
        $existError = ExistErrorsCheck($json, array(
            username,
            password
        ));
        if ($existError) {
            return;
        }

        if (isset($json[username])) {
            $username = $json[username];
        }
        else
        if (isset($json[w_id])) {
            $w_id = $json[w_id];
        }
        else {
            ReturnException(ERROR_missing_data, 400, "must have username or w_id");
            return;
        }

        $password = $json[password];
        $users = $connection->selectCollection(CLINICION_TABLE);
        if (isset($username)) {
            $user = $users->findOne(array(
                username => $username
            ));
        }

        if ($user == null) {
            ReturnException(ERROR_Invalid_Method, 400, "user not found");
            return;
        }
        else
        if (!password_verify($password, $user[password])) {
            ReturnException(ERROR_Wrong_Password, 400, "wrong password");
            return;
        }

        $_SESSION["user"] = $user;
    }
    
    $tokens = $connection->selectCollection(TOKEN_C_TABLE);
    $token_value = md5(uniqid(rand() , true));
    $token_array = array(
        username => $_SESSION["user"][username],
        token => $token_value
    );
    $return_value = $tokens->insert($token_array);
    if ($return_value['ok'] == 1) {
        unset($_SESSION["user"]["_id"]);
        unset($_SESSION["user"]["password"]);
        $siteInfo = null;
        if (isset($_SESSION["user"][site])) {
            $siteConfigTable = $connection->selectCollection(SITES_TABLE);
            $siteInfo = $siteConfigTable->findOne([site => $_SESSION["user"][site]]);
        }

        $result = array(
            'result' => SUCCEED,
            token => $token_value,
            "clinician" => $_SESSION["user"],
            config => $siteInfo != null ? $siteInfo[config] : null,
            "siteID" => $siteInfo != null ? $siteInfo[siteID] : null
        );
        $json = json_encode($result);
        echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;
        return;
    }
    else {
        ReturnException(ERROR_Internal_Error, 500);
    }
}
else {
    ReturnException(ERROR_Invalid_Method, 401);
}
