var mysql = require('./connectionModel');
mysql = mysql.connection;

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