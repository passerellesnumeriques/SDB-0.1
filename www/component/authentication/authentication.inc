<?php
class authentication extends Component {

	public function get_authentication_system($domain) {
		$local = PNApplication::$instance->local_domain;
		switch ($domain) {
			case "PNP":
				if ($local == "PNP") {
					require_once("FakeAuthenticationSystem.inc");
					return new FakeAuthenticationSystem();
				}
				require_once("PNP_Remote_AuthenticationSystem.inc");
				return new PNP_Remote_AuthenticationSystem();
			default:
				require_once("FakeAuthenticationSystem.inc");
				return new FakeAuthenticationSystem();
		}
	}
	
	public function is_service_allowed($path) {
		if (PNApplication::$instance->user_management->username == null) return false;
		return true;
	}

}
?>