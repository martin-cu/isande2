exports.holtWinters = function(data, period, products) {
	var alpha = 0.5, beta = 0.5, gamma = 0.5;
	if (data.length != 0) {
		var last_index;
		var forecast = [];
		var d = new Date();
		var date = d.getDate();
		var day = d.getDay();
		var curr_week = Math.ceil(Math.abs((date - 1 - day) / 7));
		var obj;
		var arr_data;
		var indices = [0, 1, 2, 3];
		for (var i = 0; i < products.length; i++) {
			forecast.push({ product: products[i].product_name });
		}

		for (var y = 0; y < forecast.length; y++) {
			arr_data = [];
			for (var x = 0; x < data.length; x++) {
				forecast[y]['week'] = curr_week;
				if (data[x].length > 0) {
					if (forecast[y].product === data[x][0].product_name ) {
						for (var i = 0; i < data[x].length; i++) {
							if (i < 4) {
								data[x] = prepInitialData(data[x], i, indices);
								last_index = i;
							}
							else {
								data[x] = prepDataPrediction(data[x], i, alpha, beta, gamma);
								last_index = i;
							}
						}
						forecast[y].data = [];
						for (var i = 1; i < 5; i++) {
							var temp = Math.ceil(( data[x][last_index].u + ((i + last_index) - last_index) * data[x][last_index].v ) * data[x][last_index + i - 4].s);
							forecast[y].data.push({ week: i, data: temp });
						}
					}
				}
				else {
					obj = forecast[y];
					obj['data'] = ['Cannot forecast insufficient data'];
					forecast[y] = obj;
				}
			}
		}
		if (period === 'Week') {
			return forecast;
		}
		else if (period === 'Month') {
			return forecast;
		}
	}
	else {
		return null
	}
}

function prepInitialData(data, i, indices) {
	data[i]['v'] = 0;
	data[i]['s'] = data[i].products_sold / avg(data, indices);
	data[i]['u'] = data[i].products_sold / data[i]['s'];

	if (isNaN(data[i].u))
		data[i].u = 1;
	if (isNaN(data[i].s) || data[i].s === 0)
		data[i].s = 1;

	return data;
}

function prepDataPrediction(data, i, alpha, beta, gamma) {
	data[i]['u'] = (alpha*data[i].products_sold) / data[i-4].s + ( (1 - alpha) * (data[i-1].u + data[i-1].v) );
	data[i]['v'] = beta*(data[i].u - data[i-1].u) + (1 - beta) * data[i-1].v;
	data[i]['s'] = gamma*(data[i].products_sold / data[i].u) + (1 - gamma) * data[i-4].s

	return data;
}

function avg(obj, indices) {
	var avg = 0;
	for (var i = 0; i < indices.length; i++) {
		avg += obj[indices[i]].products_sold;
	}
	avg = avg / indices.length;
	return avg;
}

exports.createRecommendation = function(obj, algo) {
	for (var i = 0; i < obj.length; i++) {
		if (algo === 'Algo 1' || algo === 1) {
			var d = new Date();
			var month = d.getMonth();
			var multiplier;

			if (month >= 0 && month <= 2)
				multiplier = 0.75;
			else if (month >= 3 && month <= 5)
				multiplier = 1.55;
			else if (month >= 6 && month <= 8)
				multiplier = 1.25;
			else if (month >= 9 && month <= 11)
				multiplier = 1;

			obj[i]['multiplier'] = multiplier;
			obj[i]['recommended'] = Math.ceil((obj[i].safety_limit * multiplier) - obj[i].qty);
		}
		else if (algo === 'Algo 2' || algo === 2) {
			
		}
		else if (algo === 'Algo 3' || algo === 3) {
			
		}
	}
	return obj;
}

exports.formatDate = function(date, format) {
	var year,month,day;
	const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	const fullMonthNames = ["", "January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"];
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
	else if (format === 'MM DD, YYYY') {
		date = fullMonthNames[month]+' '+day+', '+year;
	}

	return date;
}

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

