<?php 
$id = $_GET["id"];

$res = DataBase::execute("SELECT * FROM `Storage` WHERE `id`='".DataBase::escape_string($id)."'");
if (!$res) return;
$res = DataBase::next_row($res);
if ($res == null) return;
if ($res["expire"] == null || $res["username"] <> PNApplication::$instance->user_management->username) return;
$dir1 = $id%100;
$dir2 = ($id/100)%100;
$dir3 = ($id/10000)%100;
$filename = intval($id/1000000);
$path = dirname($_SERVER["SCRIPT_FILENAME"])."/storage/".$dir1."/".$dir2."/".$dir3."/".$filename;
if (!file_exists($path)) return;
$data = file_get_contents($path);
if ($data === false) return;
echo $data;
return false;
?>