/*!
 * jQuery Mobile Loader @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Loading Message
//>>group: Widgets
//>>description: Loading message for page transitions
//>>docs: http://api.jquerymobile.com/loader/
//>>demos: http://demos.jquerymobile.com/@VERSION/loader/
//>>css.structure: ../css/structure/jquery.mobile.core.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../helpers",
			"../defaults",
			"../widget" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

var html = $( "html" );

return $.widget( "mobile.loader", {
	version: "@VERSION",

	// NOTE if the global config settings are defined they will override these
	//      options
	options: {
		classes: {
			"ui-loader": "ui-corner-all",
			"ui-loader-icon": "ui-icon-loading"
		},

		enhanced: false,

		// the theme for the loading message
		theme: "a",

		// whether the text in the loading message is shown
		textVisible: false,

		// the text to be displayed when the popup is shown
		text: "loading"
	},

	_create: function() {
		this._ui = {};

		if ( this.options.enhanced ) {
			this._ui.span = this.element.children( "span" );
			this._ui.header = this.element.children( "h1" );
		} else {
			this._ui.span = $( "<span>" );
			this._ui.header = $( "<h1>" );
		}

		this._addClass( "ui-loader" );
		this._addClass( this._ui.span, "ui-loader-icon" );
		this._addClass( this._ui.header, "ui-loader-header" );

		if ( !this.options.enhanced ) {
			this.element
				.append( this._ui.span )
				.append( this._ui.header );
		}
	},

	// DEPRECATED as of 1.5.0 and will be removed in 1.6.0 - we no longer support browsers
	// incapable of native fixed support
	fakeFixLoader: $.noop,

	// DEPRECATED as of 1.5.0 and will be removed in 1.6.0 - we no longer support browsers
	// incapable of native fixed support
	checkLoaderPosition: $.noop,

	// Turn on/off page loading message. Theme doubles as an object argument
	// with the following shape: { theme: '', text: '', html: '', textVisible: '' }
	// NOTE that the $.mobile.loading* settings and params past the first are deprecated
	// TODO sweet jesus we need to break some of this out
	show: function( theme, msgText, textonly ) {
		var textVisible, message, loadSettings;

		// use the prototype options so that people can set them globally at
		// mobile init. Consistency, it's what's for dinner
		if ( $.type( theme ) === "object" ) {
			loadSettings = $.extend( {}, this.options, theme );

			theme = loadSettings.theme;
		} else {
			loadSettings = this.options;

			// here we prefer the theme value passed as a string argument, then
			// we prefer the global option because we can't use undefined default
			// prototype options, then the prototype option
			theme = theme || loadSettings.theme;
		}

		// set the message text, prefer the param, then the settings object
		// then loading message
		message = msgText || ( loadSettings.text === false ? "" : loadSettings.text );

		// prepare the dom
		this._addClass( html, "ui-loading" );

		textVisible = loadSettings.textVisible;

		// add the proper css given the options (theme, text, etc)
		// Force text visibility if the second argument was supplied, or
		// if the text was explicitly set in the object args
		this._removeClass( "ui-loader-verbose ui-loader-default ui-loader-textonly" )
			._addClass( "ui-loader-" +
			( textVisible || msgText || theme.text ? "verbose" : "default" ) +
			( loadSettings.textonly || textonly ? " ui-loader-textonly" : "" ),
				"ui-body-" + theme );

		this._ui.header.text( message );

		// If the pagecontainer widget has been defined we may use the :mobile-pagecontainer
		// and attach to the element on which the pagecontainer widget has been defined. If not,
		// we attach to the body.
		this.element.appendTo( $.mobile.pagecontainer ?
			$( ":mobile-pagecontainer" ) : $( "body" ) );
	},

	hide: function() {
		this._removeClass( html, "ui-loading" );
	}
} );

} );
