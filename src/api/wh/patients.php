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
    //create new patient

    $connection = db_connect();
    if ($connection == null) {
        ReturnException(Internal_Error, 500,"internal error connection is null");
        return;
    }
    if(!isset($_REQUEST[action]))
    {
        ReturnException(ERROR_Invalid_Method,401,"missing request parameter:".action);
        return;
    }
    $requestAction=$_REQUEST[action];
    if($requestAction=="new")
    {
        $groups = $connection->selectCollection(GROUPS_TABLE);
        //register group
        $data = file_get_contents('php://input'); //get POST payload
        $json = json_decode($data, true);
        $existError = ExistErrorsCheck($json, array(username));
        if ($existError) {
            return;
        }
        $username=$json[username];
        $primary_groupID=null;
        if(isset($json[primary_group_id]))
        {
            $primary_groupID = $json[primary_group_id];
        }
        $optimise_prefix="";
        if(isset($json[optimise_prefix]))
        {
            $optimise_prefix=$json[optimise_prefix];
        }

        $users=$connection->selectCollection(USER_TABLE);
        $count=$users->count(array(username=>$username)); //counting number of users
        if($count>0)
        {
            ReturnException(ERROR_UsernameExist,400,"user name already exist");
            return;
        }


        $secondaryMongoIDs=array();
        if(isset($json[secondary_group_ids]))
        {
            $secondary_groupIDs=$json[secondary_group_ids];

            if($secondary_groupIDs!=null&&count($secondary_groupIDs)>0) {
                foreach ($secondary_groupIDs as $sgID) {
                    $checkGroup=$groups->findOne(array(group_id => $sgID)); //check exist group name
                    if($checkGroup==null)
                    {
                        ReturnException(ERROR_Invalid_groupID, 400, "invalid secondary group ID:" . $sgID);
                        return;
                    }else{
                        $secondaryMongoIDs[]=$checkGroup["_id"];
                    }
                }
            }
        }
//        $demographicData=$json[demography_data];
        $w_id=null;
        try {
            if($primary_groupID!=null){
            $groups = $connection->selectCollection(GROUPS_TABLE);
            $existGroup=$groups->findOne(array(group_id => $primary_groupID)); //check exist group name
            if($existGroup==null)
            {
                ReturnException(ERROR_Invalid_groupID, 400, "invalid group ID:" . $primary_groupID);
                return;
            }
            }
            try {
                $w_id=getNextSequence(w_id);
                if($w_id==null)
                {
                    ReturnException(ERROR_Internal_Error,500,"w_id is null");
                    return;
                }else {
                    if(!isset($secondary_groupIDs)||count($secondary_groupIDs)==0)
                    {
                        $secondary_groupIDs=array();
                    }
                    $w_id=$optimise_prefix.$w_id;
                    if($primary_groupID!=null)
                    {
                        $users->insert(array(username => $username,password=>$username, w_id => (string) $w_id,primary_group_mongo_id=>$existGroup["_id"],primary_group_id=>$existGroup[group_id],secondary_group_mongo_ids=>$secondaryMongoIDs,secondary_group_ids=>$secondary_groupIDs,"created_date"=>new MongoDate())); //insert record
                    }else{
                        $users->insert(array(username => $username,password=>$username, w_id => (string) $w_id,"created_date"=>new MongoDate())); //insert record
                    }
                }
            }catch (Exception $e)
            {
                ReturnException(ERROR_Internal_Error,500);
                return;
            }
        } catch (Exception $e) {
            ReturnException(ERROR_Internal_Error, 500);
            return;
        }

        //adding new record with demographic data in Dilshan's mongodb

        if(isset($json[demography_data]))
        {
            $demographicData=$json[demography_data];
            $recordSet=$demographicData['RecordSet'];

            $recordItems=$recordSet[0]['RecordItems'];
            $existUSUBJID=false;
            $targetUSUBJID=null;
            for($i=0;$i<count($recordItems);$i++) {
                $RecordEntry=$recordItems[$i];
                if($RecordEntry['fieldName']=="USUBJID")
                {
                    $RecordEntry['value']=$w_id;
                    $recordItems[$i]=$RecordEntry;
                    $existUSUBJID=true;
                }
            }
            if($existUSUBJID==false)
            {
                $RecordEntryUser['fieldName']="USUBJID";
                $RecordEntryUser['value']=$w_id;
                $recordItems[]=$RecordEntryUser;
            }
            $recordSet[0]['RecordItems']=$recordItems;
            $demographicData['RecordSet']=$recordSet;
            $RecordSet=$recordSet;
            for ($i = 0; $i < count($RecordSet); $i++) {
                if (isset($RecordSet[$i]['RecordItems'])) {
                    $mongoItem = array();
                    for ($j = 0; $j < count($RecordSet[$i]['RecordItems']); $j++) {
                        $subItem = $RecordSet[$i]['RecordItems'][$j];
//                   var_dump($subItem);
                        if (isset($subItem) && isset($subItem['fieldName']) && isset(
                                $subItem['value'])
                        ) {
                            $fieldName = $RecordSet[$i]['RecordItems'][$j]['fieldName'];
                            $value = $RecordSet[$i]['RecordItems'][$j]['value'];
                            $mongoItem[$fieldName] = $value;
                        }
                    }
//                    var_dump($mongoItem);
                    if (count($mongoItem) > 0) {
                        $connectionOPT = db_connect(OPTIMISE_DB);
                        $optimise = $connectionOPT->selectCollection(OPTIMISE_TABLE);
                        $result = $optimise->insert($mongoItem);

                    }
                }
            }
        }

        $returnResult=array('result'=>SUCCEED,w_id=>$w_id,primary_group_id=>$primary_groupID,secondary_group_ids=>$secondary_groupIDs);
        echo json_encode($returnResult);


    }else if($requestAction=="update")
    {
        $groups = $connection->selectCollection(GROUPS_TABLE);
        //register group
        $data = file_get_contents('php://input'); //get POST payload
        $json = json_decode($data, true);
        $existError = ExistErrorsCheck($json, array(w_id));
        if ($existError) {
            return;
        }
        $w_id=$json[w_id];
        $users=$connection->selectCollection(USER_TABLE);
        $user=$users->findOne(array(w_id=>$w_id)); //check w_id exists
        if($user==null)
        {
            ReturnException(ERROR_Invalid_w_id,401,"w_id is invalid:".$w_id);
            return;
        }
        $secondaryMongoIDs=array();
        if(isset($json[secondary_group_ids]))
        {

            $secondary_groupIDs=$json[secondary_group_ids];
            if(!is_array($secondary_groupIDs))
            {
                ReturnException(ERROR_Invalid_Json, 400, secondary_group_ids." must be array");
                return;
            }
            if($secondary_groupIDs!=null&&count($secondary_groupIDs)>0) {
                foreach ($secondary_groupIDs as $sgID) {
                    $checkGroup=$groups->findOne(array(group_id => $sgID)); //check exist group name
                    if($checkGroup==null)
                    {
                        ReturnException(ERROR_Invalid_groupID, 400, "invalid secondary group ID:" . $sgID);
                        return;
                    }else{
                        $secondaryMongoIDs[]=$checkGroup["_id"];
                    }
                }
            }
        }

//    $groupManager = $json[group_manager];
        try {
            $users=$connection->selectCollection(USER_TABLE);
            try {
                $updateFields=array();
                    if(!isset($secondary_groupIDs)||count($secondary_groupIDs)==0)
                    {
                        $secondary_groupIDs=array();
                    }else{
                        $updateFields[secondary_group_mongo_ids]=$secondaryMongoIDs;
                        $updateFields[secondary_group_ids]=$secondary_groupIDs;
                    }

                if(isset($json[xnat_id]))
                {
                    $xnat_id=$json[xnat_id];
                    $updateFields[xnat_id]=$xnat_id;
                }

                $updateFields["updated_date"]=new MongoDate();
                $users->update(array(w_id => (string) $w_id),array('$set'=>$updateFields)); //insert record
                $user=null;//set back to null for nextline
                $user=$users->findOne(array(w_id=>(string) $w_id),array(w_id,primary_group_id,secondary_group_ids,xnat_id));
                if($user==null)
                {
                    ReturnException(ERROR_Internal_Error,500,"user is null");
                    return;
                }else{
                    //check null values
                    if(!isset($user[xnat_id]))
                    {
                        $user[xnat_id]="";
                    }
                    if(!isset($user[secondary_group_ids]))
                    {
                        $user[secondary_group_ids]=[];
                    }
                }
                $returnResult=array('result'=>SUCCEED,w_id=>$w_id,primary_group_id=>$user[primary_group_id],secondary_group_ids=>$user[secondary_group_ids],xnat_id=>$user[xnat_id]);
                echo json_encode($returnResult);
            }catch (Exception $e)
            {
                ReturnException(ERROR_Internal_Error,500);
                return;
            }
        } catch (Exception $e) {
            ReturnException(ERROR_Internal_Error, 500);
            return;
        }
    }else{
        ReturnException(ERROR_Invalid_Method,401,"invalid request parameter of ".action.",".$requestAction);
        return;
    }


} else if ($method == "GET") {
    //check clinician token

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
        $tokens=$connection->selectCollection(TOKEN_C_TABLE);
        $db_token=$tokens->findOne(array(token => $token));
        if($db_token==null)
        {
            ReturnException(ERROR_Permission_denied,401,"invalid access token:".$token);
            return;
        }
        $username=$db_token[username];
        $clinicians=$connection->selectCollection(CLINICION_TABLE);
        $clinician=$clinicians->findOne(array(username=>$username));
        if($clinician==null)
        {
            ReturnException(Internal_Error,500,"clinician not found");
            return;
        }
        $group_ids=$clinician[group_ids];
        $users=$connection->selectCollection(USER_TABLE);
        $allResults=[];
        //pass security return data
        $searchQuery=null;
        $SecondPartQueryList=array();

        if(isset($_REQUEST["query"])&&strlen($_REQUEST["query"])>0)
        {
            $searchQuery=new MongoRegex("/".$_REQUEST["query"]."/i");
//        $cursor = $users->find(array(w_id=>$searchQuery));
            $SecondPartQueryList[w_id]=$searchQuery;
        }
        $primaryGroupIDArray=array();
        $secondaryGroupIDArray=array();
        foreach($group_ids as $gid)
        {
            $primaryGroupIDArray[]=$gid;
            $secondaryGroupIDArray[]=$gid;
        }

      /*  if(isset($_REQUEST["primary_group_id"])&&strlen($_REQUEST["primary_group_id"])>0)
        {
            $primary_groupID=$_REQUEST["primary_group_id"];
            $groups = $connection->selectCollection(GROUPS_TABLE);
            $existGroup=$groups->findOne(array(group_id => $primary_groupID)); //check exist group name
            if($existGroup==null)
            {
                ReturnException(ERROR_Invalid_groupID, 400, "invalid group ID:" . $primary_groupID);
                return;
            }
        }*/
        $SecondPartQueryList[primary_group_mongo_id]=array('$exists' => true);

        $queryString=array('$and'=>array($SecondPartQueryList,array('$or'=>array(array(primary_group_id=>array('$in'=>$primaryGroupIDArray)),array(secondary_group_ids=>array('$in'=>$secondaryGroupIDArray))))));

        $cursor = $users->find($queryString,array(w_id,primary_group_id,secondary_group_ids,xnat_id));

        foreach ( $cursor as $id => $value )
        {
//            echo "$id: ";
//            var_dump( $value );
            unset($value["password"]);
            unset($value['_id']);
            $allResults[]=$value;
        }
        $returnResult=array('result'=>SUCCEED,"patients"=>$allResults,"queryList"=>$queryString);
        echo json_encode($returnResult);
    }else{
        ReturnException(ERROR_Permission_denied,401,"missing or invalid access token");
        return;
    }


}
else if($method == "DELETE") {
//    $data = file_get_contents('php://input'); //get POST payload
//    $json = json_decode($data, true);
    if(!isset($_REQUEST[w_id]))
    {
        ReturnException(ERROR_Invalid_Method, 401, "invalid method");
        return;
    }
    $w_id=$_REQUEST[w_id];
    $connection = db_connect();
    $users=$connection->selectCollection(USER_TABLE);
    $removeResult=$users->remove(array(w_id=>$w_id)); //check w_id exists
    $connectionOPT = db_connect(OPTIMISE_DB);
    $optimise = $connectionOPT->selectCollection(OPTIMISE_TABLE);
    $optimise->remove(array("USUBJID"=>$w_id));
    $returnResult=array('result'=>SUCCEED);
    echo json_encode($returnResult);
}else {
    ReturnException(ERROR_Invalid_Method, 401, "invalid method");
    return;
}