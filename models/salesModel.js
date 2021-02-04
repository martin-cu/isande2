var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getMonthlyCount = function(next) {
	var sql = "SELECT delivery_receipt FROM sales_history where Month(time_recorded) = month(now())";

	mysql.query(sql, next);
};

exports.createSales = function(query, next) {
	var sql = "insert into sales_history set ?";
	sql = mysql.format(sql, query);
	
	mysql.query(sql, next);
};

exports.getUnpaidOrders = function(next) {
	var sql = "SELECT c.customer_name , format((sh.qty*sh.amount), 2) as total , date_format(sh.due_date, '%m/%d/%Y') as formattedDue, case when datediff(now(), sh.due_date) > 0 then 1 else null end as overdue FROM sales_history as sh JOIN customer_table as c using(customer_id) where sh.payment_status = 'Unpaid' and sh.void != 1 order by due_date asc, customer_name";

	mysql.query(sql, next);
};

exports.getTrackOrders = function(query, next) {
	var sql = "select sh.*, ct.*, pt.product_name, date_format(sh.scheduled_date, '%b %e, %Y') as formattedSchedule from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) where sh.void != 1 and sh.scheduled_date between date(date_sub(now(), interval ? day) + INTERVAL ( - WEEKDAY(date_sub(now(), interval ? day))) DAY) and DATE(date_sub(now(), interval ? day) + INTERVAL (6 - WEEKDAY(date_sub(now(), interval ? day))) DAY) order by scheduled_date";
	while (sql.includes('?')) {
		sql = mysql.format(sql, query);
	}
	
	mysql.query(sql, next);
}

exports.getPickupRecordDetail = function(query, next) {
	var sql = "select clt.location_name as customer_location, sh.delivery_receipt, date_format(sh.scheduled_date, '%b %e, %Y') as scheduled_date, ct.customer_name, pt.product_name, sh.qty, sh.amount as price, format(sh.qty*sh.amount, 2) as total_amt, sh.payment_terms, date_format(sh.due_date, '%b %e, %Y') as due_date, sh.payment_status, sh.order_type, 'N/A' as driver, 'N/A' as plate_no, 'N/A' as damaged_bags, sh.order_status as status, sh.pickup_plate, 'N/A' as delivery_address, pdt.check_num, sh.time_recorded, sh.purchase_lo from sales_history as sh left join payment_details_table as pdt using(payment_id) join product_table as pt using(product_id) join customer_table as ct using(customer_id) join customer_location_table as clt using(customer_id) where ?";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}


exports.getSaleRecordDetail = function(query, next) {
	var sql = "select * from ( select clt.location_name, sh.delivery_receipt as delivery_receipt, sh.scheduled_date as scheduled_date, ct.customer_name as customer_name, pt.product_name as product_name, sh.qty as qty, sh.amount as price, format((sh.qty * sh.amount),2) as total_amt, sh.payment_terms as payment_terms, sh.due_date as due_date, sh.payment_status as payment_status, sh.order_type as order_type , concat(et.last_name, ', ', et.first_name) as driver, ddt.plate_no as plate_no, ddt.damaged_bags as damaged_bags, ddt.status, sh.pickup_plate as pickup_plate, sh.order_status as order_status, ddt.delivery_address as delivery_address, pdt.check_num as check_num, sh.time_recorded as time_recorded, sh.purchase_lo from sales_history as sh join customer_table as ct using (customer_id) join product_table as pt using (product_id) left outer join delivery_detail_table as ddt using (delivery_receipt) left outer join employee_table as et on et.employee_id = ddt.driver left outer join payment_details_table as pdt using (payment_id) join customer_location_table as clt on ddt.delivery_address = clt.location_id union select null, null, null, null, null, null, null, null, null, null, null, null, et.first_name as driver, temp.plate_no as plate_no, temp.damaged_bags as damaged_bags, temp.status, null, null, temp.delivery_address as delivery_address, null, null, null from delivery_detail_table as temp join employee_table as et on et.employee_id = temp.driver right outer join sales_history using (delivery_receipt) ) as t where ? group by delivery_receipt order by order_status, scheduled_date, payment_status";
	sql = mysql.format(sql, query);
	if (Array.isArray(query.delivery_receipt)) {
		var temp = sql.split('where');
		temp[1] = ' where '+temp[1];
		if (query.delivery_receipt.length >= 2) {
			while (temp[1].includes(',')) {
				temp[1] = temp[1].replace(',', ' or delivery_receipt =');
			}
		}
		sql = temp[0]+temp[1];
	}
	else {

	}
	mysql.query(sql, next);
}

