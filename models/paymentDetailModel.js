var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.createPaymentRecord = function(query, next) {
	var sql = "insert into payment_details_table set ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
};