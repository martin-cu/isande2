const customerModel = require('../models/customerModel');
const productModel = require('../models/productModel');
const purchaseModel = require('../models/purchaseModel');
const recommendationModel = require('../models/recommendationModel');
const deliveryDetailModel = require('../models/deliveryDetailModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.changeSelectedAlgo = function(req, res) {
	recommendationModel.changeDefaultAlgo(req.query, function(err, selected) {
		if (err)
			throw err;
		else {
			res.send({ algo: selected });
		}
	});
}

exports.viewOtherAlgo = function(req, res) {
	var selected_algo = parseInt(req.query.id);
	var data;

	if (selected_algo === 1) {
		recommendationModel.getRecommendation1(function(err, result) {
			if (err)
				throw err;
			else {
				data = dataformatter.createRecommendation(result, selected_algo);
				res.send({ data: data });
			}
		});
	}
	else if (selected_algo === 2) {
		recommendationModel.getRecommendation2(function(err, result) {
			if (err)
				throw err;
			else {
				data = dataformatter.createRecommendation(result, selected_algo);
				
				res.send({ data: data });
			}
		});
	}
	else if (selected_algo === 3) {
		recommendationModel.getRecommendation3(function(err, result) {
			if (err)
				throw err;
			else {
				productModel.getProducts(function(err, products) {
					if (err)
						throw err;
					else {
						var forecast;
						var obj = [];
						var product = [];
						for (var i = 0; i < products.length; i++) {
							for (var x = 0; x < result.length; x++) {
								if (products[i].product_name === result[x].product_name) {
									product.push(result[x]);
								}
								else if (x == result.length-1 && i == products.length-1) {
									product.push({ product_name: products[i].product_name });
								}
							}
							obj.push(product);
							product = [];
						}
						forecast = dataformatter.holtWinters(obj, 'Week', products);
						data = dataformatter.createRecommendation(forecast, selected_algo);
				
						res.send({ data: data });
					}
				});
			}
		});
	}
}

