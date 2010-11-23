$(document).ready(function () {

	// Item Image
	var big = false;
	$('#itemImage').click(function () {
		if(big) {
			big = false;
			$(this).css('width', '200px');
		}
		else {
			big = true;
			$(this).css('width', '100%');
		}
	});
});

function initializeMap (lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	var myOptions = {
		zoom: 16,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);

	var marker = new google.maps.Marker({
		position: latlng,
		title: 'Item location'
	});

	marker.setMap(map);
}
