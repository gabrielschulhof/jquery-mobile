//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Extends the table widget to a column toggle menu and responsive column visibility
//>>label: Table: Column Toggle
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.table.columntoggle.css

define( [
	"jquery",
	"./table",
	"./popup",
	"./controlgroup",
	"./forms/checkboxradio" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$.widget( "mobile.table", $.mobile.table, {
	options: {
		mode: "columntoggle",
		columnBtnTheme: null,
		columnPopupTheme: null,
		columnBtnText: "Columns...",
		classes: $.extend( $.mobile.table.prototype.options.classes, {
			popup: "ui-table-columntoggle-popup",
			columnBtn: "ui-table-columntoggle-btn",
			priorityPrefix: "ui-table-priority-",
			columnToggleTable: "ui-table-columntoggle"
		})
	},

	_create: function() {
		var id, popup;

		this._super();

		if ( this.options.mode !== "columntoggle" ) {
			return;
		}

		if ( this.options.enhanced ) {
			id = this._id();
			popup = $( this.document[ 0 ].getElementById( id + "-popup" ) );
			this._ui = {
				popup: popup,
				menu: popup.children().first(),
				button: $( this.document[ 0 ].getElementById( id + "-button" ) )
			};
			this._addToggles( this._ui.menu, true );
		} else {
			this._ui = this._enhanceColToggle();
			this.element.addClass( this.options.classes.columnToggleTable );
		}

		this._setupEvents();

		this._setToggleState();
	},

	_setOptions: function( options ) {
		if ( options.disabled !== undefined && this.options.mode === "columntoggle" ) {
			this._ui.popup.popup( "option", "disabled", options.disabled );
			this._ui.button.toggleClass( "ui-state-disabled", options.disabled );
			if( options.disabled ) {
				this._ui.button.attr( "tabindex", -1 );
			} else {
				this._ui.button.removeAttr( "tabindex" );
			}
		}

		return this._super( options );
	},

	_id: function() {
		return ( this.element.attr( "id" ) || ( this.widgetName + this.uuid ) );
	},

	_setupEvents: function() {
		//NOTE: inputs are bound in bindToggles,
		// so it can be called on refresh, too

		// update column toggles on resize
		this._on( this.window, {
			throttledresize: "_setToggleState"
		});
		this._on( this._ui.menu, {
			"change input": "_menuInputChange"
		});
	},

	_addToggles: function( menu, keep ) {
		var inputs,
			checkboxIndex = 0,
			opts = this.options,
			container = menu.controlgroup( "container" );

		// allow update of menu on refresh (fixes #5880)
		if ( keep ) {
			inputs = menu.find( "input" );
		} else {
			container.empty();
		}

		// create the hide/show toggles
		this.headers.not( "td" ).each( function() {
			var input, cells,
				header = $( this ),
				priority = $.mobile.getAttribute( this, "priority" );

			if ( priority ) {
				cells = header.add( header.jqmData( "cells" ) );
				cells.addClass( opts.classes.priorityPrefix + priority );

				// Make sure the (new?) checkbox is associated with its header via .jqmData() and
				// that, vice versa, the header is also associated with the checkbox
				input = ( keep ? inputs.eq( checkboxIndex++ ) :
					$("<label><input type='checkbox' checked />" +
						( header.children( "abbr" ).first().attr( "title" ) ||
							header.text() ) +
						"</label>" )
						.appendTo( container )
						.children( 0 )
						.checkboxradio( {
							theme: opts.columnPopupTheme
						}) )

						// Associate the header with the checkbox
						.jqmData( "header", header )
						.jqmData( "cells", cells );

				// Associate the checkbox with the header
				header.jqmData( "input", input );
			}
		});

		// set bindings here
		if ( !keep ) {
			menu.controlgroup( "refresh" );
		}
	},

	_menuInputChange: function( evt ) {
		var input = $( evt.target ),
			checked = input[ 0 ].checked;

		input.jqmData( "cells" )
			.toggleClass( "ui-table-cell-hidden", !checked )
			.toggleClass( "ui-table-cell-visible", checked );
	},

	_unlockCells: function( cells ) {
		// allow hide/show via CSS only = remove all toggle-locks
		cells.removeClass( "ui-table-cell-hidden ui-table-cell-visible");
	},

	_enhanceColToggle: function() {
		var id , menuButton, popup, menu,
			table = this.element,
			opts = this.options,
			ns = $.mobile.ns,
			fragment = this.document[ 0 ].createDocumentFragment();

		id = this._id() + "-popup";
		menuButton = $( "<a href='#" + id + "' " +
			"id='" + this._id() + "-button' " +
			"class='" + opts.classes.columnBtn + " ui-btn " +
			"ui-btn-" + ( opts.columnBtnTheme || "a" ) +
			" ui-corner-all ui-shadow ui-mini' " +
			"data-" + ns + "rel='popup'>" + opts.columnBtnText + "</a>" );
		popup = $( "<div class='" + opts.classes.popup + "' id='" + id + "'></div>" );
		menu = $( "<fieldset></fieldset>" ).controlgroup();

		// set extension here, send "false" to trigger build/rebuild
		this._addToggles( menu, false );

		menu.appendTo( popup );

		fragment.appendChild( popup[ 0 ] );
		fragment.appendChild( menuButton[ 0 ] );
		table.before( fragment );

		popup.popup();

		return {
			menu: menu,
			popup: popup,
			button: menuButton
		};
	},

	rebuild: function() {
		this._super();

		if ( this.options.mode === "columntoggle" ) {

			// NOTE: rebuild passes "false", while refresh passes "undefined"
			// both refresh the table, but inside addToggles, !false will be true,
			// so a rebuild call can be indentified
			this._refresh( false );
		}
	},

	_refresh: function( create ) {
		var headers, hiddenColumns, index;

		// Calling _super() here updates this.headers
		this._super( create );

		if ( !create && this.options.mode === "columntoggle" ) {
			headers = this.headers;
			hiddenColumns = [];

			// Find the index of the column header associated with each old checkbox among the
			// post-refresh headers and, if the header is still there, make sure the corresponding
			// column will be hidden if the pre-refresh checkbox indicates that the column is
			// hidden by recording its index in the array of hidden columns.
			this._ui.menu.find( "input" ).each( function() {
				var input = $( this ),
					header = input.jqmData( "header" ),
					index = headers.index( header[ 0 ] );

				if ( index > -1 && !input.prop( "checked" ) ) {

					// The column header associated with /this/ checkbox is still present in the
					// post-refresh table and the checkbox is not checked, so the column associated
					// with this column header is currently hidden. Let's record that.
					hiddenColumns.push( index );
				}
			});

			// columns not being replaced must be cleared from input toggle-locks
			this._unlockCells( this.element.find( ".ui-table-cell-hidden, " +
				".ui-table-cell-visible" ) );

			// update columntoggles and cells
			this._addToggles( this._ui.menu, create );

			// At this point all columns are visible, so uncheck the checkboxes that correspond to
			// those columns we've found to be hidden
			for ( index = hiddenColumns.length - 1 ; index > -1 ; index-- ) {
				headers.eq( hiddenColumns[ index ] ).jqmData( "input" )
					.prop( "checked", false )
					.checkboxradio( "refresh" )
					.trigger( "change" );
			}
		}
	},

	_setToggleState: function() {
		this._ui.menu.find( "input" ).each( function() {
			var checkbox = $( this );

			this.checked = checkbox.jqmData( "cells" ).eq( 0 ).css( "display" ) === "table-cell";
			checkbox.checkboxradio( "refresh" );
		});
	},

	_destroyHeader: function( index, headerElement ) {
		var priority, cells,
			header = $( headerElement );

		if ( !this.options.enhanced ) {
			priority = $.mobile.getAttribute( headerElement, "priority" );
			cells = header.add( header.jqmData( "cells" ) );

			if ( priority ) {
				cells.removeClass( this.options.classes.priorityPrefix + priority );
			}
		}

		// This data has to be removed whether or not the widget is pre-rendered
		header.jqmRemoveData( "input" );
	},

	_destroy: function() {
		if ( this.options.mode === "columntoggle" ) {
			if ( this.options.enhanced ) {

				// If the widget is enhanced, the checkboxes will be left alone, but the jqmData()
				// attached to them has to be removed
				this._ui.menu.find( "input" ).each( function() {
					$( this )
						.jqmRemoveData( "cells" )
						.jqmRemoveData( "header" );
				});
			} else {
				this.element.removeClass( this.options.classes.columnToggleTable );
				this._ui.popup.remove();
				this._ui.button.remove();
			}
			this.headers.not( "td" ).each( $.proxy( this, "_destroyHeader" ) );
		}
		return this._superApply( arguments );
	}
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
