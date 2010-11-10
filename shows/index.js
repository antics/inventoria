function (doc, req) {
	// !json templates.include
	// !json templates.index
	// !code vendor/mustache.js

	data = {
		title : "Welcome to Inventoria"
	}

	var html = templates.include.header + templates.index + templates.include.footer;
	
	return Mustache.to_html(html, data);
}
