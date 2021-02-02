var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getMonthlySalesByProduct = function(next) {
	var sql = "select max(t.product_name) as product_name, case when format(max(t.t1), 2) is null then 0 else format(max(t.t1), 2) end as total_sales from (select pt.product_id, null as t1, pt.product_name from product_table as pt union select sh.product_id, sum((sh.qty*sh.amount)), null from sales_history as sh where sh.void != 1 and month(sh.scheduled_date) = month(now()) and year(sh.scheduled_date) = year(now()) group by sh.product_id ) as t group by t.product_id";

	mysql.query(sql, next);
}

exports.filteredMonthlySales = function(filters, next) {
	var sql = "select date_format(last_day(curdate() - interval 1 month) + interval 1 day, '%Y-%m-%d') as first_day, date_format(last_day(curdate()), '%Y-%m-%d') as last_day, max(t.product_name) as product_name, case when format(max(t.t2),2) is null then 0 else format(max(t.t2),2) end as total_qty, case when format(max(t.t3),2) is null then 0 else format(max(t.t3),2) end as count_orders, case when format(max(t.t1), 2) is null then 0 else format(max(t.t1), 2) end as total_sales, case when format(max(t.t6),2) is null then 0 else format(max(t.t6),2) end as avg_qty, case when format(max(t.t4),2) is null then 0 else format(max(t.t4),2) end as max_qty, case when format(max(t.t5),2) is null then 0 else format(max(t.t5),2) end as min_qty from ( select pt.product_id, null as t1, pt.product_name, null as t2, null as t3, null as t4, null as t5, null as t6 from product_table as pt where pt.product_name = ? union select sh.product_id, sum((sh.qty*sh.amount)), null, sum(sh.qty), count(sh.delivery_receipt), max(sh.qty), min(sh.qty), avg(sh.qty) from sales_history as sh where month(sh.scheduled_date) = month(now()) and year(sh.scheduled_date) = year(now()) group by sh.product_id ) as t group by t.product_id ";
	sql = mysql.format(sql, filters);
	mysql.query(sql, next);
}

exports.filteredMonthlySalesRecord = function(filters, next) {
	var sql = "select date_format(sh.scheduled_date, '%m/%d/%Y') as formattedDate, pt.product_name, ct.customer_name, sh.* from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) where sh.void != 1 and pt.product_name = ? and month(sh.scheduled_date) = month(now()) and year(sh.scheduled_date) = year(now())";
	sql = mysql.format(sql, filters);
	mysql.query(sql, next);
}

exports.filteredEarningsPeriod = function(filters, next) {
	var sql = "select date_format(last_day(curdate()), '%Y-%m-%d') as last_day, date_format(last_day(curdate() - interval 1 month) + interval 1 day, '%Y-%m-%d') as first_day, ? as period, case when format(sum(sh.qty*(pct.selling_price-pct.purchase_price)),2) is null then 0 else format(sum(sh.qty*(pct.selling_price-pct.purchase_price)),2) end as total_sales, case when format(sum(sh.qty),0) is null then 0 else format(sum(sh.qty),0) end as total, count(*) as order_count, case when format(avg(sh.qty*(pct.selling_price-pct.purchase_price)),2) is null then 0 else format(avg(sh.qty*(pct.selling_price-pct.purchase_price)),2) end as avg_profit, case when format(max(sh.qty*(pct.selling_price-pct.purchase_price)),2) is null then 0 else format(max(sh.qty*(pct.selling_price-pct.purchase_price)),2) end as max_profit, case when format(min(sh.qty*(pct.selling_price-pct.purchase_price)),2) is null then 0 else format(min(sh.qty*(pct.selling_price-pct.purchase_price)),2) end as min_profit, case when concat(round(avg(pct.selling_price/pct.purchase_price),4),'%') is null then 0 else concat(round(avg(pct.selling_price/pct.purchase_price),4),'%') end as markup from product_catalogue_table as pct left join sales_history as sh using(product_id) where sh.void != 1 and ?(sh.scheduled_date) = ?(now()) and sh.scheduled_date between pct.start_date and case when pct.end_date is null then now() else pct.end_date end and sh.payment_status = 'Paid'";
	while (sql.includes('?')) {
		sql = mysql.format(sql, filters);
	}
	var temp;
	temp = sql.split("'"+filters+"'");
	sql = temp[0]+"'"+filters+"'"+temp.slice(1).join(filters);
	mysql.query(sql, next);
}

exports.filteredEarningsPeriodRecord = function(filters, next) {
	var sql = "select date_format(sh.scheduled_date, '%m/%d/%Y') as formattedDate, pt.product_name, ct.customer_name, sh.* from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) where sh.void != 1 and ?(sh.scheduled_date) = ?(now()) and sh.payment_status = 'Paid'";
	while (sql.includes('?')) {
		sql = mysql.format(sql, filters);
	}
	while (sql.includes("'"+filters+"'")) {
		sql = sql.replace("'"+filters+"'", filters);
	}
	mysql.query(sql, next);
}

