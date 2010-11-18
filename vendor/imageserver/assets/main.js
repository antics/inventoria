$(document).ready(function(){

    var uploader = new qq.FileUploader({
		element: document.getElementById('file-uploader'),
		action: 'upload.php',
		debug: true,
		onComplete: function (id, origFileName, responseJSON) {
			console.log(responseJSON);
			$('#file-uploader').hide();
			$('body').append('<img width="200" src="'+responseJSON.filename+'">');

			$.postMessage(
				responseJSON.filename,
				// TODO: Change this to production domain.
				'http://legnered.cloudant.com/inventoria/_design/inventoria/_show/add',
				parent
			);
		}
    });           
});
