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
	else if (event === 'automatic') {
		type = selectedType;
		id = selectedId;
	}
	else {
		type = $(target).find('option:selected').text().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");
		id = $(target).val().substring(2);
		type = type[0]+type[1];
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
			console.log(type);
			console.log(id);
			dbFields = ['formattedDate', 'customer_name', 'destination', 'qty', 'product_name', 'plate_num',
				'purchase_lo'];

			changeDisabledFields(type);
		}
		
		if (type === 'Restock')
			data.deliveryInfo.purchase_lo = 'LO'+data.deliveryInfo.purchase_lo;
		else
			data.deliveryInfo.purchase_lo = 'DR'+data.deliveryInfo.purchase_lo;

		clearDeliveryFields(data.deliveryInfo, dbFields);
		$("#confirmDamaged").val(0);
	});
}

function changeTruck(trigger) {
	$('#deliveryTruck').val(trigger.children()[0].innerHTML);
	$('#deliveryTruck').trigger('change');
}

function changeDriver(truck) {
	console.log(truck);
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

function applyRecommendedPurchase() {
	if (selectedQty <= 0)
		selectedQty = 1;
	if (selectedQty > 648)
		selectedQty = 648;
	$('#purchase_product').find('option[text='+selectedProduct+']').prop('selected', true);
	$('#purchase_product').trigger('change');
	$('#p_qty').val(selectedQty);
	$('#p_qty').trigger('change');
	var total = parseFloat($('#product_price').text()) * parseFloat(selectedQty);
	$('#total_amt').val(total);
}

$(document).ready(function() {
	/****************** Logistics Ajax *****************/
	if (typeof selectedId != 'undefined')
		changeCurrentDeliveryInfo('', 'automatic');
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
	$('.driver-clickable').on('click', function() {
		changeTruck($(this));
	});

	/****************** Purchasing Ajax *****************/
	$('#date').change(function() {
		$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
			//update price in hbs
			$("#product_price").html(result.price);
		});
	});
	$("#p_qty").change(function(){
		if($("#date").val())
			$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
				var total = result.price * $("#p_qty").val();
				$("#total_amt").val(total);
			});
	});
	if (employee == 'purchasing_role') {
		$('#date').val(dateToday);
		$('#date').trigger('change');
	}
	if (typeof selectedProduct != 'undefined') {
		applyRecommendedPurchase();
		$('#p_qty').trigger('change');
	}
});