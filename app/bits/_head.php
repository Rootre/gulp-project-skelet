<head>
	
	<title><?= APP::getText('header', 'title'); ?></title>
	
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">

	<?php if(Env::isLocal()): ?>
		<link rel="stylesheet" href="<?= CSS_URL ?>site.css?v=<?= filemtime(ROOT_URL . 'dist/css/site.css') ?>" media="screen,projection" />
		<script type="text/javascript" src="<?= JS_URL ?>all.js?v=<?= filemtime(ROOT_URL . 'dist/js/all.js') ?>" async></script>
	<?php else: ?>
		<link rel="stylesheet" href="<?= CSS_URL ?>site.min.css?v=<?= filemtime(ROOT_URL . 'dist/css/site.min.css') ?>" media="screen,projection" />
		<script type="text/javascript" src="<?= JS_URL ?>all.min.js?v=<?= filemtime(ROOT_URL . 'dist/js/all.min.js') ?>" async></script>
	<?php endif; ?>
	
</head>
<body id="<?php echo APP::getCurrentPage(); ?>">