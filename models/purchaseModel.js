var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getPurchaseHistory = function(next){
	var sql = "SELECT delivery_receipt FROM purchase_history where Month(time_recorded) = month(now())";

	mysql.query(sql, next);
}

exports.getAll = function(next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date, TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id ORDER BY status ASC, date ASC;";
	
	mysql.query(sql,next);
}

exports.getCount = function(next){
	var sql = "SELECT COUNT(supplier_lo) as count FROM purchase_history WHERE (Month(date) = month(now()) || status = 'Pending');";

	mysql.query(sql, next);
}

exports.getAllPagination = function(offset, limit, next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date, TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE (Month(ph.date) = month(now()) || ph.status = 'Pending') ORDER BY status ASC, date ASC LIMIT ?,?;";
	

	sql = mysql.format(sql, offset);
	sql = mysql.format(sql, limit);
	
	mysql.query(sql,next);
}


exports.createPurchase = function(query, next){
	var sql = "INSERT INTO purchase_history (supplier_lo, date, plate_num, product_id, qty, amount) VALUES ?";
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}

exports.getProductName = function(product_id, next){
	var sql = "SELECT product_name FROM product_table WHERE product_id = ?";
	sql = mysql.format(sql, product_id);
	mysql.query(sql, next);
}


exports.addPurchase = function(query, next){
	var pending = "pending"
	var sql = "INSERT INTO purchase_history (date, supplier_lo, supplier_so, product_id, qty, amount, status) VALUES (?, ?, ?, ?,?,?,?);";

	sql = mysql.format(sql, query.date);
	sql = mysql.format(sql, query.supplier_lo);
	sql = mysql.format(sql, query.supplier_so);
	sql = mysql.format(sql, query.product_id);
	sql = mysql.format(sql, query.qty);
	sql = mysql.format(sql, query.amount);
	sql = mysql.format(sql, pending);

	mysql.query(sql, next);
}


exports.getPurchaseDetails = function(load_no, next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%Y-%m-%d') as date, ph.time_out, ph.supplier_dr, ph.product_id, ph.supplier_so, ph.plate_num, pt.product_name, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, ph.status, sh.delivery_receipt, DATE_FORMAT(sh.scheduled_date, '%Y-%m-%d') as scheduled_date, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON pc.product_id = ph.product_id && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE ph.supplier_lo = ?;";

	sql = mysql.format(sql, load_no);

	mysql.query(sql, next);
}

exports.updatePurchaseInfo = function(date,time_out, supplier_dr, lo, next){
	var sql = "UPDATE purchase_history SET date = ? ";
	sql = mysql.format(sql, date);

	if(time_out != ""){
		sql = sql + ", time_out = '" + time_out + "' ";
	}

	if(supplier_dr != ""){
		sql = sql + ", supplier_dr = " + supplier_dr + " ";
	}

	if(supplier_dr != "" && time_out != ""){
		sql = sql + ", status = 'Completed' ";

	}

	sql = sql + "WHERE supplier_lo = " + lo + ";";
	console.log(sql);
	mysql.query(sql, next);	
	// if (query.supplier_dr == "" && query.time_out == ""){
	// 	var sql = "UPDATE purchase_history SET date = ?, product_id = ?, amount = ? WHERE supplier_lo = ?;";
	// 		sql = mysql.format(sql, query.date);
	// 		sql = mysql.format(sql, query.product_id);
	// 		sql = mysql.format(sql, query.amount);
	// 		sql = mysql.format(sql, query.supplier_lo);

	// 		console.log(sql);
	// 		mysql.query(sql, next);			
	// }
	// else if (query.supplier_dr == ""){
	// 	var sql = "UPDATE purchase_history SET date = ?, time_out = ?, product_id = ?, amount = ? WHERE supplier_lo = ?;";
	// 		sql = mysql.format(sql, query.date);
	// 		sql = mysql.format(sql, query.time_out);
	// 		sql = mysql.format(sql, query.product_id);
	// 		sql = mysql.format(sql, query.amount);
	// 		sql = mysql.format(sql, query.supplier_lo);
			
	// 		console.log(sql);


	// 		mysql.query(sql, next);	
	// }
	// else if (query.time_out == ""){
	// 	var sql = "UPDATE purchase_history SET date = ?, supplier_dr = ?,  product_id = ?, amount = ? WHERE supplier_lo = ?;";
	// 		sql = mysql.format(sql, query.date);
	// 		sql = mysql.format(sql, query.supplier_dr);
	// 		sql = mysql.format(sql, query.product_id);
	// 		sql = mysql.format(sql, query.amount);
	// 		sql = mysql.format(sql, query.supplier_lo);
			
	// 		console.log(sql);

	// 		mysql.query(sql, next);	
	// }
	// else{
	// 		var sql = "UPDATE purchase_history SET date = ?, supplier_dr = ?, time_out = ?, product_id = ?, amount = ? WHERE supplier_lo = ?;";
	// 		sql = mysql.format(sql, query.date);
	// 		sql = mysql.format(sql, query.supplier_dr);
	// 		sql = mysql.format(sql, query.time_out);
	// 		sql = mysql.format(sql, query.product_id);
	// 		sql = mysql.format(sql, query.amount);
	// 		sql = mysql.format(sql, query.supplier_lo);

	// 		console.log(sql);


	// 		mysql.query(sql, next);	
	// }
}

