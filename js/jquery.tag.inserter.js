(function () {
	/*jshint evil: true */
	// Insert a script tag pointing at the desired version of jQuery

		debugger;

	// Get the version from the url
	var jqueryRE = /[\\?&]jquery=([^&#]*)/,
		results = jqueryRE.exec( location.search ),
		version = "",
		myScriptTag = document.getElementsByTagName( "script" )[document.getElementsByTagName( "script" ).length - 1],
		baseUrl = myScriptTag.src.replace( /(.*)\/.*$/, "$1/" ),
		url = baseUrl + "../external/jquery/jquery.js",
		markup = "",
		script;

	if ( results ) {
		version = decodeURIComponent( results[results.length - 1].replace( /\+/g, " " ) );
		url = "http://code.jquery.com/jquery-" + version + ".js";
	}

	script = document.createElement( "script" );
	script.setAttribute( "src", url );
	script.setAttribute( "type", "text/javascript" );
	document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
/*
	markup =
		"\n\t<script src='" + url + "'></script>\n" +
		"\t<script type='text/javascript'>\n//<![CDATA[\n" +
			"\t\tif ( window.jQuery && parseInt( jQuery.fn.jquery.replace( /\\./g, '' ), 10 ) < 170 && window.define && window.define.amd ) {\n" +
			"\t\t\tdefine( 'jquery', [], function () { return jQuery; } );\n" +
			"\t\t}\n" +
			"//]]>\n\t</script>";

	document.getElementsByTagName( "head" )[ 0 ].innerHTML += markup;
*/
}());
