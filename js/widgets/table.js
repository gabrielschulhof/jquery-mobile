/*!
 * jQuery Mobile Table @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Table
//>>group: Widgets
//>>description: Responsive presentation and behavior for HTML data tables
//>>docs: http://api.jquerymobile.com/table/
//>>css.structure: ../css/structure/jquery.mobile.table.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../widget" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

return $.widget( "mobile.table", {
	version: "@VERSION",

	options: {
		enhanced: false
	},

	_create: function() {

		this._establishStructure();
		this._setAttributes();
		this._attachToDOM();
		this._addHandlers();
	},

	_establishStructure: function() {
		var trs = this.element.find( "thead tr" );

		this.trs = trs;
		this.headers = this.element.find( "tr:eq(0)" ).children();
		this.allHeaders = this.headers.add( trs.children() );
	},

	_setAttributes: function() {
		this._addClass( "ui-table" );

		// Iterate over the trs
		this.trs.each( function() {
			var columnCount = 0;

			// Iterate over the children of the tr
			$( this ).children().each( function() {
				var span = parseInt( this.getAttribute( "colspan" ), 10 ),
					selector = ":nth-child(" + ( columnCount + 1 ) + ")",
					j;

				this.setAttribute( "data-" + $.mobile.ns + "colstart", columnCount + 1 );

				if ( span ) {
					for ( j = 0; j < span - 1; j++ ) {
						columnCount++;
						selector += ", :nth-child(" + ( columnCount + 1 ) + ")";
					}
				}

				// Store "cells" data on header as a reference to all cells in the
				// same column as this TH
				$( this ).jqmData( "cells",
					table.find( "tr" ).not( trs.eq( 0 ) ).not( this ).children( selector ) );

				columnCount++;
			} );
		} );
	},

	_attachToDOM: $.noop,
	_addHandlers: $.noop
} );

} );
