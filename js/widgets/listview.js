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

$.widget( "mobile.listview", $.extend( {

	options: {
		theme: null,
		dividerTheme: null,
		icon: "carat-r",
		splitIcon: "carat-r",
		splitTheme: null,
		corners: true,
		shadow: true,
		inset: false,
		enhanced: false
	},

	_create: function() {
		var t = this,
			o = t.options,
			listviewClasses = "";

		if ( !o.enhanced ) {
			listviewClasses += o.inset ? " ui-listview-inset" : "";

			if ( !!o.inset ) {
				listviewClasses += o.corners ? " ui-corner-all" : "";
				listviewClasses += o.shadow ? " ui-shadow" : "";
			}

			// create listview markup
			t.element.addClass( " ui-listview" + listviewClasses );
		}
		t.refresh( true );
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
		var buttonClass, pos, numli, item, itemClass, itemTheme, itemIcon, icon, a,
			isDivider, startCount, newStartCount, value, last, splittheme, splitThemeClass, spliticon,
			altButtonClass, dividerTheme, li, ol, start, itemClassDict, countBubbles,
			o = this.options,
			$list = this.element;

		if ( o.enhanced && create ) {
			return;
		}

		ol = !!$.nodeName( $list[ 0 ], "ol" );
		start = $list.attr( "start" );
		itemClassDict = {};
		countBubbles = $list.find( ".ui-li-count" );

		if ( o.theme ) {
			$list.addClass( "ui-group-theme-" + o.theme );
		}

		// Check if a start attribute has been set while taking a value of 0 into account
		if ( ol && ( start || start === 0 ) ) {
			startCount = parseInt( start, 10 ) - 1;
			$list.css( "counter-reset", "listnumbering " + startCount );
		}

		this._beforeListviewRefresh();

		li = this._getChildrenByTagName( $list[ 0 ], "li", "LI" );

		for ( pos = 0, numli = li.length; pos < numli; pos++ ) {
			item = li.eq( pos );
			itemClass = "";

			if ( create || item[ 0 ].className.search( /\bui-li-static\b|\bui-li-divider\b/ ) < 0 ) {
				a = this._getChildrenByTagName( item[ 0 ], "a", "A" );
				isDivider = ( getAttr( item[ 0 ], "role" ) === "list-divider" );
				value = item.attr( "value" );
				itemTheme = getAttr( item[ 0 ], "theme" );

				if ( a.length && a[ 0 ].className.search( /\bui-button\b/ ) < 0 && !isDivider ) {
					itemIcon = getAttr( item[ 0 ], "icon" );
					icon = ( itemIcon === false ) ? false : ( itemIcon || o.icon );

					// TODO: Remove in 1.5 together with links.js (links.js / .ui-link deprecated in 1.4)
					a.removeClass( "ui-link" );

					buttonClass = "ui-button";

					if ( itemTheme ) {
						buttonClass += " ui-button-" + itemTheme;
					}

					if ( a.length > 1 ) {
						itemClass = "ui-li-has-alt";

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

					itemClass = "ui-li-divider ui-bar-" + ( dividerTheme ? dividerTheme : "inherit" );

					item.attr( "role", "heading" );
				} else if ( a.length <= 0 ) {
					itemClass = "ui-li-static ui-body-" + ( itemTheme ? itemTheme : "inherit" );
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

			if ( !itemClassDict[ itemClass ] ) {
				itemClassDict[ itemClass ] = [];
			}

			itemClassDict[ itemClass ].push( item[ 0 ] );
		}

		// Set the appropriate listview item classes on each list item.
		// The main reason we didn't do this
		// in the for-loop above is because we can eliminate per-item function overhead
		// by calling addClass() and children() once or twice afterwards. This
		// can give us a significant boost on platforms like WP7.5.

		for ( itemClass in itemClassDict ) {
			$( itemClassDict[ itemClass ] ).addClass( itemClass );
		}

		countBubbles.each( function() {
			$( this ).closest( "li" ).addClass( "ui-li-has-count" );
		});

		this._afterListviewRefresh();

		this._addFirstLastClasses( li, this._getVisibles( li, create ), create );
	}
}, $.mobile.behaviors.addFirstLastClasses ) );

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
