var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.create = function(user, next) {
	var sql = "INSERT INTO customer_table SET ?";
	sql = mysql.format(sql, user);

	mysql.query(sql, next);
};

exports.createLoc = function(query, next) {
	var sql = "inert into customer_location_table set ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
};

exports.queryCustomerLocation = function(next) {
	var sql = "select ct.customer_id, ct.customer_name, clt.location_id, clt.location_name from customer_table as ct join customer_location_table as clt on ct.customer_id = clt.customer_id order by ct.customer_id , clt.location_name";

	mysql.query(sql, next);
}

exports.queryLocationbyCustomer = function(next) {
	var sql = "select ct.customer_id as customer_id, ct.customer_name as customer_name, clt.location_id as location_id, clt.location_name as location_name from customer_location_table as clt join customer_table as ct using (customer_id) order by ct.customer_id";

	mysql.query(sql, next);
}

exports.queryCustomers = function(next) {
	var sql = "select * from customer_table";

	mysql.query(sql, next);
}

exports.queryUnpaidCustomers = function(next) {
	var sql = "select ct.*, sh.payment_status, sh.qty, sh.delivery_receipt, format((sh.qty*sh.amount), 2) as total, pt.product_name from customer_table as ct join sales_history as sh using(customer_id) join product_table as pt using (product_id) where sh.payment_status = 'Unpaid' order by customer_name, delivery_receipt";

	mysql.query(sql, next);
}