<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 27/01/2016
 * Time: 15:51
 */
include 'utilities.php';
include 'config.php';
if(!isset($_REQUEST["action"]))
{
    echo "UNKNOWN METHOD";
    return;
}
if($_REQUEST["action"]=="list"&&isset($_REQUEST["fieldName"])&&strlen($_REQUEST["fieldName"])>0)
{
    $fieldName=$_REQUEST["fieldName"];
    $value=null;
    if(isset($_REQUEST["value"]))
    {
        $value = new MongoRegex("/.*{$_REQUEST["value"]}.*/i");
    }
//    if(isset($_REQUEST["value"]))
//    {
//        $value=$_REQUEST["value"];
//        $fields[$value]='true';
//    }
    $valueList=[];
    $connection = db_connect(OPTIMISE_DB);
    $optimise = $connection->selectCollection(OPTIMISE_TABLE);
    if($value==null)
    {
        $cursor=$optimise->find([],[$fieldName=>'true']);
    }
    else{
        $cursor=$optimise->find([$fieldName=>$value],[$fieldName=>'true']);
    }
    foreach($cursor as $id=>$value)
    {
       if(isset($value[$fieldName])&&$value[$fieldName]!=null)
       {
           $valueList[]=$value[$fieldName];
       }
    }
    $valueList=array_values(array_unique($valueList));
    $returnResult = array($fieldName=>$valueList);
    $jsonReturn = json_encode($returnResult);
    echo isset($_GET['callback'])
        ? "{$_GET['callback']}($jsonReturn)"
        : $jsonReturn;

}
//else if($_REQUEST["action"]=="search"&&isset($_REQUEST["fieldName"])&&strlen($_REQUEST["fieldName"])>0)
//{
//    $fieldName=$_REQUEST["fieldName"];
//
//    $regexObj = new MongoRegex("/.*{$fieldName}.*/i");
////    if(isset($_REQUEST["value"]))
////    {
////        $value=$_REQUEST["value"];
////        $fields[$value]='true';
////    }
//    $valueList=[];
//    $connection = db_connect(OPTIMISE_DB);
//    $optimise = $connection->selectCollection(OPTIMISE_TABLE);
//    $cursor=$optimise->find([],[$fieldName=>'true']);
//    foreach($cursor as $id=>$value)
//    {
//        if(isset($value[$fieldName])&&$value[$fieldName]!=null)
//        {
//            $valueList[]=$value[$fieldName];
//        }
//    }
//    $valueList=array_values(array_unique($valueList));
//    $returnResult = array($fieldName=>$valueList);
//    $jsonReturn = json_encode($returnResult);
//    echo isset($_GET['callback'])
//        ? "{$_GET['callback']}($jsonReturn)"
//        : $jsonReturn;
//
//}
else{
    echo "UNKNOWN METHOD";
    return;
}