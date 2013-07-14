<?php 
if ($component->campaign_id == null) {
	echo(get_locale("Please select a selection campaign"));
	return;
}

require_once("component/data_import/page/edit_template.inc");

$data = array("People","Applicant","ApplicantSpecific");

edit_template(0,"Applicant",array("SelectionCampaign"=>$component->campaign_id),$data);

?>