exports.getAllPurchases = function(req,res){

	console.log("HERE WE GO");
	var offset = 0;
	var limit = 10;

	// purchaseModel.getAll(function(err, count){
	purchaseModel.getAllPagination(offset, limit, function(err, count){
		if(err){
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect('/');
		}
		else{
			var pending = false;
			var complete = false;
			for(var i = 0; i < count.length ; i++){
				count[i].supplier_lo = count[i].supplier_lo.toString();
				// count[i].date = dataformatter.formatDate(count[i].date, 'MM/DD/YYYY');
				count[i].amount = dataformatter.formatMoney(count[i].amount.toFixed(2), '');
				count[i].purchase_price = dataformatter.formatMoney(count[i].purchase_price.toFixed(2), '');
				if(count[i].status == "Pending")
					pending = true;
				else if(count[i].status == "Completed"){
					complete = true;
				}
				count[i].pending = pending;
				count[i].complete = complete;

				pending = false;
				complete = false;

				if(count[i].customer_name == null){
					count[i].customer_name = "WAREHOUSE"
				}
			}
			var html_data = {};
			html_data["record"] = count;
			console.log(count.length);
			var blank = [];
			if(count.length < 10){
				limit = count.length;
				for(var i = 0 ; i < 10 - count.length; i++){
					blank[i] = '.';
				}
			}
			html_data["blank"] = blank;
			console.log(html_data.blank);
			purchaseModel.getDrivers(function(err, driver){
				if(err){
					req.flash('dialog_error_msg', 'Oops something went wrong!');
					res.redirect('/');
				}							

				if(driver.length == 0){

				}
				else{
					var drivers = {};
					for(var i = 0; i < driver.length ; i++){
						drivers[i] = {
							count : i + 1,
							driver : driver[i]
						}
					}
					html_data["driver"] = drivers;
				}

				purchaseModel.getCustomers(function(err, customer){//add to driver
						if(err){
							req.flash('dialog_error_msg', 'Oops something went wrong!');
							res.redirect('/');
						}							
						if(customer.length == 0){ 
						}
						else{
							var customers = {};
							customers[0] = {
								count : 1,
								customer : {
									customer_id : 0,
									customer_name : "WAREHOUSE"
								}
							}
							for(var i = 1; i < customer.length + 1; i++){
								customers[i] = {
									count : i + 1,
									customer : customer[i-1]
								}
							}
							html_data["customer"] = customers;

						}
						purchaseModel.getFilterPrice(function(err, price){//add to customer
								if(err){
									req.flash('dialog_error_msg', 'Oops something went wrong!');
									res.redirect('/');
								}	
								if(price.length == 0){
								}
								else{
									var prices = {};
									for(i = 0; i < price.length ; i++){
										prices[i] = {
											count : i + 1,
											price : price[i]
										}
									}
									html_data["price"] = prices;
								}

								purchaseModel.getTrucks(function(err, truck){
									if(truck.length == 0){
									}
									else{
										var trucks = {};
										for(var i = 0; i < truck.length; i++){
											trucks[i] = {
												count : i + 1,
												truck : truck[i]
											}
										}
										html_data["truck"] = trucks;
									}
									var prices = {};
									purchaseModel.getCurrentPrice(1, function(err, price1){
										if(price1.length == 0){
										}
										else{
											price1[0].purchase_price = dataformatter.formatMoney(price1[0].purchase_price.toFixed(2), '');
											prices[0] = price1[0];
										}
										purchaseModel.getCurrentPrice(2, function(err, price2){
											if(price2.length == 0){
											}
											else{
												prices[1] = price2[0];
											}

											html_data["prices"] = prices;
											html_data["first_price"] = price1[0].purchase_price;
											
											var today = new Date();
											var dd = String(today.getDate()).padStart(2, '0');
											var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
											var yyyy = today.getFullYear();

											today = yyyy + '-' + mm + '-' + dd;
											purchaseModel.getPendingSales(1, today, 999,function(err, sales){
												if(err){
													throw err;
												}
												html_data["pending_sales"] = sales;
												

												purchaseModel.getCount(function(err, total){
													
													html_data["pagination"] = {
														offset : offset + 1,
														limit : limit,
														count : total[0].count 
													}
													
													html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'purchasing_role','purchase_record_tab');
													recommendationModel.getSelectedAlgo(function(err, algo) {
														if (err) {
															req.flash('dialog_error_msg', 'Oops something went wrong!');
															res.redirect('/');
														}
														else {
															var selected_algo;
															var recommendation;
															for (var i = 0; i < algo.length; i++) {
																if (algo[i].status === 'Active')
																	selected_algo = algo[i].description;
															}
															html_data['algo'] = algo;
															html_data['selected_algo'] = selected_algo;

															if (selected_algo === 'Algo 1') {
																recommendationModel.getRecommendation1(function(err, result) {
																	if (err) {
																		req.flash('dialog_error_msg', 'Oops something went wrong!');
																		res.redirect('/');
																	}
																	else {
																		html_data['recommendation'] = dataformatter.createRecommendation(result, selected_algo);
																		
																		res.render("purchasingRecordTable",html_data);
																	}
																});
															}
															else if (selected_algo === 'Algo 2') {
																recommendationModel.getRecommendation2(function(err, result) {
																	if (err) {
																		req.flash('dialog_error_msg', 'Oops something went wrong!');
																		res.redirect('/');
																	}
																	else {
																		html_data['recommendation'] = dataformatter.createRecommendation(result, selected_algo);
																		console.log(html_data['recommendation']);
																		res.render("purchasingRecordTable",html_data);
																	}
																});
															}
															else if (selected_algo === 'Algo 3') {
																recommendationModel.getRecommendation3(function(err, result) {
																	if (err) {
																		req.flash('dialog_error_msg', 'Oops something went wrong!');
																		res.redirect('/');
																	}
																	else {
																		productModel.getProducts(function(err, products) {
																			if (err) {
																				req.flash('dialog_error_msg', 'Oops something went wrong!');
																				res.redirect('/');
																			}
																			else {
																				var forecast;
																				var obj = [];
																				var product = [];
																				for (var i = 0; i < products.length; i++) {
																					for (var x = 0; x < result.length; x++) {
																						if (products[i].product_name === result[x].product_name) {
																							product.push(result[x]);
																						}
																						else if (x == result.length-1 && i == products.length-1) {
																							product.push({ product_name: products[i].product_name });
																						}
																					}
																					obj.push(product);
																					product = [];
																				}
																				forecast = dataformatter.holtWinters(obj, 'Week', products);
																				forecast.forEach(function(item, index) {
																					console.log(forecast[index]);
																				})
																				html_data['recommendation'] = dataformatter.createRecommendation(forecast, selected_algo);
																				console.log(req);
																				console.log(html_data.purchase_record_tab);
																				res.render("purchasingRecordTable",html_data);
																			}
																		});
																	}
																});
															}
														}
													})

												});
											});
										});
									});
								});
							});
					});
				
			});
		}
	});
};

