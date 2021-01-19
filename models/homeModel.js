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
exports.getRecentOrders = function(next) {
	var sql = "select date_format(ph.date, '%m/%d/%Y') as formattedDate, ph.supplier_lo, pt.product_name, ph.qty, ph.status from purchase_history as ph join product_table as pt using(product_id) order by ph.date desc limit 5";
	mysql.query(sql, next);
};

exports.getMonthlyPurchases = function(next) {
	var sql = "select pt.product_name, sum(ph.qty) as qty, date_format(ph.date, '%b') as month from purchase_history as ph join product_table as pt using(product_id) where datediff(now(), ph.date) >= 0 and year(now()) = year(ph.date) group by pt.product_id, month(ph.date) order by month(ph.date)";
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
