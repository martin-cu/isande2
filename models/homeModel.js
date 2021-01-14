var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getNetIncomeData = function(next) {
	var sql = "select distinct format(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 2) as net_income, 'yearly' as type from product_catalogue_table as pct left join sales_history as sh using(product_id) where year(sh.scheduled_date) = year('2020-01-01') and sh.scheduled_date between pct.start_date and case when pct.end_date is null then now() else pct.end_date end union select distinct format(sum(((pct.selling_price - pct.purchase_price)*sh.qty)), 2) as net_income, 'monthly' as type from product_catalogue_table as pct left join sales_history as sh using(product_id) where month(sh.scheduled_date) = month('2020-09-01') and sh.scheduled_date between pct.start_date and case when pct.end_date is null then now() else pct.end_date end";

	mysql.query(sql, next);
}

exports.getTaskProgress = function(next) {
	var sql = "select concat(round((max(t.t2)/max(t.t1)*100), 2), '%') as order_completion, max(t.t3) as pending_tasks from (select count(*) as t1, null as t2, null as t3 from sales_history as sh union select null, count(*), null from sales_history as sh where sh.order_status = 'Completed' union select null,null, count(*) from sales_history where order_status = 'Pending') as t";
	
	mysql.query(sql, next);
}

exports.getOverdueUnpaid = function(next) {
	var sql = "select ct.customer_name, format((sh.amount*sh.qty), 2) as amt_due, date_format(sh.due_date, '%m/%d/%Y') as due_date from sales_history as sh join customer_table as ct using(customer_id) where datediff(now(), sh.due_date) > 0 order by sh.due_date limit 5";

	mysql.query(sql, next);
}

exports.getRecentSales = function(next) {
	var sql = "select ct.customer_name, sh.delivery_receipt, pt.product_name, sh.qty, sh.order_status from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) order by sh.time_recorded desc limit 5";

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