const customerModel = require('../models/customerModel');
const productModel = require('../models/productModel');
const purchaseModel = require('../models/purchaseModel');
const notificationModel = require('../models/notificationModel');
const recommendationModel = require('../models/recommendationModel');
const userModel = require('../models/userModel');
const deliveryDetailModel = require('../models/deliveryDetailModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

const bcrypt = require('bcrypt');

exports.voidPurchase = function(req, res) {
	userModel.queryAdmin({ role_id: 'System Admin' }, function(err, admin) {
		if (err) {
			throw err;
		}
		else {
			bcrypt.compare(req.body.voidPassword, admin[0].password, (err, result) => {
				if (result) {
					purchaseModel.updatePurchaseDetails({ void: 1 }, { supplier_lo: req.params.lo } , function(err, isVoid) {
						if (err) {
							throw err;
						}
						else {
							res.redirect('/home');
						}
					});
				}
				else {
					req.flash('dialog_error_msg', 'Incorrect admin password!');
					res.redirect('/view_purchase_details/'+req.params.lo);
				}
			});
		}
	});
}

exports.changeCalendar = function(req, res) {
	purchaseModel.getTrackOrders(req.query.offset, function(err, orders) {
		if (err)
			throw err;
		else {
			var newDate = new Date();
			newDate.setDate(newDate.getDate()-req.query.offset);
			var dates = [], curdate = dataformatter.startOfWeek(newDate);

			dates.push(curdate);
			curdate = new Date(curdate.toString());
			for (var i = 1; i < 7; i++) {
				dates.push(dataformatter.formatDate(new Date(curdate.setDate(curdate.getDate() + 1)), 'mm DD, YYYY') );
			}

			var html_data = {
				weeklyDate: dates,
				weeklyOrders: dataformatter.groupByDayofWeek(dates, orders)
			}
			res.send(html_data);
		}
	});
}
// exports.changeSelectedAlgo = function(req, res) {
// 	recommendationModel.changeDefaultAlgo(req.query, function(err, selected) {
// 		if (err)
// 			throw err;
// 		else {
// 			res.send({ algo: selected });
// 		}
// 	});
// }

// exports.viewOtherAlgo = function(req, res) {
// 	var selected_algo = parseInt(req.query.id);
// 	var data;

// 	if (selected_algo === 1) {
// 		recommendationModel.getRecommendation1(function(err, result) {
// 			if (err)
// 				throw err;
// 			else {
// 				data = dataformatter.createRecommendation(result, selected_algo);
// 				res.send({ data: data });
// 			}
// 		});
// 	}
// 	else if (selected_algo === 2) {
// 		recommendationModel.getRecommendation2(function(err, result) {
// 			if (err)
// 				throw err;
// 			else {
// 				data = dataformatter.createRecommendation(result, selected_algo);
				
// 				res.send({ data: data });
// 			}
// 		});
// 	}
// 	else if (selected_algo === 3) {
// 		recommendationModel.getRecommendation3(function(err, result) {
// 			if (err)
// 				throw err;
// 			else {
// 				productModel.getProducts(function(err, products) {
// 					if (err)
// 						throw err;
// 					else {
// 						var forecast;
// 						var obj = [];
// 						var product = [];
// 						for (var i = 0; i < products.length; i++) {
// 							for (var x = 0; x < result.length; x++) {
// 								if (products[i].product_name === result[x].product_name) {
// 									product.push(result[x]);
// 								}
// 								else if (x == result.length-1 && i == products.length-1) {
// 									product.push({ product_name: products[i].product_name });
// 								}
// 							}
// 							obj.push(product);
// 							product = [];
// 						}
// 						forecast = dataformatter.holtWinters(obj, 'Week', products);
// 						data = dataformatter.createRecommendation(forecast, selected_algo);
				
// 						res.send({ data: data });
// 					}
// 				});
// 			}
// 		});
// 	}
// }

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
			console.log(count);
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
													res.render("purchasingRecordTable",html_data);

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


//add updating of price for product when changed
exports.getCreatePurchase = function(req,res){
	var html_data = {};
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'purchasing_role','create_purchase_tab');
	res.render("purchase_create", html_data);
};

