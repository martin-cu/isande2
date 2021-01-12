var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.create = function(user, next) {
	var sql = "INSERT INTO employee SET ?";
	sql = mysql.format(sql, user);
	console.log(sql);
	mysql.query(sql, next);
};

exports.queryUnregistered = function(next) {
	var sql = "SELECT  a.* FROM employee_table a LEFT JOIN user_table b on a.employee_id = b.employee_id WHERE b.employee_id IS NULL AND a.status = 'Active'";
	mysql.query(sql, next);
}

exports.queryAll = function(offset, limit, next) {
	var sql = "select * from employee_table order by status, job, last_name, first_name limit ?, ?";
	sql = mysql.format(sql, offset);
	sql = mysql.format(sql, limit);
	mysql.query(sql, next);
};

exports.queryEmployeeCount = function(query, next){
	var sql = "SELECT COUNT(*) AS count FROM employee_table";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}


exports.singleQuery = function(username, next) {
	var sql = "SELECT * FROM employee_table WHERE ?";
	sql = mysql.format(sql, username);
	while (sql.includes("'")) {
		sql = sql.replace("'", "");
	};
	console.log(sql);
	mysql.query(sql, next);
};

exports.singleQuery2 = function(id, next){
	var sql = "SELECT * FROM employee_table WHERE employee_id = ?";
	sql = mysql.format(sql, id);
	mysql.query(sql, next);
}

exports.update = function(query, update, next) {
	var sql = "UPDATE employee SET ? WHERE username = ?";
	var inserts = [];
	inserts.push(update);
	inserts.push(query);
	sql = mysql.format(sql, inserts);
	while (sql.includes("'")) {
		sql = sql.replace("'", "");
	}
	while (sql.includes("\\")) {
		sql = sql.replace("\\", "'");
	}
	while (sql.includes('lqkJmHoBJY')) {
		sql = sql.replace('lqkJmHoBJY', "'");
	}
	mysql.query(sql, next);
};

exports.queryRemoveDeactivatedUser = function(query, next) {
	var sql = "DELETE FROM user_table WHERE employee_id = ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
};

exports.queryDeactivateEmployee = function(query, next){
	var sql = "UPDATE employee_table SET status = 'Inactive' WHERE employee_id = ? ";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.getPossibleDrivers = function(next) {
	var sql = "select et.* from employee_table as et where et.job = 'Driver' and et.status = 'Active' and et.employee_id not in ( select temp_ph.driver from purchase_history as temp_ph where temp_ph.status = 'Processing' and datediff(curdate(), date) < 0) and et.employee_id not in ( select temp_ddt.driver from delivery_detail_table as temp_ddt join sales_history as temp_sh using(delivery_receipt)  where temp_ddt.status = 'Processing' and datediff(curdate(), scheduled_date) < 0)";	
	mysql.query(sql, next);
}

exports.getPossibleCarriers = function(next) {
	var sql = "select et.* from employee_table as et where et.job = 'Carrier' and et.status = 'Active' and et.employee_id not in ( select temp_ddt.driver from delivery_detail_table as temp_ddt join sales_history as temp_sh using(delivery_receipt) where temp_ddt.status = 'Processing' and datediff(curdate(), scheduled_date) < 0)";

	mysql.query(sql, next);
}

exports.getActualCarriers = function(query, next) {
	var sql = "select et.status, et.employee_id, concat(et.last_name, ', ', et.first_name) as carrier from delivery_employees as de join delivery_detail_table as ddt using (delivery_detail_id) join sales_history as sh using (delivery_receipt) join employee_table as et on de.carrier_id = et.employee_id where ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.getActiveDrivers = function(next) {
	var sql = "select * from employee_table where status = 'Active' and job = 'Driver'";

	mysql.query(sql, next);
}