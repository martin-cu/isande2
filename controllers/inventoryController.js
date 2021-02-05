const inventoryModel = require('../models/inventoryModel');
const productModel = require('../models/productModel');
const { validationResult } = require('express-validator');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');
const e = require('express');


exports.reportDamagedInventory = function(req, res) {
	var { damaged_amt, comments, product_id } = req.body;
	var query = {
		damaged_amt: damaged_amt,
		comments: comments,
		reported_by: req.session.username,
		product_id: product_id,
		date: new Date()
	}
	inventoryModel.createDamageReport(query, function(err, result) {
		if (err) {
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/inventory');
		}
		else {
			inventoryModel.getCurProductQty({ product_id: product_id }, function(err, qty) {
				if (err) {
					req.flash('error_msg', 'Oops something went wrong!');
					res.redirect('/inventory');
				}
				else {
					var update = { qty: (qty[0].qty - parseInt(damaged_amt)) };
					inventoryModel.subtractProductQty(update, { product_id: product_id }, function(err, newProduct) {
						if (err) {
							req.flash('error_msg', 'Oops something went wrong!');
							res.redirect('/inventory');
						}
						else {
							req.flash('success_msg', 'Successfully created damage report!');
							res.redirect('inventory_overview');
						}
					})
				}
			});
		}
	})
}

exports.reportManualCount = function(req, res) {
	var { physical_count, comments2, product_id2 } = req.body;
	var query = {
		physical_count: physical_count,
		comment: comments2,
		reported_by: req.session.username,
		product_id: product_id2,
		date_recorded: new Date()
	}
	inventoryModel.getCurProductQty({ product_id: product_id2 }, function(err, qty) {
		if (err) {
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/inventory');
		}
		else {
			query['system_count'] = qty[0].qty;
			inventoryModel.createManualCountReport(query, function(err, result) {
				if (err) {
					req.flash('error_msg', 'Oops something went wrong!');
					res.redirect('/inventory');
				}
				else {
					var update = { qty: query.physical_count };
					if (query.system_count > query.physical_count) {
						inventoryModel.subtractProductQty(update, { product_id: product_id2 }, function(err, newQty) {
							if (err) {
								req.flash('error_msg', 'Oops something went wrong!');
								res.redirect('/inventory');
							}
							else {
								var damage = {
									damaged_amt: (query.system_count - query.physical_count),
									comments: comments2,
									reported_by: req.session.username,
									product_id: product_id2,
									date: new Date()
								}
								inventoryModel.createDamageReport(damage, function(err, dmg_report) {
									if (err) {
										req.flash('error_msg', 'Oops something went wrong!');
										res.redirect('/inventory');
									}
									else {
										req.flash('error_msg', 'System Count is higher than physical count successfuly adjusted records and created damage report!');
										res.redirect('inventory_overview');
									}
								});
							}
						});
					}
					else if (query.system_count < query.physical_count) {
						inventoryModel.subtractProductQty(update, { product_id: product_id2 }, function(err, newQty) {
							if (err) {
								req.flash('error_msg', 'Oops something went wrong!');
								res.redirect('/inventory');
							}
							else {
								req.flash('error_msg', 'Physical Count is higher than system count successfuly adjusted records!');
								res.redirect('inventory_overview');
							}
						});
					}
					else {
						req.flash('success_msg', 'System count matches physical count!');
						res.redirect('inventory_overview');
					}
				}
			})
		}
	})
}


