var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.create = function(query, next) {
	var sql = "INSERT INTO delivery_detail_table SET ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
};

exports.getDeliveryFilters = function(next) {
	var sql = "select min(t.min_sh) as min_date, max(t.min_sh) as max_date from (select sh.scheduled_date as min_sh from sales_history as sh union all select ph.date from purchase_history as ph ) as t";

	mysql.query(sql, next);
}

exports.singleQuery = function(query, next) {
	var sql = "select * from delivery_detail_table where ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.editDeliveryDetails = function(query, update, next) {
	var sql = "update delivery_detail_table set ? where ?";
	sql = mysql.format(sql, update);
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.deleteDeliveryDetails = function(query, next) {
	var sql = "delete from delivery_detail_table where ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.getDeliveryCount = function(filters, next) {
	var sql = 'select count(*) as count from (select ddt.status, ddt.plate_no, ddt.driver, sh.product_id, sh.purchase_lo, ddt.delivery_receipt, clt.location_name, sh.scheduled_date as date, ddt.delivery_type as order_type, ddt.status + 0 as status_index from delivery_detail_table as ddt join sales_history as sh using (delivery_receipt) join customer_location_table as clt on clt.location_id = ddt.delivery_address left outer join purchase_history as ph on sh.purchase_lo = ph.supplier_lo union all select ph.status, ph.plate_num, ph.driver, ph.product_id, ph.supplier_lo, ph.supplier_dr, null as delivery_address, ph.date, null, ph.status + 0 as status_index from purchase_history as ph ) as t join product_table as pt using(product_id) left outer join employee_table as et on et.employee_id = t.driver ? group by ifnull(t.purchase_lo, t.delivery_receipt)';
	var arr;
	var str;
	var temp;
	var condition;
	
	if (!Object.keys(filters).length)
		filters = undefined;

	if (filters != undefined) {
		arr = [];
		var filter_keys = Object.keys(filters);
		for (var i = 0; i < filter_keys.length; i++) {
			str = '';
			filters[filter_keys[i]].forEach(function(item, index) {
				filters[filter_keys[i]][index] = '"'+item+'"';
			});
			var temp = filters[filter_keys[i]].join();
			if (filter_keys[i] === 'status') 
				filter_keys[i] = 't.status';

			if (filter_keys[i] === 'date') {
				temp = temp.replace(',', ' and ');
				if (filter_keys[i] === 'damaged_bags')
					temp += 'or damaged_bags is null';
				arr.push(filter_keys[i] + ' between ' + temp);
			}
			else if (filter_keys[i] === 'delivery_receipt' || filter_keys[i] === 'purchase_lo') {
				if (temp !== '"All"')
					arr.push(filter_keys[i]+' like '+temp);
			}
			else {
				while (temp.includes(',')) {
					temp = temp.replace(',', ' or '+filter_keys[i] + ' = ');
				}
				arr.push(filter_keys[i] + ' = ' + temp);
			}
		}
		arr.forEach(function(item, index) {
			while (arr[index].includes(' = "is null"')) {
				arr[index] = arr[index].replace(' = "is null', ' is null');
				arr[index] = arr[index].slice(0, -1);
			}
		});
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

exports.getDeliveries = function(filters, offset, limit, next) {
	var sql = 'select t.status, pt.product_name, case when t.plate_no is null then "Pending" else t.plate_no end as plate_no, case when t.purchase_lo = max(t.delivery_receipt) then null else t.purchase_lo end as purchase_lo, max(t.delivery_receipt) as delivery_receipt, case when t.location_name is null then "Warehouse" else t.location_name end as location_name, t.date, case when t.driver is null then "Pending" else concat(et.last_name, ", ", et.first_name) end as driver, case when min(bin(order_type)) is null then "Stock Replenishment" else max(order_type) end as order_type from (select ddt.status, ddt.plate_no, ddt.driver, sh.product_id, case when sh.purchase_lo is null then sh.delivery_receipt else sh.purchase_lo end as purchase_lo, ddt.delivery_receipt, clt.location_name, sh.scheduled_date as date, ddt.delivery_type as order_type, ddt.status + 0 as status_index from delivery_detail_table as ddt join sales_history as sh using (delivery_receipt) join customer_location_table as clt on clt.location_id = ddt.delivery_address left outer join purchase_history as ph on sh.purchase_lo = ph.supplier_lo union all select ph.status, ph.plate_num, ph.driver, ph.product_id, ph.supplier_lo, ph.supplier_dr, null as delivery_address, ph.date, null, ph.status + 0 as status_index from purchase_history as ph ) as t join product_table as pt using(product_id) left outer join employee_table as et on et.employee_id = t.driver ? group by purchase_lo order by status_index, date , order_type limit ?, ?';
	var arr;
	var str;
	var temp;
	var condition;
	
	if (!Object.keys(filters).length)
		filters = undefined;

	if (filters != undefined) {
		arr = [];
		var filter_keys = Object.keys(filters);
		for (var i = 0; i < filter_keys.length; i++) {
			str = '';
			filters[filter_keys[i]].forEach(function(item, index) {
				filters[filter_keys[i]][index] = '"'+item+'"';
			});
			var temp = filters[filter_keys[i]].join();
			if (filter_keys[i] === 'status') 
				filter_keys[i] = 't.status';

			if (filter_keys[i] === 'date') {
				temp = temp.replace(',', ' and ');
				if (filter_keys[i] === 'damaged_bags')
					temp += 'or damaged_bags is null';
				arr.push(filter_keys[i] + ' between ' + temp);
			}
			else if (filter_keys[i] === 'delivery_receipt' || filter_keys[i] === 'purchase_lo') {
				if (temp !== '"All"')
					arr.push(filter_keys[i]+' like '+temp);
			}
			else {
				while (temp.includes(',')) {
					temp = temp.replace(',', ' or '+filter_keys[i] + ' = ');
				}
				arr.push(filter_keys[i] + ' = ' + temp);
			}
		}
		arr.forEach(function(item, index) {
			while (arr[index].includes(' = "is null"')) {
				arr[index] = arr[index].replace(' = "is null', ' is null');
				arr[index] = arr[index].slice(0, -1);
			}
		});
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

	console.log(sql);
	mysql.query(sql, next);
};

exports.getStockReplenishment = function(query, next) {
	var sql = "select ph.qty as bought, et.employee_id, ph.status, pt.product_name, ph.plate_num as plate_no, ph.supplier_lo as purchase_lo, ph.supplier_dr as delivery_receipt, 'Warehouse' as location_name, ph.date, concat(et.last_name, ', ', et.first_name) as driver, 'Stock Replenishment' as order_type from purchase_history as ph join product_table as pt using (product_id) left outer join employee_table as et on et.employee_id = ph.driver where ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.getSellOut = function(query, next) {
	var sql = "select t.supplier_dr, et.employee_id, t.status, pt.product_name, case when t.plate_no is null then 'Pending' else t.plate_no end as plate_no, t.purchase_lo, t.delivery_receipt, case when t.location_name is null then 'Warehouse' else t.location_name end as location_name, t.date, case when t.driver is null then 'Pending' else concat(et.last_name, ', ', et.first_name) end as driver, case when order_type is null then 'Stock Replenishment' else order_type end as order_type, t.qty from (select ddt.status, ddt.plate_no, ddt.driver, sh.product_id, sh.purchase_lo, ddt.delivery_receipt, clt.location_name, sh.scheduled_date as date, ddt.delivery_type as order_type, ddt.status + 0 as status_index, sh.qty, null as supplier_dr from delivery_detail_table as ddt join sales_history as sh using (delivery_receipt) join customer_location_table as clt on clt.location_id = ddt.delivery_address left outer join purchase_history as ph on sh.purchase_lo = ph.supplier_lo union all select ph.status, ph.plate_num, ph.driver, ph.product_id, ph.supplier_lo, ph.supplier_dr, null as delivery_address, ph.date, null, ph.status + 0 as status_index, ph.qty, ph.supplier_dr from purchase_history as ph ) as t join product_table as pt using(product_id) left outer join employee_table as et on et.employee_id = t.driver where ? order by order_type";
	sql = mysql.format(sql, query);
	console.log(sql);
	mysql.query(sql, next);
}

exports.getSellIn = function(query, next) {
	var sql = "select ddt.driver as employee_id, ddt.status, pt.product_name, ddt.plate_no, sh.delivery_receipt as purchase_lo, sh.purchase_lo as delivery_receipt, clt.location_name, sh.scheduled_date as date, concat(et.last_name, ', ', et.first_name) as driver, 'Sell-in' as order_type, sh.qty from sales_history as sh join delivery_detail_table as ddt using (delivery_receipt) join product_table as pt using (product_id) join customer_location_table as clt on ddt.delivery_address = clt.location_id left outer join employee_table as et on ddt.driver = et.employee_id where ?";
	sql = mysql.format(sql, query);
	
	mysql.query(sql, next);
}

exports.updateDeliveryEmployees = function(query, update, id, next) {
	var sql = "delete de from delivery_employees as de left outer join delivery_detail_table as ddt using (delivery_detail_id) where ?;";
	sql = mysql.format(sql, query);
	for (var i = 0; i < update.length; i++) {
		sql += 'insert into delivery_employees (carrier_id, delivery_detail_id) values (?, ?);';
		sql = mysql.format(sql, update[i]);
		sql = mysql.format(sql, id);
	}

	mysql.query(sql, next);
}

exports.deleteDeliveryEmployees = function(query, next) {
	var sql = "delete de from delivery_employees as de left outer join delivery_detail_table as ddt using (delivery_detail_id) where ?";
	sql = mysql.format(sql, query);
	
	mysql.query(sql, next);
}

exports.updateDeliveryToSellout = function(delivery_receipt, next){
	var sql = "UPDATE delivery_detail_table SET delivery_type = 'Sell-out' WHERE delivery_receipt = ?";

	sql = mysql.format(sql, delivery_receipt);

	mysql.query(sql, next);
}