function formatMoney(amt, label) {
	if (amt === undefined || amt === null)
		amt = 0.00;

	var num_parts = amt.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return label+num_parts.join(".");
}

exports.formatSaleReportData = function(html_data, data, report) {
	var total_qty = 0;
	var total_amt = 0;
	var d = new Date();
	// Format Data
	for (var i = 0; i < data.length; i++) {
		total_qty += data[i].qty;
		total_amt += data[i].total_amt;
		data[i].scheduled_date = formatDate(data[i].scheduled_date, 'MM/DD/YYYY')
		data[i].due_date = formatDate(data[i].due_date, 'MM/DD/YYYY')
		data[i].total_amt = formatMoney(data[i].total_amt.toFixed(2), '');
	}
	html_data['num_orders'] = data.length;
	html_data['num_qty'] = total_qty;
	html_data['num_amt'] = formatMoney(total_amt.toFixed(2), 'Php ');
	html_data['date_accessed'] = formatDate(d, 'mm DD, YYYY');
	html_data['time_accessed'] = formatDate(d, 'HH:m');

	if (report === 'products_sold') {
		html_data['detail_report_lbls'] = ['Fulfilled Order Count', 'Products Sold', 'Total Amount'];
		html_data['detail_report_vals'] = [data.length, formatMoney(total_qty, ''), formatMoney(total_amt.toFixed(2), 'Php ')];
	}
	else if (report === 'total_sales') {
		html_data['detail_report_lbls'] = ['Paid Order Count', 'Products Sold', 'Total Amount'];
		html_data['detail_report_vals'] = [data.length, formatMoney(total_qty, ''), formatMoney(total_amt.toFixed(2), 'Php ')];
	}
	else if (report === 'incoming_overdue') {
		html_data['detail_report_lbls'] = ['Incoming Overdue Bills', 'Amount Receivable'];
		html_data['detail_report_vals'] = [data.length, formatMoney(total_amt.toFixed(2), 'Php ')];
	}
	else if (report === 'overdue_bills') {
		html_data['detail_report_lbls'] = ['Overdue Bills Count', 'Amount Receivable'];
		html_data['detail_report_vals'] = [data.length, formatMoney(total_amt.toFixed(2), 'Php ')];	
	}

	while (data.length < 9)
		data.push({ type: '&nbsp' });

	html_data['sale_report_data'] = data;

	return html_data;
}

exports.formatMoney = function(amt, label) {
	if (amt === undefined || amt === null)
		amt = 0.00;

	if (label === 'Php ')
		amt = parseInt(amt).toFixed(2);

	var num_parts = amt.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return label+num_parts.join(".");
}

exports.formatLocByCustomer = function(arr, customers) {
	var customer_obj = { customer_id: '', customer_name: '', locations: [] };
	var location_obj = { location_id: '', location_name: '' };

	for (var i = 0; i < customers.length; i++) {
		customer_obj = {
			customer_id: customers[i].customer_id,
			customer_name: customers[i].customer_name,
			locations: []
		};
		location_obj = {
			location_id: customers[i].location_id,
			location_name: customers[i].location_name
		};
		customer_obj.locations.push(location_obj);

		if (i < customers.length - 1) {
			while (customers[i].customer_id === customers[i+1].customer_id) {
				location_obj = {
					location_id: customers[i+1].location_id,
					location_name: customers[i+1].location_name
				};
				customer_obj.locations.push(location_obj);
				i++;
			}
		}
		arr.push(customer_obj);
	}
	return arr;
}

exports.formatDueDate = function(date, terms) {
	var add_days;
	if (terms == 'Cash')
		add_days = 0;
	else if (terms == 'NET7')
		add_days = 7;
	else if (terms == 'NET15')
		add_days = 15;
	else if (terms == 'NET30')
		add_days = 30;
	
	return new Date( Date.parse(date) + add_days * 24 * 60 * 60 * 1000);
}