exports.updateSaleRecord = function(update, query, next) {
	var sql = "update sales_history set ? where ?";
	sql = mysql.format(sql, update);
	sql = mysql.format(sql, query);
	var temp = sql.split('where');
	temp[1] = ' where '+temp[1];
	if (query.delivery_receipt.length >= 2) {
		while (temp[1].includes(',')) {
			temp[1] = temp[1].replace(',', ' or delivery_receipt =');
		}
	}
	sql = temp[0]+temp[1];
	mysql.query(sql, next);
}

exports.updateSaleDeliveryRecord = function(update1, update2, query, next) {
	var sql = "update sales_history set ? where ?;update delivery_detail_table set ? where delivery_detail_id = ( select sh.delivery_details from sales_history as sh where ?)";
	sql = mysql.format(sql, update1);
	sql = mysql.format(sql, query);
	sql = mysql.format(sql, update2);
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}

exports.getAllSaleRecords = function(next) {
	var sql = "select date_format(t.scheduled_date, '%m/%d/%Y') as formattedDate, ct.customer_name, pt.product_name, case when t.damaged_bags is null then 'N/A' else t.damaged_bags end as formattedDamage, format(t.amount*t.qty,2) as formattedTotal, format(t.amount, 2) as formattedAmount, t.* from ( SELECT sh.*, ddt.damaged_bags FROM sales_history as sh join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id where sh.void != 1 union select sh.*, null from sales_history as sh where sh.void != 1) as t join customer_table as ct using(customer_id) join product_table as pt using(product_id) group by delivery_receipt order by t.order_status desc, t.scheduled_date, t.customer_id, t.time_recorded";
	mysql.query(sql, next);
}








//OLD FUNCTIONS

exports.getSaleRecordCount = function(sh, next) {
	var sql = 'select count(*) as count from (select sh.delivery_receipt as delivery_receipt, sh.scheduled_date as scheduled_date, ct.customer_name as customer_name, pt.product_name as product_name, sh.qty as qty, sh.amount as price, (sh.qty * sh.amount) as total_amt, sh.payment_terms as payment_terms, sh.due_date as due_date, sh.payment_status as payment_status, sh.order_type as order_type , concat(et.last_name, ", ", et.first_name) as driver, ddt.plate_no as plate_no, ddt.damaged_bags as damaged_bags, ddt.status, sh.pickup_plate as pickup_plate, sh.order_status as order_status from sales_history as sh join customer_table as ct using (customer_id) join product_table as pt using (product_id) left outer join delivery_detail_table as ddt using (delivery_receipt) left outer join employee_table as et on et.employee_id = ddt.driver ?) as t where delivery_receipt IS NOT NULL group by delivery_receipt';
	var arr;
	var str;
	var temp;
	var condition;

	if (!Object.keys(sh).length)
		sh = undefined;

	if (sh != undefined) {
		arr = [];
		var sh_keys = Object.keys(sh);
		for (var i = 0; i < sh_keys.length; i++) {
			str = '';
			sh[sh_keys[i]].forEach(function(item, index) {
				sh[sh_keys[i]][index] = '"'+item+'"';
			});
			var temp = sh[sh_keys[i]].join();
			if (sh_keys[i] === 'qty') 
				sh_keys[i] = 'sh.qty';
			if (sh_keys[i] === 'sh.qty' || sh_keys[i] === 'amount' 
				|| sh_keys[i] === 'scheduled_date' || sh_keys[i] === 'due_date' || sh_keys[i] === 'damaged_bags') {
				temp = temp.replace(',', ' and ');
				if (sh_keys[i] === 'damaged_bags')
					temp += 'or damaged_bags is null';
				arr.push(sh_keys[i] + ' between ' + temp);
			}
			else if (sh_keys[i] === 'delivery_receipt') {
				arr.push(sh_keys[i]+' like '+temp);
			}
			else {
				while (temp.includes(',')) {
					temp = temp.replace(',', ' or '+sh_keys[i] + ' = ');
				}
				arr.push(sh_keys[i] + ' = ' + temp);
			}
		}
		arr.forEach(function(item, index) {
			arr[index] = '('+item+')';
		});
		arr = arr.join();
		while (arr.includes(',')) {
			arr = arr.replace(',', ' and ');
		}
		sql = mysql.format(sql, 'where ?');
		while(sql.includes("'"))
			sql = sql.replace("'", '');
		sql = mysql.format(sql, arr);
		while(sql.includes("'"))
			sql = sql.replace("'", '');
	}
	else
		sql = mysql.format(sql, { });

	while (sql.includes('\\')) {
		sql = sql.replace('\\', '');
	}

	mysql.query(sql, next);
};

