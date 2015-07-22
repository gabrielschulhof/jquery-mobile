test( "Classes backcompat", function( assert ) {
	var widget = $.widget( "mobile.classesbackcompat",
		$.extend( {
			options: {
				classes: {
					oldKey: "ui-new-key custom-class",
					"ui-new-key": "ui-corner-all",

					// "ui-empty-new-key": "",
					"ui-something-else": "ui-shadow",
					emptyOldKey: "ui-empty-new-key"
				}
			},
			_classKeyMap: function() {
				return {
					"ui-new-key": "oldKey",
					"ui-empty-new-key": "emptyOldKey"
				}
			},
		}, $.mobile.widget.classesBackcompat ) )();

	assert.deepEqual( $.testHelper.classStringToHash( widget._classes( {
			element: widget.element,
			keys: "ui-new-key",
			extra: "some-extra-class"
		} ) ),
		{
			"ui-new-key": true,
			"some-extra-class": true,
			"ui-corner-all": true,
			"custom-class": true
		}, "_classes() evaluates correctly when an old key is present" );

	assert.deepEqual( $.testHelper.classStringToHash( widget._classes( {
			element: widget.element,
			keys: "ui-empty-new-key"
		} ) ),
		{
			"ui-empty-new-key": true
		}, "_classes() evaluates correctly when an empty new key is present" );


	assert.deepEqual( $.testHelper.classStringToHash( widget._classes( {
			element: widget.element,
			keys: "ui-something-else"
		} ) ),
		{
			"ui-something-else": true,
			"ui-shadow": true
		}, "_classes() evaluates correctly when an old key is absent" );

} );
