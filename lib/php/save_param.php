<?php
// stop echoing error message to js, only use the "$saved" boolen value to indicate data saving status 
error_reporting(0);

$id = json_decode($_POST['id']);
$turker = json_decode($_POST['turker']);
$param = json_decode($_POST['parameters']);

//SAVE PARAM
$param_PATH = "../../data/param/" . "param_" . $id . ".json";
$param_saving_status = file_put_contents($param_PATH, json_encode($param));
if ($param_saving_status === false) {
    $param_saved = false;
} else {
    $param_saved = true;
}

//SAVE ID-TURKER PAIR
$turker2id_PATH = '../../docs/turker2id.txt';    
if (!file_exists($turker2id_PATH)) {
    $turker2id_FILE = fopen($turker2id_PATH, "w+");
    fclose($turker2id_FILE);
    $turker2id_NEWDATA[$turker] = $id;
    $turker2id_NEWTEXT = json_encode($turker2id_NEWDATA);
} else{
    $turker2id_TEXT = file_get_contents($turker2id_PATH);
    $turker2id_DATA = json_decode($turker2id_TEXT,true);
    $turker2id_DATA[$turker] = $id;
    $turker2id_NEWTEXT = json_encode($turker2id_DATA);
}
$turker2id_saving_status = file_put_contents($turker2id_PATH,$turker2id_NEWTEXT);
if ($turker2id_saving_status === false) {
    $turker2id_saved = false;
} else {
    $turker2id_saved = true;
}
$saved = $param_saved === true & $turker2id_saved === true;
echo json_encode($saved)
?>