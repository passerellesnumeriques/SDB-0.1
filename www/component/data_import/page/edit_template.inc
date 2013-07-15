<?php 

function edit_template($template_id, $start_table, $sub_models, $data_to_import) {
	if (!isset($_GET["reset"])) {
		// first, make sure everything is clean in the session
		$_SESSION["data_import_edit_template_".$template_id] = array(
			"excel_ids"=>array(),
			"excel_names"=>array(),
			"excel_types"=>array(),
			"excel_sizes"=>array()
		);
		echo "Initializing..."; // TODO locale
		echo "<script type='text/javascript'>var url = new URL(location.href);url.params['reset']=1;location.href=url.toString();</script>";
		return;
	}
	
	// check if we receive new excel files
	$s = $_SESSION["data_import_edit_template_".$template_id];
	PNApplication::$instance->storage->set_expires($s["excel_ids"], time()+30*60);
	$prev = count($s["excel_ids"]);
	if (!PNApplication::$instance->storage->receive_upload($s["excel_ids"], $s["excel_names"], $s["excel_types"], $s["excel_sizes"], 30*60)) {
		if (count($s["excel_ids"]) > $prev) {
			$_SESSION["data_import_edit_template_".$template_id] = $s;
			return; // asynchronous upload received
		}
	}
	var_dump($s);
	
	require_once("common/PHPExcel.php");
	require_once("common/php/ExcelFileDisplay.inc");
	foreach ($s["excel_ids"] as $id) {
		$excel = PHPExcel_IOFactory::load(PNApplication::$instance->storage->get_data_path($id));
		display_excel_file($excel);
	}
	
	// TODO
	?>
	<div id='import_excel'></div>
	<script type='text/javascript'>
	add_javascript('/static/storage/upload.js',function() {
		new upload('import_excel',false,location.href,function(popup){
			popup.close();
			location.reload();
		},false);
	});
	</script>
	<?php
	
	$_SESSION["data_import_edit_template_".$template_id] = $s;
}
?>