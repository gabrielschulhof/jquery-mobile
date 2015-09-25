/*
 * mobile page unit tests
 */
define( [ "jquery", "./page.setup.js" ], function( $, container ) {

var libName = 'jquery.mobile.page',
	themedefault = $.mobile.page.prototype.options.theme;

module( libName );

test( "pagecreate event fires when page is created", function() {
	ok( container.eventStack[ 0 ] === "pagecreate" || container.eventStack[ 1 ] === "pagecreate" );
} );

test( "pagebeforecreate event fires when page is created", function() {
	ok( container.eventStack[ 0 ] === "pagebeforecreate" || container.eventStack[ 1 ] === "pagebeforecreate" );
} );

test( "pagebeforecreate fires before pagecreate", function() {
	ok( container.eventStack[ 0 ] === "pagebeforecreate" );
} );

test( "target of pagebeforecreate event was div #a", function() {
	ok( $( container.etargets[ 0 ] ).is( "#a" ) );
} );

test( "target of pagecreate event was div #a", function() {
	ok( $( container.etargets[ 0 ] ).is( "#a" ) );
} );

test( "page element has ui-page class", function() {
	ok( $( "#a" ).hasClass( "ui-page" ) );
} );

test( "page element has default page theme class when not overidden", function() {
	ok( $( "#a" ).hasClass( "ui-page-theme-" + themedefault ) );
} );

test( "setting option 'theme' on page updates classes correctly", function() {
	$( "#a" ).page( "option", "theme", "x" );
	deepEqual( $( "#a" ).hasClass( "ui-page-theme-x" ), true, "After setting option 'theme' to 'x', the page has the new theme class" );
	deepEqual( $( "#a" ).hasClass( "ui-page-theme-" + themedefault ), false, "After setting option 'theme', the page does not have default theme class" );
	$( "#a" ).page( "option", "theme", themedefault );
} );

test( "B page has non-default theme matching its data-theme attr", function() {
	$( "#b" ).page();
	var btheme = $( "#b" ).jqmData( "theme" );
	ok( $( "#b" ).hasClass( "ui-page-theme-" + btheme ) );
} );

test( "Binding to pagebeforecreate and returning false prevents pagecreate event from firing", function() {
	$( "#c" ).page();

	ok( container.cEvents[ 0 ] === "pagebeforecreate" );
	ok( !container.cTargets[ 1 ] );
} );

test( "Binding to pagebeforecreate and returning false prevents classes from being applied to page", function() {
	$( "#c" ).page();

	ok( !$( "#c" ).hasClass( "ui-body-" + themedefault ) );
	ok( !$( "#c" ).hasClass( "ui-page" ) );
} );


asyncTest( "page container is updated to page theme at pagebeforeshow", function(){
	expect( 1 );

	var pageTheme = "ui-overlay-" + $.mobile.activePage.page( "option", "theme" );

	$.mobile.pageContainer.removeClass( pageTheme );

	$.mobile.activePage
		.bind( "pagebeforeshow", function() {
			ok( $.mobile.pageContainer.hasClass( pageTheme ), "Page container has the same theme as the page on pagebeforeshow" );
			start();
		} )
		.trigger( "pagebeforeshow" );

} );

asyncTest( "page container is updated to page theme at pagebeforeshow", function() {

	expect( 1 );

	var pageTheme = "ui-overlay-" + $.mobile.activePage.page( "option", "theme" );

	$.mobile.pageContainer.addClass( pageTheme );

	$.mobile.activePage
		.bind( "pagebeforehide", function() {
			ok( !$.mobile.pageContainer.hasClass( pageTheme ), "Page container does not have the same theme as the page on pagebeforeshow" );
			start();
		} )
		.trigger( "pagebeforehide" );

} );

} );
