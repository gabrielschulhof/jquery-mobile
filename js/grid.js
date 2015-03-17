//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Applies classes for creating grid or column styling.
//>>label: Grid Layouts (Columns)
//>>group: Widgets
//>>css.structure:../css/structure/jquery.mobile.grid.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

define( [ "jquery" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$.fn.grid = function( options ) {
	return this.each(function() {

		var $this = $( this ),
			o = $.extend({
				grid: null
			}, options ),
			$kids = $this.children().not( "script" ),
			gridCols = { solo:1, a:2, b:3, c:4, d:5 },
			blockIds = [ "a", "b", "c", "d", "e" ],
			grid = o.grid,
			iterator,
			letter;

			if ( !grid ) {
				if ( $kids.length <= 5 ) {
					for ( letter in gridCols ) {
						if ( gridCols[ letter ] === $kids.length ) {
							grid = letter;
						}
					}
				} else {
					grid = "a";
					$this.addClass( "ui-grid-duo" );
				}
			}
			iterator = gridCols[grid];

		$this.addClass( "ui-grid-" + grid );

		$kids.each( function( index, element ) {
			$( element ).addClass( "ui-block-" + ( blockIds[ index % iterator ] ) );
		} );
	});
};
})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