exports.getProductInventory = function(req, res){
	inventoryModel.getCurrentInventory(function(err, currinv) {
		if(err){ 
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/inventory');
		}
		else
			inventoryModel.getOutgoingProducts(function(err, outgoing)  {
			if (err) {
				req.flash('error_msg', 'Oops something went wrong!');
				res.redirect('/inventory');
			}
			else {
				inventoryModel.getIncomingProducts(function(err, incoming)  {
					if (err) {
						req.flash('error_msg', 'Oops something went wrong!');
						res.redirect('/inventory');
					}
					else {
						inventoryModel.dailyInventory(function(err, dailyInv){
							if(err){
								req.flash('error_msg', 'Oops something went wrong!');
								res.redirect('/inventory')
							}
							else{
								for(var i =0 ; i < dailyInv.length ; i++){
									dailyInv[i].date =  dataformatter.formatDate(dailyInv[i].date, 'mm DD, YYYY');
								}
								var count = 0;
								var offset = parseInt(req.query.offset);

								var html_data = { "currinv": currinv[0].currinventory , "outgoing" : outgoing[0].outgoing, "incoming" : incoming[0].incoming, "dailyInventory" : dailyInv};
// =======
// 								var html_data = { "currinv": dataformatter.formatMoney(currinv[0].currinventory, "") , "outgoing" : dataformatter.formatMoney(outgoing[0].outgoing, ""), "incoming" : dataformatter.formatMoney(incoming[0].incoming, ""), "dailysales" : dailysales, "dailypur" : dailypur};
								
								html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'inventory_overview')

								res.render('inventory_overview', html_data);
							}
						});
						// inventoryModel.DailyInventorySales(function(err, dailysales) {
						// 	if (err){
						// 		req.flash('error_msg', 'Oops something went wrong!');
						// 		res.redirect('/inventory');
						// 	}
						// 	else {
						// 		inventoryModel.DailyInventoryPurchases(function(err, dailypur) {
						// 		var count = 0;
						// 		var offset = parseInt(req.query.offset);
						// 		var html_data = { "currinv": currinv[0].currinventory , "outgoing" : outgoing[0].outgoing, "incoming" : incoming[0].incoming, "dailysales" : dailysales, "dailypur" : dailypur};
								
						// 		html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'inventory_overview')

						// 		res.render('inventory_overview', html_data);
						// 		})
								
						// 	}
						// })
				
				}
			});
		}
		});
    }
)};

exports.getProductCatalogue = function(req, res){
	inventoryModel.getProductCatalogue(function(err, monresult) {
		if(err){
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/inventory');
		}
		else
		
		var count = 0;
		var offset = parseInt(req.query.offset);

		var html_data = { 
			num_records: count.length,
			origin: offset+1,
		}
		console.log(monresult);
		for(var i =0 ; i < monresult.length ; i++){
			monresult[i].start_date =  dataformatter.formatDate(monresult[i].start_date, 'mm DD, YYYY');
		}
		html_data["past_product_price"] = monresult;
		productModel.getCurrentPrice(function(err, prices){
			
			for(var i = 0; i < prices.length; i++){
				prices[i].start_date = dataformatter.formatDate(prices[i].start_date, 'mm DD, YYYY');
			}

			html_data["prices"] = prices;


			html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'product_catalogue');

			res.render('product_catalogue', html_data);
		});
    }
)};

exports.getProductName = function(req, res){
	inventoryModel.getProductName(function(err, monresult) {
		
		if(err){
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/inventory');
		}
		else

		var count = 0;
		var offset = parseInt(req.query.offset);

		var html_data = { 
			num_records: count.length,
			origin: offset+1,
		}
		
		var html_data = {product: monresult};
		html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'change_price')

		res.render('change_price', html_data);
	});
}

exports.getProductNameForManualCount = function(req, res){
	inventoryModel.getProductName(function(err, monresult) {
		
		if(err){
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/inventory');
		}
		else

		var count = 0;
		var offset = parseInt(req.query.offset);

		var html_data = { 
			num_records: count.length,
			origin: offset+1,
		}
		
		var html_data = {product: monresult};
		html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'manual_count')

		res.render('manual_count', html_data);
	});
}