exports.getDrivers = function(next){
	var sql = 'SELECT first_name, last_name, employee_id FROM employee_table WHERE job = "Driver";';
	
	mysql.query(sql, next);
}

exports.getCustomers = function(next){
	var sql = "SELECT * FROM customer_table;";

	mysql.query(sql, next);
}

exports.getTrucks = function(next){	
	var sql = "SELECT * FROM trucks_table";
	mysql.query(sql, next);
}


exports.getFilterPrice = function(next){
	var sql = "SELECT DISTINCT purchase_price FROM product_catalogue_table ORDER BY (start_date) DESC, catalogue_id DESC LIMIT 5;";

	mysql.query(sql, next);
}

exports.getCurrentPrice = function(product, next){
	var sql = "SELECT pc.product_id, pc.purchase_price, pt.product_name  FROM product_catalogue_table pc JOIN product_table pt ON pc.product_id = pt.product_id WHERE pc.product_id = ? && status = 'Active';";

	sql = mysql.format(sql, product);
	mysql.query(sql,next);
}

exports.getDatePrice = function(product, date, next){
	var sql = "SELECT * FROM product_catalogue_table WHERE product_id = ? && start_date <= ? && end_date >= ?;";

	sql = mysql.format(sql, product);
	sql = mysql.format(sql, date);
	sql = mysql.format(sql, date);
	mysql.query(sql,next);
}


exports.addProductQuantity = function(qty, product, next){
	var sql = "UPDATE product_table SET qty = qty + ? WHERE product_id = ?;";

	sql = mysql.format(sql, qty);
	sql = mysql.format(sql, product);

	mysql.query(sql,next);
}


//FILTER RESULTS
exports.filterByStatus = function(filter, params,next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date,TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON pc.product_id = ph.product_id && pc.status = 'Active' WHERE ";

	for(var i = 0 ; i < params.length ; i++){
		sql = sql + "ph." + filter + "= '" + params[i] + "'";
		if(i != params.length - 1){
			sql = sql + "||";
		}
	}
	sql = sql + ";";

	mysql.query(sql,next);
}

