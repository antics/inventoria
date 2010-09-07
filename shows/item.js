function (doc, req) {
	// !json templates.include
	// !json templates.item
	// !code vendor/mustache.js

	var data = [];

	// Extract item fields
	for (var field in doc) {
		if (field == "_id" || field == "_rev" || field == "_revisions") {
			// do nothing, I don't know why != doesn't work
		} else
			data.push({field : field, value : doc[field]})
	}

	data = {
		item: data,
		title : doc.föremål+' : '+doc.stad
	}

	var html = templates.include.header + templates.item + templates.include.footer;
	
	return Mustache.to_html(html, data);
}
