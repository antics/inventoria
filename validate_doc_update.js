function (newDoc, oldDoc, userCtx) {

	function require(field, message) {
		message = message || 'Document must have a "' + field + '" field.';
		if (!newDoc[field]) throw({forbidden : message});
	};
	
	require('city');
	require('item');
}
