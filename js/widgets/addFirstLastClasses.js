/*!
 * jQuery Mobile First And Last Classes @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: First & Last Classes
//>>group: Widgets
//>>description: Behavior mixin to mark first and last visible item with special classes.

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../core" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

var uiScreenHiddenRegex = /\bui-screen-hidden\b/;
function noHiddenClass( elements ) {
	var index,
		length = elements.length,
		result = [];

	for ( index = 0; index < length; index++ ) {
		if ( !elements[ index ].className.match( uiScreenHiddenRegex ) ) {
			result.push( elements[ index ] );
		}
	}

	return $( result );
}

$.mobile.behaviors.addFirstLastClasses = {
	_getVisibles: function( els, create ) {
		var visibles;

		if ( create ) {
			visibles = noHiddenClass( els );
		} else {
			visibles = els.filter( ":visible" );
			if ( visibles.length === 0 ) {
				visibles = noHiddenClass( els );
			}
		}

		return visibles;
	},

	_addFirstLastClasses: function( els, visibles, create ) {
		this._removeClass( els, null, "ui-first-child ui-last-child" );
		this._addClass( visibles.eq( 0 ), null, "ui-first-child" );
		this._addClass( visibles.last(), null, "ui-last-child" );
		if ( !create ) {
			this.element.trigger( "updatelayout" );
		}
	},

	_removeFirstLastClasses: function( els ) {
		this._removeClass( els, null, "ui-first-child ui-last-child" );
	}
};

return $.mobile.behaviors.addFirstLastClasses;

} );
