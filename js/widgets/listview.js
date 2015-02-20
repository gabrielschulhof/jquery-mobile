//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Applies listview styling of various types (standard, numbered, split button, etc.)
//>>label: Listview
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.listview.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

define( [ "jquery", "../widget", "./addFirstLastClasses" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

var getAttr = $.mobile.getAttribute;

$.widget( "mobile.listview", $.extend({

	options: {
		classes: {
			"ui-listview-inset": "ui-corner-all ui-shadow"
		},
		theme: null,
		dividerTheme: null,
		icon: "carat-r",
		splitIcon: "carat-r",
		splitTheme: null,
		enhanced: false
	},

	_create: function() {
		if ( !this.options.enhanced ) {
			this._enhance();
			this.refresh( true );
		}
	},

	_enhance: function() {
		this._addClass( this.element, "ui-listview" );
		if ( this.options.theme ) {
			this._addClass( this.element, null, "ui-group-theme-" + this.options.theme );
		}
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
		var buttonClass, pos, numli, item, itemClass, itemExtraClass, itemTheme, itemIcon, icon, a,
			isDivider, startCount, newStartCount, value, last, splittheme, splitThemeClass, spliticon,
			altButtonClass, dividerTheme, li, ol, start, itemClassDict, dictionaryKey, countBubbles,
			o = this.options,
			$list = this.element;

		if ( o.enhanced && create ) {
			return;
		}

		ol = !!$.nodeName( $list[ 0 ], "ol" );
		start = $list.attr( "start" );
		itemClassDict = {};

		// Check if a start attribute has been set while taking a value of 0 into account
		if ( ol && ( start || start === 0 ) ) {
			startCount = parseInt( start, 10 ) - 1;
			$list.css( "counter-reset", "listnumbering " + startCount );
		}

		this._beforeListviewRefresh();

		li = this._getChildrenByTagName( $list[ 0 ], "li", "LI" );

		countBubbles = li
			.children( "a" )
				.children( ".ui-listview-item-count-bubble" )
			.add( li.children( ".ui-listview-item-count-bubble" ) );

		for ( pos = 0, numli = li.length; pos < numli; pos++ ) {
			item = li.eq( pos );
			itemClass = "ui-listview-item";
			itemExtraClass = undefined;

			if ( create || item[ 0 ].className
					.search( /\bui-listview-item-static\b|\bui-listview-item-divider\b/ ) < 0 ) {
				a = this._getChildrenByTagName( item[ 0 ], "a", "A" );
				isDivider = ( getAttr( item[ 0 ], "role" ) === "list-divider" );
				value = item.attr( "value" );
				itemTheme = getAttr( item[ 0 ], "theme" );

				if ( a.length && a[ 0 ].className.search( /\bui-button\b/ ) < 0 && !isDivider ) {
					itemIcon = getAttr( item[ 0 ], "icon" );
					icon = ( itemIcon === false ) ? false : ( itemIcon || o.icon );

					buttonClass = "ui-button";

					if ( itemTheme ) {
						buttonClass += " ui-button-" + itemTheme;
					}

					if ( a.length > 1 ) {
						itemClass = "ui-listview-item-has-alternate";

						last = a.last();
						splittheme = getAttr( last[ 0 ], "theme" ) || o.splitTheme || getAttr( item[ 0 ], "theme", true );
						splitThemeClass = splittheme ? " ui-button-" + splittheme : "";
						spliticon = getAttr( last[ 0 ], "icon" ) || getAttr( item[ 0 ], "icon" ) || o.splitIcon;
						altButtonClass = "ui-button ui-button-icon-only ui-icon-" + spliticon + splitThemeClass;

						last
							.attr( "title", $.trim( last.getEncodedText() ) )
							.addClass( altButtonClass )
							.empty();

						// Reduce to the first anchor, because only the first gets the buttonClass
						a = a.first();
					} else if ( icon ) {
						buttonClass += " ui-icon-end ui-icon-" + icon;
					}

					// Apply buttonClass to the (first) anchor
					a.addClass( buttonClass );
				} else if ( isDivider ) {
					dividerTheme = ( getAttr( item[ 0 ], "theme" ) || o.dividerTheme || o.theme );

					itemClass = "ui-listview-item-divider";
					itemExtraClass = "ui-bar-" + ( dividerTheme ? dividerTheme : "inherit" );

					item.attr( "role", "heading" );
				} else if ( a.length <= 0 ) {
					itemClass = "ui-listview-item-static";
					itemExtraClass = "ui-body-" + ( itemTheme ? itemTheme : "inherit" );
				}
				if ( ol && value ) {
					newStartCount = parseInt( value , 10 ) - 1;

					item.css( "counter-reset", "listnumbering " + newStartCount );
				}
			}

			// Instead of setting item class directly on the list item
			// at this point in time, push the item into a dictionary
			// that tells us what class to set on it so we can do this after this
			// processing loop is finished.

			// Construct the dictionary key from the key class and the extra class
			dictionaryKey = [ itemClass ]
				.concat( itemExtraClass ? [ itemExtraClass ] : [] )
				.join( "|" );
			if ( !itemClassDict[ dictionaryKey ] ) {
				itemClassDict[ dictionaryKey ] = [];
			}
			itemClassDict[ dictionaryKey ].push( item[ 0 ] );
		}

		// Set the appropriate listview item classes on each list item.
		// The main reason we didn't do this
		// in the for-loop above is because we can eliminate per-item function overhead
		// by calling addClass() and children() once or twice afterwards. This
		// can give us a significant boost on platforms like WP7.5.

		for ( dictionaryKey in itemClassDict ) {

			// Split the dictionary key back into key classes and extra classes and construct the
			// _addClass() parameter list
			this._addClass.apply( this,
				[ $( itemClassDict[ dictionaryKey ] ) ]
					.concat( dictionaryKey.split( "|" ) ) );
		}

		this._addClass( countBubbles.closest( "li" ), "ui-listview-item-has-count" );

		this._afterListviewRefresh();

		this._addFirstLastClasses( li, this._getVisibles( li, create ), create );

		// Untrack removed items
		if ( this._oldListItems ) {
			this._removeClass(
				this._oldListItems.filter( function() {
					return ( $( this ).parent().length === 0 );
				} ),
				"ui-listview-item ui-listview-item-static ui-listview-item-has-count " +
				"ui-listview-item-has-alternate ui-listview-item-divider" );
			this._oldListItems = li;
		}
	}
}, $.mobile.behaviors.addFirstLastClasses ) );

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
