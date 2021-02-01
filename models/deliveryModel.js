var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getTrackDelivery = function(query, next) {
	var sql = "select max(t.status) as order_status, date_format(max(t.date), '%b %e, %Y') as formattedDate, max(t.plate_num) as plate_num, max(concat(et.last_name,', ',et.first_name)) as driver, max(pt.product_name) as product_name, max(t.qty) as qty, case when max(t.purchase_lo) = max(t.supplier_lo) and max(t.dr) is not null then 'Sell-out' when max(t.supplier_lo) is null then 'Sell-in' else 'Restock' end as order_type, max(t.supplier_lo) as supplier_lo, max(t.dr) as delivery_receipt, max(t.purchase_lo) as purchase_lo, case when max(t.customer_name) is null then 'N/A' else max(t.customer_name) end as customer_name, case when max(t.destination) is null then 'Warehouse' else max(t.destination) end as destination from ( select ph.status, ph.date, ph.plate_num, ph.supplier_lo, ph.driver as employee_id, ph.product_id, ph.qty, null as dr, ph.supplier_lo as purchase_lo, null as customer_name, null as destination from purchase_history as ph where ph.void != 1 and ph.date between date(date_sub(now(), interval ? day) + INTERVAL ( - WEEKDAY(date_sub(now(), interval ? day))) DAY) and DATE(date_sub(now(), interval ? day) + INTERVAL (6 - WEEKDAY(date_sub(now(), interval ? day))) DAY) union select sh.order_status, sh.scheduled_date, ddt.plate_no, null, ddt.driver, sh.product_id, sh.qty, sh.delivery_receipt, case when sh.purchase_lo is null then sh.delivery_receipt else sh.purchase_lo end, ct.customer_name, clt.location_name from sales_history as sh join customer_table as ct using(customer_id) join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join customer_location_table as clt on ddt.delivery_address = clt.location_id where sh.void != 1 and sh.scheduled_date between date(date_sub(now(), interval ? day) + INTERVAL ( - WEEKDAY(date_sub(now(), interval ? day))) DAY) and DATE(date_sub(now(), interval ? day) + INTERVAL (6 - WEEKDAY(date_sub(now(), interval ? day))) DAY) ) as t join product_table as pt using(product_id) left join employee_table as et using(employee_id) group by t.purchase_lo order by field(t.status, 'Pending', 'Processing', 'Completed'), t.date,field('Sell-in', 'Sell-out', 'Restock')";
	while (sql.includes('?')) {
		sql = mysql.format(sql, query);
	}
	
	mysql.query(sql, next);
}

exports.getDeliveryRecordsAll = function(next) {
	var sql = "select max(t.status) as order_status, date_format(max(t.date), '%m/%d/%Y') as formattedDate, max(t.plate_num) as plate_num, max(concat(et.last_name,', ',et.first_name)) as driver, max(pt.product_name) as product_name, max(t.qty) as qty, case when max(t.purchase_lo) = max(t.supplier_lo) and max(t.dr) is not null then 'Sell-out' when max(t.supplier_lo) is null then 'Sell-in' else 'Restock' end as order_type, max(t.supplier_lo) as supplier_lo, max(t.dr) as delivery_receipt, max(t.purchase_lo) as purchase_lo, case when max(t.customer_name) is null then 'N/A' else max(t.customer_name) end as customer_name, case when max(t.destination) is null then 'Warehouse' else max(t.destination) end as destination from ( select ph.status, ph.date, ph.plate_num, ph.supplier_lo, ph.driver as employee_id, ph.product_id, ph.qty, null as dr, ph.supplier_lo as purchase_lo, null as customer_name, null as destination from purchase_history as ph where ph.void != 1 union select sh.order_status, sh.scheduled_date, ddt.plate_no, null, ddt.driver, sh.product_id, sh.qty, sh.delivery_receipt, case when sh.purchase_lo is null then sh.delivery_receipt else sh.purchase_lo end, ct.customer_name, clt.location_name from sales_history as sh join customer_table as ct using(customer_id) join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join customer_location_table as clt on ddt.delivery_address = clt.location_id where sh.void != 1) as t join product_table as pt using(product_id) left join employee_table as et using(employee_id) group by t.purchase_lo order by field(t.status, 'Pending', 'Processing', 'Completed'), t.date,field('Sell-in', 'Sell-out', 'Restock')";
	mysql.query(sql, next);
}

