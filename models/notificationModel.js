var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.createNotif = function(query, next) {
	var sql = "insert into notification (url,description,time_created,user,creator,contents) select ?,?,now(),employee_id,?,? from user_table where role_id = ?";
	sql = mysql.format(sql, query.url);
	sql = mysql.format(sql, query.desc);
	sql = mysql.format(sql, query.id);
	sql = mysql.format(sql, query.contents);
	for (var i = 0; i < query.roles.length; i++) {
		if (i == 0)
			sql = mysql.format(sql, query.roles[i]);
		else {
			sql += ' or role_id ="'+query.roles[i]+'"';
		}
	}
	mysql.query(sql, next);
};

exports.getNotifs = function(query, next) {
	var sql = "select date_format(nt.time_created, '%M %e, %Y %h:%i') as formattedDate, ut.role_id,nt.* from notification as nt join user_table as ut on creator = ut.employee_id where nt.user = ?";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
};

exports.getUnseenNotifCount = function(query, next) {
	var sql = "select count(*) as count from notification where seen = 0 and user = ?;";
	sql = mysql.format(sql, query);
	mysql.query(sql, next);
}