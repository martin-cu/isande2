var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getWeeklyTruckData = function(next) {
	var sql = "select t2.plate_num, concat(et.last_name,', ',et.first_name) as driver,case when t2.count_delivery is null then 0 else t2.count_delivery end as weekly_deliveries, case when max(t2.truck_status) is null then 'Unavailable' else max(t2.truck_status) end as truck_status from ( select plate_num, count(*) as count_delivery, truck_status from ( select ph.plate_num, ph.date, null as truck_status from purchase_history as ph where ph.date between date(now() + INTERVAL ( - WEEKDAY(now())) DAY) and DATE(now() + INTERVAL (6 - WEEKDAY(now())) DAY) union select ddt.plate_no, sh.scheduled_date, null from sales_history as sh join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id join trucks_table as tt using(plate_no) where sh.scheduled_date between date(now() + INTERVAL ( - WEEKDAY(now())) DAY) and DATE(now() + INTERVAL (6 - WEEKDAY(now())) DAY) ) as t group by t.plate_num union select tt.plate_no, null, 'Available' from trucks_table as tt where tt.status = 'Active' and tt.plate_no not in ( select ph.plate_num from purchase_history as ph where ph.status = 'Processing') and tt.plate_no not in ( select ddt.plate_no from sales_history as sh join delivery_detail_table as ddt on sh.delivery_details = ddt.delivery_detail_id where sh.order_status = 'Processing') ) as t2 join trucks_table as tt on t2.plate_num = tt.plate_no join employee_table as et on et.employee_id = tt.assigned_driver group by t2.plate_num order by truck_status, weekly_deliveries asc";
	mysql.query(sql, next);
}

exports.getActiveTrucks = function(next) {
	var sql = "SELECT *, replace(plate_no, ' ', '') as id FROM itisdev_db.trucks_table;";

	mysql.query(sql, next);
}