$(document).ready(function(){

	/*********************************************************
	 * Item Submit
	 ********************************************************/

	// Item submit form
	$('#addItem').submit(function () {

		var data = prepJSON($(this).serializeArray());
		$('input').attr('disabled', true);
		$.couch.db("inventoria").saveDoc(
			data,
			{success: function (resp) { itemSaved (resp) } }
		);

		return false;
	});

	// Append new inputs
	$('.value').live('focus', function () {
		// Check if we are editing the last input field.
		// If not, we do not want to add another field.
		if ($(this).parent().next().hasClass('last'))
			addFormField();
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
	
});

var cookie = new Cookie();
var user = new User();

function User () {

	that = this;

	this.name = cookie.read('username');

	this.login = function (data) {
		$('input').attr('disabled', true);
		$('.button.login').val('Loggar in...');
		$.couch.login({
			"name": data.name,
			"password": data.password,
			success: function (resp) { handleLogin(); }
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
		$('input').attr('disabled', false);
		$('.button.login').val('Logga in');
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

var first_time = 0;

var itemSaved = function (resp) {

	console.log(resp);

	btn_goto_item = '<button class="button gotoItem" type="button">Gå till föremål</button>';
	btn_new_item = '<button class="button newItem" type="button">Nytt föremål</button>';

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

var addFormField = function () {

	if (!first_time) {
		message = message('new_field');
		first_time = 1;
	} else {
		message = '';
		$('.message.new_field').remove();
	}
	
	new_input = '<div class="inputRow"><input class="key" type="text" value="" /> <input class="value" type="text" name="" />'+message+'</div>';
	$(new_input).insertBefore('#submitInventory');
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

var message = function (message) {
	var tag = '<span class="message new_field">'
	var detag = '</span>';
	
	switch (message) {
	case 'new_field':
		return tag+'For varje informationsrad du fyller i laggs automatiskt ett nytt falt till -- fardigt att redigera!</span>'+detag;
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
