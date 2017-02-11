/**
 * Simple module for opening/closing content. Can be used for simple show of content, a popup or tabs.
 * All of the config properties can be overriden via data-attributes (with camel case converted into hyphens)
 * We can also pass config object, if we want to initialize opener programmatically.
 * Nodes with selector .opener is processed and becomes a trigger for opening/closing opener's content (target). Content itself is targeted via data-target attribute or hash inside hrefattribute, if trigger is an <a> element
 * One trigger can have multiple targets and one target can have multiple triggers.
 * We can specify openFunction for target animation
 * closeOnClick is for closing opener when clicked on trigger
 * closeOnBlur is for closing opener when clicked anywhere but a target
 * tabs are defined by name, and all triggers with the same tab value are tabs of one 'family'
 * tabs act differently, by default they cannot be closed on blur or click (unlike default values in config)
 *
 * @type {{selector: string, config: {open: boolean, openClass: string, openFunction: string, tab: boolean, closeOnClick: boolean, closeOnBlur: boolean}, init: Footshop.Openers.init, addOpener: Footshop.Openers.addOpener, closeActiveOpener: Footshop.Openers.closeActiveOpener, closeActiveOpeners: Footshop.Openers.closeActiveOpeners, closeActiveTabs: Footshop.Openers.closeActiveTabs, openOpener: Footshop.Openers.openOpener, recover: Footshop.Openers.recover, _getConfigFromDataAttributes: Footshop.Openers._getConfigFromDataAttributes, _animatrix: Footshop.Openers._animatrix, _bodyClick: Footshop.Openers._bodyClick, _changeState: Footshop.Openers._changeState, _close: Footshop.Openers._close, _closeHandling: Footshop.Openers._closeHandling, _destroyOpeners: Footshop.Openers._destroyOpeners, _notifyOpenersOfStateChange: Footshop.Openers._notifyOpenersOfStateChange, _openerClick: Footshop.Openers._openerClick, _open: Footshop.Openers._open}}
 */
