/*!
 * jQuery Mobile Widget Classes Backcompat @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Backcompat for classes option
//>>group: Backcompat
//>>description: Synchronize old-style classes options with the final implementation

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../ns",
			"jquery-ui/widget" ], factory );
	} else {

		// Browser globals.
		factory( jQuery );
	}
} )( function( $ ) {

function classStringToHash( classString ) {
	var index,
		classList = ( classString.match( /\S+/g ) || [] ),
		listLength = classList.length,
		returnValue = {};

	for ( index = 0 ; index < listLength ; index++ ) {
		returnValue[ classList[ index ] ] = true;
	}

	return returnValue;
}

if ( $.mobileBackcompat !== false ) {
	$.mobile.widget = $.extend( {}, { classesBackcompat: {

		// Internally calls a widget-level function _classKeyMap() which returns a map of new class
		// keys to old class keys. Whenever a new class key is in options.keys that has such a
		// mapping, it will add the classes at the old class key to options.extra while making sure
		// that the new class key does not end up in options.extra. This latter can happen if the
		// value at the old class key contains the new class key.
		_classes: function( options ) {
			var oldClassKeyValue, desiredKey,

				// Convert the extra to a hash. We will amend this hash with classes we find at the
				// old class key. We must, however, remove the new class key from among the
				// classes located at the old class key, or else we'll end up passing the new class
				// key in both the keys and the extra property.
				resultHash = classStringToHash( options.extra || "" ),
				desiredKeys = classStringToHash( options.keys || "" ),
				classKeyMap = this._classKeyMap();

			// Copy the options object because we don't want to clobber the original
			options = $.extend( {}, options );

			// We iterate over each key we find in options.keys
			for ( desiredKey in desiredKeys ) {

				// If we find that it maps to an old key, we add the classes at the old key to
				// the extras, while taking care not to add the new class key (which may be
				// part of the value of the old class key)
				if ( classKeyMap[ desiredKey ] ) {
					oldClassKeyValue =
						classStringToHash( this.options.classes[ classKeyMap[ desiredKey ] ] );

					// Delete the class that has the same name as the new class key from the
					// list of classes found at the old class key, if present.
					delete oldClassKeyValue[ desiredKey ];

					$.extend( resultHash, oldClassKeyValue );
				}
			}

			// Alas, Object.keys does not work in IE8
			// http://kangax.github.io/compat-table/es5/#Object.keys (make sure "Show obsolete
			// browsers?" is checked )
			options.extra = $.map( resultHash, function( object, key ) {
				return key;
			} ).join( " " );

			return this._super( options );
		}
	} }, $.mobile.widget );
}

} );
