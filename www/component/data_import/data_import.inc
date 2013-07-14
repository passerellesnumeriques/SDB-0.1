<?php 
class data_import extends Component {

	public function dependencies() { return array("storage"); }
	
	protected function is_service_allowed($path) {
		if ($path == "excel") return true;
		return false;
	}
	
}
?>