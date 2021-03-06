$(document).ready(function(){

	
	/*********************************************************
	 * Search
	 ********************************************************/

	$('#search').submit(function () {
		var search = new Search();

		search.item($('#searchString').val());
		
		return false;
	});


	/*********************************************************
	 * User login
	 ********************************************************/

	// Prep Login form for Ajax submit
	$('#login').submit(function () {
		user.login(prepJSON($(this).serializeArray()));
		return false;
	});

	// Show control bar instead of login form if logged in
	if (user.name)
		user.showControlBar();
	else
		user.showLoginForm();

	// Logout button
	$('.button.logout').click(function () { user.logout() });
	

	/*********************************************************
	 * Signup
	 ********************************************************/

	/*
	$('#signup').submit(function () {
		user.signup(prepJSON($(this).serializeArray()));
		return false;
	});*/
	
});

var cookie = new Cookie();
var user = new User();
var msg = new Message();

// Options object
var o = {
	server: "legnered.cloudant.com",
	db: "inventoria",
	uri: "http://legnered.cloudant.com/inventoria"
};

function Pouch () {

	// Get users items
	this.open = function (username) {
		$.couch.db('inventoria').view('inventoria/pouch', {
			"keys": username,
			success: function (res) { outputResult(res) }
		});		
	}
}

function Search () {

	// Full text search for items
	this.item = function (search_string) {

		var query = buildQuery(search_string);
		
		$.getJSON(o.uri+'/_search?q='+query, function (docs) {
			var keys = [];
			console.log(docs);
			jQuery.each(docs[0].rows, function(i, doc) {
				keys.push(doc.id);
			});

			$.couch.db('inventoria').view('inventoria/search', {
				"keys": keys, 
				success: function (res) { outputResult(res) }
			});

			
		});
	}

	// Format and output results
	var outputResult = function (data) {

		$('#searchResults').html('');
		
		jQuery.each(data.rows, function(i, doc) {
			var html = '<tr><td><img src="'+doc.value.image+'"></td><td><a href="'+o.uri+'/_design/inventoria/_show/item/'+doc.id+'">'+doc.value.item+'</a></td><td>'+doc.value.city+'</td></tr>';
			$('#searchResults').append(html);
		});

		console.log(data);
	}

	// Build search query
	var buildQuery = function (str) {

		var query = "";
		
		// RegExp for finding "words in quotes"
		var quoted = new RegExp("\".*?\"");

		// Find quoted item
		var item = quoted.exec(str);
		if (item != null) {
			str = str.replace(item, '');
			query = 'item:'+item;
		}

		// Trim away whitespaces
		str = str.replace(/^\s+|\s+$/g, '');
		
		var words = str.split(' ');

		jQuery.each(words, function(i, word) {
			// Do we have a key:val match?
			if (word.search(':') > -1) {
				if (query != '')
					query += ' AND ';
				query += word;
				kv_match = true;
			}
			// item only search
			else if (word != '') {
				if (query != '')
					query += ' OR ';
				query += 'item:'+word;
			}
		});

		return query;
	}
}

function User () {

	var that = this;

	this.name = cookie.read('username');

	this.login = function (data) {
		$('#login input').attr('disabled', true);
		$('.button.login').val(msg.t('opening_pouch'));
		$.couch.login({
			"name": data.name,
			"password": data.password,
			success: function (resp) { handleLogin() },
			error: function () {
				alert(msg.t('incorrect_login'));
				$('#login input').attr('disabled', false);
				$('.button.login').val(msg.t('login'));
			}
		});
	}

	this.signup = function (data) {
		user_doc = { "name": data.name }
		$.couch.signup(user_doc, data.password, {
			success: function (resp) { console.log(resp) }
		});
	}

	this.logout = function () {
		$.couch.logout();
		cookie.erase('username');
		this.showLoginForm();
	}

	this.showControlBar = function () {
		this.name = cookie.read('username');
		$('#controlBar .username').html(this.name);
		$('#controlBar').show();
		$('#loginBox').hide();
		
		// Enable site features
		//$('.needLogin').css({'background': 'none'});
		$('.needLogin input').attr('disabled', false);
	}

	this.showLoginForm = function () {
		$('#login input').attr('disabled', false);
		$('.button.login').val(msg.t('login'));
		$('#controlBar').hide();
		$('#loginBox').show('slow');

		// Disable features that needs login
		//$('.needLogin').css({'background': 'grey'});
		$('.needLogin input').attr('disabled', true);

	}

	var handleLogin = function () {
 		$.couch.session({
			success: function (res) {
				cookie.create('username', res.userCtx.name);
				$('#loginBox').hide('slow');
				that.showControlBar();
			}
		});
	}
}

// Based on: http://www.quirksmode.org/js/cookies.html
function Cookie () {

	this.create = function (name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	this.read = function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	this.erase = function (name) {
		this.create(name,"",-1);
	}
}

function Message () {

	var that = this;
	
	this.t = function (key) { return that.txt(key) }

	this.txt = function (key) {
		switch (key) {
		case 'please_login':
			'Please login before submitting any new items.';
		case 'incorrect_login':
			return "Incorrect username or password.";
		case 'new_field':
			var tag = '<div class="message new_field">'
			var detag = '</div>';
			return tag+'^^ New row automatically added.'+detag;
		case 'btn_goto_item':
			return 'Goto Item';
		case 'btn_new_item':
			return 'New Item';
		case 'opening_pouch':
			return 'Opening Pouch...';
		case 'login':
			return 'Login';
		case 'item_map_mark':
			return 'Item can be found in this area.';
		}
	}
}