exports.postAddPurchase = function(req,res){
	var amount = 0;
	purchaseModel.getDatePrice( parseInt(req.body.purchase_product), req.body.purchase_schedule.toString(), function(err, price){
		if(err){
			req.flash("dialog_error_msg", "Error getting price.");
			res.redirect("/purchase_history");
		}
		else{
			if(price.length == 0){
				purchaseModel.getCurrentPrice(req.body.purchase_product, function(err, price2){
					amount = parseInt(req.body.purchase_qty) * price2[0].purchase_price;
				console.log("1-" + amount);
						var record = {
						supplier_lo : req.body.purchase_lo,
						date : req.body.purchase_schedule,
						supplier_so : req.body.purchase_so,
						product_id : parseInt(req.body.purchase_product),
						qty : parseInt(req.body.purchase_qty),
						amount : amount,
						status : "Pending"
					};

					purchaseModel.addPurchase(record ,function(err){
						if(err){
							req.flash("dialog_error_msg", "LO Number already exists.");
							res.redirect("/purchase_history");
						}
						else{
							if(req.body.purchase_delivery_location != "WAREHOUSE"){
								console.log(req.body.purchase_delivery_location);
								purchaseModel.updateSalesLo(req.body.purchase_delivery_location, req.body.purchase_lo, function(err){
									if(!err)
										console.log("Sales updated");
									deliveryDetailModel.updateDeliveryToSellout(req.body.purchase_delivery_location, function(err){});

								});
							}
							req.flash("dialog_success_msg", "Record successfully added!");
							res.redirect("/purchase_history");
						}
					});
					

				});
				console.log("1-" + amount);

			}
			else{
				amount = parseInt(req.body.purchase_qty) * price[0].purchase_price;
				console.log("2-" + amount);
				var record = {
						supplier_lo : req.body.purchase_lo,
						date : req.body.purchase_schedule,
						supplier_so : req.body.purchase_so,
						product_id : parseInt(req.body.purchase_product),
						qty : parseInt(req.body.purchase_qty),
						amount : amount,
						status : "Pending"
					};

					purchaseModel.addPurchase(record ,function(err){
						if(err){
							console.log(err);
							console.log("DUPLICATE");
							req.flash("dialog_success_msg", "LO Number already exists.");
							res.redirect("/purchase_history");

						}
						else{
							if(req.body.purchase_delivery_location != "WAREHOUSE"){
								console.log(req.body.purchase_delivery_location);
								purchaseModel.updateSalesLo(req.body.purchase_delivery_location, req.body.purchase_lo, function(err){
									if(!err)
										console.log("Sales updated");
									deliveryDetailModel.updateDeliveryToSellout(req.body.purchase_delivery_location, function(err){});

								});
							}
						}
					});
					req.flash("dialog_success_msg", "Record successfully added!");
					res.redirect("/purchase_history");
			}
		}
		
	});
};


