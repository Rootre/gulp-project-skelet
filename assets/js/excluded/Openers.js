Openers = {

	selector: '.opener',
	openClass: 'open',
	openFunction: 'fade',	// [slide, fade]

	init: function() {
		this.openers = [];

		var self = this;

		$(this.selector).each(function () { self._addOpener($(this)) });

		// $(document).on('click', this._bodyClick.bind(this));
		$(document).on('click.openers, touch.openers', function(e) { self._bodyClick(e) });
	},
	_addOpener: function ($node) {
		var targetsQuery = $node.data('target') ? $node.data('target') : $node[0].hash,
			$targets = $(targetsQuery),
			openClass = $node.data('open-class') || this.openClass,
			openFunction = $node.data('open-function') || this.openFunction,
			opened = !!$node.data('open') || false,
			tab = typeof $node.data('tab') == "undefined" ? false : $node.data('tab'),	//is it tab? if so, we store its name for other tabs to be closed on one's opening
			closeOnClick = typeof $node.data('close-on-click') == "undefined" ? !tab : !!$node.data('close-on-click'),	//do we want to close opened targets when clicked elsewhere?
			closeOnBlur = typeof $node.data('close-on-blur') == "undefined" ? !tab : !!$node.data('close-on-blur'),	//do we want to close opened targets when clicked elsewhere?
			self = this;


		if ($targets.length) {

			var opener = {
				$node: $node,
				$targets: $targets,
				targetsSelector: targetsQuery,
				openClass: openClass,
				opened: opened,
				openFunction: openFunction,
				tab: tab,
				closeOnBlur: closeOnBlur,
				closeOnClick: closeOnClick,
			};

			this.openers.push(opener);

			// $node.on('click', this._openerClick.bind(this));
			$node.on('click.opener', function(e){ self._openerClick(e, opener) });

			//close if opener not opened by default
			if (!opened) {
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
	_bodyClick: function (e) {
		var self = this;

		this.openers.forEach(function(opener) {
			// TODO: check parents and self also
			if (opener.opened && opener.closeOnBlur && !$(e.target).parents(opener.$targets.selector).length) {
				self._changeState(false, opener);
			}
		});
	},
	_changeState: function(open, opener, immediately) {
		if (open) {
			this._open(opener, immediately);
		}
		else {
			this._close(opener, immediately);
		}
		this._notifyOpenersOfStateChange(opener);
	},
	_close: function (opener, closeImmediately) {
		opener.$node.removeClass(opener.openClass).trigger('opener.closing', opener);
		opener.opened = false;
		if (closeImmediately) {
			opener.$targets.hide().trigger('opener.closed', opener);
		}
		else {
			this._animatrix(opener, false)
		}
	},
	_destroyOpeners: function() {
		this.openers.forEach(function(opener) {
			opener.$node.off('click.opener');
		});
		$(document).off('click.openers, touch.openers');
	},
	_notifyOpenersOfStateChange: function(changedOpener) {
		this.openers.forEach(function (opener) {
			if (opener.targetsSelector == changedOpener.targetsSelector && opener.opened != changedOpener.opened) {
				opener.opened = changedOpener.opened;
			}
		});
	},
	_openerClick: function (e, opener) {
		e.preventDefault();
		e.stopPropagation();	//we dont want to trigger _bodyClick function, because it would close opener immediately

		if (opener.opened) {
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
	_open: function (opener) {
		opener.$node.addClass(opener.openClass).trigger('opener.opening', opener);
		opener.opened = true;
		this._animatrix(opener, true);
	},
	closeActiveOpener: function($node) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.$node.is($node)) {
				self._changeState(false, opener);
			}
		});
	},
	closeActiveOpeners: function() {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.opened) {
				self._changeState(false, opener);
			}
		});
	},
	closeActiveTabs: function (tab) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.opened && opener.tab == tab) {
				self._changeState(false, opener, true);
			}
		});
	},
	openOpener: function($node) {
		var self = this;

		this.openers.forEach(function(opener) {
			if (opener.$node.is($node)) {
				self._changeState(true, opener);
			}
		});
	},
	recover: function () {
		this._destroyOpeners();
		this.init();
	},

};