exports.getProcessingDeliveries = function(query, next) {
	var sql = "select max(t.status) as order_status, date_format(max(t.date), '%m/%d/%Y') as formattedDate, max(t.plate_num) as plate_num, max(concat(et.last_name,', ',et.first_name)) as driver, max(pt.product_name) as product_name, max(t.qty) as qty, case when max(t.purchase_lo) = max(t.supplier_lo) and max(t.dr) is not null then 'Sell-out' when max(t.supplier_lo) is null then 'Sell-in' else 'Restock' end as order_type, max(t.supplier_lo) as supplier_lo, max(t.dr) as delivery_receipt, max(t.purchase_lo) as purchase_lo, case when max(t.customer_name) is null then 'N/A' else max(t.customer_name) end as customer_name, case when max(t.destination) is null then 'Warehouse' else max(t.destination) end as destination from ( select ph.status, ph.date, ph.plate_num, ph.supplier_lo, ph.driver as employee_id, ph.product_id, ph.qty, null as dr, ph.supplier_lo as purchase_lo, null as customer_name, null as destination from purchase_history as ph where ph.void != 1 and ph.status = 'Processing' union select sh.order_status, sh.scheduled_date, ddt.plate_no, null, ddt.driver, sh.product_id, sh.qty, sh.delivery_receipt, case when sh.purchase_lo is null then sh.delivery_receipt else sh.purchase_lo end, ct.customer_name, clt.location_name from sales_history as sh join customer_table as ct using(customer_id) join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join customer_location_table as clt on ddt.delivery_address = clt.location_id where sh.void != 1 and sh.order_status = 'Processing' ) as t join product_table as pt using(product_id) left join employee_table as et using(employee_id) group by t.purchase_lo order by field(t.status, 'Pending', 'Processing', 'Completed'), t.date,field('Sell-in', 'Sell-out', 'Restock') limit ?";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}

exports.getSingleDeliveryInfo = function(query, next) {
	var sql = "select supplier_dr, format(max(t.amount),2) as total_amt,format(max(t.price),2) as pricePiece, case when max(t.time_out) is null then 'N/A' else max(t.time_out) end as time_out, case when max(t.damaged_bags) is null then 'N/A' else max(t.damaged_bags) end as damaged_bags, max(t.status) as order_status, date_format(max(t.date), '%Y-%m-%d') as formattedDate, max(t.plate_num) as plate_num, max(concat(et.last_name,', ',et.first_name)) as driver, max(pt.product_name) as product_name, max(t.qty) as qty, case when max(t.purchase_lo) = max(t.supplier_lo) and max(t.dr) is not null then 'Sell-out' when max(t.supplier_lo) is null then 'Sell-in' else 'Restock' end as order_type, max(t.supplier_lo) as supplier_lo, max(t.dr) as delivery_receipt, max(t.purchase_lo) as purchase_lo, case when max(t.customer_name) is null then 'N/A' else max(t.customer_name) end as customer_name, case when max(t.destination) is null then 'Warehouse' else max(t.destination) end as destination from ( select ph.amount, ph.amount/ph.qty as price, ph.time_out, null as damaged_bags, ph.status, ph.date, ph.plate_num, ph.supplier_lo, ph.driver as employee_id, ph.product_id, ph.qty, null as dr, ph.supplier_lo as purchase_lo, null as customer_name, null as destination, ph.supplier_dr from purchase_history as ph union select sh.amount*sh.qty,sh.amount, null, ddt.damaged_bags, sh.order_status, sh.scheduled_date, ddt.plate_no, null, ddt.driver, sh.product_id, sh.qty, sh.delivery_receipt, case when sh.purchase_lo is null then sh.delivery_receipt else sh.purchase_lo end, ct.customer_name, clt.location_name, null as supplier_dr from sales_history as sh join customer_table as ct using(customer_id) join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join customer_location_table as clt on ddt.delivery_address = clt.location_id ) as t join product_table as pt using(product_id) left join employee_table as et using(employee_id) where ? group by t.purchase_lo order by field(t.status, 'Pending', 'Processing', 'Completed'), t.date,field('Sell-in', 'Sell-out', 'Restock')";
	sql = mysql.format(sql, query);
	while (sql.includes('`')) {
		sql = sql.replace('`', '');
	}
	mysql.query(sql, next);
}