exports.getPurchaseDetails = function(req,res){

	var html_data = {};

	purchaseModel.getPurchaseDetails(req.params.lo, function(err, details){
		if(err) {
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect("/");
		}
		else{
			//get customers and locations and prices
			var status = {
				completed : false,
				pending   : false,
				intransit: false,
			};
			if(details[0].status == "Completed")
				status.completed = true;
			if(details[0].status == "Pending")
				status.pending = true;
			if(details[0].status == "Processing")
				status.intransit = true;
			html_data["status"] = status;

			if(details[0].product_id == 1){
				html_data["product"] = true;
			}
			else{
				html_data["product"] = false;
			}
			details[0].amount = dataformatter.formatMoney(details[0].amount.toFixed(2), '');

			details[0].supplier_lo = details[0].supplier_lo.toString();

			html_data["details"] = details[0];

			purchaseModel.getTrucks(function(err, trucks){
				var temp = {};
				for(var i = 0 ; i < trucks.length ; i++){
					if(details[0].plate_num == trucks[i].plate_no){
						temp = trucks[0];
						trucks[0] = trucks[i];
						trucks[i] = temp;
						i = trucks.length;
					}
				}
				html_data["trucks"] = trucks;

				purchaseModel.getDrivers(function(err, drivers){
					temp = {};
					for(var i = 0; i < drivers.length; i++){
						if(details[0].driver == drivers[i].employee_id){
							temp = drivers[0];
							drivers[0] = drivers[i];
							drivers[i] = temp;
							i = drivers.length;
						}
					}
					html_data["drivers"] = drivers;

					if(details[0].delivery_receipt != null){
						var text = details[0].customer_name + "-" + details[0].scheduled_date + "-" + details[0].delivery_receipt;
						console.log(text);
						html_data["delivery"] = {
							val : "",
							text : text
						};
						html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'purchase');
						res.render("purchase_details", html_data);
					}
					else{
						html_data["delivery"] = {
							val : "WAREHOUSE",
							text : "WAREHOUSE"
						};
						purchaseModel.getPendingSales(details[0].product_id , details[0].date,details[0].qty,function(err, sales){
							console.log(sales);
							html_data["sale"] = sales;
							html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'purchase');
							res.render("purchase_details", html_data);
						});
					}
					
				});
			});
		}
	});
}

exports.updatePurchaseDetails = function(req,res){

	var html_data = {};
	console.log(req.body);
	var dr = req.body.supplier_dr;
	var to = req.body.time_out;
	var date = req.body.date;
	if(dr == "")
		console.log("1");
	if(to == "")
		console.log("3");
	console.log(to);
	purchaseModel.updatePurchaseInfo(date,to.toString(),dr,req.params.lo, function(err){
		if(err){
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect("/purchase_record/" + req.params.lo);
		}
		else{
			if(req.body.location != "WAREHOUSE")
			purchaseModel.updateSalesLo(req.body.location, req.params.lo, function(err){
				if(err){
					req.flash('dialog_error_msg', 'Oops something went wrong!');
					res.redirect("/purchase_record/" + req.params.lo);
				}
				else{
					deliveryDetailModel.updateDeliveryToSellout(req.body.location, function(err){
						req.flash('dialog_success_msg', 'Successfully updated purchase record!');
						res.redirect("/purchase_record/" + req.params.lo);
				});
				}			
			});
			else{
				req.flash('dialog_success_msg', 'Successfully updated purchase record!');
				res.redirect("/purchase_record/" + req.params.lo);
			}
		}
	});

	




	

	// purchaseModel.getPurchaseDetails(req.params.lo, function(err, details){
	// 	console.log(req.body);
	// 	if(details[0].status != "Completed" && req.body.status == "Completed"){
	// 		purchaseModel.addProductQuantity(req.body.qty, req.body.product_id, function(err){	
	// 		});
	// 	}
	// 	else if(details[0].status == "Completed" && req.body.status != "Completed"){
	// 		purchaseModel.addProductQuantity(req.body.qty * (-1), req.body.product_id, function(err){	
	// 		});
	// 	}

	// 	if(details[0].product_id != parseInt(req.body.product_id)){
	// 		console.log("update price bruh");
	// 	}

	// 	var total = 0.0;
	// purchaseModel.getDatePrice(req.body.product_id, req.body.date, function(err, price){
	// 	if(price.length == 0){
	// 		purchaseModel.getCurrentPrice(req.body.product_id, function(err, curPrice){

	// 			total = curPrice[0].purchase_price * details[0].qty;
	// 			var record = {
	// 			supplier_lo : req.params.lo,
	// 			date : req.body.date,
	// 			supplier_dr : req.body.supplier_dr,
	// 			product_id : parseInt(req.body.product_id),
	// 			qty : parseInt(req.body.qty),
	// 			amount : total,
	// 			status : req.body.status,
	// 			time_out : req.body.time_out
	// 			};

	// 			if(record.supplier_dr != "" && record.time_out != ""){
	// 				record.status = "Completed";
	// 			}

	// 			purchaseModel.updatePurchaseInfo( record , function(err){
	// 				if(err){
	// 					console.log("err");
	// 					res.redirect("/purchase_record/" + req.params.lo);
	// 				}
	// 				else{
	// 					res.redirect("/purchase_record/" + req.params.lo);
	// 				}
					
	// 			});
	// 		});
	// 	}
	// 	else{
	// 		total = price[0].purchase_price * details[0].qty;

	// 		var record = {
	// 		supplier_lo : req.params.lo,
	// 		date : req.body.date,
	// 		supplier_dr : req.body.supplier_dr,
	// 		product_id : parseInt(req.body.product_id),
	// 		qty : parseInt(req.body.qty),
	// 		amount : total,
	// 		status : req.body.status,
	// 		time_out : req.body.time_out
	// 		};

	// 		if(record.supplier_dr != "" && record.time_out != ""){
	// 			record.status = "Completed";
	// 		}

	// 		purchaseModel.updatePurchaseInfo( record , function(err){
	// 			if(err){
	// 				console.log("err");
	// 				res.redirect("/purchase_record/" + req.params.lo);
	// 			}
	// 			else{
	// 				res.redirect("/purchase_record/" + req.params.lo);
	// 			}
				
	// 		});
	// 	}
	// });

	// });

	
}