exports.getFilteredPurchases = function(filter, offset, next){
	
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date,TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, c.customer_name, c.customer_id FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE (Month(ph.date) = month(now()) || ph.status = 'Pending') ";
	if(filter[0] != null){
		sql = sql + " && ";

		for(var i = 0 ; i < filter.length; i++){
			sql = sql + " ( ";
			for(var x = 0 ; x < filter[i].parameters.length; x++){
				
				if(filter[i].filtername == "status" || filter[i].filtername == "plate_num")
					sql = sql + "ph." + filter[i].filtername + " = '" + filter[i].parameters[x]+ "' ";
				else if(filter[i].filtername == "purchase_price"){
					sql = sql + "pc." + filter[i].filtername + " = " + filter[i].parameters[x];	
				}
				else if(filter[i].filtername == "customer_id"){
					if(filter[i].parameters.length == 1 && filter[i].parameters[0] == 0)
						sql = sql + "c." + filter[i].filtername + " IS NULL ";
					else
						sql = sql + "c." + filter[i].filtername + " = " + filter[i].parameters[x];
				}
				else{
					sql = sql + "ph." + filter[i].filtername + " = " + filter[i].parameters[x];
				}
				if(x != filter[i].parameters.length - 1){
					sql = sql + " || ";
				}
			}
			if(i != filter.length - 1){
				sql = sql + ") && ";
			}
			if(filter.length-1 == i)
				sql = sql + " ) ";
		}
	}
	
	sql = sql + " ORDER BY status ASC, date ASC LIMIT ?,10;";
	sql = mysql.format(sql, offset);
	
	mysql.query(sql,next);
}

exports.updatePurchaseFromDelivery = function(update, query, next) {
	var sql = "update purchase_history set ? where ?";
	sql = mysql.format(sql, update);
	sql = mysql.format(sql, query);

	mysql.query(sql, next);
}


exports.getPendingSales = function(product, date, qty, next){
	var sql = "SELECT sh.delivery_receipt, ct.customer_name, DATE_FORMAT(sh.scheduled_date, '%m/%d/%Y') as scheduled_date , pt.product_name FROM sales_history sh JOIN customer_table ct ON ct.customer_id = sh.customer_id JOIN product_table pt ON pt.product_id = sh.product_id WHERE sh.order_status = 'Pending' && sh.purchase_lo IS NULL && sh.product_id = ? && datediff(?, sh.scheduled_date) <= 0 && sh.qty <= ?;"

	sql = mysql.format(sql, product);
	sql = mysql.format(sql, date);
	sql = mysql.format(sql, qty);

	
	mysql.query(sql, next);
}

exports.updateSalesLo = function(sales_dr, purchase_lo, next){
	var sql = "UPDATE sales_history set purchase_lo = ? WHERE delivery_receipt = ?";

	sql = mysql.format(sql, purchase_lo);
	sql = mysql.format(sql, sales_dr);

	
	mysql.query(sql, next);

}
/*
exports.changeProductPrice = function (product, purchase_price, selling_price, next) {
	var sql = ""

	sql = mysql.format(sql, product);
	mysql.query(sql,next);

}
*/
//Reports

exports.getTotalBags =  function(product_id, from_date, to_date, next){
	var sql = "SELECT COALESCE(SUM(qty), 0) as bags, COALESCE(SUM(amount), 0) as total_amount FROM purchase_history WHERE status = 'Completed' && product_id = ? && date >= ? && date <= ?;";

	sql = mysql.format(sql, product_id);
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);
	
	mysql.query(sql, next);
}

exports.getDirectDeliveriesCount = function(from_date, to_date, products, next){
	var sql = "SELECT COALESCE(COUNT(ph.supplier_lo),0) as direct_deliveries FROM purchase_history ph INNER JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo WHERE date >= ? && date <= ? "
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0)
			sql = sql + " && ";
		sql = sql + " ph.product_id = " + products[i];

		if(i != products.length - 1)
			sql = sql + " || "	
	}
	sql = sql + ";";
	mysql.query(sql,next);
}

exports.getDailyAverage = function(from_date, to_date, products,next){
	var sql = "SELECT COALESCE(ROUND(AVG(a.count), 2), 0) as average FROM (SELECT COUNT(ph.supplier_lo) as count FROM purchase_history ph WHERE ph.status = 'Completed' && ph.date >= ? && ph.date <= ? "
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);
	
	for(var i = 0 ; i < products.length; i++){
		if(i == 0)
			sql = sql + " && ";

		sql = sql + " ph.product_id = " + products[i];

		if(i != products.length - 1)
			sql = sql + " || "
	}
	sql = sql + " GROUP BY ph.date) a;";
	mysql.query(sql,next);
}

