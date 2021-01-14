var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getMonthlySalesByProduct = function(next) {
	var sql = "select max(t.product_name) as product_name, case when format(max(t.t1), 2) is null then 0 else format(max(t.t1), 2) end as total_sales from (select pt.product_id, null as t1, pt.product_name from product_table as pt union select sh.product_id, sum((sh.qty*sh.amount)), null from sales_history as sh where month(sh.scheduled_date) = month(now()) and year(sh.scheduled_date) = year(now()) group by sh.product_id ) as t group by t.product_id";

	mysql.query(sql, next);
}

exports.filteredMonthlySales = function(filters, next) {
	var sql = "select date_format(last_day(curdate() - interval 1 month) + interval 1 day, '%Y-%m-%d') as first_day, date_format(last_day(curdate()), '%Y-%m-%d') as last_day, max(t.product_name) as product_name, case when format(max(t.t2),2) is null then 0 else format(max(t.t2),2) end as total_qty, case when format(max(t.t3),2) is null then 0 else format(max(t.t3),2) end as count_orders, case when format(max(t.t1), 2) is null then 0 else format(max(t.t1), 2) end as total_sales, case when format(max(t.t6),2) is null then 0 else format(max(t.t6),2) end as avg_qty, case when format(max(t.t4),2) is null then 0 else format(max(t.t4),2) end as max_qty, case when format(max(t.t5),2) is null then 0 else format(max(t.t5),2) end as min_qty from ( select pt.product_id, null as t1, pt.product_name, null as t2, null as t3, null as t4, null as t5, null as t6 from product_table as pt where pt.product_name = ? union select sh.product_id, sum((sh.qty*sh.amount)), null, sum(sh.qty), count(sh.delivery_receipt), max(sh.qty), min(sh.qty), avg(sh.qty) from sales_history as sh where month(sh.scheduled_date) = month(now()) and year(sh.scheduled_date) = year(now()) group by sh.product_id ) as t group by t.product_id ";
	sql = mysql.format(sql, filters);
	mysql.query(sql, next);
}

exports.filteredMonthlySalesRecord = function(filters, next) {
	var sql = "select pt.product_name, ct.customer_name, sh.* from sales_history as sh join customer_table as ct using(customer_id) join product_table as pt using(product_id) where pt.product_name = ? and month(sh.scheduled_date) = month(now()) and year(sh.scheduled_date) = year(now())";
	sql = mysql.format(sql, filters);
	mysql.query(sql, next);
}