exports.filterPurchases = function(req,res){
	console.log(req.query.filters);

	var offset = parseInt(req.query.offset);
	var limit = 10;

	var filters = [];
	var parameters = [];
	var filtername = "";
	var count = 0;
	if(req.query.filters.status != ""){
		for(var i = 0 ;  i < req.query.filters.status.length; i++){
			parameters[i] = req.query.filters.status[i];
		}

		filters[count] = {
			filtername : "status",
			parameters : req.query.filters.status
		};
		count++;
	}
	if(req.query.filters.product != ""){
		for(var i = 0 ;  i < req.query.filters.product.length; i++){
			parameters[i] = req.query.filters.product[i];
		}
		filters[count] = {
			filtername : "product_id",
			parameters : req.query.filters.product
		};
		count++;
	}
	if(req.query.filters.price != ""){
		for(var i = 0 ;  i < req.query.filters.price.length; i++){
			parameters[i] = req.query.filters.price[i];
		}
		filters[count] = {
			filtername : "purchase_price",
			parameters : req.query.filters.price
		};
		count++;
	}
	if(req.query.filters.truck != ""){
		for(var i = 0 ;  i < req.query.filters.truck.length; i++){
			parameters[i] = req.query.filters.truck[i];
		}
		filters[count] = {
			filtername : "plate_num",
			parameters : req.query.filters.truck
		};
		count++;
	}
	if(req.query.filters.driver != ""){
		for(var i = 0 ;  i < req.query.filters.driver.length; i++){
			parameters[i] = req.query.filters.driver[i];
		}
		filters[count] = {
			filtername : "driver",
			parameters : req.query.filters.driver
		};
		count++;
	}
	if(req.query.filters.customer != ""){
		for(var i = 0 ;  i < req.query.filters.customer.length; i++){
			parameters[i] = req.query.filters.customer[i];
		}
		filters[count] = {
			filtername : "customer_id",
			parameters : req.query.filters.customer
		};
		count++;
	}

	if(count == 0){
		filters[0] == null;
	}
	console.log(filters);
	purchaseModel.getFilteredPurchases(filters, offset ,function(err, records){
		for(var i = 0; i < records.length; i++){
			if(records[i].customer_name == null){
					records[i].customer_id = 0;
					records[i].customer_name = "WAREHOUSE"
				}
		}

		if(limit > records.length)
			limit = offset + records.length;
		else
			limit = offset + 10;

		res.send({
				record : records,
				offset : offset + 1,
				limit : limit,
				count : records.length
			});
	});
}

