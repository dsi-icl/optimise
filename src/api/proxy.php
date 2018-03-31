<?php
include 'utilities.php';
include 'config.php';
//headers function
$server=$_SERVER;
//var_dump($server);
//return;
$setting=2;
$checkResult = permission_check($server,$destinationURL); //raw response
if($checkResult!=null&&$setting==1)
{
    header('Access-Control-Allow-Origin: *');

    if(function_exists('http_response_code'))
    {
        http_response_code($checkResult['http_code']);
    }else{
        header('HTTP/1.1 401 Unauthorized', true, 401);
    }
    echo $checkResult["content"];
    return;
}


$response = proxy_request($server,$destinationURL); //raw response

/*$file = 'log.txt';
file_put_contents($file, $log, FILE_APPEND | LOCK_EX);*/

$headerArray = explode("\r\n", $response['header']);
foreach($headerArray as $headerLine) {
    header($headerLine); //handle header
}
$finalReturn=$response['content'];
header('Access-Control-Allow-Origin: *');
echo isset($_GET['callback'])
    ? "{$_GET['callback']}($finalReturn)"
    : $finalReturn;