exports.postCreatePurchase = function(req,res){
	var amount = 0;
	console.log(req.query);
	purchaseModel.getDatePrice( parseInt(req.body.purchase_product), req.body.date, function(err, price){
		if(err){
			req.flash("dialog_error_msg", "Error getting price.");
			res.redirect("/home");
		}
		else{
			if(price.length == 0){//current price
				purchaseModel.getCurrentPrice(req.body.purchase_product, function(err, price2){
					amount = parseInt(req.body.qty) * price2[0].purchase_price;
					var record = {
						supplier_lo : req.body.purchase_lo,
						date : req.body.date,
						supplier_so : req.body.purchase_so,
						product_id : parseInt(req.body.purchase_product),
						qty : parseInt(req.body.qty),
						amount : amount,
						status : "Pending"
					};
					purchaseModel.addPurchase(record ,function(err){
						if(err){
							req.flash("dialog_error_msg", "There is an error adding a purchase.");
							res.redirect("/view_purchase_records");
						}
						else{
							productModel.getProductDetails(parseInt(req.body.purchase_product), function(err, product){
								if(err){
									throw err;
									req.flash("dialog_error_msg", "There is an error adding a purchase.");
									res.redirect("/view_purchase_records");
								}
								else{
									var query = {
									url: '/schedule_delivery',
									desc: 'New Purchase of ' + product[0].product_name,
									id: req.session.employee_id,
									roles: dataformatter.getNotifRoles('L'),
									contents: 'New Purchase of ' + product[0].product_name
									}
									/* Creating a Sale Record for Delivery sends a notification to Logistics */
									notificationModel.createNotif(query, function(err, notif) {
										if (err)
											throw err;
										else {
											
										}
									});
									req.flash("dialog_success_msg", "Record successfully added!");
									res.redirect("/view_purchase_details/" + record.supplier_lo);
								}
							});
						}
					});
				});
			}
			else{
				amount = parseInt(req.body.qty) * price[0].purchase_price;
				console.log("2-" + amount);
				var record = {
						supplier_lo : req.body.purchase_lo,
						date : req.body.date,
						supplier_so : req.body.purchase_so,
						product_id : parseInt(req.body.purchase_product),
						qty : parseInt(req.body.qty),
						amount : amount,
						status : "Pending"
					};

					purchaseModel.addPurchase(record ,function(err){
						if(err){
							console.log(err);
							console.log("DUPLICATE");
							req.flash("dialog_success_msg", "LO Number already exists.");
							res.redirect("/view_purchase_records");

						}
						else{
							productModel.getProductDetails(parseInt(req.body.purchase_product), function(err, product){
								if(err){
									throw err;
									req.flash("dialog_error_msg", "There is an error adding a purchase.");
									res.redirect("/view_purchase_records");
								}
								else{
									var query = {
									url: '/schedule_delivery',
									desc: 'New Purchase of ' + product[0].product_name,
									id: req.session.employee_id,
									roles: dataformatter.getNotifRoles('L'),
									contents: 'New Purchase of ' + product[0].product_name
									}
									/* Creating a Sale Record for Delivery sends a notification to Logistics */
									notificationModel.createNotif(query, function(err, notif) {
										if (err)
											throw err;
										else {
											req.flash('dialog_success_msg', 'Successfully created sale record!');
											res.redirect("/view_purchase_details/" + record.supplier_lo);
										}
									});
									req.flash("dialog_success_msg", "Record successfully added!");
									res.redirect("/view_purchase_details/" + record.supplier_lo);
								}
							});
						}
					});
					req.flash("dialog_success_msg", "Record successfully added!");
					res.redirect("/view_purchase_details/" + record.supplier_lo);
			}
		}
	});
};


exports.getPrice = function(req,res){
	var product = req.query.product;
	var date = req.query.date;
	console.log(req.query);
	purchaseModel.getDatePrice(product, date, function(err, price){
		if(err){
			throw(err);
			console.log("ERROR IN GETTING PRICE: 1");
		}
		else{
			if(price.length == 0){
				purchaseModel.getCurrentPrice(product, function(err,price2){
					if(err){
						throw(err);
					}
					else{
						console.log(price2[0]);
						price2[0].purchase_price = dataformatter.formatMoney(price2[0].purchase_price.toFixed(2), '');
						res.send({
							price : price2[0].purchase_price
						});
					}
				});
			}
			else{
				console.log(price[0]);
				price[0].purchase_price = dataformatter.formatMoney(price[0].purchase_price.toFixed(2), '');
				res.send({
					price : price[0].purchase_price
				});
			}
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
						supplier_so :  req.body.purchase_so,
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
			});
		}
	});
}
exports.getTrackOrdersPage = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			purchaseModel.getTrackOrders(0, function(err, orders) {
				if (err)
					throw err;
				else {
					var dates = [], curdate = dataformatter.startOfWeek(new Date());

					dates.push(curdate);
					curdate = new Date(curdate.toString());
					for (var i = 1; i < 7; i++) {
						dates.push(dataformatter.formatDate(new Date(curdate.setDate(curdate.getDate() + 1)), 'mm DD, YYYY') );
					}

					var html_data = {
						notifCount: notifCount[0],
						weeklyDate: dates,
						weeklyOrders: dataformatter.groupByDayofWeek(dates, orders)
					}
					
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'track_orders_tab');
					res.render('trackPurchaseOrders', html_data);
				}
			});
		}
	});	
}

exports.getPurchaseRecords = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			purchaseModel.getAllPurchaseRecords(function(err, purchases) {
				if (err)
					throw err;
				else {
					var blanks = [];
					var x = 0;
					while(purchases.length+x <= 9) {
						blanks.push('temp');
						x++;
					}
					html_data = {
						notifCount: notifCount[0],
						purchases: purchases,
						blanks: blanks
					};
					
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'purchase_record_tab');
					res.render('purchasingRecordTable', html_data);
				}
			});
		}
	});
};
// exports.updatePurchaseDetails = function(req,res){

