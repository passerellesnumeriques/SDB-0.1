<?php 
require_once("component/application/MainSectionPage.inc");
$p = new MainSectionPage($this, '/static/people/people_32.png', get_locale("People"), "list");
$p->add_menu_link("/static/common/images/list_text_16.png", get_locale("List"), "list");
$p->add_menu_link("/static/common/images/list_detail_16.png", get_locale("Detailed List"), "list_details");
$p->add_menu_link("/static/common/images/list_thumb_16.png", get_locale("Faces"), "list_faces");
$p->generate();
?>