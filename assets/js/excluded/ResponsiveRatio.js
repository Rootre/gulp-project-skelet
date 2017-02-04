ResponsiveRatio = {
	
	selector: '.responsive-ratio',
	
	init: function() {
		this.$nodes = $(this.selector);
		this.log = false;

		this.connect(this.$nodes);
	},
	/**
	 * @param $nodes
	 * @param config - { width }
	 * @private
	 */
	connect: function($nodes, config) {
		var self = this;

		$nodes.each(function() {
			this.rr = {};
			this.rr.ratio = parseFloat(eval($(this).data('ratio'))) || $(this).width() / $(this).height();
			if (config) {
				this.rr.width = config.width ? config.width : $(this).data('width');
				this.rr.ratio = config.ratio ? config.ratio : this.rr.ratio;
			}
			self._log('Setting ratio', this.rr.ratio, this);
		});

		this._keepRatio($nodes);

		$(window).on({
			resize: function() { self._keepRatio($nodes) }
		})
	},
	_keepRatio: function($nodes) {
		var self = this;

		$nodes.each(function() {
			if (!this.rr.ratio) {
				self._log('No ratio is set', $(this));
			}
			else {
				var height;

				if (this.rr.width) {
					$(this).width(this.rr.width);
				}

				if ($(this).is(':visible')) {
					height = Math.round($(this).width() / this.rr.ratio);
				}
				else {
					var $hiddenParents = $(this).parents().andSelf().not(':visible');
					$hiddenParents.each(function() { $(this).css({ visibility: 'hidden', display: 'block' }) });
					height = Math.round($(this).width() / this.rr.ratio);
					//TODO: save previous state of elements instead of resetting the value
					$hiddenParents.each(function() { $(this).css({ visibility: '', display: '' }) });
				}

				$(this).height(height);
				self._log('Setting height from width', $(this).width(), this.rr.ratio, this);
			}
		})
	},
	_log: function() {
		if (this.log) {
			console.log(Array.prototype.slice.call(arguments));
		}
	}
	
};