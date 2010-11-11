function (doc, req) {
	// !json templates.include
	// !json templates.item
	// !code vendor/mustache.js

	var data = [];

	// Fields to exclude in output
	var exclude = ['_id', '_rev', '_revisions', 'created_at', 'type'];
				   
	// Extract item fields
	for (var field in doc) {
		if (exclude.indexOf(field) == -1)
			data.push({field : field, value : doc[field]})
	}

	data = {
		item: data,
		title : doc.item+' : '+doc.city
	}

	var html = templates.include.header + templates.item + templates.include.footer;
	
	return Mustache.to_html(html, data);
}
