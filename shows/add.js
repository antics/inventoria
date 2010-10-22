function (doc, req) {
	// !json templates.include
	// !json templates.add
	// !code vendor/mustache.js

	data = {
		title : "Add new item"
	}

	var html = templates.include.header + templates.add + templates.include.footer;
	
	return Mustache.to_html(html, data);
}
