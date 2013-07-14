<?php 
require_once("component/data_model/list/DataList.inc");
$list = new DataList("People");
$list->add("People.first_name", false);
$list->add("People.last_name", false);
$list->add("People.sex", false);
$list->add("People.birth", false);
$list->add_item_action("/static/people/profile_16.png",get_locale("Profile"),"profile?people=%People.id%");
$list->add_header("<div class='button' onclick='import_people();' title='".htmlspecialchars(get_locale("common","Import"),ENT_QUOTES,"UTF-8")."'><img src='/static/common/images/import.png'/></div>");
$list->build($this);
?>
<script type='text/javascript'>
function import_people() {
	add_stylesheet("/static/common/js/popup_window/popup_window.css");
	add_javascript('/static/common/js/popup_window/popup_window.js',function(){
		var div = document.createElement("DIV");
		var popup = new popup_window(<?php echo json_encode(get_locale("common","Import"));?>,"/static/common/images/import.png",div);
		popup.show();
		add_javascript('/static/storage/upload.js',function(){
			new upload(div, false, '/dynamic/people/page/import', function(popup){
				location.href = '/dynamic/people/page/import';
			},true,popup).appendDropArea();
			popup.resize();
		});
	});
}
</script>