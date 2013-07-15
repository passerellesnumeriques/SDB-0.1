<?php 
require_once("component/data_import/page/import_wizard.inc");
if (isset($_GET["reset"])) {
	import_wizard_reset();
	unset($_SESSION["people_import"]);
	return;
}
$ids = array();
$names = array();
$types = array();
$sizes = array();
if (!PNApplication::$instance->storage->receive_upload($ids, $names, $types, $sizes, 30*60)) {
	// asynchronous upload
	if (count($ids) > 0)
		$_SESSION["people_import"] = $ids[0];
	return;
}

if (!isset($_SESSION["people_import"])) {
	PNApplication::error("No file imported");
	return;
}
$storage_id = $_SESSION["people_import"];
import_wizard($this,$storage_id,"People",null);
?>