function (doc, req) {
	// !json templates.item
	// !code vendor/mustache.js

	var data = [];

	// Extract item properties
	for (var field in doc) {
		if (field == "_id" || field == "_rev" || field == "_revisions") {
			// do nothing, I don't know why != doesn't work
		} else
			data.push({field : field, value : doc[field]})
	}

	data = {
		items: data,
		föremål : doc.föremål,
		stad : doc.stad
	}

	return Mustache.to_html(templates.item, data);
}
