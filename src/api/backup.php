<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 14/12/2015
 * Time: 17:41
 */

$folderName="backups/".date('M-Y');
mkdir($folderName, 0777, true);
$data = file_get_contents("http://www.optimise-ms.org/api/OPTIMISE?a=b");
$fp = fopen($folderName.'/'.date('d'), 'w');
fwrite($fp, $data);
fclose($fp);