var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getPossibleTrucks = function(next) {
	var sql = "select tt.* from trucks_table as tt where tt.status = 'Active' and tt.plate_no not in ( select temp_ph.plate_num from purchase_history as temp_ph where temp_ph.status = 'Processing') and tt.plate_no not in ( select temp_ddt.plate_no from delivery_detail_table as temp_ddt where temp_ddt.status = 'Processing')";
	mysql.query(sql, next);
}

exports.getActiveTrucks = function(next) {
	var sql = "SELECT *, replace(plate_no, ' ', '') as id FROM itisdev_db.trucks_table;";

	mysql.query(sql, next);
}