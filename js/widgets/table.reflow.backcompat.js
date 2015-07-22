/*!
 * jQuery Mobile Reflow Table Backcompat @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Reflow Table Backcompat
//>>group: Widgets
//>>description: Backwards compatibility of the table widget

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./table.backcompat" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

if ( $.mobileBackcompat !== false ) {
	$.widget( "mobile.table", $.mobile.table, {
		options: {
			classes: {
				reflowTable: "ui-table-reflow",
				cellLabels: "ui-table-cell-label"
			}
		},
		_classKeyMap: function() {
			return $.extend( this._superApply( arguments ), {
				"ui-table-reflow": "reflowTable",
				"ui-table-cell-label": "cellLabels"
			} );
		}
	} );
}

return $.mobile.table;

} );
