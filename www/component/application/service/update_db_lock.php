<?php
require_once("common/DataBaseLock.inc"); 
$error = DataBaseLock::update($_POST["id"]);
if (!$error)
	echo "true";
else
	PNApplication::error($error);
?>