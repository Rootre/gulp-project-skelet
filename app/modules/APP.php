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
		if (isset($_GET['lang']) && in_array($_GET['lang'], $this->get("langs"))) {
			$this->language = $_GET['lang'];
		}
		else {
			$this->language = 'cs';
		}

		$this->texts = new XMLReader();
		$this->texts->open(ROOT_URL . "texts.xml");
		$this->texts->read();
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
		$doc = new DOMDocument;

		while (self::getInstance()->texts->name === 'category')
		{
			if (self::getInstance()->texts->getAttribute('name') === $category)
			{
				//$node = new SimpleXMLElement($z->readOuterXML());
				$node = simplexml_import_dom($doc->importNode(self::getInstance()->texts->expand(), true));
				foreach ($node->children() as $key => $val)
				{
					if ($key === $name)
					{
						$lang = self::getInstance()->language;
						$value = $val->$lang->child->asXML();
						return $value ? $value : $val->cs->__toString();
					}
				}
			}

			self::getInstance()->texts->next('category');
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