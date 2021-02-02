var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.changeDefaultAlgo = function(filter, next) {
	var sql = "update recommendation_algo set status = 'Inactive';update recommendation_algo set status = 'Active' where ?";
	sql = mysql.format(sql, filter);
	
	mysql.query(sql, next);
}

exports.getSelectedAlgo = function(next) {
	var sql = "select * from recommendation_algo";

	mysql.query(sql, next);
}

exports.getRecommendation1 = function(next) {
	var sql = 'select * from product_table';

	mysql.query(sql, next);
}

exports.getRecommendation2 = function(next) {
	var sql = "select pt.product_name, case when max(t.completed_qty) is null then 0 else max(t.completed_qty) end as completed_orders, case when max(t.pending_qty) is null then 0 else max(t.pending_qty) end as pending_orders, pt.qty as current_stock, case when (max(t.completed_qty) is null and max(t.pending_qty) is null) then 0 else ceiling((max(ifnull(t.completed_qty, 0)) + max(ifnull(t.pending_qty, 0)))/7) end as moving_avg, case when (max(t.completed_qty)+max(t.pending_qty)) is null then case when (max(t.limiter) - pt.qty) < 0 then 0 else max(t.limiter) - pt.qty end else ceiling((max(t.completed_qty) + max(t.pending_qty))/7) + max(t.limiter) - pt.qty end as recommended, max(t.limiter) as safety_limit from ( select sh.product_id, sum(sh.qty) as completed_qty, null as pending_qty, null as limiter from sales_history as sh where datediff(curdate(), sh.scheduled_date) <= 8 and datediff(curdate(), sh.scheduled_date) >= 1 and sh.order_status = 'Completed' group by sh.product_id union select sh.product_id, null, sum(sh.qty) as ordered_qty, null from sales_history as sh where datediff(curdate(), sh.scheduled_date) <= 8 and datediff(curdate(), sh.scheduled_date) >= 1 and sh.order_status != 'Completed' group by sh.product_id union select pt.product_id, null, null, pt.safety_limit from product_table as pt ) as t join product_table as pt using(product_id) group by t.product_id";
	mysql.query(sql, next);
}

exports.getRecommendation3 = function(next) {
	var sql = "select t1.year, t1.month, t1.week, t1.product_name, sum(t1.qty) as products_sold from ( select t.year, t.month, w.week, t.product_name, case when t.week != w.week then 0 else sum(t.qty) end as qty from week as w cross join ( select year(sh.scheduled_date) as year, month(sh.scheduled_date) as month, WEEK(sh.scheduled_date) - WEEK(DATE_SUB(sh.scheduled_date, INTERVAL DAYOFMONTH(sh.scheduled_date) - 1 DAY), 5) + 1 as week, sh.qty as qty, pt.product_name from sales_history as sh join product_table as pt using(product_id) where order_status != 'Cancelled' ) as t where t.week = w.week group by product_name, t.week, year union select t2.year, t2.month, w.week, t2.product_name, case when t2.week != w.week then 0 else sum(t2.qty) end as qty from week as w cross join ( select year(sh.scheduled_date) as year, month(sh.scheduled_date) as month, WEEK(sh.scheduled_date) - WEEK(DATE_SUB(sh.scheduled_date, INTERVAL DAYOFMONTH(sh.scheduled_date) - 1 DAY), 5) + 1 as week, sh.qty as qty, pt.product_name from sales_history as sh join product_table as pt using(product_id) where order_status != 'Cancelled' ) as t2 where t2.week != w.week group by product_name, w.week, year ) as t1 where month = month(curdate()) and year < year(curdate()) group by product_name, week, year order by product_name, year, week";

	mysql.query(sql, next);
}