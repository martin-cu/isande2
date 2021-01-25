var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getNetIncomeData = function(next) {
	var sql = "select distinct case when format(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 2) is null then 0 else format(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 2) end as net_income, 'yearly' as type from product_catalogue_table as pct left join sales_history as sh using(product_id) where year(sh.scheduled_date) = year(now()) and sh.scheduled_date between pct.start_date and case when pct.end_date is null then now() else pct.end_date end and sh.payment_status = 'Paid' union select distinct case when format(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 2) is null then 0 else format(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 2) end as net_income, 'monthly' as type from product_catalogue_table as pct left join sales_history as sh using(product_id) where month(sh.scheduled_date) = month(now()) and sh.scheduled_date between pct.start_date and case when pct.end_date is null then now() else pct.end_date end and sh.payment_status = 'Paid' ";
	
	mysql.query(sql, next);
}

exports.getTaskProgress = function(next) {
	var sql = "select case when concat(round((max(t.t2)/(max(t.t1)+max(t.t2))*100), 2), '%') is null then 'No orders yet' else concat(round((max(t.t2)/(max(t.t1)+max(t.t2))*100), 2), '%') end as order_completion, max(t.t3) as pending_tasks from ( select count(*) as t1, null as t2, null as t3 from sales_history as sh where datediff(now(), sh.scheduled_date) >= 0 and sh.order_status != 'Completed' union select null, count(*), null from sales_history as sh where sh.order_status = 'Completed' and datediff(now(), sh.scheduled_date) >= 0 and month(now()) = month(sh.scheduled_date) union select null,null, count(*) from sales_history where order_status = 'Pending' and datediff(now(), scheduled_date) >= 0) as t";
	mysql.query(sql, next);
}

exports.getOverdueUnpaid = function(next) {
	var sql = "select ct.customer_name, format((sh.amount*sh.qty), 2) as amt_due, date_format(sh.due_date, '%m/%d/%Y') as due_date from sales_history as sh join customer_table as ct using(customer_id) where datediff(now(), sh.due_date) > 0 and payment_status = 'Unpaid' order by sh.due_date limit 5";

	mysql.query(sql, next);
}

exports.getRecentSales = function(next) {
	var sql = "select date_format(sh.scheduled_date, '%m/%d/%Y') as formattedDate,ct.customer_name, sh.delivery_receipt, pt.product_name, sh.qty, sh.order_status from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) order by sh.time_recorded desc limit 5";

	mysql.query(sql, next);
}

exports.getMonthlySales = function(next) {
	var sql = "select date_format(sh.scheduled_date, '%b') as month, round(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 0) as net_income, 'yearly' as type from sales_history as sh join product_catalogue_table as pct using(product_id) where year(sh.scheduled_date) = year(now()) and sh.scheduled_date between pct.start_date and case when pct.end_date is null then now() else pct.end_date end group by month(sh.scheduled_date)";

	mysql.query(sql, next);
}

//Purchasing
exports.getOrderedBags = function(next) {
	var sql = "select t.name, case when max(t.total_orders) is null then 0 else max(t.total_orders) end as total_orders from ( select product_id as id, product_name as name, null as total_orders from product_table union select product_id, null, sum(qty) from purchase_history where year(now()) = year(date) and month(now()) = month(date) group by product_id ) as t group by t.id";
	mysql.query(sql, next);
}

exports.getPurchaseProgress = function(next) {
	var sql = "select max(t.pending) as pending, max(t.processing) as processing, max(t.completed) as completed, concat(round((max(t.completed)/(max(t.pending)+max(t.completed)+max(t.processing))*100),2),'%') as task_progress from ( select count(*) as pending, null as processing, null as completed from purchase_history as ph where ph.status = 'Pending' and datediff(now(), ph.date) >= 0 union select null, count(*), null from purchase_history as ph where ph.status = 'Processing' and year(now()) = year(date) and month(now()) = month(ph.date) union select null, null, count(*) from purchase_history as ph where ph.status = 'Completed' and year(now()) = year(date) and month(now()) = month(ph.date) ) as t";
	mysql.query(sql, next);
} 

exports.getRecentOrders = function(next) {
	var sql = "select date_format(ph.date, '%m/%d/%Y') as formattedDate, ph.supplier_lo, pt.product_name, ph.qty, ph.status from purchase_history as ph join product_table as pt using(product_id) order by ph.date desc limit 5";
	mysql.query(sql, next);
}

