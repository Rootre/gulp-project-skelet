<?php

function __autoload($className){
	$file = MODULES_URL.$className.".php";
	if (file_exists($file)) {
		include_once($file);
	}
	else {
		$textLog = new logger(LOGS_URL);
		$textLog->log("Nepodařilo se vložit soubor '{$file}'. Soubor nenalezen");
	}
}

define("ROOT_URL", $_SERVER["DOCUMENT_ROOT"] . "/app/");
define("APACHE_ROOT_URL", "/");

define("BITS_URL", ROOT_URL . "bits/");
define("MODULES_URL", ROOT_URL . "modules/");
define("LOGS_URL", ROOT_URL . "logs/");
define("PAGES_URL", ROOT_URL . "pages/");

define("IMAGES_URL", APACHE_ROOT_URL . "dist/images/");
define("CSS_URL", APACHE_ROOT_URL . "dist/css/");
define("JS_URL", APACHE_ROOT_URL . "dist/js/");

//define("MAILING_FROM", "Tejsty test");

if (file_exists(APP_URL . 'env.php')) {
	require_once 'env.php';
}

?>