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
