<?php 
if ($this->campaign_id == null) {
	PNApplication::error(get_locale("Please select a selection campaign"));
	return;
}
require_once("common/SQLQuery.inc");
$r = SQLQuery::create()->select("SelectionZone")->where("campaign",$this->campaign_id)->where("name",$_POST["name"])->execute_single_row();
if ($r <> null) {
	PNApplication::error(get_locale("common","__ already exists",array("name"=>$_POST["name"])));
	return;
}
$id = SQLQuery::create()->insert("SelectionZone", array("campaign"=>$this->campaign_id,"name"=>$_POST["name"]));
echo $id <> null ? "true" : "false";
?>