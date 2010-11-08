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
	 * Item Submit
	 ********************************************************/

	// Item submit form
	$('#addItem').submit(function () {

		var data = prepJSON($(this).serializeArray());
		data.created_at = new Date();
		data.type = 'item';

		// Check if user is logged in
		$.couch.session({
			success: function(resp) {
				data.user = resp.name;
				// Save data
				$.couch.db("inventoria").saveDoc(
					data,
					{ success: function (resp) { itemSaved (resp) } }
				);
			},
			error: function() { alert(msg.t('please_login')) }
		});

		$('input').attr('disabled', true);

		return false;
	});

	// Append new inputs
	$('.value').live('focus', function () {
		// Check if we are editing the last input field.
		// If not, we do not want to add another field.
		if ($(this).parent().next().hasClass('last')) {

			if (!first_time) {
				message = msg.t('new_field');
				first_time = 1;
			} else {
				message = '';
				$('.message.new_field').remove();
			}
			
			new_input = '<div class="inputRow"><input class="key" type="text" value="" /> <input class="value" type="text" name="" />'+message+'</div>';
			$(new_input).insertBefore('#submitInventory');
		}
	});
					   
	// Set key (name="") from previous input
	$('.value').live('focus', function () {
		value = $(this).prev().val();
		$(this).attr('name', value);
	});

	// Set non optional keys to read-only
	$('.readonly').attr('readonly', true);


	
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

function Search () {

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

	var outputResult = function (data) {

		$('#searchResults').html('');
		
		jQuery.each(data.rows, function(i, doc) {
			var html = '<tr><td><a href="'+o.uri+'/_design/inventoria/_show/item/'+doc.id+'">'+doc.value.item+'</a></td><td>'+doc.value.city+'</td></tr>';
			$('#searchResults').append(html);
		});

		console.log(data);
	}

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
			success: function (resp) { console.log(resp); handleLogin() },
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
		$('#login').hide();
		$('#controlBar .username').html(this.name);
		$('#controlBar').show();		
	}

	this.showLoginForm = function () {
		$('#login input').attr('disabled', false);
		$('.button.login').val(msg.t('login'));
		$('#controlBar').hide();
		$('#login').show();
	}

	var handleLogin = function () {
 		$.couch.session({
			success: function (res) {
				cookie.create('username', res.userCtx.name);
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
			var tag = '<span class="message new_field">'
			var detag = '</span>';
			return tag+'New row automatically added.'+detag;
		case 'btn_goto_item':
			return 'Goto Item';
		case 'btn_new_item':
			return 'New Item';
		case 'opening_pouch':
			return "Opening Pouch...";
		case 'login':
			return "Login";
		}
	}
}

var first_time = 0;

var itemSaved = function (resp) {

	console.log(resp);

	btn_goto_item = '<button class="button gotoItem" type="button">'+msg.t('btn_goto_item')+'</button>';
	btn_new_item = '<button class="button newItem" type="button">'+msg.t('btn_new_item')+'</button>';

	$('#addItem').append(btn_new_item);
	$('#addItem').append(btn_goto_item);

	$('.button.newItem').live('click', function () {
		$('input').attr('disabled', false);
		$(this).remove();
		$('.button.gotoItem').remove();
		$('input.value').val('');
	});
	
	// Goto item page on button click
	$('.button.gotoItem').live('click', function () {
		location.href = '/inventoria/_design/inventoria/_show/item/' + resp.id;
	});
}

var prepJSON = function (fields) {

	if (fields.length) {
		var data = '{';
		jQuery.each(fields, function(i, field) {
			data = data+'"'+field.name+'": "'+field.value+'",';
		});
		// Remove last comma
		data = data.slice(0, -1);
		data = data+'}';

		return JSON.parse(data);
	} else
		return {};
}