exports.formatPage = function(limit, offset, count) {
	console.log(limit+'-'+offset+'-'+count);
	if (limit > count)
		limit = count;
	else if (limit === null || limit === undefined)
		limit = 10;
	if (offset < 0 || offset === null || offset === undefined)
		offset = 0;

	return { limit: limit, offset: offset };
}

exports.groupUnpaidCustomerOrders = function(arr) {
	var groupedArr = [];
	var customerObj = {};
	var orderObj = {};
	for (var i = 0; i < arr.length; i++) {
		orderObj = {
			deliveryReceipt: arr[i].delivery_receipt,
			productName: arr[i].product_name,
			qty: arr[i].qty,
			totalAmt: arr[i].total
		};
		customerObj = {
			customerID: arr[i].customer_id,
			customerName: arr[i].customer_name,
			orderDetails: []
		};
		customerObj['orderDetails'].push(orderObj);
		if (i < arr.length - 1) {
			while (arr[i].customer_id === arr[i+1].customer_id && i < arr.length - 2) {
				orderObj = {
					deliveryReceipt: arr[i+1].delivery_receipt,
					productName: arr[i+1].product_name,
					qty: arr[i+1].qty,
					totalAmt: arr[i+1].total
				};
				customerObj['orderDetails'].push(orderObj);
				i++;
			}
		}
		groupedArr.push(customerObj);
	}
	return groupedArr;
}

exports.startOfWeek = function(date) {
	var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

	return formatDate(new Date(date.setDate(diff)), "mm DD, YYYY");
}

exports.groupByDayofWeek = function(dates, orders) {
	var arr = [];
	var dayObj = {};
	var orderObj;

	for (var i = 0; i < dates.length; i++) {
		dayObj = {};
		dayObj['date'] = dates[i];
		dayObj['orders'] = [];
		for (var x = 0; x < orders.length; x++) {
			if (orders[x].formattedSchedule === dates[i] || orders[x].formattedDate === dates[i]) {
				orderObj = {};
				orderObj['deliveryReceipt'] = orders[x].delivery_receipt;
				orderObj['supplier_lo'] = orders[x].supplier_lo;
				orderObj['customer'] = orders[x].customer_name;
				orderObj['product'] = orders[x].product_name;
				orderObj['qty'] = orders[x].qty;
				orderObj['status'] = orders[x].order_status || orders[x].status;
				orderObj['order_type'] = orders[x].order_type;
				dayObj['orders'].push(orderObj);
			}
		}
		arr.push(dayObj);
	}
	return arr;
}

exports.groupedMonthlySales = function(data) {
	var arr = [];
	var found;
	var monthObj = {};
	var months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun',
	'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	for (var i = 0; i < months.length; i++) {
		for (var x = 0; x < data.length; x++) {
			if (months[i] === data[x].month) {
				found = 1;
				monthObj = {};
				monthObj['month'] = months[i];
				monthObj['earnings'] = data[x].net_income;
				arr.push(monthObj);
			}
		}
		if (found)
			found = 0;
		else {
			monthObj = {};
			monthObj['month'] = months[i];
			monthObj['earnings'] = 0;
			arr.push(monthObj);
		}
	}
	return arr;
}
exports.groupedMonthlyPurchases = function(data) {
	var arr = { rcc_series: [], fcc_series: [] };
	var found;
	var months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun',
	'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	for (var i = 0; i < months.length; i++) {
		for (var x = 0; x < data.length; x++) {
			if (months[i] === data[x].month) {
				found = 1;
				
				if (data[x].product_name === 'FCC')
					arr.fcc_series.push(data[x].qty);
				else
					arr.rcc_series.push(data[x].qty);
			}
		}
		if (found)
			found = 0;
		else {
			arr.fcc_series.push(0);
			arr.rcc_series.push(0);
		}
	};
	return arr;
}
exports.transformPerfectOrderRate = function(data) {
	var arr = [];
	var found;
	var monthObj = {};
	var months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun',
	'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	for (var i = 0; i < months.length; i++) {
		for (var x = 0; x < data.length; x++) {
			if (months[i] === data[x].month) {
				found = 1;
				monthObj = {};
				monthObj['month'] = months[i];
				monthObj['data'] = (data[x].percentDamageFree * data[x].percentOnTime / 100).toFixed(2);
				arr.push(monthObj);
			}
		}
		if (found)
			found = 0;
		else {
			monthObj = {};
			monthObj['month'] = months[i];
			monthObj['data'] = NaN;
			arr.push(monthObj);
		}
	}
	return arr;
}
exports.groupedDeliveryByLoc = function(data) {
	if (data.length != 0) {
		var obj = { labels: [], data: [] };
		for (var i = 0; i < data.length; i++) {
			obj.labels.push(data[i].location_name);
			obj.data.push(data[i].count_deliveries);
		}
		return obj;
	}
	else
		return ;
}

