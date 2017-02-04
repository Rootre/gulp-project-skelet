/**
 * This module works alongside with css table transformation, as every cell on mobile is a row with caption
 * Caption is set via this module, either specified in data-title on specific table cell or taken from thead
 *
 * @type {{selector: string, init: Footshop.ResponsiveTables.init, _initResponsiveTable: Footshop.ResponsiveTables._initResponsiveTable}}
 */
ResponsiveTables = {
	
	selector: 'table.table-responsive',

	init: function() {
		
		var self = this;
		
		$(this.selector).each(function() {
			self._initResponsiveTable($(this));
		});
		
	},
	/**
	 * Sets data-titles for every row
	 * @param $table
	 * @private
	 */
	_initResponsiveTable: function ($table) {
		
		var labels = [];
		$table.find('thead th').each(function(){
			labels.push($(this).text());
		});

		$table.find('tbody tr').each(function(){
			$(this).children().each(function(i){
				if (!$(this).attr('data-title')) {
					$(this).attr('data-title', labels[i]);
				}
			});
		});
	}

};