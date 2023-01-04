<?php
// stop echoing error message to js, only use the "$saved" boolen value to indicate data saving status 
error_reporting(0);

$turker2id_file = '../../docs/turker2id.txt';
$turker = json_decode($_POST['turker']);

// get the file contents, assuming the file to be readable (and exist)
$turker2id_TEXT = file_get_contents($turker2id_file);

if ($turker2id_TEXT === false){
    $subid = false;
} else {
    $turker2id_DATA = json_decode($turker2id_TEXT,true);
    $subid =  json_encode($turker2id_DATA[$turker]);
}
echo $subid
?>