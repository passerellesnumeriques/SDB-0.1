<?php 
$storage_id = $_GET["id"];
PNApplication::$instance->storage->set_expire($storage_id, time()+30*60);
require_once("common/PHPExcel.php");
require_once("common/php/ExcelFileDisplay.inc");
$excel = PHPExcel_IOFactory::load(PNApplication::$instance->storage->get_data_path($storage_id));
display_excel_file($excel);
return false;
?>