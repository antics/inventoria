function (doc, req) {
	// !json templates.include
	// !json templates.add
	// !code vendor/mustache.js

	data = {
		title : "Add new item",

		html_header: templates.include.header,
		html_css_js: templates.include.css_js
	};

	var html = templates.add;
	
	return Mustache.to_html(html, data);
}
