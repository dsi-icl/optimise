<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 24/02/2016
 * Time: 21:02
 */

include_once("../config.php");
header('Access-Control-Allow-Origin: *');

$connection=db_connect();
if($connection==null)
{
    ReturnException(ERROR_Internal_Error,500);
    return;
}

$method = $_SERVER['REQUEST_METHOD'];
if($method=="POST") {
    $data = file_get_contents('php://input'); //get POST payload
    $json = json_decode($data, true);
    $existError = ExistErrorsCheck($json, array(site,config));
    if ($existError) {
        return;
    }
    $siteTable=$connection->selectCollection(SITES_TABLE);
    if($siteTable->findOne([site=>$json[site]])!=null)
    {
        ReturnException(ERROR_Permission_denied,400,"site exist");
        return;
    }else{
        $siteTable->insert($json);
        echo "successful";
    }

}