<?php

class APP
{
	private static $VARS = array(
		"langs" => array("cs", "en")
	);

	private static $instance;

	function __construct()
	{
		$this->page = isset($_GET['page']) ? $_GET['page'] : 'homepage';

		if (!isset($_SESSION['lang'])) {
			self::setLang('cs');
		}

		if (isset($_GET['lang']) && in_array($_GET['lang'], $this->get("langs"))) {
			self::setLang($_GET['lang']);
		}

		$xml_texts = file_get_contents(ROOT_URL . "texts.xml");
		$this->texts = simplexml_load_string($xml_texts);
	}

	private function setLang($lang) {
		$_SESSION['lang'] = $lang;
	}

	public static function getLang() {
		return $_SESSION['lang'];
	}

	public static function getLangs() {
		$langs = array();
		foreach (self::$VARS['langs'] as $lang) {
			array_push($langs, array(
				'url' => '?lang=' . $lang,
				'code' => $lang,
			));
		}

		return $langs;
	}

	/**
	 * Returns the *Singleton* instance of this class.
	 *
	 * @return Singleton The *Singleton* instance.
	 */
	public static function getInstance()
	{
		if (null === static::$instance) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	public static function get($var)
	{
		return isset(self::$VARS[$var]) ? self::$VARS[$var] : false;
	}

	public function getCurrentPage() {
		return $this->page;
	}

	public static function getText($category, $name)
	{
		$self = self::getInstance();
		$lang = self::getLang();

		foreach ($self->texts->category as $parsed_category) {
			if ($parsed_category->attributes()['name'] == $category) {
				foreach ($parsed_category as $text) {
					if ($text->getName() == $name) {
						$value = !!$text->$lang ? $text->$lang : $text->cs;
						//finally strip <lang> markers from asXML function
						return preg_replace("/^<\w+>(.+)<\/\w+>$/i", '$1', $value->asXML());
					}
				}
			}
		}
		return false;
	}

	public function render()
	{
		$this->getBit("_start");
		$this->getBit("_head");
		$this->getBit("header");
		$this->getPage($this->page);
		$this->getBit("_end");
	}

	private function getBit($name)
	{
		return $this->getFileContent(BITS_URL, $name . ".php");
	}
	private function getPage($name)
	{
		return $this->getFileContent(PAGES_URL, $name . ".php");
	}
	private function getFileContent($url, $name)
	{
		return file_exists($url . $name) ? include($url . $name) : false;
	}
}