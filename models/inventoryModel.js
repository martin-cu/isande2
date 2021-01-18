var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.getProductMovement = function(next) {
    var sql = "select DATE_FORMAT(t.scheduled_date, '%m/%d/%Y') as scheduled_date, pt.product_name, sum(ifnull(sum_orders,0)) as sumOrdersPerDay, sum(ifnull(sum_purchase, 0)) as sumPurchasePerDay, pt.qty from ( select sh.scheduled_date, sh.product_id, sum(sh.qty) as sum_orders, null as sum_purchase from sales_history as sh group by sh.scheduled_date, sh.product_id union select ph.date, ph.product_id, null, sum(ph.qty) from purchase_history as ph group by ph.date, ph.product_id ) as t join product_table as pt using(product_id) group by t.scheduled_date, t.product_id having t.scheduled_date between DATE_SUB(curdate(), interval 8 day) and DATE_SUB(curdate(), interval 1 day) order by t.scheduled_date desc limit 7";

    mysql.query(sql, next);
}

exports.getProductsQuantity = function(next) {
    var sql = "SELECT DISTINCT DATE_FORMAT(src.date, '%m/%d/%Y') as DATE, src.RCC_total_purchase - src.RCC_total_sales - src.RCC_damaged_bags as RCC_total_inventory, src.FCC_total_purchase - src.FCC_total_sales - src.FCC_damaged_bags as FCC_total_inventory FROM (SELECT ph.DATE, pt.product_id, (select case when sum(ph1.qty) is null then 0 else sum(ph1.qty) end as qty from purchase_history as ph1 where ph1.status = 'Completed' and datediff(ph.date, ph1.date) >= 0 and ph.product_id = ph1.product_id and product_id = 1) as FCC_total_purchase, (select case when sum(ph1.qty) is null then 0 else sum(ph1.qty) end as qty from purchase_history as ph1 where ph1.status = 'Completed' and datediff(ph.date, ph1.date) >= 0 and ph.product_id = ph1.product_id and product_id = 2) as RCC_total_purchase, (select case when sum(sh.qty) is null then 0 else sum(sh.qty) end as total_sold from sales_history as sh where sh.order_status = 'Completed' and datediff(date, sh.scheduled_date) >= 0 and product_id = 1) as FCC_total_sales, (select case when sum(sh.qty) is null then 0 else sum(sh.qty) end as total_sold from sales_history as sh where sh.order_status = 'Completed' and datediff(date, sh.scheduled_date) >= 0 and product_id = 2) as RCC_total_sales, (select case when sum(dit.damaged_amt) is null then 0 else sum(dit.damaged_amt) end as total_damaged from damaged_inventory_table as dit where datediff(date, dit.date) >= 0 and product_id = 1) as FCC_damaged_bags, (select case when sum(dit.damaged_amt) is null then 0 else sum(dit.damaged_amt) end as total_damaged from damaged_inventory_table as dit where datediff(date, dit.date) >= 0 and product_id = 2) as RCC_damaged_bags FROM purchase_history as ph JOIN product_table as pt using(product_id) WHERE ph.status = 'Completed' order by date DESC, product_id) as src GROUP BY DATE ORDER BY DATE DESC;";
    
    mysql.query(sql, next);
}

exports.getProductCatalogue = function(next) {
    var sql = "SELECT DATE_FORMAT(start_date, '%m/%d/%Y') as start_date, product_name, purchase_price, selling_price, status from product_catalogue_table join product_table on product_catalogue_table.product_id = product_table.product_id WHERE status = 'Active' UNION SELECT DATE_FORMAT(start_date, '%m/%d/%Y') as start_date, product_name, purchase_price, selling_price, status from product_catalogue_table join product_table on product_catalogue_table.product_id = product_table.product_id WHERE status = 'Inactive' ORDER BY status, start_date DESC limit 0,5;";
    mysql.query(sql, next);
}

exports.setCatalogueInactive = function(product_id, next) {
	var sql = "UPDATE product_catalogue_table SET status = 'Inactive' WHERE catalogue_id = (SELECT MAX(ct.catalogue_id) FROM (SELECT catalogue_id FROM product_catalogue_table WHERE product_id = '?') as ct) AND status = 'Active';";
    sql = mysql.format(sql, product_id);
    // console.log(sql);
    mysql.query(sql,next);
}

exports.getProductName = function(next) {
	var sql = "select product_id, product_name from product_table;";

	mysql.query(sql, next);
}

exports.getDiscrepancyTable = function(next) {
	var sql = "select product_id, product_name from product_table;";

	mysql.query(sql, next);
}

exports.reportDamagedInventory = function(product_id, damaged_amt, reported_by, comments, next) {
    var sql = "INSERT INTO damaged_inventory_table(product_id, damaged_amt, reported_by, date, comments) VALUES('?', '?', '?', curdate(), '?');";
    
    sql = mysql.format(sql, product_id);
    sql = mysql.format(sql, damaged_amt);
    sql = mysql.format(sql, reported_by);
    sql = mysql.format(sql, comments);
    console.log(sql);
    mysql.query(sql, next);
}

exports.createDamageReport = function(query, next) {
    var sql = "insert into damaged_inventory_table set ?";
    sql = mysql.format(sql, query);
    
    mysql.query(sql, next);
}

exports.createManualCountReport = function(query, next) {
    var sql = "insert into discrepancy_table set ?";
    sql = mysql.format(sql, query);
    
    mysql.query(sql, next);
}

exports.getCurProductQty = function(query, next) {
    var sql = "select * from product_table where ?";
    sql = mysql.format(sql, query);
    
    mysql.query(sql, next);
}

exports.subtractProductQty = function(update, query, next) {
    var sql = "update product_table set ? where ?";
    sql = mysql.format(sql, update);
    sql = mysql.format(sql, query);
    
    mysql.query(sql, next);
}