exports.getMonthlyAverage = function(from_date, to_date, products, next){
	var sql = "SELECT COALESCE(ROUND(AVG(a.monthly_records),2),0) as monthly_avg FROM (SELECT MONTH(ph.date) as month, SUM(ph.qty) as monthly_bags, SUM(ph.amount) as monthly_amount, COUNT(ph.supplier_lo) as monthly_records FROM purchase_history ph WHERE ph.status = 'Completed' && (ph.date >= ? && ph.date <= ?)";
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + ")";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + " GROUP BY YEAR(ph.date), MONTH(ph.date) ORDER BY MONTH(ph.date) ASC, YEAR(ph.date) DESC) a;";
	
	mysql.query(sql,next);

}
exports.getCard1 = function(from_date, to_date, product, next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date, TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE ph.date >= ? && ph.date <= ? && ph.status = 'Completed' && ph.product_id = ?;"
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);
	sql = mysql.format(sql, product);

	
	mysql.query(sql,next);
}

exports.getPendingCount = function(from_date, to_date, products, next){
	var sql = "SELECT COALESCE(COUNT(supplier_lo),0) as pending FROM purchase_history WHERE status = 'Pending' && date >= ? && date <= ? "
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + ")";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + ";"
	
	mysql.query(sql,next);
}
exports.getPendingPurchases = function(from_date, to_date, products, next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date, TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE ph.date >= ? && ph.date <= ? && ph.status = 'Pending' ";
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + ")";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + ";"
	
	mysql.query(sql,next);
}

exports.getPendingSummary = function(from_date, to_date, products, next){
	var sql = "SELECT COALESCE(SUM(ph.amount),0) as total_amount, COALESCE(SUM(ph.qty),0) as total_bags FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE ph.date >= ? && ph.date <= ? && ph.status = 'Pending' "
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + ")";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + ";"
	
	mysql.query(sql,next);
}


exports.getDirectDeliveries = function(from_date, to_date, products, next){
	var sql = "SELECT ph.supplier_lo, DATE_FORMAT(ph.date, '%m/%d/%Y') as date, TIME_FORMAT(ph.time_out, '%h %i %p') as time_out, ph.supplier_dr, ph.supplier_so, ph.plate_num, pt.product_name, ph.status, ph.amount, ph.qty, ph.driver, et.first_name, et.last_name, pc.purchase_price, c.customer_name FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE ph.date >= ? && ph.date <= ? && !isnull(c.customer_id) ";
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);


	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + ")";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + ";"
	
	mysql.query(sql,next);
}

exports.getDirectSummary = function(from_date, to_date, products, next){
	var sql = "SELECT COALESCE(COUNT(ph.supplier_lo),0) as count, COALESCE(SUM(ph.qty),0) as bags, COALESCE(SUM(ph.amount),0) as total_amount FROM purchase_history ph LEFT JOIN product_table pt ON pt.product_id = ph.product_id LEFT JOIN employee_table et ON et.employee_id = ph.driver && et.job = 'Driver' LEFT JOIN product_catalogue_table pc ON  pc.product_id = ph.product_id && pc.start_date <= ph.date && (pc.status = 'Active' || pc.end_date >= ph.date) LEFT JOIN sales_history sh ON sh.purchase_lo = ph.supplier_lo LEFT JOIN customer_table c ON c.customer_id = sh.customer_id WHERE ph.date >= ? && ph.date <= ? && !isnull(c.customer_id) "

	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);


	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + ")";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + ";"
	
	mysql.query(sql,next);

}
exports.getDailyAverageDetailed = function(from_date, to_date, products, next){
	var sql = "WITH RECURSIVE t as ( select ? as dt UNION SELECT DATE_ADD(t.dt, INTERVAL 1 DAY) FROM t WHERE DATE_ADD(t.dt, INTERVAL 1 DAY) <= ? ) select t.dt as date, COALESCE(COUNT(ph.supplier_lo),0) as purchases, COALESCE(SUM(ph.qty),0) as quantity, COALESCE(SUM(ph.amount),0) as amount FROM t LEFT JOIN purchase_history ph ON t.dt = ph.date WHERE (ph.status = 'Completed' || isnull(ph.status)) ";

	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);


	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + "|| isnull(ph.product_id))";
		}
		else{
			sql = sql + " || ";
		}
	}
	sql = sql + " GROUP BY t.dt ORDER BY t.dt;";
	
	mysql.query(sql,next);
}