exports.changeProductPrice = function(req, res){
	const errors = validationResult(req);
	var { fcc_name, fcc_purchaseprice, fcc_sellingprice } = req.body;
	var { rcc_name, rcc_purchaseprice, rcc_sellingprice } = req.body;


	if(errors.isEmpty()){
		console.log("Change price!");
		console.log(req.body);
		inventoryModel.setCatalogueInactive(parseInt(req.body.product_id), function(err, result){
			if(err){
				throw err;
				req.flash('error_msg', 'Product Change Price Not Successful.');
				res.redirect('/product_catalogue');
			}
			else{
				productModel.changeProductPrice(parseInt(req.body.product_id), parseFloat(req.body.purchase_price), parseFloat(req.body.selling_price), function(err, result) {
					req.flash('success_msg', 'Successfully changed product price!.');
					res.redirect('/product_catalogue');
				});
			}
		});
	}
	else{
		req.flash('error_msg', 'Product Change Price Not Successful.');
		res.redirect('/product_catalogue');

	}






	// if ((errors.isEmpty()) && !(isNaN(fcc_name)) && !(isNaN(rcc_name))) {
	// 	inventoryModel.setCatalogueInactive(parseInt(fcc_name), function(err, result) {
	// 		if(err){
	// 			throw err;
	// 		}
	// 		else {
	// 			productModel.changeProductPrice(parseInt(fcc_name), parseFloat(fcc_purchaseprice), parseFloat(fcc_sellingprice), function(err, result) {	
	// 				if(err){
	// 					throw err;
	// 				}
	// 				else {
	// 					inventoryModel.setCatalogueInactive(parseInt(rcc_name), function(err, result) {
	// 						if(err){
	// 							throw err;
	// 						}
	// 						else {
	// 							productModel.changeProductPrice(parseInt(rcc_name), parseFloat(rcc_purchaseprice), parseFloat(rcc_sellingprice), function(err, result) {	
	// 								if(err){
	// 									throw err;
	// 								}
	// 								else {
	// 									req.flash('success_msg', 'Product Change Price Successfully Implemented');
	// 									res.redirect('/product_catalogue');
	// 								}
	// 							});
	// 						}
	// 					});
	// 				}
	// 			});
	// 		}
	// 	});
	// }
	// else if ((errors.isEmpty()) && !(isNaN(fcc_name)) && (isNaN(rcc_name))) {
	// 	inventoryModel.setCatalogueInactive(parseInt(fcc_name), function(err, result) {
	// 		if(err){
	// 			throw err;
	// 		}
	// 		else {
	// 			productModel.changeProductPrice(parseInt(fcc_name), parseFloat(fcc_purchaseprice), parseFloat(fcc_sellingprice), function(err, result) {	
	// 				if(err){
	// 					throw err;
	// 				}
	// 				else {
	// 						req.flash('success_msg', 'Product Change Price Successfully Implemented');
	// 						res.redirect('/product_catalogue');
	// 				}
	// 			});
	// 		}
	// 	});
	// } else if ((errors.isEmpty()) && (isNaN(fcc_name)) && !(isNaN(rcc_name))) {
	// 	inventoryModel.setCatalogueInactive(parseInt(rcc_name), function(err, result) {
	// 		if(err){
	// 			throw err;
	// 		}
	// 		else {
	// 			productModel.changeProductPrice(parseInt(rcc_name), parseFloat(rcc_purchaseprice), parseFloat(rcc_sellingprice), function(err, result) {	
	// 				if(err){
	// 					throw err;
	// 				}
	// 				else {
	// 						req.flash('success_msg', 'Product Change Price Successfully Implemented');
	// 						res.redirect('/product_catalogue');
	// 				}
	// 			});
	// 		}
	// 	});
	// }
	// else {
	// 	req.flash('error_msg', 'Product Change Price Not Successful.');
	// 	res.redirect('/product_catalogue');
	// }



	
};

exports.getProductNameForReportDamage = function(req, res){
	inventoryModel.getProductName(function(err, monresult) {
		
		if(err){
			throw err;
		}
		else

		var count = 0;
		var offset = parseInt(req.query.offset);

		var html_data = { 
			num_records: count.length,
			origin: offset+1,
		}
		
		var html_data = {product: monresult};
		html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'report_damage')

		res.render('report_damage', html_data);
	});
}