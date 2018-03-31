<?php

if(!function_exists('apache_request_headers')) {
// Function is from: http://www.electrictoolbox.com/php-get-headers-sent-from-browser/
    function apache_request_headers() {
        $headers = array();
        foreach($_SERVER as $key => $value) {
            if(substr($key, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

function PostRecord($url,$array_data)
{

    $data=json_encode($array_data);
    $method = "POST";
    $url = parse_url($url);
    $host = $url['host'];
    $path = $url['path'];
    $out = "";
    $url = $host;
    $fp = fsockopen($url, 80,$errno, $errstr, 30);
    if($fp) {

        $out = "POST $path HTTP/1.1\r\n";

        $out .= "Host:$host\r\n";
        $out .= "Content-Type: application/json\r\n";
        $out .= "Content-Length: " . strlen($data) . "\r\n";
        $out .= "Connection: Close\r\n\r\n";
        $out .= $data;
        fwrite($fp, $out);
//        header('Content-type: application/json');

        $result = '';
        while (!feof($fp)) {
            // receive the results of the request
            $result .= fgets($fp, 128);
        }
    }else{
        return array(
            'status' => 'err',
            'error' => "$errstr ($errno)"
        );
    }
    fclose($fp);
    $result = explode("\r\n\r\n", $result, 2);

    $header = isset($result[0]) ? $result[0] : '';
    $content = isset($result[1]) ? $result[1] : '';

    // return as structured array:
    return array(
        'status' => 'ok',
        'header' => $header,
        'content' => $content
    );
}

function permission_check($SERVER, $url)
{
    $method = $SERVER['REQUEST_METHOD'];
    $token=null;
    $headers = apache_request_headers();
    foreach ($headers as $header => $value) {
        if($header=="token")
        {
            $token=$value;
        }
    }
/*    if($token==null)
    {
        $errorCode="aaa";
        $error=array('result'=>'error',"errorCode"=>$errorCode,"method"=>$method);
        return array(
            'http_code' => '401',
            'content' => json_encode($error)
        );
    }*/
    if (!empty($SERVER['HTTP_CLIENT_IP'])) {
        $ip = $SERVER['HTTP_CLIENT_IP'];
        //echo "HTTP_CLIENT_IP: ".$ip;
    } elseif (!empty($SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $SERVER['HTTP_X_FORWARDED_FOR'];
        //echo "HTTP_X_FORWARDED_FOR: ".$ip;
    } else {
        $ip = $SERVER['REMOTE_ADDR'];
        //echo "REMOTE_ADDR: ".$ip;
    }

    if($method=="POST")
    {
        $data=file_get_contents('php://input'); //get POST payload

    }else if($method=="GET")
    {
        $data=$_GET; //get GET parameters

    }else if($method=="DELETE")
    {
        $data=file_get_contents('php://input'); //get DELETE payload
    }
    $url = parse_url($url);
    return null;

}
function proxy_request($SERVER, $url)
{
    $ip = ''; //declare IP
//below update IP address
    if (!empty($SERVER['HTTP_CLIENT_IP'])) {
        $ip = $SERVER['HTTP_CLIENT_IP'];
        //echo "HTTP_CLIENT_IP: ".$ip;
    } elseif (!empty($SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $SERVER['HTTP_X_FORWARDED_FOR'];
        //echo "HTTP_X_FORWARDED_FOR: ".$ip;
    } else {
        $ip = $SERVER['REMOTE_ADDR'];
        //echo "REMOTE_ADDR: ".$ip;
    }
    $method = $SERVER['REQUEST_METHOD'];
    if($method=="POST")
    {
        $data=file_get_contents('php://input'); //get POST payload

    }else if($method=="GET")
    {
        $data=$_GET; //get GET parameters
    }else if($method=="DELETE")
    {
        $data=file_get_contents('php://input'); //get DELETE payload
    }
    $url = parse_url($url);
    $host = $url['host'];
    $path = $url['path'];
    $out = "";
    $url = $host;
    $fp = fsockopen($url, 80,$errno, $errstr, 30);
    if($fp) {
        if ($method == "GET") {
            $data = http_build_query($data);
            $out = "GET $path?$data HTTP/1.1\r\n";
        } else if ($method == "POST") {
            $path=$path.'?'.$SERVER['QUERY_STRING'];
            $out = "POST $path HTTP/1.1\r\n";
        } else if ($method == "DELETE") {
            $path=$path.'?'.$SERVER['QUERY_STRING'];
            $out = "DELETE $path HTTP/1.1\r\n";
        }

//$out.= "Host: ".$parts['host']."\r\n";
        $out .= "Host:$host\r\n";
        $out .= "Content-Type: application/json\r\n";
        $out .= "Content-Length: " . strlen($data) . "\r\n";
        $out .= "Connection: Close\r\n\r\n";
        $out .= $data;
        fwrite($fp, $out);
//        header('Content-type: application/json');

        $result = '';
        while (!feof($fp)) {
            // receive the results of the request
            $result .= fgets($fp, 128);
        }
    }else{
        return array(
            'status' => 'err',
            'error' => "$errstr ($errno)"
        );
    }
    fclose($fp);
    $result = explode("\r\n\r\n", $result, 2);

    $header = isset($result[0]) ? $result[0] : '';
    $content = isset($result[1]) ? $result[1] : '';

    // return as structured array:
    return array(
        'status' => 'ok',
        'header' => $header,
        'content' => $content
    );
}
?>
