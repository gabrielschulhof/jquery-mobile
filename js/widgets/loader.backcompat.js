/*!
 * jQuery Mobile Loader Backcompat @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Loading Message Backcompat
//>>group: Widgets
//>>description: The backwards compatible portions of the loader widget

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./loader" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

if ( $.mobileBackcompat !== false ) {
	$.widget( "mobile.loader", $.mobile.loader, {
		options: {

			// custom html for the inner content of the loading message
			html: ""
		},
		defaultHtml: "<div>" +
			"<span class='ui-icon-loading'></span>" +
			"<h1></h1>" +
			"</div>",

		show: function( theme ) {
			var html;

			this._superApply( arguments );

			html = ( $.type( theme ) === "object" && theme.html || this.options.html );

			// TODO verify that jquery.fn.html is ok to use in both cases here
			//      this might be overly defensive in preventing unknowing xss
			// if the html attribute is defined on the loading settings, use that
			// otherwise use the fallbacks from above
			if ( html ) {
				this.element.html( html );
			}
		},

		resetHtml: function() {
			this.element.html( $( this.defaultHtml ).html() );
		}
	} );
}

return $.mobile.loader;

} );
