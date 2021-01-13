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

exports.updateSaleRecord = function(update, query, next) {
	var sql = "update sales_history set ? where ?";
	sql = mysql.format(sql, update);
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}

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
	var sql = 'select * from (select sh.delivery_receipt as delivery_receipt, sh.scheduled_date as scheduled_date, ct.customer_name as customer_name, pt.product_name as product_name, sh.qty as qty, sh.amount as price, (sh.qty * sh.amount) as total_amt, sh.payment_terms as payment_terms, sh.due_date as due_date, sh.payment_status as payment_status, sh.order_type as order_type , concat(et.last_name, ", ", et.first_name) as driver, ddt.plate_no as plate_no, ddt.damaged_bags as damaged_bags, ddt.status, sh.pickup_plate as pickup_plate, sh.order_status as order_status from sales_history as sh join customer_table as ct using (customer_id) join product_table as pt using (product_id) left outer join delivery_detail_table as ddt using (delivery_receipt) left outer join employee_table as et on et.employee_id = ddt.driver ?) as t where delivery_receipt IS NOT NULL group by delivery_receipt order by order_status, scheduled_date, payment_status limit ?, ?';

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

	mysql.query(sql, next);
}

exports.getSaleRecordDetail = function(query, next) {
	var sql = "select * from (select sh.delivery_receipt as delivery_receipt, sh.scheduled_date as scheduled_date, ct.customer_name as customer_name, pt.product_name as product_name, sh.qty as qty, sh.amount as price, (sh.qty * sh.amount) as total_amt, sh.payment_terms as payment_terms, sh.due_date as due_date, sh.payment_status as payment_status, sh.order_type as order_type , concat(et.last_name, ', ', et.first_name) as driver, ddt.plate_no as plate_no, ddt.damaged_bags as damaged_bags, ddt.status, sh.pickup_plate as pickup_plate, sh.order_status as order_status, ddt.delivery_address as delivery_address, pdt.check_num as check_num, sh.time_recorded as time_recorded, sh.purchase_lo from sales_history as sh join customer_table as ct using (customer_id) join product_table as pt using (product_id) left outer join delivery_detail_table as ddt using (delivery_receipt) left outer join employee_table as et on et.employee_id = ddt.driver left outer join payment_details_table as pdt using (payment_id) union select null, null, null, null, null, null, null, null, null, null, null, et.first_name as driver, temp.plate_no as plate_no, temp.damaged_bags as damaged_bags, temp.status, null, null, temp.delivery_address as delivery_address, null, null, null from delivery_detail_table as temp join employee_table as et on et.employee_id = temp.driver right outer join sales_history using (delivery_receipt) ) as t where ? group by delivery_receipt order by order_status, scheduled_date, payment_status";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
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