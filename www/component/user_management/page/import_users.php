<?php
$domain = $_GET["domain"];
$token = $domain == PNApplication::$instance->local_domain ? $component->auth_token : $_GET["token"];
if ($domain == null || $token == null) return;
$import_users = PNApplication::$instance->authentication->get_authentication_system($domain)->get_user_list($token);
if ($import_users == null) {
	PNApplication::error("Authentication system for domain ".$domain." does not support to retrieve the list of users");
	return;
}

$data_id = PNApplication::$instance->storage->store_data(serialize($import_users),null,time()+30*60);
	
require_once("common/SQLQuery.inc");
$db_users = SQLQuery::create()->select("Users")->where("domain",$domain)->execute();

$new_users = array();
foreach ($import_users as $u) {
	$found = false;
	for ($i = 0; $i < count($db_users); $i++) {
		if ($db_users[$i]["username"] == $u[0]) {
			$found = true;
			array_splice($db_users, $i, 1);
			break;
		}
	}
	if (!$found) array_push($new_users, $u);
}

$this->add_javascript("/static/common/js/grid/grid.js");
$this->add_stylesheet("/static/common/js/grid/grid.css");
$this->add_javascript("/static/common/js/field/field_text.js");
?>
<style type='text/css'>
h1{
	font-size: 12pt;
	font-style: bold;
	color: #404080;
}
</style>
<div style='float:left'><h1>New users</h1></div>
<div>Hello</div>
<div id='new_users'></div>
<script type='text/javascript'>
var new_users = new grid('new_users');
new_users.setSelectable(true);
new_users.addColumn("<?php locale("Username")?>",null,null,null,null,function(v1,v2){
	return v1.localeCompare(v2);
});
<?php
$cols = array();
foreach ($new_users as $u)
	foreach ($u[1] as $name=>$value)
		if(!in_array($name,$cols)) array_push($cols, $name);
foreach ($cols as $name)
	echo "new_users.addColumn(".json_encode($name).",null,null,null,null,null,true);";
?>
new_users.setData(
[
<?php
$first = true; 
foreach ($new_users as $u) {
	if ($first) $first = false; else echo ",";
	echo "[";
	echo json_encode($u[0]);
	foreach ($cols as $name) {
		echo ",";
		if (isset($u[1][$name]))
			echo json_encode($u[1][$name]);
		else
			echo "\"\"";
	}
	echo "]";
} 
?>
]
);
</script>
