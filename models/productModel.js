var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getCurrInventory = function(next) {
	var sql = "select DATE_FORMAT(curdate(), '%m/%d/%Y') as date, pt.* from product_table as pt";
	
	mysql.query(sql, next);
};

exports.create = function(user, next) {
	var sql = "INSERT INTO product_table SET ?";
	sql = mysql.format(sql, user);

	mysql.query(sql, next);
};

exports.queryProductbyPrice = function(next) {
	var sql = "select pt.product_id as product_id, pt.product_name as product_name, pct.purchase_price as purchase_price, pct.selling_price as selling_price from product_catalogue_table as pct join product_table as pt using (product_id) where pct.status = 'Active'";
	
	mysql.query(sql, next);
};

exports.getProductPriceByDate = function(query, next) {
	var sql = "select pct.*, pt.product_name from product_catalogue_table as pct join product_table as pt using (product_id) where ? between start_date and case when end_date is null then curdate() else end_date end order by catalogue_id";
	sql = mysql.format(sql, query);
	
	mysql.query(sql, next);
};

exports.getProducts = function(next) {
	var sql = "select * from product_table";

	mysql.query(sql, next);
}

exports.addProductQty = function(product, qty, next){
	var sql = "UPDATE product_table SET qty = qty + ? WHERE product_name = ?;";

	sql = mysql.format(sql, qty);
	sql = mysql.format(sql, product);
	// console.log(sql);
	mysql.query(sql,next);
}

exports.subtractProductQty = function(product, qty, next){
	var sql = "UPDATE product_table SET qty = qty - ? WHERE product_name = ?;";

	sql = mysql.format(sql, qty);
	sql = mysql.format(sql, product);
	// console.log(sql);
	mysql.query(sql,next);
}

exports.changeProductPrice = function(product, purchase_price, selling_price, next) {
	var sql = "INSERT INTO product_catalogue_table (product_id, purchase_price, selling_price, start_date, end_date, status) values ('?', '?', '?', curdate(), NULL, 'Active');";

	sql = mysql.format(sql, product);
	sql = mysql.format(sql, purchase_price);
	sql = mysql.format(sql, selling_price);
	console.log(sql);
	mysql.query(sql,next);
}

exports.getProductQuantity = function(product_id, next){
	var sql = "SELECT qty FROM product_table WHERE product_id = ?";
	sql = mysql.format(sql, product_id);

	mysql.query(sql,next);

}