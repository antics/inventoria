function (doc, req) {
	// !json templates.include
	// !json templates.index
	// !code vendor/mustache.js

	data = {
		title : "Welcome to Inventoria",

		html_header: templates.include.header,
		html_css_js: templates.include.css_js
	};

	var html = templates.index;

	return Mustache.to_html(html, data);
}
