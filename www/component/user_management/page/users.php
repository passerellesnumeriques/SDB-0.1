<?php
require_once("component/data_model/list/DataList.inc");
$list = new DataList("Users");
$list->primary_key("Users.domain","Users.username");
$list->add("Users.domain", false);
$list->add("Users.username", false);
$list->add("UserPeople.people>first_name", false);
$list->add("UserPeople.people>last_name", false);
$list->add("UserRole.role_id>name", false);
if (PNApplication::$instance->user_management->has_right("assign_role")) {
	$list->selectable();
	$list->add_selection_action("<div class='button' onclick='um_users_assign_roles()'>".get_locale("Assign roles")."</div>");
	$list->add_selection_action("<div class='button' onclick='um_users_unassign_roles()'>".get_locale("Unassign roles")."</div>");
}
if (PNApplication::$instance->user_management->has_right("manage_users"))
	$list->add_header("<div class='button' onclick='um_users_import();'><img src='/static/common/images/import.png' style='vertical-align:bottom'/>".get_locale("Import users")."</div>");
if (PNApplication::$instance->user_management->has_right("consult_user_rights"))
	$list->add_item_action("/static/user_management/access_list.png",get_locale("Access Rights"),"user_rights?domain=%Users.domain%&username=%Users.username%");
$list->build($this);

