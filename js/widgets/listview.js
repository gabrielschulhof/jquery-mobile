/*!
 * jQuery Mobile Listview @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Listview
//>>group: Widgets
//>>description: Applies listview styling of various types (standard, numbered, split button, etc.)
//>>docs: http://api.jquerymobile.com/listview/
//>>demos: http://demos.jquerymobile.com/@VERSION/listview/
//>>css.structure: ../css/structure/jquery.mobile.listview.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../widget",
			"./addFirstLastClasses" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

var getAttr = $.mobile.getAttribute,
	staticOrDividerRe = /\bui-listview-item-static\b|\bui-listview-item-divider\b/,
	buttonClassRe = /\bui-button\b/

return $.widget( "mobile.listview", $.extend( {
	version: "@VERSION",

	options: {
		theme: "inherit",
		dividerTheme: "inherit",
		icon: "caret-r",
		splitIcon: "caret-r",
		splitTheme: "inherit",
		inset: false,
		enhanced: false
	},

	_create: function() {
		this._addClass( "ui-listview" + ( this.options.inset ? " ui-listview-inset" : "" ) );
		this.refresh( true );
	},

	_getChildrenByTagName: function( ele, lcName, ucName ) {
		var results = [],
			dict = {};
		dict[ lcName ] = dict[ ucName ] = true;
		ele = ele.firstChild;
		while ( ele ) {
			if ( dict[ ele.nodeName ] ) {
				results.push( ele );
			}
			ele = ele.nextSibling;
		}
		return $( results );
	},

	_beforeListviewRefresh: $.noop,
	_afterListviewRefresh: $.noop,

	refresh: function( create ) {
		var buttonClass, pos, numli, item, itemClass, itemClassKey, itemTheme, itemIcon, icon, a,
			isDivider, startCount, newStartCount, value, last, splittheme, splitThemeClass, spliticon,
			altButtonClass, dividerTheme, li, ol, start, itemClassDict, countBubbles,
			that = this,
			o = this.options,
			list = this.element;

		ol = !!$.nodeName( list[ 0 ], "ol" );
		start = list.attr( "start" );
		itemClassDict = {};
		countBubbles = list.find( ".ui-listview-item-count-bubble" );

		if ( o.theme ) {
			this._addClass( null, "ui-group-theme-" + o.theme );
		}

		// Check if a start attribute has been set while taking a value of 0 into account
		if ( ol && ( start || start === 0 ) ) {
			startCount = parseInt( start, 10 ) - 1;
			list.css( "counter-reset", "listnumbering " + startCount );
		}

		this._beforeListviewRefresh();

		li = this._getChildrenByTagName( list[ 0 ], "li", "LI" );

		for ( pos = 0, numli = li.length; pos < numli; pos++ ) {
			item = li.eq( pos );
			itemClass = "";
			itemClassKey = "";

			if ( create || item[ 0 ].className
					.search( staticOrDividerRe ) < 0 ) {
				a = this._getChildrenByTagName( item[ 0 ], "a", "A" );
				isDivider = ( getAttr( item[ 0 ], "role" ) === "list-divider" );
				value = item.attr( "value" );
				itemTheme = getAttr( item[ 0 ], "theme" );

				if ( a.length && a[ 0 ].className.search( buttonClassRe ) < 0 && !isDivider ) {
					itemIcon = getAttr( item[ 0 ], "icon" );
					icon = ( itemIcon === false ) ? false : ( itemIcon || o.icon );

					buttonClass = "ui-button";

					if ( itemTheme ) {
						buttonClass += " ui-button-" + itemTheme;
					}

					if ( a.length > 1 ) {
						itemClassKey = "ui-listview-item-has-alternate";

						last = a.last();
						splittheme = getAttr( last[ 0 ], "theme" ) || o.splitTheme || getAttr( item[ 0 ], "theme", true );
						splitThemeClass = splittheme ? " ui-button-" + splittheme : "";
						spliticon = getAttr( last[ 0 ], "icon" ) || getAttr( item[ 0 ], "icon" ) || o.splitIcon;
						altButtonClass = "ui-button ui-button-icon-only ui-icon-" + spliticon + splitThemeClass;

						last.attr( "title", $.trim( last.getEncodedText() ) ).empty();

						this._addClass( last, null, altButtonClass );

						// Reduce to the first anchor, because only the first gets the buttonClass
						a = a.first();
					} else if ( icon ) {
						buttonClass += " ui-icon-end ui-icon-" + icon;
					}

					// Apply buttonClass to the (first) anchor
					this._addClass( a, null, buttonClass );
				} else if ( isDivider ) {
					dividerTheme = ( getAttr( item[ 0 ], "theme" ) || o.dividerTheme || o.theme );

					itemClassKey = "ui-listview-item-divider";
					itemClass = "ui-bar-" + ( dividerTheme ? dividerTheme : "inherit" );

					item.attr( "role", "heading" );
				} else if ( a.length <= 0 ) {
					itemClassKey = "ui-listview-item-static";
					itemClass = "ui-body-" + ( itemTheme ? itemTheme : "inherit" );
				}
				if ( ol && value ) {
					newStartCount = parseInt( value, 10 ) - 1;

					item.css( "counter-reset", "listnumbering " + newStartCount );
				}
			}

			// Instead of setting item class directly on the list item
			// at this point in time, push the item into a dictionary
			// that tells us what class to set on it so we can do this after this
			// processing loop is finished.

			if ( !itemClassDict[ itemClassKey + "!" + itemClass ] ) {
				itemClassDict[ itemClassKey + "!" + itemClass ] = [];
			}

			itemClassDict[ itemClassKey + "!" + itemClass ].push( item[ 0 ] );
		}

		// Set the appropriate listview item classes on each list item.
		// The main reason we didn't do this
		// in the for-loop above is because we can eliminate per-item function overhead
		// by calling addClass() and children() once or twice afterwards. This
		// can give us a significant boost on platforms like WP7.5.

		for ( itemClass in itemClassDict ) {
			itemClassKey = itemClass.split( "!" );
			if ( itemClassKey[ 0 ] || itemClassKey[ 1 ] ) {
				this._addClass( $( itemClassDict[ itemClass ] ),
					( itemClassKey[ 0 ] ? itemClassKey[ 0 ] : null ),
					( itemClassKey[ 1 ] ? itemClassKey[ 1 ] : null ) );
			}
		}

		countBubbles.each( function() {
			that._addClass( $( this ).closest( "li" ), "ui-listview-item-has-count" );
		} );

		this._afterListviewRefresh();

		this._addFirstLastClasses( li, this._getVisibles( li, create ), create );
	}
}, $.mobile.behaviors.addFirstLastClasses ) );

} );
