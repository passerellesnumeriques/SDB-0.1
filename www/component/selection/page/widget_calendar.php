<?php
/* @var $component selection */
if ($component->campaign_id == null) die(get_locale("Please select a selection campaign"));

require_once("common/SQLQuery.inc");
$calendar_id = SQLQuery::create()->select("SelectionCampaign")->field("calendar")->where("id",$component->campaign_id)->execute_single_value();
?>
<div id='selection_calendar' style='height:250px'>
</div>
<script type='text/javascript'>
add_javascript("/static/calendar/calendar.js",function() {
	var cal = new Calendar();
	cal.add_calendar("","/dynamic/calendar/service/get?id=<?php echo $calendar_id;?>","#C0C0FF");
	add_stylesheet("/static/calendar/calendar_view.css");
	add_javascript("/static/calendar/calendar_view.js",function() {
		var view = new calendar_view('selection_calendar',cal);
	});
});
</script>