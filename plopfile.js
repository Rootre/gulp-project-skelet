const paths = {
	sass: 'assets/sass/',
	components: 'assets/sass/components/',
	modules: 'assets/js/footshop/',
	pages: 'assets/sass/pages/',
}

module.exports = function (plop) {

	plop.addHelper('dashAround', (text) => '---- ' + text + ' ----');
	plop.addHelper('upperCase', (text) => text.toUpperCase());
	plop.addHelper('lowerCase', (text) => text.toLowerCase());

	plop.setGenerator('comp', {
		description: 'Nova sass komponenta',
		prompts: [{
			type: 'input',
			name: 'component',
			message: 'Nazev komponenty:',
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'Nejak se jmenovat musi';
			}
		}],
		actions: [{
			type: 'add',
			path: `${paths.components}/{{component}}.scss`,
			templateFile: 'plop-templates/component.txt',
		},{
			type: 'modify',
			path: `${paths.sass}/site.scss`,
			pattern: /(\/\/#generated-components)/gi,
			template: `$1\n@import "components/{{component}}";`
		}]
	});
	plop.setGenerator('page', {
		description: 'Nova sass stranka',
		prompts: [{
			type: 'input',
			name: 'page',
			message: 'Nazev stranky:',
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'Nejak se jmenovat musi';
			}
		}],
		actions: [{
			type: 'add',
			path: `${paths.pages}/{{page}}.scss`,
			templateFile: 'plop-templates/page.txt',
		},{
			type: 'modify',
			path: `${paths.sass}/site.scss`,
			pattern: /(\/\/#generated-pages)/gi,
			template: `$1\n@import "pages/{{page}}";`
		}]
	});
	plop.setGenerator('module', {
		description: 'Novy js modul',
		prompts: [{
			type: 'input',
			name: 'module_name',
			message: 'Nazev modulu:',
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'Nejak se jmenovat musi';
			}
		}],
		actions: [{
			type: 'add',
			path: `${paths.modules}/{{module_name}}.js`,
			templateFile: 'plop-templates/js_module.txt',
		},{
			type: 'modify',
			path: `${paths.modules}/Footshop.js`,
			pattern: /(\/\*dynamic-modules\*\/)/gi,
			template: `$1\n\t\tthis.{{module_name}}.init();`
		}]
	});

};