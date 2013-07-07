<?php
$this->add_javascript("/static/common/js/splitter_vertical/splitter_vertical.js");
$this->add_stylesheet("/static/common/js/splitter_vertical/splitter_vertical.css");
$this->add_javascript("/static/calendar/calendar.js");
$this->add_javascript("/static/calendar/calendar_view.js");
$this->add_stylesheet("/static/calendar/calendar_view.css");
//$this->onload("");

require_once("common/SQLQuery.inc");
$calendars = SQLQuery::create()->select("UserCalendar")->where("username",PNApplication::$instance->user_management->username)->join("UserCalendar","Calendar",array("calendar"=>"id"))->execute();
foreach ($calendars as &$cal)
	$cal["color"] = "#A0F0A0";
?>
<div id='calendar_page' style='width:100%;height:100%'>
	<div id='calendar_left' style='overflow:auto'>
		<div class='button' onclick='import_calendar();'><img src='/static/common/images/import.png'/> <?php locale("Import Calendar")?></div>
<?php
foreach ($calendars as &$cal) {
	echo "<div>";
	echo "<div style='width:10px;height:10px;border:1px solid black;background-color:".$cal["color"].";display:inline-block;vertical-align:bottom'></div>";
	echo $cal["name"];
	echo "</div>";
}
?>
	</div>
	<div id='calendar_content'>
	</div>
</div>
<script type='text/javascript'>
new splitter_vertical('calendar_page',0.3);
var cal = new Calendar();
var view = new calendar_view('calendar_content',cal);
<?php
foreach ($calendars as &$cal)
	echo "cal.add_calendar(".json_encode($cal["name"]).",'/dynamic/calendar/service/get?id=".$cal["calendar"]."','".$cal["color"]."');";
?>

function import_calendar() {
	add_javascript("/static/common/js/wizard/wizard.js",function() {
		var w = new wizard();
		w.title = "<?php locale("Import Calendar")?>";
		var page_type_of_calendar;
		var page_internet_url;

		// page 1: type and name of calendar
		var div = document.createElement("DIV");
		var type_internet = document.createElement("INPUT");
		type_internet.type = 'radio';
		type_internet.onchange = function() {
			if (this.checked) {
				w.removePagesFrom(1);
				w.addPage(page_internet_url);
			}
			w.validate();
		};
		div.appendChild(type_internet);
		div.appendChild(document.createTextNode("<?php locale("From internet")?>"));
		div.appendChild(document.createElement("BR"));
		div.appendChild(document.createElement("BR"));
		div.appendChild(document.createTextNode("<?php locale("common","Name")?>"));
		var calendar_name = document.createElement("INPUT");
		calendar_name.type = "text";
		calendar_name.size=30;
		calendar_name.max_length=100;
		calendar_name.onkeyup = function() { w.validate(); };
		div.appendChild(calendar_name);
		page_type_of_calendar = {
			icon: "/static/common/images/import_32.png",
			title: "<?php locale("Type of calendar to import")?>",
			content: div,
			validate: function(w,handler) {
				if (calendar_name.value.length == 0)
					handler(false);
				else {
					if (type_internet.checked)
						handler(true);
					else
						handler(false);
				}
			}
		};

		// type internet: page to enter URL
		div = document.createElement("DIV");
		var internet_url = document.createElement("INPUT");
		internet_url.type = "text";
		internet_url.size = 50;
		internet_url.max_length = 1024;
		internet_url.onkeyup = function() {
			w.validate();
		};
		div.appendChild(internet_url);
		page_internet_url = {
			icon: "/static/common/images/import_32.png",
			title: "<?php locale("Internet Calendar Address")?>",
			content: div,
			validate: function(w,handler) {
				if (internet_url.value.length == 0)
					handler(false);
				else
					handler(true);
			}
		};

		// onfinish
		w.onfinish = function() {
			var name = calendar_name.value;
			var type, data;
			if (type_internet.checked) {
				type = "internet";
				data = internet_url.value;
			}
			var s = new StatusMessage(Status_TYPE_PROCESSING, "<?php locale("Import calendar")?>");
			status_mgr.add_status(s);
			ajax.post_parse_result("/dynamic/calendar/service/import_calendar",{name:name,type:type,data:data},function(result){
				status_mgr.remove_status(s);
				if (result && result.id)
					cal.add_calendar(name, "/dynamic/calendar/service/get?id="+result.id, "#A0FFA0");
			});
		};

		// start wizard
		w.addPage(page_type_of_calendar);
		w.launch();
	});
}
</script>