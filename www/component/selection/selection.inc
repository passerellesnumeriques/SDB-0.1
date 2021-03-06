<?php
class selection extends Component {

	public $campaign_id = 0;

	public function get_readable_rights() {
		return array(
			new AccessRightCategory("selection","Selection",array(
				new BooleanRight("consult_selection","Consult selection data"),
			)),
		);
	}
	public function get_writable_rights() {
		return array(
			new AccessRightCategory("selection","Selection",array(
				new BooleanRight("edit_selection","Edit selection data",array(true=>array("consult_selection"=>true))),
			)),
		);
	}

	protected function is_page_allowed($path) {
		switch ($path) {
			case "application_forms/edit_templates":
				return $this->app->user_management->has_right("edit_selection");
			default:
				return $this->app->user_management->has_right("consult_selection");
		}
	}

	protected function is_service_allowed($path) {
		if ($path == "create_campaign" ||
			$path == "zone/create"
			)
			return $this->app->user_management->has_right("edit_selection");
		return false;
	}

	public function get_campaigns() {
		require_once("common/SQLQuery.inc");
		return SQLQuery::create()->select("SelectionCampaign")->execute();
	}
	public function get_zones() {
		require_once("common/SQLQuery.inc");
		return SQLQuery::create()->select("SelectionZone")->where("campaign",$this->campaign_id)->execute();
	}
	
	// queries for applicants

	public function &select_applicants() {
		require_once("common/SQLQuery.inc");
		return SQLQuery::create()->select_sub_model("SelectionCampaign",$this->campaign_id)->select("Applicant");
	}

	// queries for information sessions

	public function &select_information_sessions() {
		require_once("common/SQLQuery.inc");
		return SQLQuery::create()->select("InformationSession")->where("campaign",$this->campaign_id);
	}
	public function &select_information_sessions_with_schedule() {
		return $this->select_information_sessions()->where("calendar_event IS NOT NULL");
	}
	public function &select_information_sessions_without_schedule() {
		return $this->select_information_sessions()->where("calendar_event IS NULL");
	}
	public function &select_information_sessions_with_schedule_but_without_staff() {
		return $this->select_information_sessions_with_schedule()->join("InformationSession","CalendarEvent",array("calendar_event"=>"id"), "EVENT")->where("EVENT.attendees IS NOT NULL");
	}
}
?>