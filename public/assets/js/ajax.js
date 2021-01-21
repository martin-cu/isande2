function clearDeliveryFields(obj, dbFields) {
	var fields = ['deliveryCustomer', 'deliveryAddress', 'deliveryQty', 'deliveryTotal'];

	for (var i = 0; i < fields.length; i++) {
		$('#'+fields[i]).val(obj[fields[i]]);
	}
}

function changeCurrentDeliveryInfo(target, event) {
	var type, id;
	if (event === 'card') {
		type = $(target[0]).val();
		id = $(target[1]).val();
	}
	else {

	}
	
	$.get('/ajaxChangeDeliveryInfo', { type: type, id: id }, function(data) {
		if (type === 'Sell-in' || type === 'Sell-out') {
			var dbFields = ['customer_name', 'location_name', 'qty', 'total_amt'];
		}
		else {

		}

		clearDeliveryFields(data.deliveryInfo, dbFields);
	});
}

$(document).ready(function() {
	$('[name="deliveryCardItem"]').on('click', function() {
		changeCurrentDeliveryInfo($(this).children(), 'card');
	});
});