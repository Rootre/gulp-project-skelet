<?php
session_start();

require_once "app/bootstrap.php";

$app = APP::getInstance();

$app->render();
?>
