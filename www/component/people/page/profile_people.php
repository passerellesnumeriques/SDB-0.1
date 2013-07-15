<?php
$people = $_GET["people"];
if ($people <> PNApplication::$instance->user_people->user_people_id) {
	if (!PNApplication::$instance->user_management->has_right("see_other_people_details")) {
		PNApplication::error(get_locale("common","Access Denied"));
		return;
	}
}
$can_edit = PNApplication::$instance->user_management->has_right("edit_people_details");
require_once("common/SQLQuery.inc");
$people = SQLQuery::create()->select("People")->where("id",$people)->execute_single_row();

$this->add_javascript("/static/storage/upload.js");
$this->add_javascript("/static/storage/picture.js");
?>
<table>
<tr>
<td>
	<div id='picture'></div>
	<div id='upload_picture'></div>
</td>
<td>
	<?php
	require_once("component/data_model/page/entity.inc");
	data_entity_page("People",$people,$this);
	?>
</td>
</tr>
</table>
<script type='text/javascript'>
picture('picture','/dynamic/people/service/picture?people=<?php echo $people["id"];?>&version=<?php echo $people["picture_version"]?>',150,200,"<?php echo htmlspecialchars($people["first_name"]." ".$people["last_name"],ENT_QUOTES,"UTF-8");?>");
new upload('upload_picture',false,'/dynamic/people/page/set_picture?people=<?php echo $people["id"]?>',
	function(popup){
		popup.setContentFrame('/dynamic/people/page/set_picture?people=<?php echo $people["id"]?>');
	},
	true
).addHiddenDropArea('picture');	
</script>