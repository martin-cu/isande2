function formatDate(date, format) {
	var year,month,day;
	const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	year = date.getFullYear();
	month = date.getMonth()+1;
	day = date.getDate();

	if (format === 'MM/DD/YYYY') {
		if (month < 10)
			month = '0'+month;
		if (day < 10)
			day = '0'+day;
		date = month+'/'+day+'/'+year;
	}
	else if (format === 'YYYY-MM-DD') {
		if (month < 10)
			month = '0'+month;
		if (day < 10)
			day = '0'+day;
		date = year+'-'+month+'-'+day;
	}
	else if (format === 'mm DD, YYYY') {
		date = monthNames[month]+' '+day+', '+year;
	}
	else if (format === 'HH:m') {
		var hour = parseInt(date.getHours());
		var lbl;
		if (hour < 12)
			lbl = 'AM';
		else {
			lbl = 'PM';
		}

		if (hour == 0)
			hour = 12;
		else if (hour > 12)
			hour -= 12;

		date = hour+':'+date.getMinutes()+lbl;
	}

	return date;
}

function appendCalendarDates(arr) {
	var td, tr = $('#calendarDates');
	for (var i = 0; i < arr.length; i++) {
		td = document.createElement('td');
		td.setAttribute('class', 'text-center font-weight-bold');
		td.innerHTML = arr[i];
		
		tr.append(td);
	}
}

function appendCalendarCards(arr) {
	var br, td, div, p1, p2, tr = $('#calendarCards');
	var href, pContent, pContent2, elemClass;
	var divParent;
	var opaque = '';
	var today = formatDate(new Date(), 'mm DD, YYYY');
	for (var i = 0; i < arr.length; i++) {
		td = document.createElement('td');
		td.setAttribute('class', 'text-center');
		td.setAttribute('style', 'width: 170px;');

		if (today != arr[i].date)
			opaque = ' opaque ';
		else
			opaque = '';
		for (var x = 0; x < arr[i].orders.length; x++) {
			if (view === 'Sales Employee') {
				href = '/view_sale_details/'+arr[i].orders[x].deliveryReceipt;
				pContent = arr[i].orders[x].customer;
				pContent2 = arr[i].orders[x].product+' - '+arr[i].orders[x].qty+' bags';
			}
			else if (view === 'Purchasing Employee') {
				href = '/view_purchase_details/'+arr[i].orders[x].supplier_lo;
				pContent = 'LO '+arr[i].orders[x].supplier_lo;
				pContent2 = arr[i].orders[x].product+' - '+arr[i].orders[x].qty+' bags';
			}
			else if (view === 'Logistics Employee') {
				href = '/view_delivery_details/'+arr[i].orders[x].supplier_lo;
				
				if (arr[i].orders[x].order_type === 'Restock') {
					pContent = 'Restock';
					// pContent = arr[i].orders[x].order_type+' ('+arr[i].orders[x].supplier_lo+')';
				}
				else {
					pContent = arr[i].orders[x].customer;
					// pContent = arr[i].orders[x].order_type+' ('+arr[i].orders[x].deliveryReceipt+')';
				}

				pContent2 = arr[i].orders[x].product+' - '+arr[i].orders[x].qty+' bags';
			}

			divParent = document.createElement('div');
			divParent.setAttribute('onclick', 'location.href="'+href+'"');
			divParent.setAttribute('class', 'mb-2 card shadow border-left-'+arr[i].orders[x].status+opaque);

			div = document.createElement('div');
			div.setAttribute('class', 'text-center cursor');

			p1 = document.createElement('p');
			p1.setAttribute('class', 'text-center status-data');
			p1.innerHTML = pContent;
			p2 = document.createElement('p');
			p2.setAttribute('class', 'text-center status-data');
			p2.innerHTML = pContent2;

			br = document.createElement('br');

			div.appendChild(p1);
			div.appendChild(p2);
			divParent.appendChild(div);
			td.appendChild(divParent);
		}
		tr.append(td);
	}
}

function changeShowDate(val) {
	var url;
	
	if (view === 'Sales Employee')
		url = '/changeSaleCalendar';
	else if (view === 'Purchasing Employee')
		url = '/changePurchaseCalendar';
	else if (view === 'Logistics Employee')
		url = '/changeLogisticCalendar';

	$('#startDate').val( parseInt($('#startDate').val()) + val );

	$.get(url, { offset: $('#startDate').val() }, function(calendar) {
		$('#calendarDates').children().remove();
		$('#calendarCards').children().remove();
		appendCalendarDates(calendar.weeklyDate);
		appendCalendarCards(calendar.weeklyOrders);
	});
}

$(document).ready(function() {
	$('#orderPrev').click(function() {
		changeShowDate(7);
	});
	$('#orderNext').click(function() {
		changeShowDate(-7);
	});
});