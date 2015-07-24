( function() {

	define( "jquery-no-backcompat", [ "jquery" ], function( $ ) {
		$.mobileBackcompat = false;
		return $;
	} );

	define( "jquery-set-ns", [ "jquery" ], function( $ ) {
		$( document ).bind( "mobileinit", function() {
			$.mobile.ns = "nstest-";
			$.support.inlineSVG = $.noop;
		});

		return $;
	} );

	function requireModules( dependencies, callback, modules ) {
		if ( dependencies.length == 1 ) {

			$( document ).ready( function() {
				var $fixture = $( '#qunit-fixture' );
				if ( $fixture.length ) {
					QUnit.config.fixture = $fixture.html();
				}
				QUnit.start();
			} );
		}

		if ( !dependencies.length ) {
			if ( callback ) {
				callback.apply( null, modules );
			}
		}

		if ( !modules ) {
			modules = [];
		}

		var dependency = dependencies.shift();
		require( [ dependency ], function( module ) {
			modules.push( module );
			requireModules( dependencies, callback, modules );
		} );
	}

	// Load a set of test file along with the required test infrastructure
	function requireTests( dependencies ) {
		requireModules( dependencies, function( QUnit ) {
			// QUnit.start();
		} );
	}

	// Load test modules based on data attributes
	(function() {
		QUnit.config.autostart = false;

		var scripts = document.getElementsByTagName( "script" );
		var script = scripts[ scripts.length - 1 ];

		var deps = script.getAttribute( "data-deps" );

		if ( deps ) {
			deps = deps.replace( /^\s+|\s+$/g, "" ).split( /\s+/ );
		} else {
			deps = [];
		}

		var init = !!script.getAttribute( "data-init" );
		var noBackCompat = !!script.getAttribute( "data-no-backcompat" );
		var baseUrl = script.getAttribute( "data-base-url" );
		var main = script.getAttribute( "data-main" );

		if ( init ) {
			deps = deps.concat( [ "init" ] );

			if ( noBackCompat ) {
				deps = deps.concat( [ "jquery-no-backcompat" ] );
			} else {
				deps = deps.concat( [ "jquery-set-ns", "widget/widget.backcompat" ] );
			}
		}

		if ( main ) {
			deps = deps.concat( main );
		}

		require( {
			baseUrl: baseUrl || "../../../js"
		} );

		requireTests( deps )

	} )();

} )();
