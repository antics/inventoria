$(document).ready(function () {

	// Image upload is in an iframe containing a page
	// on a different domain. When image is uploaded that domain
	// (child iframe) will send a cross-domain postMessage to
	// parent page (this). Message contains filename of saved
	// image and location (GPS) data if available.
	var filename = "";
	var coordinates;
	$.receiveMessage(
		function(message){
			var data = $.deparam(message.data);
			filename = data.filename;

			latData = data.gps.GPSLatitude;
			longData = data.gps.GPSLongitude;
			
			gps = new gps();
			coordinates = gps.convertToDec(latData, longData);
		},
		'http://images.legnered.com'
	);


	/*********************************************************
	 * Item Submit
	 ********************************************************/

	// Item submit form
	$('#addItem').submit(function () {

		var data = prepJSON($(this).serializeArray());

		//
		// Required keys
		//
		data.created_at = new Date();
		data.type = 'item';
		// prepJSON ignores these two fields, we want to
		// add them manually:
		userEmail = $('#userEmail').val();
		userPassw = $('#userPassword').val();
		data.user = {
			email: userEmail,
			password: hex_sha1(userEmail+userPassw)
		};
		
		// TODO: Change this to production domain
		if (filename != '')
			data.image = 'http://images.legnered.com/'+filename;
		// Optional location data
		if (coordinates != null)
			data.location = {gps: coordinates};

		console.log(data);

		// Save data
		$.couch.db("inventoria").saveDoc(
			data, {
				success: function (resp) {
					itemSaved (resp);
				}
			}
		);

		//
		// Check if user is logged in
		// TODO: not implemented as of yet.
		/*
		$.couch.session({
			success: function(resp) {
				data.user = resp.name;
				// Save data
				$.couch.db("inventoria").saveDoc(
					data,
					{ success: function (resp) {
						itemSaved (resp);
						console.log($('#imageUpload').attr('src')) } }
				);
			},
			error: function() { alert(msg.t('please_login')) }
		});
		*/

		$('input').attr('disabled', true);

		return false;
	});

	var first_time = 0;
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
			$(new_input).insertBefore('#userData');
		}
	});
					   
	// Set key (name="") from previous input
	$('.value').live('focus', function () {
		value = $(this).prev().val();
		$(this).attr('name', value);
	});

	// Set non optional keys to read-only
	$('.readonly').attr('readonly', true);

});

function gps() {

	this.convertToDec = function (lat, lon) {

		deg = typeof lat[0] === "string" ? parse(lat[0]) : lat[0];
		min = typeof lat[1] === "string" ? parse(lat[1]) : lat[1];
		sec = typeof lat[2] === "string" ? parse(lat[2]) : lat[2];

		var coord = {};
		
		coord.latitude =  deg + min/60 + sec/3600;

		deg = typeof lon[0] === "string" ? parse(lon[0]) : lon[0];
		min = typeof lon[1] === "string" ? parse(lon[1]) : lon[1];
		sec = typeof lon[2] === "string" ? parse(lon[2]) : lon[2];
		
		coord.longitude =  deg + min/60 + sec/3600;

		return coord;
	}

	parse = function (str) {
		var div = str.split('/');
		
		return parseFloat(div[0]) / parseFloat(div[1]);
	}
}

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
			if(field.name != 'userEmail' && field.name != 'userPassword')
				data = data+'"'+field.name+'": "'+field.value+'",';
		});
		// Remove last comma
		data = data.slice(0, -1);
		data = data+'}';

		return JSON.parse(data);
	} else
		return {};
}
