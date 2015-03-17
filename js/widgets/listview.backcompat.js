//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Enhances and consistently styles listviews.
//>>label: Listviews
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.listview.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./widget.theme",
			"./widget.backcompat",
			"./listview" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
})( function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

if ( $.mobileBackcompat !== false ) {
	$.widget( "mobile.listview", $.mobile.listview, {
		options: {
			corners: true,
			shadow: true,
			inset: false
		},
		classProp: "ui-listview-inset",
		_create: function() {
			if ( !this.options.enhanced && this.options.inset ) {
				this._addClass( this.element, "ui-listview-inset" );
			}

			return this._superApply( arguments );
		}
	} );
	$.widget( "mobile.listview", $.mobile.listview, $.mobile.widget.backcompat );
}

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
