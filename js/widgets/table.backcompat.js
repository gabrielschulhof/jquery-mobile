/*!
 * jQuery Mobile Table Backcompat @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Table Backcompat
//>>group: Widgets
//>>description: Backwards compatibility of the table widget

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./table",
			"./widget.classes.backcompat" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

if ( $.mobileBackcompat !== false ) {
	$.widget( "mobile.table", $.mobile.table, $.extend( {
		options: {
			classes: {
				table: "ui-table"
			}
		},
		_classKeyMap: function() {
			return {
				"ui-table": "table"
			};
		}
	}, $.mobile.widget.classesBackcompat ) );
}

return $.mobile.table;

} );
