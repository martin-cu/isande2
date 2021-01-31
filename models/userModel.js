var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.create = function(user, next) {
	var sql = "INSERT INTO user_table SET ?";
	sql = mysql.format(sql, user);

	mysql.query(sql, next);
};

exports.queryAll = function(offset, limit, next) {
	var sql = "SELECT u.username as username, u.email as email, u.role_id as role_id, e.first_name as first_name , e.last_name as last_name, e.job as job, e.status as status FROM user_table as u JOIN employee_table as e using (employee_id) ORDER BY e.status, u.role_id,e.last_name, e.first_name limit ?, ?";
	sql = mysql.format(sql, offset);
	sql = mysql.format(sql, limit);
	console.log(sql);
	mysql.query(sql, next);
};

exports.queryUserCount = function(query, next){
	var sql = "SELECT COUNT(*) AS count FROM user_table";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.queryAdmin = function(query, next) {
	var sql = "select * from user_table where ?";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}


exports.singleQuery = function(username, next) {
	var sql = "SELECT u.employee_id, u.username as username, u.password as password, u.email as email, u.role_id as role_id, e.first_name as first_name , e.last_name as last_name, e.job as job, e.status as status FROM user_table as u JOIN employee_table as e using (employee_id) WHERE username = ? OR email = ?";
	sql = mysql.format(sql, username);
	sql = mysql.format(sql, username);
	mysql.query(sql, next);
};

exports.update = function(query, update, next) {
	var sql = "UPDATE user_table SET ? WHERE username = ?";
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

exports.delete = function(query, next) {
	var sql = "DELETE FROM user_table WHERE id = ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
};