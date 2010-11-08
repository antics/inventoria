function (doc, req) {
	// !json templates.include
	// !json templates.signup
	// !code vendor/mustache.js

	data = {
		title : "Signup"
	}

	var html = templates.include.header + templates.signup + templates.include.footer;
	
	return Mustache.to_html(html, data);
}
