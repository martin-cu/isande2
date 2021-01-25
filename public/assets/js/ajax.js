function clearDeliveryFields(obj, dbFields) {
	var fields;

	if (ajaxView === 'scheduleDelivery') {
		fields = ['dateScheduled', 'deliveryCustomer', 'deliveryAddress', 'deliveryQty', 'deliveryTotal', 
	'deliveryProduct', 'deliveryReference'];
	}
	else if (ajaxView === 'confirmDelivery') {
		fields = ['confirmDate', 'confirmCustomer', 'confirmAddress', 'confirmQty', 'confirmProduct',
		'confirmPlateNo', 'confirmReference'];
	}

	for (var i = 0; i < fields.length; i++) {
		$('#'+fields[i]).val(obj[dbFields[i]]);
	}

	if (ajaxView === 'confirmDelivery')
		$('#confirmPlateNo').val(obj['plate_num']).change();
}

function changeDisabledFields(type) {
	var fields = ['confirmDamaged', 'confirmTimeOut', 'confirmSupplierDR'];
	for (var i = 0; i < fields.length; i++) {
		$('#'+fields[i]).val('');
		$('#'+fields[i]).attr('disabled', false);
	}

	if (type === 'Restock') {
		$('#confirmDamaged').attr('disabled', true);
	}
	else {
		$('#confirmTimeOut').attr('disabled', true);
		$('#confirmSupplierDR').attr('disabled', true);
	}
}

function changeCurrentDeliveryInfo(target, event) {
	var type, id, dbFields;
	if (event === 'card') {
		type = $(target[0]).val();
		id = $(target[1]).val();
	}
	else {
		type = $(target).find('option:selected').text().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");
		id = $(target).val().substring(2);
		if (type === 'LO')
			type = 'Restock';
		else
			type = 'Sell-in'
	}
	$('#deliveryOrderType').text(type);

	$.get('/ajaxChangeDeliveryInfo', { type: type, id: id }, function(data) {

		if (ajaxView === 'scheduleDelivery') {
			dbFields = ['formattedDate', 'customer_name', 'destination', 'qty', 'total_amt', 'product_name',
				'purchase_lo'];
		}
		else if (ajaxView === 'confirmDelivery') {
			dbFields = ['formattedDate', 'customer_name', 'destination', 'qty', 'product_name', 'plate_num',
				'purchase_lo'];

			changeDisabledFields(type);
		}

		if (type === 'Restock')
			data.deliveryInfo.purchase_lo = 'LO'+data.deliveryInfo.purchase_lo;
		else
			data.deliveryInfo.purchase_lo = 'DR'+data.deliveryInfo.purchase_lo;

		clearDeliveryFields(data.deliveryInfo, dbFields);

	});
}

function changeDriver(truck) {
	$.get('/ajaxChangeDriver', { plate_no: truck }, function(data) {
		if (ajaxView === 'scheduleDelivery') {
			$('#deliveryDriver').val(data.truckData.driver);
			$('#deliveryDriverId').val(data.truckData.driver_id);
		}
		else {
			$('#confirmDriver').val(data.truckData.driver);
			$('#confirmDriverId').val(data.truckData.driver_id);
		}
	});
}

$(document).ready(function() {
	$('[name="deliveryCardItem"]').on('click', function() {
		changeCurrentDeliveryInfo($(this).children(), 'card');
	});
	$('#deliveryReference').on('change', function() {
		changeCurrentDeliveryInfo($(this), 'select');
	});
	$('#deliveryTruck').on('change', function() {
		changeDriver($(this).val());
	});

	$('#confirmReference').on('change', function() {
		changeCurrentDeliveryInfo($(this), 'select');
	});
	$('#confirmPlateNo').on('change', function() {
		changeDriver($(this).val());
	});
});