exports.getDailyAverageSummary = function(from_date, to_date, products, next){
	var sql = "SELECT COALESCE(AVG(a.purchases),0) as avg_purchases, COALESCE(AVG(a.bags),0) as avg_quantity, COALESCE(AVG(a.amount),0) as avg_amount FROM (WITH RECURSIVE t as (select ? as dt UNION SELECT DATE_ADD(t.dt, INTERVAL 1 DAY) FROM t WHERE DATE_ADD(t.dt, INTERVAL 1 DAY) <= ? ) select t.dt, COALESCE(COUNT(ph.supplier_lo),0) as purchases, SUM(ph.qty) as bags, SUM(ph.amount) as amount FROM t LEFT JOIN purchase_history ph ON t.dt = ph.date WHERE (ph.status = 'Completed' || isnull(ph.status)) ";
	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + "|| isnull(ph.product_id))";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + " GROUP BY t.dt ORDER BY t.dt) a;"
	console.log(sql);
	
	mysql.query(sql,next);
}

exports.getMonthlyAverageDetailed = function(from_date, to_date, products, next){
	var sql = "WITH RECURSIVE t as ( select ? as dt UNION SELECT DATE_ADD(t.dt, INTERVAL 1 DAY) FROM t WHERE DATE_ADD(t.dt, INTERVAL 1 DAY) <= ? ) select YEAR(t.dt) as year, MONTHNAME(t.dt) as date,  COALESCE(COUNT(ph.supplier_lo),0) as purchases, COALESCE(SUM(ph.qty),0) as quantity, COALESCE(SUM(ph.amount),0) as amount FROM t LEFT JOIN purchase_history ph ON t.dt = ph.date WHERE (ph.status = 'Completed' || isnull(ph.status) ";

	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + "|| isnull(ph.product_id))";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + ") GROUP BY MONTH(t.dt) ORDER BY t.dt;"
	console.log(sql);
	mysql.query(sql,next);
}


exports.getMonthlyAverageSummary = function(from_date, to_date, products, next){
	var sql = "SELECT a.year as year, a.month as month, COALESCE(ROUND(AVG(a.purchases),2),0) as avg_purchases,COALESCE(ROUND(AVG(a.bags),2),0) as avg_quantity, COALESCE(ROUND(AVG(a.amount),2),0) as avg_amount FROM ( WITH RECURSIVE t as ( select ? as dt UNION SELECT DATE_ADD(t.dt, INTERVAL 1 DAY) FROM t WHERE DATE_ADD(t.dt, INTERVAL 1 DAY) <= ? ) select YEAR(t.dt) as year, MONTHNAME(t.dt) as month,  MONTH(t.dt) as monthnum, COALESCE(COUNT(ph.supplier_lo),0) as purchases, SUM(ph.qty) as bags, SUM(ph.amount) as amount FROM t LEFT JOIN purchase_history ph ON t.dt = ph.date WHERE (ph.status = 'Completed' || isnull(ph.status)) ";

	sql = mysql.format(sql, from_date);
	sql = mysql.format(sql, to_date);

	for(var i = 0 ; i < products.length; i++){
		if(i == 0){
			sql = sql + " && (";
		}
		sql = sql + " ph.product_id = " + products[i]; 

		if(i == products.length - 1){
			sql = sql + "|| isnull(ph.product_id))";
		}
		else{
			sql = sql + " || ";
		}
	}

	sql = sql + " GROUP BY t.dt ORDER BY t.dt) a GROUP BY a.year ,a.month ORDER BY a.year, a.month DESC;"
	console.log(sql);
	mysql.query(sql,next);
}