// 	var html_data = {};
// 	console.log(req.body);
// 	var dr = req.body.supplier_dr;
// 	var to = req.body.time_out;
// 	var date = req.body.date;
// 	if(dr == "")
// 		console.log("1");
// 	if(to == "")
// 		console.log("3");
// 	console.log(to);
// 	purchaseModel.updatePurchaseInfo(date,to.toString(),dr,req.params.lo, function(err){
// 		if(err){
// 			req.flash('dialog_error_msg', 'Oops something went wrong!');
// 			res.redirect("/purchase_record/" + req.params.lo);
// 		}
// 		else{
// 			if(req.body.location != "WAREHOUSE")
// 			purchaseModel.updateSalesLo(req.body.location, req.params.lo, function(err){
// 				if(err){
// 					req.flash('dialog_error_msg', 'Oops something went wrong!');
// 					res.redirect("/purchase_record/" + req.params.lo);
// 				}
// 				else{
// 					deliveryDetailModel.updateDeliveryToSellout(req.body.location, function(err){
// 						req.flash('dialog_success_msg', 'Successfully updated purchase record!');
// 						res.redirect("/purchase_record/" + req.params.lo);
// 				});
// 				}			
// 			});
// 			else{
// 				req.flash('dialog_success_msg', 'Successfully updated purchase record!');
// 				res.redirect("/purchase_record/" + req.params.lo);
// 			}
// 		}
// 	});

	

// 	// purchaseModel.getPurchaseDetails(req.params.lo, function(err, details){
// 	// 	console.log(req.body);
// 	// 	if(details[0].status != "Completed" && req.body.status == "Completed"){
// 	// 		purchaseModel.addProductQuantity(req.body.qty, req.body.product_id, function(err){	
// 	// 		});
// 	// 	}
// 	// 	else if(details[0].status == "Completed" && req.body.status != "Completed"){
// 	// 		purchaseModel.addProductQuantity(req.body.qty * (-1), req.body.product_id, function(err){	
// 	// 		});
// 	// 	}

// 	// 	if(details[0].product_id != parseInt(req.body.product_id)){
// 	// 		console.log("update price bruh");
// 	// 	}

// 	// 	var total = 0.0;
// 	// purchaseModel.getDatePrice(req.body.product_id, req.body.date, function(err, price){
// 	// 	if(price.length == 0){
// 	// 		purchaseModel.getCurrentPrice(req.body.product_id, function(err, curPrice){

// 	// 			total = curPrice[0].purchase_price * details[0].qty;
// 	// 			var record = {
// 	// 			supplier_lo : req.params.lo,
// 	// 			date : req.body.date,
// 	// 			supplier_dr : req.body.supplier_dr,
// 	// 			product_id : parseInt(req.body.product_id),
// 	// 			qty : parseInt(req.body.qty),
// 	// 			amount : total,
// 	// 			status : req.body.status,
// 	// 			time_out : req.body.time_out
// 	// 			};

// 	// 			if(record.supplier_dr != "" && record.time_out != ""){
// 	// 				record.status = "Completed";
// 	// 			}

// 	// 			purchaseModel.updatePurchaseInfo( record , function(err){
// 	// 				if(err){
// 	// 					console.log("err");
// 	// 					res.redirect("/purchase_record/" + req.params.lo);
// 	// 				}
// 	// 				else{
// 	// 					res.redirect("/purchase_record/" + req.params.lo);
// 	// 				}
					
// 	// 			});
// 	// 		});
// 	// 	}
// 	// 	else{
// 	// 		total = price[0].purchase_price * details[0].qty;

// 	// 		var record = {
// 	// 		supplier_lo : req.params.lo,
// 	// 		date : req.body.date,
// 	// 		supplier_dr : req.body.supplier_dr,
// 	// 		product_id : parseInt(req.body.product_id),
// 	// 		qty : parseInt(req.body.qty),
// 	// 		amount : total,
// 	// 		status : req.body.status,
// 	// 		time_out : req.body.time_out
// 	// 		};

// 	// 		if(record.supplier_dr != "" && record.time_out != ""){
// 	// 			record.status = "Completed";
// 	// 		}

// 	// 		purchaseModel.updatePurchaseInfo( record , function(err){
// 	// 			if(err){
// 	// 				console.log("err");
// 	// 				res.redirect("/purchase_record/" + req.params.lo);
// 	// 			}
// 	// 			else{
// 	// 				res.redirect("/purchase_record/" + req.params.lo);
// 	// 			}
				
// 	// 		});
// 	// 	}
// 	// });

// 	// });

	
// }

exports.viewPurchaseDetails = function(req, res) {
	var query = { supplier_lo: req.params.lo };

	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			purchaseModel.getPurchaseRecordDetails(query, function(err, purchaseRecord) {
				if (err)
					throw err;
				else {
					html_data = {
						notifCount: notifCount[0],
						purchaseRecord: purchaseRecord[0]
					};
					console.log(purchaseRecord[0]);
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'purchase_record_tab');
					res.render('purchasingDetails', html_data);
				}
			});
		}
	});
};