exports.getProductPrice = function(req,res){
	console.log(req.params.product_id);
	purchaseModel.getCurrentPrice(parseInt(req.params.product_id), function(err, price){
		console.log(price);
		res.send(price);
	});
}

exports.getDatePrice = function(req, res){
	// console.log(req.params.product_id);
	// console.log(req.params.date);

	purchaseModel.getDatePrice(parseInt(req.params.product_id), req.params.date, function(err, price){
		
		if(price.length == 0){
			purchaseModel.getCurrentPrice(parseInt(req.params.product_id), function(err, price2){
				res.send(price2);
			});
		}
		else{
			res.send(price);
		}
	});
}

exports.getPendingSales = function(req,res){
	console.log(req.query.qty); 
	purchaseModel.getPendingSales(parseInt(req.params.product_id), req.params.date, req.query.qty , function(err, sales){
		res.send(sales);
	});
}

exports.getPagination = function(req,res){
	var offset = parseInt(req.query.offset);
	var limit = 10;
	var filters = [];
	console.log(offset + limit);

	var filters = [];
	var parameters = [];
	var filtername = "";
	var count = 0;
	if(req.query.filters.status != ""){
		for(var i = 0 ;  i < req.query.filters.status.length; i++){
			parameters[i] = req.query.filters.status[i];
		}

		filters[count] = {
			filtername : "status",
			parameters : req.query.filters.status
		};
		count++;
	}
	if(req.query.filters.product != ""){
		for(var i = 0 ;  i < req.query.filters.product.length; i++){
			parameters[i] = req.query.filters.product[i];
		}
		filters[count] = {
			filtername : "product_id",
			parameters : req.query.filters.product
		};
		count++;
	}
	if(req.query.filters.price != ""){
		for(var i = 0 ;  i < req.query.filters.price.length; i++){
			parameters[i] = req.query.filters.price[i];
		}
		filters[count] = {
			filtername : "purchase_price",
			parameters : req.query.filters.price
		};
		count++;
	}
	if(req.query.filters.truck != ""){
		for(var i = 0 ;  i < req.query.filters.truck.length; i++){
			parameters[i] = req.query.filters.truck[i];
		}
		filters[count] = {
			filtername : "plate_num",
			parameters : req.query.filters.truck
		};
		count++;
	}
	if(req.query.filters.driver != ""){
		for(var i = 0 ;  i < req.query.filters.driver.length; i++){
			parameters[i] = req.query.filters.driver[i];
		}
		filters[count] = {
			filtername : "driver",
			parameters : req.query.filters.driver
		};
		count++;
	}
	if(req.query.filters.customer != ""){
		for(var i = 0 ;  i < req.query.filters.customer.length; i++){
			parameters[i] = req.query.filters.customer[i];
		}
		filters[count] = {
			filtername : "customer_id",
			parameters : req.query.filters.customer
		};
		count++;
	}

	if(count == 0){
		filters[0] == null;
	}

	
	purchaseModel.getFilteredPurchases(filters, parseInt(offset), function(err, records){
		if(limit > records.length)
			limit = offset + records.length;
		else{
			limit = offset + 10;
		}
		for(var i = 0; i < records.length ; i++){
				records[i].amount = dataformatter.formatMoney(records[i].amount.toFixed(2), '');

				records[i].purchase_price = dataformatter.formatMoney(records[i].purchase_price.toFixed(2), '');

			if(records[i].last_name == null){
				records[i].customer_name = "WAREHOUSE";
			}
		}
		res.send({
			data : records,
			offset : offset + 1,
			limit : limit,
			count : records.length
		});
	});
}
