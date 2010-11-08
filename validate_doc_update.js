function (newDoc, oldDoc, userCtx) {

	forbidden = function (message) {
		throw({forbidden : message});
	}

	unauthorized = function (message) {
		throw({unauthorized : message});
	}
	
	require = function (field, message) {
		message = message || 'Document must have a "' + field + '" field.';
		if (!newDoc[field]) forbidden(message);
	};

	unchanged = function (field) {
		if (oldDoc && oldDoc[field] != newDoc[field])
			forbidden("You may not change the '"+field+"' field.");
	}

	require('city');
	require('item');
	require('user');
	require('created_at');

	unchanged('created_at');
	unchanged('user');

	if (!userCtx.name)
		unauthorized("Please log in to post a new item.");

	if (newDoc.user != userCtx.name)
		unauthorized("Only God can rename your soul.");
}
