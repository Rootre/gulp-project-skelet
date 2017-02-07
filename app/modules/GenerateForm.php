<?php

/**
 * Class GenerateForm
 * This Class works with output from AssebmleForm class and generates its output into HTML form elements with labels and errors or successes, if there are any
 */
class GenerateForm {

	/**
	 * Generated html form elements from array. Every element is generated into div.form-group and if corresponding error is defined, adds class success / error
	 * @param array $form
	 * @param array $errors - array('name' => 'error text', 'name2' => '') in this scenario, element name has error, name2 is OK, all others are undefined (no success/error)
	 * @return string
	 */
	public static function generate($form, $errors = array()) {

		$output = array();
		foreach ($form as $name => $element) {
			$validation_class = isset($errors[$name]) ? ($errors[$name] ? 'error' : 'success') : '';
			array_push($output, "<div class='form-group $validation_class'>");

			switch ($element['type']) {
				case 'checkbox': array_push($output, self::generateCheckbox($element)); break;
				case 'radio': array_push($output, self::generateRadio($element)); break;
				case 'submit': array_push($output, self::generateSubmit($element)); break;
				default: array_push($output, self::generateElement($element));
			}

			if ($validation_class == 'error') {
				array_push($output, "<small class='error'>{$errors[$name]}</small>");
			}
			if (isset($element['info'])) {
				array_push($output, "<small>{$element['info']}</small>");
			}

			array_push($output, "</div>");
		}

		return implode("", $output);
	}

	/**
	 * Generate checkbox
	 * @param $checkbox
	 * @return string
	 */
	public static function generateCheckbox($checkbox)
	{
		return "<div class='checkbox'>{$checkbox['element']} {$checkbox['label']}</div>";
	}

	/**
	 * Generate radios
	 * @param $element
	 * @return string
	 */
	public static function generateRadio($element)
	{
		$radios = array();
		foreach ($element['element'] as $radio) {
			array_push($radios, "<div class='radio'>{$radio['input']}{$radio['label']}</div>");
		}

		return "<span class='label'>{$element['label']}</span>" . implode("", $radios);
	}

	/**
	 * Generate submit button
	 * @param $submit
	 * @return mixed
	 */
	public static function generateSubmit($submit)
	{
		return $submit['element'];
	}

	/**
	 * Generate standard form element
	 * @param $element
	 * @return string
	 */
	public static function generateElement($element)
	{
		return "<span class='label'>{$element['label']}</span>{$element['element']}";
	}

}


?>