$this->add_javascript("/static/common/js/popup_window/popup_window.js");
$this->add_stylesheet("/static/common/js/popup_window/popup_window.css");
if (PNApplication::$instance->user_management->has_right("assign_role")) {
?>
<div style='visibility:hidden;position:absolute;top:-10000px;' id='assign_roles_popup'>
<?php
echo " <span id='assign_unassign'></span> ";
echo " <span id='nb_assign'></span> ";
locale("users");
echo ":<br/>";
echo "<form name='assign_roles_form' onsubmit='return false'>";
$roles = DataModel::get()->getTable("Role")->select()->order_by('Role','name')->execute();
foreach ($roles as $role) {
	echo "<input type='checkbox' name='role_".$role['id']."'/> ".$role['name']."<br/>";
}
echo "</form>";
?>
</div>
<script type='text/javascript'>
function um_users_assign_roles() {
	var sel = datalist_grid.getSelection();
	var data = {};
	for (var i = 0; i < sel.length; ++i)
		data["user"+i] = datalist_data_keys[sel[i]];
	var content = document.getElementById('assign_roles_popup');
	document.getElementById('nb_assign').innerHTML = sel.length;
	document.getElementById('assign_unassign').innerHTML = "<?php locale("Assign the following roles to the");?>";
	var popup = new popup_window("<?php locale("Assign roles")?>","/static/user_management/role.png",content);
	popup.keep_content_on_close = true;
	popup.addOkCancelButtons(function() {
		var form = document.forms['assign_roles_form'];
		var j = 0;
		for (var i = 0; i < form.elements.length; ++i)
			if (form.elements[i].checked)
				data["role"+(j++)] = form.elements[i].name.substring(5);
		ajax.post_parse_result("/dynamic/user_management/service/assign_roles",data,function(result) {
			popup.close();
			if (result)
				location.reload();
		},true);
	});
	popup.show();
}
function um_users_unassign_roles() {
	var sel = datalist_grid.getSelection();
	var data = {};
	for (var i = 0; i < sel.length; ++i)
		data["user"+i] = datalist_data_keys[sel[i]];
	var content = document.getElementById('assign_roles_popup');
	document.getElementById('nb_assign').innerHTML = sel.length;
	document.getElementById('assign_unassign').innerHTML = "<?php locale("Unassign the following roles to the");?>";
	var popup = new popup_window("<?php locale("Unassign roles")?>","/static/user_management/role.png",content);
	popup.keep_content_on_close = true;
	popup.addOkCancelButtons(function() {
		var form = document.forms['assign_roles_form'];
		var j = 0;
		for (var i = 0; i < form.elements.length; ++i)
			if (form.elements[i].checked)
				data["role"+(j++)] = form.elements[i].name.substring(5);
		ajax.post_parse_result("/dynamic/user_management/service/unassign_roles",data,function(result) {
			popup.close();
			if (result)
				location.reload();
		},true);
	});
	popup.show();
}
</script>
<?php }
if (PNApplication::$instance->user_management->has_right("manage_users")) {
$this->add_javascript("/static/common/js/wizard/wizard.js");
$this->add_stylesheet("/static/common/js/wizard/wizard.css");
$this->add_javascript("/static/common/js/validation.js");
$this->add_stylesheet("/static/common/js/validation.css");
?>
<script type='text/javascript'>
function um_users_import() {
	var w = new wizard();
	w.icon = "/static/common/images/import.png";
	w.title = "<?php locale("Import users")?>";
	var select_op_page = document.createElement("DIV");
	var radio_synch_local = document.createElement("INPUT");
	radio_synch_local.type = "radio";
	radio_synch_local.name = "select_op";
	radio_synch_local.onchange = function() { w.removePagesFrom(1); add_local_pages(w); w.validate(); };
	select_op_page.appendChild(radio_synch_local);
	select_op_page.appendChild(document.createTextNode("<?php locale("Synchronize with local system");?> (<?php echo PNApplication::$instance->local_domain;?>)"));
	select_op_page.appendChild(document.createElement("BR"));
	var radio_synch_remote = [];
	<?php
	$i = 0;
	foreach (PNApplication::$instance->get_domains() as $domain=>$descr) {
		echo "radio_synch_remote[".$i."] = document.createElement('INPUT');";
		echo "radio_synch_remote[".$i."].type = 'radio';";
		echo "radio_synch_remote[".$i."].name = 'select_op';";
		echo "radio_synch_remote[".$i."].data = '".$domain."';";
		echo "radio_synch_remote[".$i."].onchange = function() { w.removePagesFrom(1); add_remote_pages(w,this.data); w.validate(); };";
		echo "select_op_page.appendChild(radio_synch_remote[".$i."]);";
		echo "select_op_page.appendChild(document.createTextNode('".get_locale("Synchronize with remote system")." ".$domain."'));";
		echo "select_op_page.appendChild(document.createElement('BR'));";
		$i++;
	} 
	?>
	w.addPage({
		icon: "/static/common/images/import_32.png",
		title: "<?php locale("Select operation")?>",
		content: select_op_page,
		validate: function(w,handler) {
			if (radio_synch_local.checked) {
				// TODO
				handler(true);
				return;
			}
			for (var i = 0; i < radio_synch_remote.length; ++i) {
				if (radio_synch_remote[i].checked) {
					// TODO
					handler(true);
					return;
				}
			}
			handler(false);
		}
	});
	w.onfinish = function(w) {
		location.href = "/dynamic/user_management/page/import_users?domain="+w.domain+(w.token ? "&token="+w.token : "");
	};
	w.launch();
}
function add_local_pages(w) {
	w.domain = "<?php echo PNApplication::$instance->local_domain;?>";
	w.token = null;
}
function add_remote_pages(w,domain) {
	var table = document.createElement("TABLE");
	var tr,td;
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.innerHTML = "<?php locale("Domain")?>";
	tr.appendChild(td = document.createElement("TD"));
	td.innerHTML = domain;
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.innerHTML = "<?php locale("Username")?>";
	tr.appendChild(td = document.createElement("TD"));
	var username = document.createElement("INPUT");
	username.type = 'text';
	username.id = "username";
	username.onchange = function() { w.token = null; w.validate(); };
	td.appendChild(username);
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.colSpan = 2;
	td.style.visibility = 'hidden';
	td.style.position = 'absolute';
	td.id = "username_validation";
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.innerHTML = "<?php locale("Password")?>";
	tr.appendChild(td = document.createElement("TD"));
	var password = document.createElement("INPUT");
	password.type = 'password';
	password.id = "password";
	password.onchange = function() { w.token = null; w.validate(); };
	td.appendChild(password);
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.colSpan = 2;
	td.style.visibility = 'hidden';
	td.style.position = 'absolute';
	td.id = "password_validation";
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.colSpan = 2;
	td.align = "center";
	var button;
	td.appendChild(button = document.createElement("BUTTON"));
	button.innerHTML = "<?php locale("authentication","Authentication")?>";
	button.id = "auth";
	button.validated = false;
	button.onclick = function() {
		validation_ok(button);
		username.disabled = "disabled";
		password.disabled = "disabled";
		button.disabled = "disabled";
		ajax.post_parse_result("/dynamic/authentication/service/auth",{domain:domain,username:username.value,password:password.value},function(result){
			username.disabled = "";
			password.disabled = "";
			button.disabled = "";
			if (result) {
				button.validated = true;
				w.domain = domain;
				w.token = result.token;
				w.validate();
				return;
			}
			w.token = null;
			button.validated = false;
			w.validate();
		},false,function(error){
			username.disabled = "";
			password.disabled = "";
			button.disabled = "";
			w.token = null;
			button.validated = false;
			validation_error(button, error);
			w.validate();
		});
	
	};
	table.appendChild(tr = document.createElement("TR"));
	tr.appendChild(td = document.createElement("TD"));
	td.colSpan = 2;
	td.style.visibility = 'hidden';
	td.style.position = 'absolute';
	td.id = "auth_validation";
	w.addPage({
		icon: "/static/authentication/authentication_32.png",
		title: "<?php locale("authentication","Authentication")?>",
		content: table,
		validate: function(w,handler) {
			if (username.value.length == 0) {
				validation_error(username, "<?php locale("common","Cannot be empty")?>");
				handler(false);
				return;
			}
			validation_ok(username);
			if (password.value.length == 0) {
				validation_error(password, "<?php locale("common","Cannot be empty")?>");
				handler(false);
				return;
			}
			validation_ok(password);
			handler(button.validated);
		}
	});
}
</script>
<?php }?>