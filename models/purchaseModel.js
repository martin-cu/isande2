var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getTrackOrders = function(query, next) {
	var sql = "select sh.*, pt.product_name, date_format(sh.date, '%b %e, %Y') as formattedSchedule from purchase_history as sh join product_table as pt using(product_id) where sh.date between date(date_sub(now(), interval ? day) + INTERVAL ( - WEEKDAY(date_sub(now(), interval ? day))) DAY) and DATE(date_sub(now(), interval ? day) + INTERVAL (6 - WEEKDAY(date_sub(now(), interval ? day))) DAY) order by date";
	while (sql.includes('?')) {
		sql = mysql.format(sql, query);
	}
	mysql.query(sql, next);
}

exports.getAllPurchaseRecords = function(next) {
	var sql = "select * from ( select concat(et.last_name, ', ',et.first_name) as driverName ,format((ph.amount/ph.qty),2) as pricePiece, date_format(ph.date, '%m/%d/%Y') as formattedDate, format(ph.amount, 2) as formattedAmount, pt.product_name, ph.* from purchase_history as ph join product_table as pt using(product_id) join employee_table as et on ph.driver = et.employee_id union select null ,format((ph.amount/ph.qty),2) as pricePiece, date_format(ph.date, '%m/%d/%Y') as formattedDate, format(ph.amount, 2) as formattedAmount, pt.product_name, ph.* from purchase_history as ph join product_table as pt using(product_id) ) as t group by supplier_lo order by field (t.status ,'Pending', 'Processing', 'Completed'), t.date, t.supplier_lo";
	mysql.query(sql, next);
}

exports.getPurchaseRecordDetails = function(query, next) {
	var sql = "select case when plate_num is null then 'N/A' else plate_num end as newPlate, format((ph.amount/ph.qty),2) as pricePiece, pt.product_name, case when concat(et.last_name, ', ', et.first_name) is null then 'N/A' else concat(et.last_name, ', ', et.first_name) end as driverName, case when time_out is null then 'N/A' else time_out end as newTimeOut, date_format(ph.date, '%Y-%m-%d') as formattedDate, format(ph.amount, 2) as formattedAmount, ph.* from purchase_history as ph join product_table as pt using(product_id) left join employee_table as et on ph.driver = et.employee_id where ?";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}

exports.updatePurchaseDetails = function(update, query, next) {
	var sql = "update purchase_history set ? where?";
	sql = mysql.format(sql, update);
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
};