exports.formatReportMetrics = function(data) {
	var obj;
	var arr = [];

	for (var i = 0; i < Object.keys(data).length; i++) {
		if (Object.keys(data)[i] == 'total_qty') {
			obj = { metricName: 'Total Bags Sold', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'count_orders') {
			obj = { metricName: 'Order Count', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'max_qty') {
			obj = { metricName: 'Max Quantity', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'min_qty') {
			obj = { metricName: 'Min Quantity', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'avg_qty') {
			obj = { metricName: 'Avg Quantity/Order', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'total') {
			obj = { metricName: 'Total Bags Sold', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'order_count') {
			obj = { metricName: 'Order Count', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'avg_profit') {
			obj = { metricName: 'Avg Profit', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'max_profit') {
			obj = { metricName: 'Max Profit', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'min_profit') {
			obj = { metricName: 'MinProfit', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'markup') {
			obj = { metricName: 'Avg Markup', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'total_orders') {
			obj = { metricName: 'Total Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'completed') {
			obj = { metricName: 'Completed Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'processing') {
			obj = { metricName: 'Processing Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'pending') {
			obj = { metricName: 'Pending Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'overdue') {
			obj = { metricName: 'Overdue Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'deliveries') {
			obj = { metricName: 'Delivery Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
		else if (Object.keys(data)[i] == 'pickup') {
			obj = { metricName: 'Pick-up Orders', metricData: data[Object.keys(data)[i]] };
			arr.push(obj);
			obj = {};
		}
	}
	return arr;
}

exports.getNotifRoles = function(data) {
	var temp, arr = ['System Admin'];
	for (var i = 0; i < data.length; i++) {
		temp = data.charAt(i);
		if (temp == 'S') {
			arr.push('Sales Employee');
		}
		else if (temp == 'P') {
			arr.push('Purchasing Employee');
		}
		else if (temp == 'L') {
			arr.push('Logistics Employee');
		}
	}
	return arr;
}

exports.aggregateSalesByCustomer = function(data) {
	var arr = [];
	var page = [], customerObj, ordersObj;
	var grandTotal = 0, pageLimit = 30, rowCount = 0;
	var pageData = { customers: [] };
	var total = 0;
	var pageObj = {};

	//Group Records by Customer Together
	for (var i = 0; i < data.length-1; i++) {
		customerObj = { customer_name: data[i].customer_name, orders_arr: [], total_amount: parseFloat(data[i].formattedAmount.replace(',','')) };
		ordersObj = { 
			date: data[i].formattedDate,
			qty: data[i].qty,
			product: data[i].product_name,
			amount: data[i].formattedAmount
		}
		customerObj.orders_arr.push(ordersObj);
		if (i+2 == data.length) {
			if (data[i].customer_name == data[i+1].customer_name) {
				i++;
				ordersObj = { 
					date: data[i].formattedDate,
					qty: data[i].qty,
					product: data[i].product_name,
					amount: data[i].formattedAmount
				}
				customerObj.orders_arr.push(ordersObj);
				customerObj.total_amount += parseFloat(data[i].formattedAmount.replace(',',''));
				customerObj.total_amount = customerObj.total_amount.toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});
				customerObj['rows'] = customerObj.orders_arr.length+1;
				arr.push(customerObj);
			}
			else {
				for (var x = i; x < i+2; x++) {
					customerObj = { customer_name: data[x].customer_name, orders_arr: [], total_amount: parseFloat(data[x].formattedAmount.replace(',','')) };
					ordersObj = { 
						date: data[x].formattedDate,
						qty: data[i].qty,
						product: data[i].product_name,
						amount: data[x].formattedAmount
					}
					customerObj.orders_arr.push(ordersObj);
					customerObj.total_amount = customerObj.total_amount.toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});
					customerObj['rows'] = customerObj.orders_arr.length+1;
					arr.push(customerObj);
				}
			}
		}
		else {
			while (data[i].customer_name == data[i+1].customer_name && i < data.length-2) {
				i++;
				ordersObj = { 
					date: data[i].formattedDate,
					qty: data[i].qty,
					product: data[i].product_name,
					amount: data[i].formattedAmount
				}
				customerObj.orders_arr.push(ordersObj);
				customerObj.total_amount += parseFloat(data[i].formattedAmount.replace(',',''));
			}
			customerObj.total_amount = customerObj.total_amount.toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});
			customerObj['rows'] = customerObj.orders_arr.length+1;
			arr.push(customerObj);
		}
	}

	//Transform Customer Data by Record
	for (var i = 0; i < arr.length; i++) {
		arr[i].orders_arr[0]['customer_name'] = arr[i].customer_name;
		grandTotal += parseFloat(arr[i].total_amount.replace(',',''));
	}
	grandTotal = grandTotal.toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});

	arr.push({ customer_name: '', orders_arr: [], grandTotal: grandTotal, rows: 1 })

	//Seggregate to Pages according to page limit
	for (var i = 0; i < arr.length; i++) {
		rowCount += arr[i].rows;
		if (rowCount < pageLimit && i < arr.length) {
			pageData.customers.push(arr[i]);
			if (i+1 == arr.length) {
				page.push(pageData);
			}
		}
		else {
			if (rowCount == pageLimit) {
				pageData.customers.push(arr[i]);
				page.push(pageData);
				rowCount = 0;
				pageData = { customers: [] };
			}
			else {
				var endingPos = arr[i].orders_arr.length - (rowCount - pageLimit);
				customerObj = { customer_name: arr[i].customer_name, orders_arr: [] };
				for (var x = 0; x <= endingPos; x++) {
					customerObj.orders_arr.push(arr[i].orders_arr[x]);
				}
				pageData.customers.push(customerObj);
				page.push(pageData);
				rowCount = 0;
				pageData = { customers: [] };

				customerObj = { customer_name: '', orders_arr: [], total_amount: arr[i].total_amount };
				for (var y = endingPos; y < arr[i].orders_arr.length; y++) {
					customerObj.orders_arr.push(arr[i].orders_arr[y]);
				}
				pageData.customers.push(customerObj);

				rowCount += arr[i].orders_arr.length;

				if (i+1 == arr.length) {
					page.push(pageData);
				}

			}
		}
	}

	pageObj['pages'] = page;
	pageObj['grandTotal'] = grandTotal;

	return pageObj;
}

exports.aggregateRevenueByPage = function(revenue, cogs) {
	var blankRevenue = { delivery_receipt: '&nbsp', formattedDate: '', product_name: '', qty: '', formattedAmount: '' };
	var totalRevenue = { delivery_receipt: '', formattedDate: '', product_name: '', qty: '', totalAmount: '' };
	var blankCogs = { delivery_receipt: '&nbsp', product_name: ' ', qty: '', formattedAmount: ' ' };
	var totalCogs = { delivery_receipt: '', product_name: '', qty: '', totalAmount: '' };
	var grossProfit = { delivery_receipt: '', product_name: '', qty: '', grossProfit: '' };
	var page = [], pageData = { 
		revenue: [], revenueTitle: 'Revenue', 
		revenueHeaders: [{ title: 'DR Number', class: '' }, { title: 'Transaction Date', class: 'text-center' }, { title: 'Product', class: 'text-center' }, { title: 'Qty', class: 'text-center' }, { title: 'Amount', class: 'text-right' }], 
		cogs: [] , cogsTitle: null,
		cogsHeaders: []
	};
	rowCount = 2;
	var pageLimit = 32, total = 0;
	var revenueTotal = 0, cogsTotal = 0;
	var pageObj = {};

	for (var i = 0; i < revenue.length; i++)
		revenueTotal += parseFloat(revenue[i].formattedAmount.replace(',',''));

	for (var i = 0; i < cogs.length; i++)
		cogsTotal += parseFloat(cogs[i].formattedAmount.replace(',',''));

	grossProfit['grossProfit'] = (revenueTotal - cogsTotal).toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});;
	totalRevenue['totalAmount'] = revenueTotal.toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});;
	totalCogs['totalAmount'] = cogsTotal.toLocaleString('en-US', {maximumFractionDigit:2, minimumFractionDigits:2});;

	revenue = JSON.parse(JSON.stringify(revenue));
	revenue.push(blankRevenue);
	revenue.push(totalRevenue);

	cogs = JSON.parse(JSON.stringify(cogs));
	cogs.push(blankCogs);
	cogs.push(totalCogs);
	cogs.push(blankCogs);
	cogs.push(grossProfit);
	cogs.push(blankCogs);
	
	for (var i = 0; i < revenue.length; i++) {
		rowCount++;
		if (rowCount < pageLimit && i < revenue.length) {
			pageData.revenue.push(revenue[i]);
			if (i+1 == revenue.length) {
				//page.push(pageData);
			}
		}
		else {
			if (rowCount == pageLimit) {
				pageData.revenue.push(revenue[i]);
				if (i+1 != revenue.length)
					page.push(pageData);
				rowCount = 2;
				pageData = { 
					revenue: [], revenueTitle: 'Revenue', 
					revenueHeaders: [{ title: 'DR Number', class: '' }, { title: 'Transaction Date', class: 'text-center' }, { title: 'Product', class: 'text-center' }, { title: 'Qty', class: 'text-center' }, { title: 'Amount', class: 'text-right' }], 
					cogs: [] , cogsTitle: null,
					cogsHeaders: []
				};	
			}
		}
	}

	for (var i = 0; i < cogs.length; i++) {
		rowCount++;
		if (i == 0 && rowCount <= pageLimit) {
			pageData.cogsTitle = 'Cost of Goods Sold';
			pageData.cogsHeaders = [{ title: 'DR Number', class: '' },{ title: 'Product', class: 'text-center' },{ title: 'Buying Price', class: 'text-right' },{ title: 'Amount', class: 'text-right' }];
		}
		if (rowCount < pageLimit && i < cogs.length) {
			pageData.cogs.push(cogs[i]);
			if (i+1 == cogs.length) {
				page.push(pageData);
			}
		}
		else {
			if (rowCount == pageLimit) {
				pageData.cogs.push(cogs[i]);
				page.push(pageData);
				rowCount = 2;
				pageData = { 
					revenue: [], revenueTitle: null, 
					revenueHeaders: [],
					cogs: [] , cogsTitle: 'Cost of Goods Sold',
					cogsHeaders: [{ title: 'DR Number', class: '' },{ title: 'Product', class: 'text-center' },{ title: 'Buying Price', class: 'text-right' },{ title: 'Amount', class: 'text-right' }]
				};
			}
		}
	}

	return page;
}