exports.getTaskProgress = function(next) {
	var sql = "select date_format(last_day(curdate()), '%Y-%m-%d') as last_day, date_format(last_day(curdate() - interval 1 month) + interval 1 day, '%Y-%m-%d') as first_day, case when concat(round((max(t.completed)/(max(t.processing)+max(t.pending)+max(t.completed))*100),2),'%') is null then 'No orders yet' else concat(round((max(t.completed)/(max(t.processing)+max(t.pending)+max(t.completed))*100),2),'%') end as task_progress,(max(t.pending)+max(t.processing)+max(t.completed)) as total_orders,max(t.pending) as pending, max(t.completed) as completed, max(t.processing) as processing from ( select count(*) as pending, null as completed, null as processing from sales_history where void != 1 and order_status = 'Pending' and datediff(now(), scheduled_date) >= 0 union select null, count(*) as completed, null as processing from sales_history where void != 1 and order_status = 'Completed' and datediff(now(), scheduled_date) >= 0 and month(now()) = month(scheduled_date) union select null, null as completed, count(*) as processing from sales_history where void != 1 and order_status = 'Processing' and datediff(now(), scheduled_date) >= 0 and month(now()) = month(scheduled_date) ) as t";
	mysql.query(sql, next);
};

exports.taskProgressRecords = function(next) {
	var sql = "select date_format(sh.scheduled_date, '%m/%d/%Y') as formattedDate,ct.customer_name, pt.product_name, sh.* from sales_history as sh join product_table as pt using(product_id) join customer_table as ct using(customer_id) where (month(sh.scheduled_date) = month(now())) or (sh.order_status = 'Pending' and datediff(now(), sh.scheduled_date) >= 0) order by sh.order_status, sh.scheduled_date, sh.customer_id desc";
	mysql.query(sql, next);
};

exports.getPendingRequests = function(next) {
	var sql = "select date_format(last_day(curdate()), '%Y-%m-%d') as last_day, date_format(last_day(curdate() - interval 1 month) + interval 1 day, '%Y-%m-%d') as first_day, case when max(t.total_orders) is null then 0 else max(t.total_orders) end as total_orders, case when max(t.overdue) is null then 0 else max(t.overdue) end as overdue, case when max(t.deliveries) is null then 0 else max(t.deliveries) end as deliveries, case when max(t.pickup) is null then 0 else max(t.pickup) end as pickup from ( select count(*) as total_orders, null as overdue, null as deliveries, null as pickup from sales_history as sh where sh.order_status = 'Pending' union select null, count(*),null,null from sales_history as sh where sh.order_status = 'Pending' and datediff(now(), sh.scheduled_date) > 0 union select null,null,count(*),null from sales_history as sh where sh.order_status = 'Pending' and sh.order_type = 'Delivery' union select null,null,null,count(*) from sales_history as sh where sh.order_status = 'Pending' and sh.order_type = 'Pick-up' ) as t";
	mysql.query(sql, next);
};

exports.pendingRequestsRecord = function(next) {
	var sql = "select date_format(sh.scheduled_date, '%m/%d/%Y') as formattedDate,ct.customer_name, pt.product_name, sh.* from sales_history as sh join product_table as pt using(product_id) join customer_table as ct using(customer_id) where order_status = 'Pending' and datediff(now(), scheduled_date) >= 0 order by sh.scheduled_date, sh.customer_id desc, sh.time_recorded";
	mysql.query(sql, next);
};

exports.getSalesByCustomerReport = function(next) {
	var sql = "select ct.customer_name, date_format(sh.scheduled_date, '%Y/%m/%d') as formattedDate, pt.product_name, format((sh.qty*sh.amount), 2) as formattedAmount , sh.* from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) where sh.void = 0 and sh.payment_status = 'Paid' and month(now()) = month(sh.scheduled_date) order by sh.customer_id, sh.scheduled_date";
	mysql.query(sql,next);
}

exports.getMonthlyRevenue = function(next) {
	var sql = "select sh.delivery_receipt, date_format(sh.scheduled_date, '%m/%d/%Y') as formattedDate, pt.product_name, sh.qty, format((sh.qty*sh.amount),2) as formattedAmount from sales_history as sh join product_table as pt using(product_id) where sh.void != 1 and sh.payment_status = 'Paid' and month(now()) = month(sh.scheduled_date) and year(now()) = year(sh.scheduled_date) order by sh.time_recorded, sh.delivery_receipt, sh.product_id";
	mysql.query(sql, next);
}

exports.getCOGS = function(next) {
	var sql = "select sh.delivery_receipt, pt.product_name, format(pct.purchase_price, 2) as buyingPrice, format(sh.qty*pct.purchase_price, 2) as formattedAmount from sales_history as sh join product_table as pt using(product_id) join product_catalogue_table as pct using(product_id) where sh.void != 1 and sh.payment_status = 'Paid' and month(now()) = month(sh.scheduled_date) and year(now()) = year(sh.scheduled_date) and sh.scheduled_date between pct.start_date and case when pct.end_date is null then sh.scheduled_date else pct.end_date end order by sh.time_recorded, sh.delivery_receipt, sh.product_id";
	mysql.query(sql, next);
}
