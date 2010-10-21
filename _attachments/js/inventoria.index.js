$(document).ready(function(){
	$.couch.db("inventoria").view(
		'inventoria/recent-items',
		{
			limit: 10,
			success: function (resp) {
				jQuery.each(resp.rows, function (i, row) {
					$('#recentItems').append('<tr><td><a href="/inventoria/_design/inventoria/_show/item/'+row.value.id+'">'+row.value.item+'</a></td><td>'+row.value.city+'</td></tr>');
				});
			}
		}
	);
});
	
