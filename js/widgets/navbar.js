/*!
 * jQuery Mobile Navbar @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Navbars
//>>group: Widgets
//>>description: Formats groups of links as horizontal navigation bars.
//>>docs: http://api.jquerymobile.com/navbar/
//>>demos: http://demos.jquerymobile.com/@VERSION/navbar/
//>>css.structure: ../css/structure/jquery.mobile.navbar.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../widget",
			"../grid" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
})( function( $ ) {

return $.widget( "mobile.navbar", {
	version: "@VERSION",

	options: {
		classes: {},
		iconpos: "top",
		grid: null
	},

	_create: function() {

		var that = this,
			navbar = this.element,
			navbuttons = navbar.find( "a, button" ),
			iconpos = navbuttons.filter( ":jqmData(icon)" ).length ? this.options.iconpos : undefined;

		this._addClass( navbar, "ui-navbar" );
		navbar
			.attr( "role", "navigation" )
			.find( "ul" )
			.jqmEnhanceable()
			.grid({ grid: this.options.grid });

		navbuttons
			.each( function() {
				var icon = $.mobile.getAttribute( this, "icon" ),
					theme = $.mobile.getAttribute( this, "theme" ),
					classes = "ui-button";

				if ( theme ) {
					classes += " ui-button-" + theme;
				}
				if ( icon ) {
					classes += " ui-icon-" + icon + " ui-button-icon-" + iconpos;
				}
				that._addClass( $( this ), classes );
			});

		this._on( navbar, {
			"vclick a": function( event ) {
				var activeBtn = $( event.target ).closest( "a" );

				if ( !( activeBtn.hasClass( "ui-state-disabled" ) ||
					activeBtn.hasClass( "ui-button-active" ) ) ) {

					that._removeClass( navbuttons, null, "ui-button-active" );
					that._addClass( activeBtn, null, "ui-button-active" );

					// The code below is a workaround to fix #1181
					that.element.closest( ":mobile-pagecontainer" )
						.one( "pagecontainerhide", function( event, data ) {
							that._removeClass( activeBtn, null, "ui-button-active" );
						});
				}
			}
		});

		// Buttons in the navbar with ui-state-persist class should regain their active state before page show
		this._on( navbar.closest( ".ui-page" ), {
			pagebeforeshow: function() {
				that._addClass( navbuttons.filter( ".ui-state-persist" ), null, "ui-button-active" );
			}
		});
	}
});

});
