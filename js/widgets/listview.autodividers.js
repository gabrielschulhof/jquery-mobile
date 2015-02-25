//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Generates dividers for listview items
//>>label: Listview Autodividers
//>>group: Widgets
define( [ "jquery", "./listview" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

var dividerClassRegex = /\bui-listview-item-divider\b/;

function defaultAutodividersSelector( elt ) {
	// look for the text in the given element
	var text = $.trim( elt.text() ) || null;

	if ( !text ) {
		return null;
	}

	// create the text for the divider (first uppercased letter)
	text = text.slice( 0, 1 ).toUpperCase();

	return text;
}

$.widget( "mobile.listview", $.mobile.listview, {
	options: {
		autodividers: false,
		autodividersSelector: defaultAutodividersSelector
	},

	_beforeListviewRefresh: function() {
		if ( this.options.autodividers ) {
			this._replaceDividers();
		}
		return this._superApply( arguments );
	},

	_replaceDividers: function() {
		var i, item, dividerText,
			listItems = [],
			lastDividerText = null,
			list = this.element,
			divider;

		// Remove existing dividers and record remaining items
		this._getChildrenByTagName( list[ 0 ], "li", "LI" )
			.filter( function() {
				if ( this.className && this.className.match( dividerClassRegex ) ) {
					return true;
				}
				listItems.push( this );
			} )
			.remove();

		for ( i = 0; i < listItems.length ; i++ ) {
			item = listItems[ i ];
			dividerText = this.options.autodividersSelector( $( item ) );

			if ( dividerText && lastDividerText !== dividerText ) {
				divider = document.createElement( "li" );
				divider.appendChild( document.createTextNode( dividerText ) );
				divider.setAttribute( "data-" + $.mobile.ns + "role", "list-divider" );
				item.parentNode.insertBefore( divider, item );
			}

			lastDividerText = dividerText;
		}
	}
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
