<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 22/10/2015
 * Time: 15:01
 */

include_once("../config.php");
header('Access-Control-Allow-Origin: *');
$setting = 1; //1 enable Auth , 0 disable auth


$method = $_SERVER['REQUEST_METHOD'];
if ($method == "POST") {
    $connection = db_connect();
    if ($connection == null) {
        ReturnException(Internal_Error, 500);
        return;
    }
    $groups = $connection->selectCollection(GROUPS_TABLE);
    //register group
    $data = file_get_contents('php://input'); //get POST payload
    $json = json_decode($data, true);
    $existError = ExistErrorsCheck($json, array(group_name));
    if ($existError) {
        return;
    }
    $groupName = $json[group_name];

//    $groupManager = $json[group_manager];
    try {
        $existGroup=$groups->findOne(array(group_name => $groupName)); //check exist group name
        if($existGroup!=null)
        {
            ReturnException(ERROR_GroupNameExist, 401, "group name already exist:" . $groupName);
            return;
        }
        $groupID = md5(uniqid(rand(), true));
        $groups->insert(array(group_name => $groupName, group_id => $groupID, "created_date" => new MongoDate())); //insert record
        ReturnSucceedResult();
    } catch (Exception $e) {
        ReturnException(ERROR_Internal_Error, 500);
        return;
    }

} else if ($method == "GET") {
    //check clinician token

    $connection = db_connect();
    if ($connection == null) {
        ReturnException(Internal_Error, 500);
        return;
    }
    $groups = $connection->selectCollection(GROUPS_TABLE);
    $allResults = [];
    //pass security return data
    $searchQuery = null;
    if (isset($_REQUEST["query"]) && strlen($_REQUEST["query"]) > 0) {
        $searchQuery = new MongoRegex("/" . $_REQUEST["query"] . "/i");
        $cursor = $groups->find(array(group_name => $searchQuery));
    } else {
        $cursor = $groups->find();
    }

    foreach ($cursor as $id => $value) {
//            echo "$id: ";
//            var_dump( $value );
        unset($value['_id']);
        $allResults[] = $value;
    }
    $returnResult = array('result' => SUCCEED, "groups" => $allResults);
    echo json_encode($returnResult);
} else {
    ReturnException(ERROR_Permission_denied, 401, "missing or invalid access token");
    return;
}