Openers = {

	selector: '.opener',
	config: {
		open: false,
		openClass: 'open',
		openFunction: 'fade',	// [slide, fade]
		tab: false,
		closeOnClick: true,
		closeOnBlur: true,
	},
	/**
	 * Initialize openers
	 * @param config
	 */
	init: function(config) {
		this.openers = [];

		var self = this;

		this._closeHandling();

		$(this.selector).each(function () { self.addOpener($(this), config) });
	},
	/**
	 * Register Opener as an jQuery element, which functions as a trigger for opening/closing Opener's content
	 * @param $node - jQuery object, a trigger
	 * @param config - custom config object
	 */
	addOpener: function ($node, config) {
		var targetsQuery = $node.data('target') ? $node.data('target') : $node[0].hash,
			$targets = $(targetsQuery);

		if ($targets.length) {

			var self = this,
				opener = $.extend(true, {}, this.config),
				openerConfig = {
					$node: $node,
					$targets: $targets,
					targetsSelector: targetsQuery,
				},
				dataAttributesConfig = this._getConfigFromDataAttributes($node, this.config);

			$.extend(opener, config, dataAttributesConfig, openerConfig);

			// sets special behavior for tab opener if not defined (tab cannost be closed on click or blur)
			if (opener.tab) {
				if (typeof dataAttributesConfig.closeOnClick === 'undefined' && (!config || typeof config.closeOnClick === 'undefined')) {
					opener.closeOnClick = false;
				}
				if (typeof dataAttributesConfig.closeOnBlur === 'undefined' && (!config || typeof config.closeOnBlur === 'undefined')) {
					opener.closeOnBlur = false;
				}
			}

			this.openers.push(opener);

			// $node.on('click', this._openerClick.bind(this));
			$node.on('click.opener, touchend.opener', function(e){ self._openerClick(e, opener) });

			//close if opener not opened by default
			if (!opener.open) {
				this._changeState(false, opener, true);
			}
			else {
				this._changeState(true, opener);
			}

		}
		else {
			console.log('Opener doesn\'t have any targets', $node);
		}
	},
	/**
	 * Closes opener
	 * @param $node - jQuery trigger
	 */
	closeActiveOpener: function($node) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.$node.is($node)) {
				self._changeState(false, opener);
			}
		});
	},
	/**
	 * Closes all active openers
	 */
	closeActiveOpeners: function() {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.open) {
				self._changeState(false, opener);
			}
		});
	},
	/**
	 * Close all active tabs of a single set
	 * @param tab
	 */
	closeActiveTabs: function (tab) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.open && opener.tab == tab) {
				self._changeState(false, opener, true);
			}
		});
	},
	/**
	 * Opens opener
	 * @param $node - jQuerx trigger
	 */
	openOpener: function($node) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.$node.is($node)) {
				self._changeState(true, opener);
			}
		});
	},
	/**
	 * Refreshes openers, refreshes event listeners
	 */
	recover: function () {
		this._destroyOpeners();
		this.init();
	},
	/**
	 * Search given element for config keys defined as data-attributes. Camel case in config keys is transformed into hyphens
	 * @param $node
	 * @param config
	 * @returns {{}}
	 * @private
	 */
	_getConfigFromDataAttributes: function ($node, config) {
		var output = {};
		Object.keys(config).forEach(function(key) {
			var data = $node.data(convertCamelToDash(key));
			if (data) {
				output[key] = data;
			}
		});

		return output;

		function convertCamelToDash(string) {
			return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		}
	},
	/**
	 * Animates given opener according to its open property (shows or hides it) and triggers openers events
	 * @param opener
	 * @param open
	 * @private
	 */
	_animatrix: function(opener, open) {
		var triggers = function(){
			if (open) {
				opener.$node.trigger('opener.opened', opener);
				opener.$targets.trigger('opener.opened', opener);
			}
			else {
				opener.$node.trigger('opener.closed', opener);
				opener.$targets.trigger('opener.closed', opener);
			}
		};

		switch (opener.openFunction) {
			case 'slide':
				open ? opener.$targets.slideDown(triggers) : opener.$targets.slideUp(triggers);
				break;
			default:
				open ? opener.$targets.fadeIn(triggers) : opener.$targets.fadeOut(triggers);
		}
	},
	/**
	 * Function to call if user clicked anywhere but active opener's content. This closes all active openers
	 * @param e
	 * @private
	 */
	_bodyClick: function (e) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.open && opener.closeOnBlur && !$(e.target).parents(opener.$targets.selector).length) {
				self._changeState(false, opener);
			}
		});
	},
	/**
	 * Change state of opener
	 * @param open
	 * @param opener
	 * @param immediately
	 * @private
	 */
	_changeState: function(open, opener, immediately) {
		if (open) {
			this._open(opener, immediately);
		}
		else {
			this._close(opener, immediately);
		}
		this._notifyOpenersOfStateChange(opener);
	},
	/**
	 * Close opener
	 * @param opener
	 * @param immediately
	 * @private
	 */
	_close: function (opener, immediately) {
		opener.$node.removeClass(opener.openClass).trigger('opener.closing', opener);
		opener.open = false;
		if (immediately) {
			opener.$targets.hide().trigger('opener.closed', opener);
		}
		else {
			this._animatrix(opener, false)
		}
	},
	/**
	 * Handles closing opened Openers when user click/touch screen elsewhere
	 * @private
	 */
	_closeHandling: function () {
		var self = this,
			touchClick = false;
		$(document).on({
			'click.openers': function(e) { self._bodyClick(e) },
			'touchend.openers': function(e) {
				if (touchClick) {
					self._bodyClick(e);
					touchClick = false;
				}
			},
			'touchstart.openers': function() { touchClick = true; },
			'touchmove.openers': function() { touchClick = false; },
		});
	},
	/**
	 * Destroys events for all openers
	 * @private
	 */
	_destroyOpeners: function() {
		this.openers.forEach(function(opener) {
			opener.$node.off('click.opener, touchend.opener');
		});
		$(document).off('click.openers, touchstart.openers, touchmove.openers, touchend.openers');
	},
	/**
	 * If there is more than one trigger for opener content, then when one is triggered, others are set to be changed the same way (opened, closed)
	 * @param changedOpener
	 * @private
	 */
	_notifyOpenersOfStateChange: function(changedOpener) {
		this.openers.forEach(function (opener) {
			if (opener.targetsSelector == changedOpener.targetsSelector && opener.open != changedOpener.open) {
				opener.open = changedOpener.open;
			}
		});
	},
	/**
	 * When clicked on opener's trigger
	 * @param e
	 * @param opener
	 * @private
	 */
	_openerClick: function (e, opener) {
		e.preventDefault();
		e.stopPropagation();	//we dont want to trigger _bodyClick function, because it would close opener immediately

		if (opener.open) {
			if (opener.closeOnClick) {
				this._changeState(false, opener);
			}
		}
		else {
			if (opener.tab) {
				this.closeActiveTabs(opener.tab);
			}
			this._changeState(true, opener);
		}
	},
	/**
	 * Opens an opener
	 * @param opener
	 * @param immediately
	 * @private
	 */
	_open: function (opener, immediately) {
		opener.$node.addClass(opener.openClass).trigger('opener.opening', opener);
		opener.open = true;
		if (immediately) {
			opener.$targets.show().trigger('opener.opened', opener);
		}
		else {
			this._animatrix(opener, true)
		}
	},

};