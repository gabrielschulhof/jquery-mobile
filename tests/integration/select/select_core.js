/*
 * mobile select unit tests
 */

(function($){
	var libName = "forms.select",
		originalDefTransitionHandler = $.mobile.defaultTransitionHandler.prototype.transition,
		originalGetEncodedText = $.fn.getEncodedText,
		resetHash, closeDialog;

	resetHash = function(timeout){
		$.testHelper.openPage( location.hash.indexOf("#default") >= 0 ? "#" : "#default" );
	};

	closeDialog = function(timeout){
		$.mobile.activePage.find("li a").first().click();
	};

	var homeWithSearch = $.mobile.path.parseUrl(location.pathname).pathname + location.search;

	test( "No tags are accidentally injected during list building", function() {
		deepEqual( $( "#encoding-test-menu > li:first-child > a > script" ).length, 0,
			"No script tag has ended up inside the anchor" );
	});

	module(libName, {
		setup: function() {
			$.mobile.navigate.history.stack = [];
			$.mobile.navigate.history.activeIndex = 0;
			$.testHelper.navReset( homeWithSearch );
		},

		teardown: function(){
			$.mobile.defaultTransitionHandler.prototype.transition = originalDefTransitionHandler;

			$.fn.getEncodedText = originalGetEncodedText;
			window.encodedValueIsDefined = undefined;
		}
	});

	asyncTest( "placeholder correctly gets ui-screen-hidden class after rebuilding", function() {
		$.testHelper.sequence( [
			function() {
				// bring up the optgroup menu
				ok( $( "#optgroup-and-placeholder-container a" ).length > 0, "there is in fact a button in the page" );
				$( "#optgroup-and-placeholder-container a" ).trigger( "click" );
			},

			function() {
				//select the first menu item
				$( "#optgroup-and-placeholder-menu li:not(.ui-screen-hidden) a:first" ).click();
			},

			function() {
				ok( $( "#optgroup-and-placeholder-menu li:first" ).hasClass( "ui-screen-hidden" ), "the placeholder item has the ui-screen-hidden class" );
				start();
			}
		], 1000);
	});

	asyncTest( "firing a click at least 400 ms later on the select screen overlay does close it", function(){
		expect( 3 );

		var prefix = ".firingAClick";
		$.testHelper.detailedEventCascade([
			function(){
				// bring up the smaller choice menu
				ok($("#select-choice-few-container a").length > 0, "there is in fact a button in the page");
				$("#select-choice-few-container a").trigger("click");
			},

			{
				popupafteropen: { src: $( "#select-choice-few\\.dotTest-listbox" ), event: "popupafteropen" + prefix },
				timeout: { length: 1000 }
			},

			function( result ){
				deepEqual( result.popupafteropen.timedOut, false, "Did receive 'popupafteropen'" );
				//select the first menu item
				$("#select-choice-few\\.dotTest-menu a:first").click();
			},

			{
				timeout: { length: 1000 }
			},

			function(){
				deepEqual($("#select-choice-few\\.dotTest-menu").parent().parent(".ui-popup-hidden").length, 1);
				start();
			}
		]);
	});

	asyncTest( "selecting an item from a dialog sized custom select menu leaves no dialog hash key", function(){
		var historyIndex;

		$.testHelper.pageSequence([
			resetHash,

			function(timeout){
				$("#select-choice-many-container-hash-check a").click();
			},

			function(){
				deepEqual( $.mobile.navigate.history.getActive().transientLocation, true,
					"History entry for dialog is transient" );
				historyIndex = $.mobile.navigate.history.activeIndex;
				closeDialog();
			},

			function(){
				deepEqual( $.mobile.navigate.history.activeIndex, historyIndex - 1,
					"Closing the dialog has moved history back by one" );
				deepEqual( !!$.mobile.navigate.history.getActive().transientLocation, false,
					"History entry for page is not transient" );
				start();
			}
		]);
	});

	asyncTest( "dialog sized select menu opened many times remains a dialog", function(){
		var openDialogSequence = [
			resetHash,

			function(){
				$("#select-choice-many-container-many-clicks a").click();
			},

			function(){
				deepEqual( $.mobile.navigate.history.getActive().transientLocation, true,
					"Current history entry marked transient");
				closeDialog();
			}
		],

				sequence = openDialogSequence.concat(openDialogSequence).concat([start]);

		$.testHelper.sequence(sequence, 1000);
	});

	module("Non native menus", {
		setup: function() {
			$.mobile.selectmenu.prototype.options.nativeMenu = false;
		},
		teardown: function() {
			$.mobile.selectmenu.prototype.options.nativeMenu = true;
		}
	});

	asyncTest( "a large select option should not overflow", function() {
		// https://github.com/jquery/jquery-mobile/issues/1338
		var menu;

		$.testHelper.sequence( [
			resetHash,

			function() {
				// bring up the dialog
				$( "#select-long-option-label" ).siblings( "a" ).trigger( "click" );
			},

			function() {
				menu = $( "#select-long-option-label-menu.ui-selectmenu-list" );

				equal( menu.outerWidth( true ), menu.find( "li:nth-child(2) a" ).outerWidth( true ), "a element should not overflow" );
				start();
			}
		], 500);
	});

	asyncTest( "focus is transferred to a menu item when the menu is opened",function() {
		expect( 1 );

		$.testHelper.sequence([
			resetHash,

			function() {
				// bring up the dialog
				$( "#select-choice-menu-focus-test a:first" ).trigger( "click" );
			},

			function() {
				ok( $( document.activeElement ).parents( "#select-choice-menu-focus-test-menu" ).length > 0,
					"item in open select menu (" + $( "#select-choice-menu-focus-test-menu" ).length + ") has focus" );
				$(".ui-popup-screen:not(.ui-screen-hidden)").trigger( "click" );
			},

			function() {
				start();
			}
		], 5000);
	});

	asyncTest( "using custom refocuses the button after close", function() {
		var select, button, triggered = false;

		expect( 1 );

		$.testHelper.sequence([
			resetHash,

			function() {
				select = $("#select-choice-focus-test");
				button = select.find( "a" );
				button.trigger( "click" );
			},

			function() {
				// NOTE this is called twice per triggered click
				button.focus(function() {
					triggered = true;
				});

				$(".ui-popup-screen:not(.ui-screen-hidden)").trigger("click");
			},

			function(){
				ok(triggered, "focus is triggered");
				start();
			}
		], 1500);
	});

	asyncTest( "selected items are highlighted", function(){
		$.testHelper.sequence([
			resetHash,

			function(){
				// bring up the smaller choice menu
				ok($("#select-choice-few-container a").length > 0, "there is in fact a button in the page");
				$("#select-choice-few-container a").trigger("click");
			},

			function(){
				var firstMenuChoice = $("#select-choice-few\\.dotTest-menu li:first a");
				ok( firstMenuChoice.hasClass( $.mobile.activeBtnClass ),
						"default menu choice has the active button class" );

				$("#select-choice-few\\.dotTest-menu a:last").click();
			},

			function(){
				// bring up the menu again
				$("#select-choice-few-container a").trigger("click");
			},

			function(){
				var lastMenuChoice = $("#select-choice-few\\.dotTest-menu li:last a");
				ok( lastMenuChoice.hasClass( $.mobile.activeBtnClass ),
						"previously selected item has the active button class" );

				// close the dialog
				lastMenuChoice.click();
			},

			start
		], 1000);
	});

	asyncTest( "adding options and refreshing a custom select changes the options list", function(){
		var select = $( "#custom-refresh-opts-list" ),
			button = select.siblings( "a" ),
			text = "foo";

		$.testHelper.sequence([
			resetHash,

			// bring up the dialog
			function() {
				button.click();
			},

			function() {
				deepEqual( $( ".ui-popup-container:not(.ui-popup-hidden) .ui-selectmenu ul" ).text(), "default" );
				$( ".ui-popup-screen.in" ).click();
			},

			function() {
				select.find( "option" ).remove(); //remove the loading message
				select.append('<option value="1">' + text + '</option>');
				select.selectmenu( 'refresh' );
			},

			function() {
				button.click();
			},

			function() {
				deepEqual( $( ".ui-popup-container:not(.ui-popup-hidden) .ui-selectmenu ul" ).text(), text );
				$( ".ui-popup-screen.in" ).click();
			},

			start
		], 500);
	});

	// issue #2547
	test( "custom select list item links have encoded option text values", function() {
		$( "#encoded-option" ).data( 'mobile-selectmenu' )._buildList();
		deepEqual(window.encodedValueIsDefined, undefined);
	});

	// not testing the positive case here since's it's obviously tested elsewhere
	test( "select elements in the keepNative set shouldn't be enhanced", function() {
		ok( !$("#keep-native").parent().is("div.ui-btn") );
	});

	asyncTest( "dialog size select title should match the label", function() {
		var $select = $( "#select-choice-many-1\\.dotTest" ),
			$label = $select.parent().siblings( "label" ),
			$button = $select.siblings( "a" );

		$.testHelper.pageSequence([
			function() {
				$button.click();
			},

			function() {
				deepEqual($.mobile.activePage.find( ".ui-title" ).text(), $label.text());
				window.history.back();
			},

			start
		]);
	});

	asyncTest( "dialog size select title should match the placeholder when there's no label",
		function() {
			var $select = $( "#select-choice-many-placeholder-1" ),
				$label = $( "#select-choice-many-placeholder-1-listbox li:first" ),
				$button = $select.siblings( "a" );

			$.testHelper.pageSequence([
				function() {
					$button.click();
				},

				function() {
					deepEqual($.mobile.activePage.find( ".ui-title" ).text(), $label.text());
					window.history.back();
				},

				start
			]);
		});

	asyncTest( "dialog size select title should match the label when changed after the dialog markup is added to the DOM", function() {
		var $select = $( "#select-choice-many-1\\.dotTest" ),
			$label = $select.parent().siblings( "label" ),
			$button = $select.siblings( "a" );

		$.testHelper.detailedEventCascade([
			function() {
				$label.text( "foo" );
				$button.click();
			},

			{ pagechange: { src: $.mobile.pageContainer, event: "pagechange.dialogSizeSelectTitleMod1" } },

			function() {
				deepEqual($.mobile.activePage.find( ".ui-title" ).text(), $label.text());
				window.history.back();
			},

			{ pagechange: { src: $.mobile.pageContainer, event: "pagechange.dialogSizeSelectTitleMod2" } },

			start
		]);
	});

	asyncTest( "destroying a select menu leaves no traces", function() {
		$.testHelper.pageSequence( [
			function() { $.mobile.changePage( "#destroyTest" ); },
			// Check if two chunks of DOM are identical
			function() {
				var unenhancedSelect = $(
						"<select data-" + ( $.mobile.ns || "" ) + "native-menu='true'>" +
						"<option>Title</option>" +
						"<option value='option1'>Option 1</option>" +
						"<option value='option2'>Option 2</option>" +
						"</select>"),
					unenhancedSelectClone = unenhancedSelect.clone();

				$( "#destroyTest" ).append( unenhancedSelectClone );
				unenhancedSelectClone.selectmenu();
				unenhancedSelectClone.selectmenu( "destroy" );
				unenhancedSelectClone.remove();

				deepEqual( $( "#destroyTest" ).children().length, 0, "After adding, enhancing, destroying, and removing the select menu, the page is empty" );
				ok( $.testHelper.domEqual( unenhancedSelect, unenhancedSelectClone ), "DOM for select after enhancement/destruction is equal to DOM for unenhanced select" );
			},
			function() { $.mobile.back(); },

			start
		]);
	});

	asyncTest( "destroying a custom select menu leaves no traces", function() {
		expect( 7 );

		var unenhancedSelectClone,
			prefix = ".destroyingASelectMenuLeavesNoTraces",
			id = "select-" + Math.round( Math.random() * 1177 ),
			unenhancedSelect = $(
				"<select id='" + id + "' data-" + ( $.mobile.ns || "" ) + "native-menu='false'>" +
				"<option>Title</option>" +
				"<option value='option1'>Option 1</option>" +
				"<option value='option2'>Option 2</option>" +
				"</select>");
		$.testHelper.detailedEventCascade( [
			function() {
				$.mobile.changePage( "#destroyTest" );
			},

			{
				pagechange: { src: $.mobile.pageContainer, event: "pagechange" + prefix + "0" }
			},

			function() {
				unenhancedSelectClone = unenhancedSelect.clone();

				$( "#destroyTest" ).append( unenhancedSelectClone );
				unenhancedSelectClone.selectmenu();
				$( "#" + id + "-button" ).click();
			},

			{
				popupafteropen: { src: $.mobile.document, event: "popupafteropen" + prefix + "1" }
			},

			function( result ) {
				deepEqual( result.popupafteropen.timedOut, false, "Popup did open" );
				$( "#" + id + "-listbox" ).popup( "close" );
			},

			{
				popupafterclose: { src: $.mobile.document, event: "popupafterclose" + prefix + "2" }
			},

			function( result ) {
				var idx;

				deepEqual( result.popupafterclose.timedOut, false, "Popup did close" );

				unenhancedSelectClone.selectmenu( "destroy" );
				unenhancedSelectClone.remove();

				deepEqual( $( "#destroyTest" ).children().length, 0, "After adding, enhancing, opening, destroying, and removing the popup-sized select menu, the page is empty" );
				ok( $.testHelper.domEqual( unenhancedSelect, unenhancedSelectClone ), "DOM for select after enhancement/destruction is equal to DOM for unenhanced select" );

				// Add a bunch of options to make sure the menu ends up larger than
				// the screen, thus requiring a dialog
				for ( idx = 3 ; idx < 60 ; idx++ ) {
					unenhancedSelect.append( "<option value='option" + idx + "'>Option " + idx + "</option>" );
				}
				unenhancedSelectClone = unenhancedSelect.clone();
				$( "#destroyTest" ).append( unenhancedSelectClone );
				unenhancedSelectClone.selectmenu();
				$( "#" + id + "-button" ).click();
			},

			{
				pagechange: { src: $.mobile.pageContainer, event: "pagechange" + prefix + "3" }
			},

			function() {
				// Close the dialog
				$.mobile.activePage.find( "a:first" ).click();
			},

			{
				pagechange: { src: $.mobile.pageContainer, event: "pagechange" + prefix + "4" }
			},

			function() {
				unenhancedSelectClone.selectmenu( "destroy" );
				unenhancedSelectClone.remove();

				deepEqual( $( "#destroyTest" ).children().length, 0, "After adding, enhancing, opening, destroying, and removing the dialog-sized select menu, the page is empty" );
				ok( $.testHelper.domEqual( unenhancedSelect, unenhancedSelectClone ), "DOM for select after enhancement/destruction is equal to DOM for unenhanced select" );
				deepEqual( $( "#" + id + "-dialog" ).length, 0, "After adding, enhancing, opening, destroying, and removing the dialog-sized select menu, no dialog page is left behind" );
				$.mobile.back();
			},

			{
				pagechange: { src: $.mobile.pageContainer, event: "pagechange" + prefix + "5" }
			},

			start
		]);
	});

	asyncTest( "Custom select passes overlay theme to its dialog", function() {

		expect( 1 );

		var dialog,
			eventNs = ".passesOnOverlayThemeToDialog";

		$.testHelper.pageSequence([
			function() {
				$( "#select-overlay-theme-container a:first" ).click();
			},
			function() {
				dialog = $( "#select-choice-many-overlay-theme-test-dialog" );
				deepEqual( dialog.page( "option", "overlayTheme" ), "x",
					"Dialog widget overlayTheme option is correct." );
				$.mobile.back();
			},
			start
		]);
	});

	// Utensils for logging calls to $.event.trigger()
	var callLog, origTrigger,
		replacementTrigger = function( event, data, element, onlyHandlers ) {
			callLog.push({
				event: event,
				data: data,
				element: element,
				onlyHandlers: onlyHandlers
			});
			return origTrigger.apply( this, arguments );
		};

	module( "Custom select change comes after closing list", {
		setup: function() {
			callLog = [];
			origTrigger = $.event.trigger;
			$.event.trigger = replacementTrigger;
		},
		teardown: function() {
			$.event.trigger = origTrigger;
		}
	});

	function testChangeAfterClose( select, ns, openEvent, closeEvent, tail ) {
		var closeComesBeforeChange = false,
			closeEventName = closeEvent.event;

		openEvent.event += ns + "1";
		closeEvent.event += ns + "2";

		$.testHelper.detailedEventCascade([
			function() {
				$( "#" + select.attr( "id" ) + "-button" ).click();
			},
			{
				openevent: openEvent
			},
			function() {
				$( "#" + select.attr( "id" ) + "-menu" ).find( "a" ).eq( 2 ).click();
			},
			{
				closeevent: closeEvent,
				change: { src: select, event: "change" + ns + "2" }
			},
			function() {
				$.each( callLog, function( index, value ) {
					var name = ( typeof callLog[ index ].event === "string" ?
						callLog[ index ].event :
						callLog[ index ].event.type ),
						target = callLog[ index ].element;

					if ( name === "change" && target === select[ 0 ] ) {
						return false;
					}

					if ( name === closeEventName &&
							target === ( typeof closeEvent.src === "function" ?
								closeEvent.src()[ 0 ] :
								closeEvent.src[ 0 ] ) ) {

						closeComesBeforeChange = true;
						return false;
					}
				});

				deepEqual( closeComesBeforeChange, true,
					"close event is triggered before change event" );
				tail();
			}
		]);
	}

	asyncTest( "Small select triggers change after popup closes", function() {
		testChangeAfterClose( $( "#small-select-change-after-close" ),
			".smallSelectTriggersChangeAfterPopupCloses",
			{
				src: $( "#small-select-change-after-close-listbox" ),
				event: "popupafteropen"
			},
			{
				src: $( "#small-select-change-after-close-listbox" ),
				event: "popupafterclose"
			}, start);
	});

	asyncTest( "Large select triggers change after dialog closes", function() {
		testChangeAfterClose( $( "#large-select-change-after-close" ),
			".largeSelectTriggersChangeAfterPopupCloses",
			{ src: $( document ), event: "pageshow" },
			{
				src: function() { return $( "#large-select-change-after-close-dialog" ); },
				event: "pagehide"
			},
			start);
	});

})(jQuery);
