<?php
/* @var $model DataModel */
$model->addTable("Users")
	->addString("domain",100,1,false)
	->addString("username",100,1,false)
	->addIndex("domain","username")
	->restrictReadAccess("consult_user_list",true)
	->addDisplayableData("domain", "User","Domain")
	->addDisplayableData("username", "User","Username");
$model->addDataCategoryLink("User","/dynamic/people/page/profile?plugin=user_management&page=user_rights&domain=%Users.domain%&username=%Users.username%");
$model->addTable("UserRights")
	->addString("domain", 100, 1, false)
	->addString("username", 100, 1, false)
	->addString("right", 100, 1, false)
	->addString("value")
	->addIndex("domain","username")
	->addLink("Users", array("domain"=>"domain","username"=>"username"), false)
	->restrictReadAccess("consult_user_rights",true);
$model->addTable("Role")
	->addPrimaryKey("id")
	->addString("name", 100, 1, false, true)
	->addDisplayableData("name", "User","Role")
	->allowReadAccess()
	->restrictFieldWriteAccess("name","manage_roles",true)
	->restrictAddAccess("manage_roles", true)
	->restrictRemoveAccess("manage_roles", true);
$model->addTable("UserRole")
	->addString("domain", 100, 1, false)
	->addString("username", 100, 1, false)
	->addForeignKey("role_id", "Role")
	->addIndex("domain","username")
	->addLink("Users", array("domain"=>"domain","username"=>"username"), false)
	->restrictReadAccess("consult_user_roles",true)
	->restrictAddAccess("assign_role",true)
	->restrictRemoveAccess("assign_role",true);
$model->addTable("RoleRights")
	->addForeignKey("role_id", "Role")
	->addString("right", 100, 1, false)
	->addString("value")
	->addIndex("role_id")
	->allowReadAccess()
	->restrictAddAccess("manage_roles",true)
	->restrictRemoveAccess("manage_roles",true);
?>