exports.getMonthlyPurchases = function(next) {
	var sql = "select pt.product_name, sum(ph.qty) as qty, date_format(ph.date, '%b') as month from purchase_history as ph join product_table as pt using(product_id) where datediff(now(), ph.date) >= 0 and year(now()) = year(ph.date) group by pt.product_id, month(ph.date) order by month(ph.date)";
	mysql.query(sql, next);
}

//Logistics
exports.getPendingDeliveries = function(query, next) {
	var sql = "select case when max(t.purchase_lo) = max(t.supplier_lo) and max(t.dr) is not null then 'Sell-out' when max(t.supplier_lo) is null then 'Sell-in' else 'Restock' end as order_type, max(t.supplier_lo) as supplier_lo, max(t.dr) as delivery_receipt, max(t.purchase_lo) as purchase_lo, case when max(t.customer_name) is null then 'N/A' else max(t.customer_name) end as customer_name from ( select ph.date, ph.supplier_lo, null as dr, ph.supplier_lo as purchase_lo, null as customer_name from purchase_history as ph where ph.status = 'Pending' and datediff(now(), ph.date) >= 0 union select sh.scheduled_date, null, sh.delivery_receipt, case when sh.purchase_lo is null then sh.delivery_receipt else sh.purchase_lo end, ct.customer_name from sales_history as sh join customer_table as ct using(customer_id) where sh.order_status = 'Pending' and datediff(now(), sh.scheduled_date) >= 0 ) as t group by t.purchase_lo order by t.date, field('Sell-in', 'Sell-out', 'Restock') limit ?";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}

exports.getPerfectOrderRate = function(next) {
	var sql = "select date_format(sh.scheduled_date, '%b') as month, ( sum(case when ddt.damaged_bags = '0' and ddt.status='Completed' then 1 else 0 end) / ((sum(case when ddt.damaged_bags = '0' and ddt.status='Completed' then 1 else 0 end))+sum(case when ddt.damaged_bags != '0' and ddt.status='Completed' then 1 else 0 end)) )*100 as percentDamageFree, ( sum(case when ddt.status = 'Completed' and datediff(sh.scheduled_date, ddt.date_completed) >= 0 then 1 else 0 end)/count(*))*100 as percentOnTime from sales_history as sh join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id where year(now()) = year(sh.scheduled_date) group by month(sh.scheduled_date) order by sh.scheduled_date";
	mysql.query(sql, next);
}

exports.getDeliveryByDestination = function(next) {
	var sql = "SELECT clt.location_name, count(*) as count_deliveries, concat(format((count(*)/(select count(*) FROM sales_history as sh join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join customer_location_table as clt on ddt.delivery_address = clt.location_id where month(now()) = month(sh.scheduled_date))*100),2),'%') as delivery_percentage FROM sales_history as sh join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join customer_location_table as clt on ddt.delivery_address = clt.location_id where month(now()) = month(sh.scheduled_date) group by ddt.delivery_address order by count(ddt.delivery_address) desc, clt.location_name";
	mysql.query(sql, next);
}

/*
exports.getPurchasesOverview = function(next){
	var sql = "SELECT ph.status, pt.product_name, ph.supplier_lo, ph.plate_num, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE date(ph.date) = CURDATE() OR ph.status = 'Pending' order by ph.status limit 10";
	mysql.query(sql,next);
}

exports.getSalesOverview = function(next){
	var sql = "SELECT sh.order_status, pt.product_name, sh.purchase_lo, dd.plate_no, c.customer_name FROM sales_history sh LEFT JOIN product_table pt ON pt.product_id = sh.product_id LEFT JOIN customer_table c ON c.customer_id = sh.customer_id LEFT JOIN delivery_detail_table dd ON dd.delivery_receipt = sh.delivery_receipt WHERE datediff(date(time_recorded), CURDATE()) <= 0 and (sh.order_status = 'Pending' or sh.order_status = 'Processing') order by sh.scheduled_date, sh.time_recorded, sh.order_status limit 10";
	mysql.query(sql,next);
}

exports.getMonthlySoldBags = function(next){
	var sql = "SELECT SUM(qty) AS MonthlySales, product_id FROM sales_history WHERE MONTH(time_recorded) = MONTH(CURDATE()) GROUP BY product_id";
	mysql.query(sql,next);
}
*/
