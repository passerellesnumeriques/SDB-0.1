<?php 
echo "Removing all tables from DataBase:<br/>";
flush();
$res = DataBase::$conn->execute("SHOW TABLES");
if ($res !== FALSE) {
	while (($table = DataBase::$conn->next_row($res)) !== FALSE) {
		echo " + Table ".$table[0]."<br/>";
		DataBase::$conn->execute("DROP TABLE `".$table[0]."`");
		flush();
	}
} else
	echo "Failed to get the list of tables<br/>";
flush();
echo "Create tables according to data model<br/>";
$model = PNApplication::$instance->data_model();
require_once("common/DataBaseModel.inc");
DataBaseModel::update_model($model);
echo "Insert test data<br/>";

$roles = array(
	"Staff",
	"Student",
	"Alumni",
	"General Manager",
	"Education Manager",
	"Educator",
	"Training Manager",
	"SNA",
	"Selection Manager",
	"Selection Officer",
	"External Relations Manager",
	"External Relations Officer",
	"Finance Manager",
);
$users = array(
	array("Helene", "Huard", "F", array("General Manager","Staff")),
	array("Julie", "Tardieu", "F", array("Staff", "Education Manager", "Educator")),
	array("Eduard", "Bucad", "M", array("Staff", "Educator")),
	array("Marian", "Lumapat", "F", array("Staff", "Educator")),
	array("Fatima", "Tiah", "F", array("Staff", "Educator")),
	array("Stanley", "Vasquez", "M", array("Staff", "Educator")),
	array("Kranz", "Serino", "F", array("Staff", "Educator")),
	array("Guillaume", "Le Cousin", "M", array("Staff", "Training Manager")),
	array("Jovanih", "Alburo", "M", array("Staff", "SNA")),
	array("Rosalyn", "Minoza", "F", array("Staff", "Selection Manager")),
	array("Isadora", "Gerona", "F", array("Staff", "Selection Officer")),
	array("Sandy", "De Veyra", "M", array("Staff", "External Relations Manager")),
	array("Ann", "Labra", "F", array("Staff", "External Relations Officer")),
	array("Jeanne", "Salve", "F", array("Staff", "Finance Manager")),
	array("Rhey", "Laurente", "M", array("Alumni")),
	array("X", "Y", "F", array("Student")),
);
$roles_id = array();
foreach ($roles as $role_name) {
	DataBase::$conn->execute("INSERT INTO Role (name) VALUES ('".$role_name."')");
	$roles_id[$role_name] = DataBase::$conn->get_insert_id();
}
foreach ($users as $user) {
	DataBase::$conn->execute("INSERT INTO People (first_name,last_name,sex) VALUES ('".$user[0]."','".$user[1]."','".$user[2]."')");
	$people_id = DataBase::$conn->get_insert_id();
	$username = str_replace(" ","-", strtolower($user[0]).".".strtolower($user[1]));
	DataBase::$conn->execute("INSERT INTO Users (domain,username) VALUES ('PNP','".$username."')");
	DataBase::$conn->execute("INSERT INTO UserPeople (domain,username,people) VALUES ('PNP','".$username."',".$people_id.")");
	foreach ($user[3] as $role) {
		DataBase::$conn->execute("INSERT INTO UserRole (domain,username,role_id) VALUES ('PNP','".$username."',".$roles_id[$role].")");
	}
}
echo "<a href='/'>Back to application</a>";

PNApplication::print_errors();
?>