<?php
/* @var $component selection */
if ($component->campaign_id == null) die(get_locale("Please select a selection campaign"));

require_once("common/SQLQuery.inc");
$zones = $component->get_zones();

$this->add_javascript('/static/common/js/common_dialogs.js');

?>
<table style='border:1px solid black' rules='all'>
<tr>
	<th><?php locale("Zone")?></th>
	<th><?php locale("Information sessions")?></th>
	<th><?php locale("Applicants")?></th>
	<th><?php locale("Written exams")?></th>
	<th><?php locale("Interviews")?></th>
</tr>
<?php 
foreach ($zones as $z) {
	echo "<tr>";
	echo "<td>".$z["name"]."</td>";
	echo "</tr>";
}
?>
<tr>
	<td colspan=30 align=center>
		<div class='button' onclick="create_zone();"><img src='/static/common/images/add.png'/> <?php locale("Create a new zone")?></div>
	</td>
</table>
<script type='text/javascript'>
function create_zone() {
	input_dialog('/static/common/images/add.png',"<?php locale("Create a new zone")?>","<?php locale("common","Name")?>","",100,function(value){
		if (value.length == 0) return "<?php locale("common", "Cannot be empty")?>";
		return null;
	},function(value){
		if (value == null) return;
		ajax.post_parse_result("/dynamic/selection/service/zone/create",{name:value},function(result){
			if (result) get_selection_widget("zones").refresh();
		});
	});
}
</script>