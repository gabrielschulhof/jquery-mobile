$.mobile.ns = "nstest-";

test( "Columntoggle table with generated id works correctly", function() {
	var container = $( "#generated-id-test-container" ),
		link = container.find( "a:first" ),
		linkId = link.attr( "id" ),
		popupId = ( linkId || "" ).replace( /-button$/, "-popup" ),
		popup = $( "#" + popupId + ":data('mobilePopup')" );

	deepEqual( !!linkId, true, "Anchor has an ID" );
	deepEqual( link.attr( "href" ), "#" + popupId,
		"Anchor's href points to an element with an ID sharing the link ID's prefix, but -popup" );
	deepEqual( popup.length, 1,
		"There is exactly one element enhanced as a popup with the id to which the anchor links" );
});