exports.getSaleRecords = function(sh, offset, limit, next) {
	var sql = 'select * from (select sh.pickup_plate, sh.delivery_receipt as delivery_receipt, sh.scheduled_date as scheduled_date, ct.customer_name as customer_name, pt.product_name as product_name, sh.qty as qty, sh.amount as price, (sh.qty * sh.amount) as total_amt, sh.payment_terms as payment_terms, sh.due_date as due_date, sh.payment_status as payment_status, sh.order_type as order_type , concat(et.last_name, ", ", et.first_name) as driver, ddt.plate_no as plate_no, ddt.damaged_bags as damaged_bags, ddt.status, sh.pickup_plate as pickup_plate, sh.order_status as order_status from sales_history as sh join customer_table as ct using (customer_id) join product_table as pt using (product_id) left outer join delivery_detail_table as ddt using (delivery_receipt) left outer join employee_table as et on et.employee_id = ddt.driver ?) as t where delivery_receipt IS NOT NULL group by delivery_receipt order by order_status, scheduled_date, payment_status limit ?, ?';

	var arr;
	var str;
	var temp;
	var condition;

	if (!Object.keys(sh).length)
		sh = undefined;

	if (sh != undefined) {
		arr = [];
		var sh_keys = Object.keys(sh);
		for (var i = 0; i < sh_keys.length; i++) {
			str = '';
			sh[sh_keys[i]].forEach(function(item, index) {
				sh[sh_keys[i]][index] = '"'+item+'"';
			});
			var temp = sh[sh_keys[i]].join();
			if (sh_keys[i] === 'qty') 
				sh_keys[i] = 'sh.qty';
			if (sh_keys[i] === 'sh.qty' || sh_keys[i] === 'amount' 
				|| sh_keys[i] === 'scheduled_date' || sh_keys[i] === 'due_date' || sh_keys[i] === 'damaged_bags') {
				temp = temp.replace(',', ' and ');
				if (sh_keys[i] === 'damaged_bags')
					temp += 'or damaged_bags is null';
				arr.push(sh_keys[i] + ' between ' + temp);
			}
			else if (sh_keys[i] === 'delivery_receipt') {
				arr.push(sh_keys[i]+' like '+temp);
			}
			else {
				while (temp.includes(',')) {
					temp = temp.replace(',', ' or '+sh_keys[i] + ' = ');
				}
				arr.push(sh_keys[i] + ' = ' + temp);
			}
		}
		arr.forEach(function(item, index) {
			arr[index] = '('+item+')';
		});
		arr = arr.join();
		while (arr.includes(',')) {
			arr = arr.replace(',', ' and ');
		}
		sql = mysql.format(sql, 'where ?');
		while(sql.includes("'"))
			sql = sql.replace("'", '');
		sql = mysql.format(sql, arr);
		while(sql.includes("'"))
			sql = sql.replace("'", '');
	}
	else
		sql = mysql.format(sql, { });

	while (sql.includes('\\')) {
		sql = sql.replace('\\', '');
	}
	sql = mysql.format(sql, offset);
	sql = mysql.format(sql, limit);
}


exports.getDeliveryCarriers = function(query, next) {
	var sql = "select de.*, et.first_name, et.last_name from delivery_employees as de left outer join delivery_detail_table as ddt using (delivery_detail_id) join employee_table as et on de.carrier_id = et.employee_id where ? and delivery_emp_id is not null";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.createPaymentDetails = function(query, next) {
	var sql = "insert into payment_details_table set ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.getSaleFilters = function(next) {
	var sql = "select max(t.qty) as max_qty, max(t.price) as max_price, min(t.min_price) as min_price, max(t.max_dmged) as max_dmged, min(t.start_date) as start_date, max(t.end_date) as end_date, max(t.end_due) as end_due from (select distinct max(sh.qty) as qty, null as price, null as min_price, null as max_dmged, min(sh.scheduled_date) as start_date, max(sh.scheduled_date) as end_date, max(sh.due_date) as end_due from sales_history as sh union select distinct null, max(pct.selling_price), min(pct.selling_price), null, null, null, null from product_catalogue_table as pct union select distinct null, null, null, max(ddt.damaged_bags), null, null, null from delivery_detail_table as ddt) as t";
	mysql.query(sql, next);
}


exports.getSaleStatus = function(dr, next){
	var sql = "SELECT order_status, product_id FROM sales_history WHERE delivery_receipt = ? ;"
	sql = mysql.format(sql, dr);

	mysql.query(sql, next);
}

exports.getCustomerLocation = function(loc_id, next){
	var sql = "select * from customer_location_table where location_id = ?;";
	sql = mysql.format(sql, loc_id);

	mysql.query(sql, next);
};
