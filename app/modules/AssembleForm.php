<?php

/**
 * Class AssembleForm
 * Assembling language dependent form elements defined in arrays
 * 
 * This class transforms array like this:
 * array(
 * 		'code' => array(
 * 			'type' => 'text',
 * 			'label' => array('cs' => 'Ověřovací kód', 'en' => 'Verification code'),
 * 			'info' => array('cs' => 'xxxxx-xxxx', 'en' => 'xxxx-xxxx'),
 * 		),
 * 		'country' => array(
 * 			'type' => 'select',
 * 			'label' => array('cs' => 'Země', 'en' => 'Country'),
 * 			'placeholder' => array('cs' => 'Vyberte', 'en' => 'Choose'),
 * 			'options' => array(
 * 				'cr' => array(
 * 					'cs' => 'Česká republika',
 * 					'en' => 'Czech Republic'
 * 				),
 *			),
 * 		),
 * 		'send' => array(
 * 			'type' => 'submit',
 * 			'label' => array('cs' => 'Odeslat formulář', 'en' => 'Send form')
 * 		)
 * )
 * 
 * into array like this:
 * array(
 * 		'code' => array(
 * 			'label' => 'Ověřovací kód',
 * 			'element' => '<input type="text" name="code" value="" />'
 * 			'type' => 'text',
 * 			'info' => 'xxxxx-xxxx',
 * 		),
 * 		'country' => array(
 * 			'label' => 'Země',
 * 			'element' => '<select name="country"><option>Vyberte</option><option value="cr">Česká republika</option></select>'
 * 			'type' => 'select',
 * 		),
 * 		'send' => array(
 * 			'element' => '<button type="submit" name="send">Odeslat formulář</button>',
 * 			'type' => 'submit',
 * 		)
 * )
 * 
 */
class AssembleForm {

	public function __construct($lang, $form_values = array())
	{
		$this->lang = $lang;
		$this->form_values = $form_values;
	}

	/**
	 * Returns element's value sent by form, otherwise empty string
	 * @param string $name - form element name
	 * @return string
	 */
	private function _getFormValue($name)
	{
		return isset($this->form_values[$name]) ? $this->form_values[$name] : '';
	}

	/**
	 * Gets value in current language, if its not set, takes the first value
	 * @param array $text - array('lang' => 'value', 'lang2' => 'value')
	 * @return string
	 */
	private function _getLangValue($text)
	{
		return isset($text[$this->lang]) ? $text[$this->lang] : array_values($text)[0];
	}

	/**
	 * Assembles elements from array parameters into labels and html form elements
	 * @param array $form - array of form elements
	 * @return array
	 */
	public function assembleForm($form)
	{
		$output = array();

		foreach ($form as $name => $element) {
			$output[$name] = $this->assembleElement($name, $element);
		}

		return $output;
	}

	/**
	 * Assembles element from array parameters into label and html form element
	 * @param $name
	 * @param $element
	 * @return array
	 */
	public function assembleElement($name, $element)
	{
		switch ($element['type']) {
			case 'select': $output = $this->assembleSelect($name, $element); break;
			case 'radio': $output = $this->assembleRadio($name, $element); break;
			case 'checkbox': $output = $this->assembleCheckbox($name, $element); break;
			case 'submit': $output = $this->assembleSubmit($name, $element); break;
			default: $output = $this->assembleInput($name, $element);
		}

		$output['type'] = $element['type'];

		if (isset($element['info'])) {
			$output['info'] = $this->_getLangValue($element['info']);
		}
		
		return $output;
	}

	/**
	 * Assembles select
	 * selects can have defined placeholder the same way as labels are
	 * @param $name
	 * @param $select
	 * @return array
	 */
	public function assembleSelect($name, $select)
	{
		$lang = $this->lang;
		$form_value = $this->_getFormValue($name);
		$label = $this->_getLangValue($select['label']);

		$options = array();
		if (isset($select['placeholder'][$lang]))
		{
			array_push($options, "<option>{$select['placeholder'][$lang]}</option>");
		}
		foreach ($select['options'] as $value => $text) {
			array_push($options, "<option value='$value'" . ($form_value == $value ? " selected='selected'" : '') . ">" . $this->_getLangValue($text) . "</option>");
		}

		return array(
			'label' => $label,
			'element' => "<select name='$name'>" . implode("", $options) . "</select>"
		);
	}

	/**
	 * Assembles radio buttons
	 * @param $name
	 * @param $radio
	 * @return array
	 */
	public function assembleRadio($name, $radio)
	{
		$form_value = $this->_getFormValue($name);
		$label = $this->_getLangValue($radio['label']);

		$options = array();
		foreach ($radio['options'] as $value => $text) {
			array_push($options, array(
				'input' => "<input type='radio' name='$name' id='radio_{$name}_{$value}' value='$value'" . ($form_value == $value ? " checked='checked'" : '') . " />",
				'label' => "<label for='radio_{$name}_{$value}'>" . $this->_getLangValue($text) . "</label>"
			));
		}

		return array(
			'label' => $label,
			'element' => $options
		);
	}

	/**
	 * Assembles checkbox
	 * @param $name
	 * @param $checkbox
	 * @return array
	 */
	public function assembleCheckbox($name, $checkbox)
	{
		$form_value = $this->_getFormValue($name);
		$label = $this->_getLangValue($checkbox['label']);

		return array(
			'label' => "<label for='checkbox_$name'>$label</label>",
			'element' => "<input id='checkbox_$name' type='checkbox' name='$name' " . ($form_value ? " checked='checked'" : '') . " />"
		);
	}

	/**
	 * Assembles submit button
	 * @param $name
	 * @param $submit
	 * @return array
	 */
	public function assembleSubmit($name, $submit)
	{
		$label = $this->_getLangValue($submit['label']);

		return array(
			'element' => "<button type='submit' name='$name'>$label</button>"
		);
	}

	/**
	 * Assembles input element
	 * @param $name
	 * @param $input
	 * @return array
	 */
	public function assembleInput($name, $input)
	{
		$form_value = $this->_getFormValue($name);
		$label = $this->_getLangValue($input['label']);

		return array(
			'label' => $label,
			'element' => "<input type='{$input['type']}' name='$name' value='$form_value' />"
		);
	}

}

?>