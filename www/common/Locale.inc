<?php
/**
 * Prints a localized string.
 * Usages:
 *  locale("key");
 *  locale("key", array("param1"=>value1,...));
 *  locale("component", "key");
 *  locale("component", "key", array("param1"=>value1,...));
 */
function locale() {
	$nb = func_num_args();
	if ($nb == 1)
		echo Locale::get_string(Locale::$current_component, func_get_arg(0));
	else if ($nb == 3)
		echo Locale::get_string(func_get_arg(0), func_get_arg(1), func_get_arg(2));
	else {
		$second = func_get_arg(1);
		if (is_array($second))
			echo Locale::get_string(Locale::$current_component, func_get_arg(0), func_get_arg(1));
		else
			echo Locale::get_string(func_get_arg(0), func_get_arg(1));
	}
}
/** Returns a localized string, instead of printing it. */
function get_locale() {
	$nb = func_num_args();
	if ($nb == 1)
		return Locale::get_string(Locale::$current_component, func_get_arg(0));
	else if ($nb == 3)
		return Locale::get_string(func_get_arg(0), func_get_arg(1), func_get_arg(2));
	else {
		$second = func_get_arg(1);
		if (is_array($second))
			return Locale::get_string(Locale::$current_component, func_get_arg(0), func_get_arg(1));
		else
			return Locale::get_string(func_get_arg(0), func_get_arg(1));
	}
}

function get_locale_html() {
	$str = call_user_func_array('get_locale', func_get_args());
	return htmlentities($str, ENT_COMPAT, "UTF-8");
}
function locale_html() {
	$str = call_user_func_array('get_locale', func_get_args());
	echo htmlentities($str, ENT_COMPAT, "UTF-8");
}
function get_locale_xml() {
	$str = call_user_func_array('get_locale', func_get_args());
	return htmlspecialchars($str, ENT_QUOTES, "UTF-8");
}
function locale_xml() {
	$str = call_user_func_array('get_locale', func_get_args());
	echo htmlspecialchars($str, ENT_QUOTES, "UTF-8");
}
function get_locale_js() {
	$str = call_user_func_array('get_locale', func_get_args());
	return json_encode($str);
}
function locale_js() {
	$str = call_user_func_array('get_locale', func_get_args());
	echo json_encode($str);
}

class Locale {

	/** @var string default namespace, used if no namespace is specified */
	public static $current_component = "";
	/** @var string current language of the user */
	public static $language = null;
	public static $known = array("en","fr","kh","vn","ph");

	public static function get_string($component, $key) {
		if (!in_array($component, Locale::$loaded))
			Locale::load($component);
		$key_lower = strtolower($key);
		if (!isset(Locale::$strings[$component][$key_lower]))
			return "?locale(".$component.",".$key_lower.")?";
		$a = Locale::$strings[$component][$key_lower];

		$str = $a[0];
		if (count($a[1]) > 0) {
			for ($i = 0; $i < count($a[1]) && $i < count($a[2]); $i++) {
				$word_pos = $a[1][$i];
				$letter = substr($key,$word_pos,1);
				if ($letter == strtolower($letter)) continue; // not a capital letter
				$word_pos2 = $a[2][$i];
				$letter = mb_substr(substr($str, $word_pos2), 0, 1, "UTF-8");
				$str = substr($str, 0, $word_pos2).mb_strtoupper($letter, "UTF-8").substr($str, $word_pos2+strlen($letter));
			}
		} else {
			if (substr($key,0,1) <> substr($key_lower,0,1)) {
				$first_letter = mb_substr($str, 0, 1, "UTF-8");
				$remaining = substr($str, strlen($first_letter));
				$str = mb_strtoupper($first_letter,"UTF-8").$remaining;
			}
		}

		$nb = func_num_args();
		if ($nb > 2) {
			$a = func_get_arg(2);
			foreach ($a as $k=>$v)
				$str = str_replace("%".$k."%", $v, $str);
		}
		return $str;
	}

	private static $loaded = array();
	private static $loaded_path = array();
	private static $strings = array(""=>array());

	private static function load($component) {
		if ($component == "common")
			Locale::load_file("common", "common/locale/");
		else
			Locale::load_file($component, "component/".$component."/locale/");
	}

	public static function load_file($namespace, $path) {
		if (in_array($namespace, Locale::$loaded)) return;
		array_push(Locale::$loaded, $namespace);
		$filename = $path.Locale::$language;
		if (!file_exists($filename))
			$filename = $path."en"; // default to english
		if (!file_exists($filename)) {
			$filename = $path.Locale::$language;
			PNApplication::error("File '".$filename."' does not exist");
			return;
		}
		Locale::load_path($namespace, $filename);
		if (file_exists($path."generic"))
			Locale::load_path($namespace, $path."generic");
	}

	public static function load_path($namespace, $filename, $charset = null) {
		if (in_array($filename, Locale::$loaded_path)) return;
		array_push(Locale::$loaded_path, $filename);
		if (!isset(Locale::$strings[$namespace]))
			Locale::$strings[$namespace] = array();
		if (!in_array($namespace, Locale::$loaded))
			array_push(Locale::$loaded, $namespace);
		$f = @fopen($filename, "r");
		if ($f == null) {
			PNApplication::error("Cannot open file '".$filename."'");
			return;
		}
		while (($line = fgets($f, 4096)) !== false) {
			$line = trim($line);
			if (strlen($line) == 0) continue;
			if ($charset <> null) $line = iconv($charset, "UTF-8", $line);
			$i = strpos($line, "=");
			if ($i === false) continue;
			$key = trim(substr($line, 0, $i));
			$str = trim(substr($line,$i+1));

			$key = strtolower($key);
			if (isset(Locale::$strings[$namespace][$key])) continue;
			$words_pos_key = array();
			while (($i = strpos($key, "~")) !== FALSE) {
				array_push($words_pos_key, $i);
				$key = substr($key, 0, $i).substr($key,$i+1);
			}
			$words_pos_str = array();
			while (($i = strpos($str, "~")) !== FALSE) {
				array_push($words_pos_str, $i);
				$str = substr($str, 0, $i).substr($str,$i+1);
			}
			Locale::$strings[$namespace][$key] = array($str, $words_pos_key, $words_pos_str);
		}
		fclose($f);
	}

}

if (isset($_SESSION["lang"]))
	Locale::$language = $_SESSION["lang"];
else if (isset($_COOKIE["lang"]))
	Locale::$language = $_SESSION["lang"] = $_COOKIE["lang"];
else {
	if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
		$s = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
		$i = strpos($s, ';');
		if ($i <> false) {
			$s = substr($s, 0, $i);
		}
		$values = explode(',', $s);
		$count = count($values);
		for ($i = 0; $i < $count; $i++) {
			$s = strtolower($values[$i]);
			if (strlen($s) == 2 && in_array($s,Locale::$known)) {
				Locale::$language = $s;
				break;
			}
		}
	}
	if (Locale::$language == null)
		Locale::$language = Locale::$known[0];
	$_SESSION["lang"] = Locale::$language;
	setcookie("lang",Locale::$language,time()+2*365*24*60*60,"/dynamic/");
	setcookie("lang",Locale::$language,time()+2*365*24*60*60,"/locale/");
}
?>