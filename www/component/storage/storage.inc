<?php 
class storage extends Component {
	
	protected function is_page_allowed($path) {
		// TODO
		return true;
	}
	protected function is_service_allowed($path) {
		// TODO
		return true;
	}
	
	private function remove_old() {
		DataBase::execute("DELETE FROM `Storage` WHERE `expire` IS NOT NULL AND `expire` < ".time());
	}
	
	public function store_data($data, $mime = null, $expire = null) {
		$this->remove_old();
		DataBase::execute("INSERT INTO `Storage` (`mime`,`expire`) VALUE (".($mime <> null ? "'".DataBase::escape_string($mime)."'" : "NULL").",".($expire <> null ? $expire : "NULL").")");
		$id = DataBase::get_insert_id();
		$dir1 = $id%100;
		$dir2 = ($id/100)%100;
		$dir3 = ($id/10000)%100;
		$filename = intval($id/1000000);
		$path = dirname($_SERVER["SCRIPT_FILENAME"])."/storage";
		if (!file_exists($path."/".$dir1)) {
			if (!mkdir($path."/".$dir1)) {
				PNApplication::error("Unable to create directory ".$path."/".$dir1);
				DataBase::execute("DELETE FROM `Storage` WHERE `id`=".$id);
				return null;
			}
		}
		$path = $path."/".$dir1;
		if (!file_exists($path."/".$dir2)) {
			if (!mkdir($path."/".$dir2)) {
				PNApplication::error("Unable to create directory ".$path."/".$dir2);
				DataBase::execute("DELETE FROM `Storage` WHERE `id`=".$id);
				return null;
			}
		}
		$path = $path."/".$dir2;
		if (!file_exists($path."/".$dir3)) {
			if (!mkdir($path."/".$dir3)) {
				PNApplication::error("Unable to create directory ".$path."/".$dir3);
				DataBase::execute("DELETE FROM `Storage` WHERE `id`=".$id);
				return null;
			}
		}
		$path = $path."/".$dir3."/".$filename;
		if (file_exists($path)) {
			if (!unlink($path)) {
				PNApplication::error("File ".$path." already exists, but we cannot remove it");
				DataBase::execute("DELETE FROM `Storage` WHERE `id`=".$id);
				return null;
			}
		}
		$f = @fopen($path, "w");
		if ($f == null) {
			PNApplication::error("Unable to create file ".$path);
			DataBase::execute("DELETE FROM `Storage` WHERE `id`=".$id);
			return null;
		}
		fwrite($f, $data);
		fclose($f);
		return $id;
	}
	
	function get_data($id, $new_expire = null) {
		$dir1 = $id%100;
		$dir2 = ($id/100)%100;
		$dir3 = ($id/10000)%100;
		$filename = intval($id/1000000);
		$path = dirname($_SERVER["SCRIPT_FILENAME"])."/storage/".$dir1."/".$dir2."/".$dir3."/".$filename;
		if (!file_exists($path)) return null;
		$data = file_get_contents($path);
		if ($data === false) return null;
		if ($new_expire <> null)
			DataBase::execute("UPDATE `Storage` SET `expire`=".$new_expire." WHERE `id`=".$id);
		return $data;
	}
	
	function remove_data($id) {
		$dir1 = $id%100;
		$dir2 = ($id/100)%100;
		$dir3 = ($id/10000)%100;
		$filename = intval($id/1000000);
		$path = dirname($_SERVER["SCRIPT_FILENAME"])."/storage/".$dir1."/".$dir2."/".$dir3."/".$filename;
		unlink($path);
		DataBase::execute("DELETE FROM `Storage` WHERE `id`=".$id);
	}
	
}
?>