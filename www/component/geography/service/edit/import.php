<?php 
$level = $_POST["level"];
$parent = $_POST["parent"];
$country = $_POST["country"];
if ($parent == 0) $parent = null;

$latitude = 0;
$longitude = 0;
$names = array();

$geonames_level = null;
$geonames_id = null;
$gadm_level = null;
$gadm_id = null;

if (isset($_POST["geonames_level"])) {
	$geonames_level = $_POST["geonames_level"];
	$geonames_id = $_POST["geonames_id"];
	$table = ($geonames_level == 5 ? "ppl" : "adm".$geonames_level)."_temp";
	$res = DataBase::execute("SELECT * FROM `geonames`.`".$table."` WHERE `id`=".$geonames_id);
	if (!$res) {
		PNApplication::error("Invalid geonames element");
		return;
	}
	$r = DataBase::next_row($res);
	if ($r == null) {
		PNApplication::error("Invalid geonames element");
		return;
	}
	$latitude = $r["latitude"];
	$longitude = $r["longitude"];
	$res = DataBase::execute("SELECT * FROM `geonames`.`".$table."_names` WHERE `id`=".$geonames_id);
	if ($res)
		while (($r = DataBase::next_row($res)))
			$names[$r["lang"]] = $r["name"];
}
if (isset($_POST["gadm_level"])) {
	$gadm_level = $_POST["gadm_level"];
	$gadm_id = $_POST["gadm_id"];
	if (count($names) == 0) {
		$res = DataBase::execute("SELECT * FROM `gadm`.`adm".$gadm_level."` WHERE `id`=".$gadm_id);
		if (!$res) {
			PNApplication::error("Invalid gadm element");
			return;
		}
		$r = DataBase::next_row($res);
		if ($r == null) {
			PNApplication::error("Invalid gadm element");
			return;
		}
		$names["__"] = $r["name"];
	}
}

DataBase::execute("INSERT INTO `geography`.`adm` (`parent_id`,`country`,`latitude`,`longitude`) VALUE (".($parent <> null ? $parent : "NULL").",'".$country."',".$latitude.",".$longitude.")");
$id = DataBase::get_insert_id();
$names_id = array();
foreach ($names as $lang=>$name) {
	$res = DataBase::execute("SELECT `id` FROM `geography`.`name` WHERE `name`='".DataBase::escape_string($name)."'");
	$name_id = 0;
	if ($res && ($r = DataBase::next_row($res)) <> null)
		$name_id = $r["id"];
	if ($name_id == 0) {
		DataBase::execute("INSERT INTO `geography`.`name` (`name`) VALUE ('".DataBase::escape_string($name)."'");
		$name_id = DataBase::get_insert_id();
	}
	DataBase::execute("INSERT INTO `geography`.`adm_name` (`id`,`lang`,`name`) VALUE (".$id.",'".$lang."',".$name_id.")");
}

DataBase::execute("INSERT INTO `geography_match`.`adm` (`id`,`geonames_level`,`geonames_id`,`gadm_level`,`gadm_id`) VALUE (".$id.",".($geonames_level <> null ? $geonames_level.",".$geonames_id : "NULL,NULL").",".($gadm_level <> null ? $gadm_level.",".$gadm_id : "NULL,NULL").")");

$name = $names["__"];
echo "{id:".$id.",name:".json_encode(utf8_encode($name))."}";
?>