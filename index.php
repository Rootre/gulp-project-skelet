<?php
session_start();

require_once "app/bootstrap.php";

$app = APP::getInstance();

/* redirecting to langs
if (!preg_match("/^(cs|en)\/(.*)/", ltrim($_SERVER['REQUEST_URI'], '/'))) {
	header("Location: " . $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['SERVER_NAME'] . "/" . APP::getLang() . "/" . ltrim($_SERVER['REQUEST_URI'], '/'));
	die();
}
*/

$app->render();
?>
