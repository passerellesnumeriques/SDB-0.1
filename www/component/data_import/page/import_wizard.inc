<?php 
function import_wizard_reset() {
	unset($_SESSION["data_import_wizard"]);
}

function import_wizard(&$page,$storage_id, $start_table, $sub_models) {
	if (!isset($_SESSION["data_import_wizard"]))
		$_SESSION["data_import_wizard"] = array();
	
	if (isset($_POST["data_import_type"])) {
		$_SESSION["data_import_wizard"]["import_type"] = $_POST["data_import_type"];
	} else if (isset($_POST["field_import_1_field"])) {
		$list = array();
		for ($i = 1; isset($_POST["field_import_".$i."_field"]); $i++) {
			$field = $_POST["field_import_".$i."_field"];
			$sheet = $_POST["field_import_".$i."_sheet"];
			$row1 = $_POST["field_import_".$i."_row1"];
			$col1 = $_POST["field_import_".$i."_col1"];
			$row2 = $_POST["field_import_".$i."_row2"];
			$col2 = $_POST["field_import_".$i."_col2"];
			if ($sheet <> -1 && $row1 <> -1 && $row2 <> -1 && $col1 <> -1 && $col2 <> -1) {
				array_push($list, array($field, $sheet, $row1, $col1, $row2, $col2));
			}
		}
		$_SESSION["data_import_wizard"]["fields"] = $list;
	}
	$step = "select_type";
	if (isset($_GET["step_data_import"]))
		$step = $_GET["step_data_import"];

	$content = "";
	$script = "";
	
	$page->add_javascript('/static/common/js/vertical_layout/vertical_layout.js');
	
	if ($step == "validate_import") {
		PNApplication::$instance->storage->set_expire($storage_id, time()+30*60);
		require_once("common/PHPExcel.php");
		$excel = PHPExcel_IOFactory::load(PNApplication::$instance->storage->get_data_path($storage_id));

		$content .= "<div style='overflow:auto;width:100%;height:100%'>";
		$content .= "<form name='validate_import' method='POST'>";
		// TODO
		$content .= "</form>";
		$content .= "</div>";
	}
	
	if ($step == "select_type" || $step == "select_fields") {
		$page->add_javascript('/static/data_import/excel.js');
		$page->add_javascript('/static/common/js/splitter_vertical/splitter_vertical.js');
		
		$content .= "<div id='excel_container'><img src='/static/common/images/loading.gif'/></div>";
		$content .= "<div id='wizard_container' style='overflow:auto'>";
		
		$script .= "var excel_file = new excel('excel_container');";
		$script .= "excel_file.onload = function() { var e = document.getElementById('excel_file'); e.style.width='100%'; e.style.height='100%'; triggerEvent(window, 'resize'); highlight_selection(); };";
		$script .= "excel_file.load(".$storage_id.",30*60);";
		$script .= "new splitter_vertical('import_content',0.5);";

		if ($step == "select_type") {
			$page->add_javascript('/static/common/js/form.js');
			$content .= "<form method='POST' name='select_type'>";
			$content .= "<input type='radio' name='data_import_type' value='multiple_entries'".(isset($_SESSION["data_import_wizard"]["import_type"]) && $_SESSION["data_import_wizard"]["import_type"] == "multiple_entries" ? " checked='checked'" : "")."/> ".get_locale_html("data_import","The file contains multiple entries to import")."<br/>";
			$content .= "<input type='radio' name='data_import_type' value='single_entry'".(isset($_SESSION["data_import_wizard"]["import_type"]) && $_SESSION["data_import_wizard"]["import_type"] == "single_entry" ? " checked='checked'" : "")."/> ".get_locale_html("data_import","The file contains only one entry to import")."<br/>";
			$content .= "</form>";
		} else if ($step == "select_fields") {
			$page->add_javascript('/static/common/js/collapsable_section/collapsable_section.js');
			$page->add_stylesheet('/static/common/js/collapsable_section/collapsable_section.css');

			$content .= "<form method='POST' name='select_fields'>";
			require_once("component/data_model/DataModel.inc");
			$table = DataModel::get()->getTable($start_table);
			require_once("component/data_model/DataPath.inc");
			$paths = DataPathBuilder::find_all_possible_paths_from($table);
			$tables = array();
			$data = array();
			foreach ($paths as $path) {
				if (in_array($path->table, $tables)) continue;
				$t = DataModel::get()->getTable($path->table);
				foreach ($t->getDisplayableDataResolved() as $field=>$name) {
					if (!isset($data[$name[0]]))
						$data[$name[0]] = array();
					$data[$name[0]][$name[1]] = array($t->getName(), $field);
				}
			}
			$cat_index = 1;
			$field_index = 1;
			foreach ($data as $cat=>$cat_content) {
				$content .= "<div id='field_category_".$cat_index."' style='border:1px solid black;'>";
				$content .= "<div class='collapsable_section_header'>".$cat."</div>";
				$content .= "<div class='collapsable_section_content'>";
				$content .= "<table style='padding-left:5px;padding-right:5px;'>";
				foreach ($cat_content as $name=>$field) {
					$content .= "<tr>";
					$content .= "<td>".$name."</td>";
					$content .= "<td>";
					$f = $field[0].".".$field[1];
					$f_where = null;
					if (isset($_SESSION["data_import_wizard"]["fields"])) {
						foreach ($_SESSION["data_import_wizard"]["fields"] as $fi)
							if ($fi[0] == $f) {
								$f_where = $fi;
								break;
							}
					}
					$content .= "<a href='#' onclick='select_range(this);return false' field_index='".$field_index."'>";
					if ($f_where <> null)
						$content .= (($f_where[4]-$f_where[2]+1)*($f_where[5]-$f_where[3]+1))." value(s) selected on sheet ".$f_where[1];
					else
						$content .= "Select range";
					$content .= "</a>";
					$content .= "<input type='hidden' name='field_import_".$field_index."_field' value=\"".htmlspecialchars($f,ENT_QUOTES,"UTF-8")."\"/>";
					$content .= "<input type='hidden' name='field_import_".$field_index."_sheet' value='".($f_where <> null ? htmlspecialchars($f_where[1],ENT_QUOTES,"UTF-8") : "-1")."'/>";
					$content .= "<input type='hidden' name='field_import_".$field_index."_row1' value='".($f_where <> null ? $f_where[2] : "-1")."'/>";
					$content .= "<input type='hidden' name='field_import_".$field_index."_col1' value='".($f_where <> null ? $f_where[3] : "-1")."'/>";
					$content .= "<input type='hidden' name='field_import_".$field_index."_row2' value='".($f_where <> null ? $f_where[4] : "-1")."'/>";
					$content .= "<input type='hidden' name='field_import_".$field_index."_col2' value='".($f_where <> null ? $f_where[5] : "-1")."'/>";
					$content .= "</td>";
					$content .= "</tr>";
					$field_index++;
				}
				$content .= "</table>";
				$content .= "</div></div>";
				$script .= "new collapsable_section('field_category_".$cat_index."');";
				$cat_index++;
			}
			$content .= "</form>";
		}
		$content .= "</div>";
	}
	?>
	<div id='data_import_wizard' style='width:100%;height:100%;overflow:hidden'>
		<div layout='fixed' style='font-size:12pt;font-weight: bold; background-color:#D0D0D0;color:#0000A0;padding:3px;vertical-align:middle;border-bottom:1px solid #0000A0;'>
			<img src='/static/common/images/import_32.png' style='vertical-align:middle'/>
			<?php locale("common", "Import"); ?>
		</div>
		<div id='import_content' layout='fill'>
			<?php echo $content; ?>
		</div>
		<div layout='fixed' style='background-color:#D0D0D0;padding:3px;border-top:1px solid #0000A0;'>
			<div style='float:right;padding-right:10px'>
				<?php 
				$prev = null;
				if ($step == "select_fields")
					$prev = "var u = new window.URL(location.href);u.params['step_data_import']='select_type';document.forms['select_fields'].action=u.toString();document.forms['select_fields'].submit();";
				else if ($step == "validate_import")
					$prev = "var u = new window.URL(location.href);u.params['step_data_import']='select_fields';document.forms['validate_import'].action=u.toString();document.forms['validate_import'].submit();";
				if ($prev <> null) {?>
				<div class='button' onclick="<?php echo $prev;?>"><img src='/static/common/images/left.png'/> <?php locale("common","Previous")?></div>
				<?php }?>
				<?php
				$next = null;
				if ($step == "select_type")
					$next = "if (get_radio_value(document.forms['select_type'],'data_import_type') == null) {alert('".get_locale_xml("data_import","Please select an option")."');return;} var u = new window.URL(location.href);u.params['step_data_import']='select_fields';document.forms['select_type'].action=u.toString();document.forms['select_type'].submit();";
				else if ($step == "select_fields")
					$next = "var u = new window.URL(location.href);u.params['step_data_import']='validate_import';document.forms['select_fields'].action=u.toString();document.forms['select_fields'].submit();"; 
				if ($next <> null) {?>
				<div class='button' onclick="<?php echo $next;?>"><?php locale("common","Next")?> <img src='/static/common/images/right.png'/></div>
				<?php }?>
			</div>
		</div>
	</div>
<script type='text/javascript'>
function data_import_resize() {
	var content = document.getElementById('data_import_wizard');
	content.style.height = (getWindowHeight())+"px";
	content.style.width = (getWindowWidth())+"px";
}
addLayoutEvent(document.body,data_import_resize);

new vertical_layout('data_import_wizard');

<?php echo $script;?>

triggerEvent(window, 'resize');

<?php if ($step == "select_fields") {?>
function select_range(link) {
	var data_name = link.parentNode.previousSibling.innerHTML;

	var index = parseInt(link.getAttribute("field_index"));
	var form = document.forms['select_fields'];
	var selection = null;
	if (form.elements['field_import_'+index+'_sheet'].value != "-1") {
		selection = [
			form.elements['field_import_'+index+'_sheet'].value,
			parseInt(form.elements['field_import_'+index+'_row1'].value),
			parseInt(form.elements['field_import_'+index+'_col1'].value),
			parseInt(form.elements['field_import_'+index+'_row2'].value),
			parseInt(form.elements['field_import_'+index+'_col2'].value)
		];
		excel_file.remove_area('field_'+index);
	}
	
	var container = document.getElementById('wizard_container');
	var prev_content = [];
	while (container.childNodes.length > 0)
		prev_content.push(container.removeChild(container.childNodes[0]));
	container.innerHTML = "Select on the left panel, in the Excel file, where <i>"+data_name+"</i> will be imported from.<br/>You can use the mouse or the keyboard to select.<br/>Current selection: ";
	var span = document.createElement("SPAN");
	container.appendChild(span);
	span.innerHTML = "Nothing";
	span.style.fontWeight = "bold";
	container.appendChild(document.createElement("BR"));
	var button = document.createElement("BUTTON");
	button.innerHTML = "Ok";
	container.appendChild(button);
	button.onclick = function() {
		var selection = excel_file.selection;
		excel_file.disable_select();
		while (container.childNodes.length > 0)
			container.removeChild(container.childNodes[0]);
		for (var i = 0; i < prev_content.length; ++i)
			container.appendChild(prev_content[i]);
		var index = parseInt(link.getAttribute("field_index"));
		var form = document.forms['select_fields'];
		if (selection != null) {
			form.elements['field_import_'+index+'_sheet'].value = selection[0];
			form.elements['field_import_'+index+'_row1'].value = selection[1];
			form.elements['field_import_'+index+'_col1'].value = selection[2];
			form.elements['field_import_'+index+'_row2'].value = selection[3];
			form.elements['field_import_'+index+'_col2'].value = selection[4];
		} else {
			form.elements['field_import_'+index+'_sheet'].value = "-1";
			form.elements['field_import_'+index+'_row1'].value = "-1";
			form.elements['field_import_'+index+'_col1'].value = "-1";
			form.elements['field_import_'+index+'_row2'].value = "-1";
			form.elements['field_import_'+index+'_col2'].value = "-1";
		}
		if (selection == null)
			link.innerHTML = "Select a range";
		else
			link.innerHTML = ((selection[3]-selection[1]+1)*(selection[4]-selection[2]+1))+" value(s) selected on sheet "+selection[0];
		highlight_selection();
	};
	excel_file.allow_select_range();
	excel_file.onselectionchange = function(excel_file) {
		var selection = excel_file.selection;
		if (selection == null)
			span.innerHTML = "Nothing";
		else {
			span.innerHTML = "Sheet "+selection[0]+": "+(selection[3]-selection[1]+1)+" row(s), "+(selection[4]-selection[2]+1)+" column(s) = "+((selection[3]-selection[1]+1)*(selection[4]-selection[2]+1))+" value(s)";
		};
	};
	if (selection != null)
		excel_file.set_selection(selection[0],selection[1],selection[2],selection[3],selection[4]);
}
function highlight_selection() {
	excel_file.removeAllAreas();
	var form = document.forms['select_fields'];
	for (var index = 1; typeof form.elements['field_import_'+index+'_sheet'] != 'undefined'; index++) {
		if (form.elements['field_import_'+index+'_sheet'].value == "-1") continue;
		excel_file.add_area(
			'field_'+index,
			form.elements['field_import_'+index+'_sheet'].value,
			form.elements['field_import_'+index+'_row1'].value,
			form.elements['field_import_'+index+'_col1'].value,
			form.elements['field_import_'+index+'_row2'].value,
			form.elements['field_import_'+index+'_col2'].value,
			form.elements['field_import_'+index+'_sheet'].parentNode.previousSibling.innerHTML,
			0,255,0
		);
	}
}
<?php }?>
</script>
<?php 
}
?>