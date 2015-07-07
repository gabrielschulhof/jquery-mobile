/*!
 * jQuery Mobile Listview Backcompat @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Listview Backcompat
//>>group: Widgets
//>>description: Provides backwards compatibility for listview style options
//>>docs: http://api.jquerymobile.com/listview/
//>>demos: http://demos.jquerymobile.com/@VERSION/listview/
//>>css.structure: ../css/structure/jquery.mobile.listview.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./widget.backcompat",
			"./listview" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

if ( $.mobileBackcompat !== false ) {
	$.widget( "mobile.listview", $.mobile.listview, {

		options: {
			corners: true,
			shadow: true
		},

		classProp: "ui-listview"

	} );

	$.widget( "mobile.listview", $.mobile.listview, $.mobile.widget.backcompat );
}

return $.mobile.listview;

} );
