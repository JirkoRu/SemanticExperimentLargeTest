<?php
// stop echoing error message to js, only use the "$saved" boolen value to indicate data saving status 
error_reporting(0);

$id = json_decode($_POST['id']);
$saved_path = "../../data/param/param_" .$id . ".json";

$param_str = file_get_contents($saved_path);
if ($param_str === false){
    $param = json_encode($param_str);
} else {
    $param = $param_str;
}
echo $param

?>