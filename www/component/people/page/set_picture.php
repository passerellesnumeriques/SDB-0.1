<?php 
global $people_id;
$people_id = $_GET["people"];
if ($people_id <> PNApplication::$instance->user_people->user_people_id) {
	if (!PNApplication::$instance->user_management->has_right("see_other_people_details")) {
		PNApplication::error("Access Denied");
		return;
	}
}

function finalize_picture_import($ids) {
	global $people_id;
	$storage_id = $ids[0];
	require_once("common/SQLQuery.inc");
	$people = SQLQuery::create()->select("People")->where("id",$people_id)->execute_single_row();
	if (isset($people["picture"]) && $people["picture"] <> null && $people["picture"] <> 0)
		PNApplication::$instance->storage->remove_data($people["picture"]);
	$version = isset($people["picture_version"]) && $people["picture_version"] <> null ? intval($people["picture_version"])+1 : 1;
	SQLQuery::create()->update("People", array("picture"=>$storage_id,"picture_version"=>$version), array("id"=>$people_id));
	if (!PNApplication::has_errors()) {
		PNApplication::$instance->storage->set_expire($storage_id, null);
		?>
		<img src='/static/common/images/saving.gif'/>
		<script type='text/javascript'>
		window.parent.location.reload();
		</script>
		<?php 
	}
}

require_once("component/data_import/page/pictures.inc");
pictures_import("people_set_picture_".$people_id,600,600,100,100,'finalize_picture_import');

/*
$ids = array();
if (!PNApplication::$instance->storage->receive_upload($ids, 5*60)) {
	// this is an asynchronous send
	if (count($ids) > 0)
		$_SESSION["people_set_picture"] = array("people"=>$people_id,"storage"=>$ids[0]);
	return;
}
if (count($ids) == 0) {
	if (!isset($_SESSION["people_set_picture"])) return;
	if ($_SESSION["people_set_picture"]["people"] <> $people_id) return;
	array_push($ids, $_SESSION["people_set_picture"]["storage"]);
}
$storage_id = $ids[0];
unset($_SESSION["people_set_picture"]);
$data = PNApplication::$instance->storage->get_data($storage_id, time()+30*60);
$img = imagecreatefromstring($data);
if ($img === false) {
	PNApplication::$instance->storage->remove_data($storage_id);
	PNApplication::error("Invalid image format"); // TODO locale
	return;
}
// TODO edit picture
// store the picture
require_once("common/SQLQuery.inc");
$people = SQLQuery::create()->select("People")->where("id",$people_id)->execute_single_row();
if (isset($people["picture"]) && $people["picture"] <> null && $people["picture"] <> 0)
	PNApplication::$instance->storage->remove_data($people["picture"]);
$version = isset($people["picture_version"]) && $people["picture_version"] <> null ? intval($people["picture_version"])+1 : 1;
SQLQuery::create()->update("People", array("picture"=>$storage_id,"picture_version"=>$version), array("id"=>$people_id));
if (!PNApplication::has_errors()) {
	PNApplication::$instance->storage->set_expire($storage_id, null);
?>
<img src='/static/common/images/saving.gif'/>
<script type='text/javascript'>
window.parent.location.reload();
</script>
<?php
} */
?>