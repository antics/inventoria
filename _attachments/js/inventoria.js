$(document).ready(function(){

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

	// Upload and retrieve image data
	/*
	  See:
	  http://www.williambharding.com/blog/rails/rails-ajax-image-uploading-made-simple-with-jquery/
	  http://valums.com/ajax-upload/
	  http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously-with-jquery
	
	$('#uploadImage input').change(function(){
		$(this).parent().ajaxSubmit({
			beforeSubmit: function(a,f,o) {
				o.dataType = 'json';
			},
			complete: function(XMLHttpRequest, textStatus) {
				console.log(XMLHttpRequest.responseText);
				
				// XMLHttpRequest.responseText will contain the URL of the uploaded image.
				// Put it in an image element you create, or do with it what you will.
				// For example, if you have an image elemtn with id "my_image", then
				//  $('#my_image').attr('src', XMLHttpRequest.responseText);
				// Will set that image tag to display the uploaded image.
			},
		});
	});
	*/
	
	/*
	$('#uploadImage').submit(function () {
		var formdata = $(this).serialize();

		$.ajax({
			type: $(this).attr('method'),
			url: $(this).attr('action'),
			dataType: 'json',
			data: formdata,
			success: function (data) {console.log(data)}
		});

		return false;
	});
	*/
	
	// Submit form data to DB
	$('#addInventory').submit(function () {
		var fields = $(this).serializeArray();

		$('input').attr('disabled', true);

		var data = '{';
		jQuery.each(fields, function(i, field) {
			data = data+'"'+field.name+'": "'+field.value+'",';
		});
		// Remove last comma
		data = data.slice(0, -1);
		data = data+'}';

		//console.log(data);
		
		$.couch.db("inventoria").saveDoc(
			JSON.parse(data),
			{success: function (resp) { itemSaved (resp) } }
		);
		
		return false;
	});
	
});

var first_time = 0;

function itemSaved (resp) {
	console.log(resp);
	btn_goto_item = '<button class="button gotoItem" type="button">Gå till föremål</button>';
	btn_new_item = '<button class="button newItem" type="button">Nytt föremål</button>';

	$('#addInventory').append(btn_new_item);
	$('#addInventory').append(btn_goto_item);

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

function addFormField () {

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

function message (message) {
	var tag = '<span class="message new_field">'
	var detag = '</span>';
	
	switch (message) {
	case 'new_field':
		return tag+'For varje informationsrad du fyller i laggs automatiskt ett nytt falt till -- fardigt att redigera!</span>'+detag;
	}
}
