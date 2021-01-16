const customerModel = require('../models/customerModel');
const notificationModel = require('../models/notificationModel');
const paymentDetailModel = require('../models/paymentDetailModel');
const productModel = require('../models/productModel');
const salesModel = require('../models/salesModel');
const deliveryDetailModel = require('../models/deliveryDetailModel');
const employeeModel = require('../models/employeeModel');
const truckModel = require('../models/truckModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.getSaleOrderForm = function(req, res) {
	var status = [
		{ name: 'Pending' }, { name: 'Processing' }, { name: 'Completed' }
	];
	var terms = [
		{ name: 'Cash', id: 'Cash' }, { name: 'NET 7', id: 'NET7' }, { name: 'NET 15', id: 'NET15' }, { name: 'NET 30', id: 'NET30' }
	];
	var payment_status = [
		{ name: 'Paid' }, { name: 'Unpaid' }
	];
	var order_type = [
		{ name: 'Delivery' }, { name: 'Pick-up' }
	];
	notificationModel.getNotifs(req.session.employee_id, function(err, notifs) {
		if (err)
			throw err;
		else {
			notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
				if (err)
					throw err;
				else {
					customerModel.queryLocationbyCustomer(function(err, customers) {
						if (err)
							throw err;
						else {
							customerModel.queryCustomers(function(err, customerArr) {
								if (err)
									throw err;
								else {
									productModel.queryProductbyPrice(function(err, products) {
										if (err)
											throw err;
										else {
											salesModel.getMonthlyCount(function(err, monthlyCount) {
												if (err)
													throw err;
												else {
													var date, month, year, count, due_date, dr, add_days;
													date = new Date();
													year = date.getFullYear();
													month = new Date().getMonth()+1;
													if (month < 10)
														month = '0'+month;
													count = ("000" + parseInt(monthlyCount.length+1)).slice(-3)
													dr = year+month+count;

													var customer_arr = [];
													customer_arr = dataformatter.formatLocByCustomer(customer_arr, customers);

													html_data = {
														notifCount: notifCount[0],
														notifs: notifs,
														drCount: dr,
														products: products,
														customers: customer_arr,
														try: customerArr
													};

													html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'create_sales_tab');
													res.render('createOrder', html_data);
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

/* TODO	 ADJUST NOTIFICATION CONTENTS AFTER LOGISTICS MODULE */
exports.createSaleRecord = function(req, res) {
	var { dateScheduled, customerName, qty,
		orderType, saleAddress, product, paymentTerms, pickup_plate } = req.body;
	salesModel.getMonthlyCount(function(err, monthlycount) {
		if (err) {
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect('/create_sales');
		}
		else {
			productModel.queryProductbyPrice(function(err, price) {
				if (err)
					throw err;
				else {
					customerModel.queryLocationbyCustomer(function(err, customer_id) {
						if (err)
							throw err;
						else {
							var date, month, year, count, due_date, dr, add_days, productPrice, customerID;
							date = new Date();
							year = date.getFullYear();
							month = new Date().getMonth()+1;
							if (month < 10)
								month = '0'+month;
							count = ("000" + parseInt(monthlyCount.length+1) ).slice(-3)
							dr = year+month+count;
							due_date = dataformatter.formatDueDate(dateScheduled, paymentTerms);

							for (var i = 0; i < price.length; i++) {
								if (price[i].product_id == product)
									productPrice = price[i].selling_price;
							}
							for (var i = 0; i < customer_id.length; i++) {
								if (customer_id[i].customer_name == customerName)
									customerID = customer_id[i].customer_id;
							}

							var sale_obj = {
								delivery_receipt: dr,
								scheduled_date: dateScheduled,
								customer_id: customerID,
								product_id: product,
								qty: qty,
								amount: productPrice,
								due_date: due_date,
								time_recorded: date,
								order_type: orderType,
								payment_terms: paymentTerms,
								pickup_plate : pickup_plate
							}

							/********** PICK UP **********/
							if (orderType === 'Pick-up') {
								sale_obj["order_status"] = "Completed";
								salesModel.createSales(sale_obj, function(err, result) {
									if (err) {
										req.flash('dialog_error_msg', 'Oops something went wrong!');
										res.redirect('/create_sales');
									}
									else {
										// salesModel.createSales(sale_obj, function(err, result){
										// 	if(err){
										// 		req.flash('dialog_error_msg', 'Oops something went wrong!');
										// 		res.redirect('/create_sales');
										// 	}
										// 	else{
										// 		req.flash('dialog_success_msg', 'Successfully created sale record!')
										// 		res.redirect("view_sales_details/" + sale_obj.delivery_receipt);
										// 	}
										// });
										res.redirect('/view_sales_details/' + sale_obj.delivery_receipt);
									}
								});
							}
							/********** DELIVERY**********/
							else {
								salesModel.createSales(sale_obj, function(err, result) {
									if (err) {
										req.flash('dialog_error_msg', 'Oops something went wrong!');
										res.redirect('/create_sales');
									}
									else {
										var delivery_detail = {
											delivery_receipt: dr,
											delivery_address: saleAddress,
											status: 'Pending'
										}
										deliveryDetailModel.create(delivery_detail, function(err, delivery_result) {
											if (err) {
												req.flash('dialog_error_msg', 'Oops something went wrong!');
												res.redirect('/create_sales');
											}
											else {
												var update, query;
												query = { delivery_receipt: dr };

												deliveryDetailModel.singleQuery(query, function(err, dr_result) {
													if (err) {
														req.flash('dialog_error_msg', 'Oops something went wrong!');
														res.redirect('/create_sales');
													}
													else {
														update = { delivery_details: dr_result[0].delivery_detail_id };
														salesModel.updateSaleRecord(update, query, function(err, update_result) {
															if (err) {
																req.flash('dialog_error_msg', 'Oops something went wrong!');
																res.redirect('/create_sales');
															}
															else {
																var query = {
																	url: 'url',
																	desc: 'desc',
																	id: req.session.employee_id,
																	roles: dataformatter.getNotifRoles('L'),
																	contents: 'Insert message here'
																}
																/* Creating a Sale Record for Delivery sends a notification to Logistics */
																notificationModel.createNotif(query, function(err, notif) {
																	if (err)
																		throw err;
																	else {
																		req.flash('dialog_success_msg', 'Successfully created sale record!');
																		res.redirect('/create_sales');
																	}
																});
															}
														});
													}
												});
											
											}
										});
									}
								});
							}
						}
					})
				}
			});
		}
	});
};

exports.getPaymentsPage = function(req, res) {
	notificationModel.getNotifs(req.session.employee_id, function(err, notifs) {
		if (err)
			throw err;
		else {
			notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
				if (err)
					throw err;
				else {
					salesModel.getUnpaidOrders(function(err, unpaidOrders) {
						if (err)
							throw err;
						else {
							customerModel.queryUnpaidCustomers(function(err, unpaidCustomers) {
								if (err)
									throw err;
								else {
									var groupedCustomer;
									groupedCustomer = dataformatter.groupUnpaidCustomerOrders(unpaidCustomers);

									var html_data = {
										notifCount: notifCount[0],
										notifs: notifs,
										unpaidOrderArr: unpaidOrders,
										unpaidCustomerArr: groupedCustomer,
										groupedUnpaidOrder: JSON.stringify(groupedCustomer)
									};

									html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'payments_tab');
									res.render('paymentsTable', html_data);
								}
							});
						}
					});			
				}
			});
		}
	});
}

exports.postPaymentForm = function(req, res) {
	var { paymentDR, paymentType, amountPaid, bankID, checkNo, paymentDate } = req.body;

	salesModel.getSaleRecordDetail({ delivery_receipt: paymentDR }, function(err, saleRecord) {
		if (err)
			throw err;
		else {
			var paymentObj = { amount: amountPaid, date_paid: paymentDate };
			if(paymentType === 'Check')
				paymentObj['check_num'] = bankID+checkNum;

			paymentDetailModel.createPaymentRecord(paymentObj, function(err, paymentDetail) {
				if (err)
					throw err;
				else {
					salesModel.updateSaleRecord({ payment_status: 'Paid', payment_id: paymentDetail.payment_id }, { delivery_receipt: paymentDR }, function(err, newRecord) {
						if(err)
							throw err;
						else {
							res.redirect('/view_payments');
						}
					});
				}
			});
		}
	});
}

exports.getTrackOrdersPage = function(req, res) {
	notificationModel.getNotifs(req.session.employee_id, function(err, notifs) {
		if (err)
			throw err;
		else {
			notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
				if (err)
					throw err;
				else {
					salesModel.getTrackOrders(function(err, orders) {
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
								notifs: notifs,
								weeklyDate: dates,
								weeklyOrders: dataformatter.groupByDayofWeek(dates, orders)
							}
							
							html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'track_orders_tab');
							res.render('trackSalesOrders', html_data);
						}
					});
				}
			});
		}
	});			
}

exports.getSalesRecords = function(req, res) {
	notificationModel.getNotifs(req.session.employee_id, function(err, notifs) {
		if (err)
			throw err;
		else {
			notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
				if (err)
					throw err;
				else {
					salesModel.getAllSaleRecords(function(err, records) {
						if (err)
							throw err;
						else {
							var blanks = [], x = 0;
							while(records.length+x <= 9) {
								blanks.push('temp');
								x++;
							}
							var html_data = {
								notifCount: notifCount[0],
								notifs: notifs,
								sales: records,
								blanks: blanks
							};
							html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'sales_record_tab');
						}
					});
				}
			});
		}
	});				
}

/*
exports.getSalesRecords = function(req,res){
	console.log("pumasok");
	var status = [
		{ name: 'Pending' }, { name: 'Processing' }, { name: 'Completed' }
	];
	var terms = [
		{ name: 'Cash', id: 'Cash' }, { name: 'NET 7', id: 'NET7' }, { name: 'NET 15', id: 'NET15' }, { name: 'NET 30', id: 'NET30' }
	];
	var payment_status = [
		{ name: 'Paid' }, { name: 'Unpaid' }
	];
	var order_type = [
		{ name: 'Delivery' }, { name: 'Pick-up' }
	];
	var offset = 0;
	var limit = 10;
	salesModel.getSaleRecordCount({}, function(err, count) {
		if (err)
			throw err;
		else {
			if(count.length == 0){

			}
			else{
				var page_obj = dataformatter.formatPage(limit, offset, count[0].count);
				
			}
			var limit = 10;
			var offset = 0;
			customerModel.queryCustomers(function(err, customer_data) {
				if (err)
					throw err;
				else {
					salesModel.getSaleFilters(function(err, filter_data) {
						if (err)
							throw err;
						else {
							if(filter_data.length == 0){

							}
							else{
								//filter_data[0].start_date = dataformatter.formatDate(filter_data[0].start_date, 'MM/DD/YYYY');
							}
							productModel.getProducts(function(err, product_data) {
								if (err)
									throw err;
								else {
									employeeModel.getActiveDrivers(function(err, drivers) {
										if (err)
											throw err;
										else {
											truckModel.getActiveTrucks(function(err, trucks) {
												if (err)
													throw err;
												else {
													customerModel.queryLocationbyCustomer(function(err, customers) {
														if (err) {
															throw err;
															res.redirect('/');
														}
														else {
															productModel.queryProductbyPrice(function(err, products) {
																if (err) {
																	throw err;
																	res.redirect('/');
																}
																else {
																	var filter = {};
																	salesModel.getSaleRecords(filter, offset, limit,  function(err, sale_record) {
																		if (err)
																			throw err;
																		else {
																			// prep data structure for customer and their locations for create order
																			var customer_arr = [];
																			customer_arr = dataformatter.formatLocByCustomer(customer_arr, customers);

																			var data = [ {customers: customer_arr}, {products: products}];
																			data = JSON.stringify(data);	
																			// prep sale record data
																			var year, month, day;
																			for (var i = 0; i < sale_record.length; i++) {
																				// for scheduled_date to MM/DD/YYYY
																				sale_record[i].scheduled_date = dataformatter.formatDate(sale_record[i].scheduled_date, 'MM/DD/YYYY');
																				// format due_date to MM/DD/YYYY
																				sale_record[i].due_date = dataformatter.formatDate(sale_record[i].due_date, 'MM/DD/YYYY');
																				// format total_amt separated by thousands and with decimal
																				sale_record[i].total_amt = dataformatter.formatMoney(sale_record[i].total_amt.toFixed(2), 'Php ');
																				sale_record[i].price = dataformatter.formatMoney(sale_record[i].price.toFixed(2), '');
																			}
																			
																			var html_data = { 
																				num_records: count.length,
																				origin: offset+1,
																				end: sale_record.length+offset,
																				status: status,
																				terms: terms,
																				payment_status: payment_status,
																				order_type: order_type,
																				customers: customer_data,
																				products: product_data,
																				drivers: drivers,
																				trucks: trucks,
																				filter_data: filter_data[0]
																			};
																			var temp_data = { delivery_receipt: '' };
																			var blank = [];
																			console.log(sale_record.length);
																			if(sale_record.length < 9){
																				var x = sale_record.length;
																				while(x != 0){
																					blank.push("temp_data");
																					x--;
																				}
																			}
																			html_data['sales'] = sale_record;
																			html_data["blanks"] = blank;
																			html_data['sale_record_data'] = data;
																			console.log(req.session.initials);
																			html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'sales_record_tab');
																			html_data = js.innit_pagination(html_data, offset, sale_record.length+offset, count.length);
																			
																			res.render('salesRecordTable', html_data);
																		}
																	})	
																}
															});
														}
													});
												}
											});
										}
									});
								}
							})
						}
					});
				}
			})
		}
	});
};
*/
exports.viewSalesDetails = function(req,res){
	var { dr } = req.params;
	var query = { delivery_receipt: dr };

	salesModel.getSaleRecordDetail(query, function(err, record) {
		if (err)
			throw err;
		else {
			salesModel.getDeliveryCarriers({ delivery_receipt: record[0].delivery_receipt },function(err, carriers) {
				if (err)
					throw err;
				else {
					sale_date = dataformatter.formatDate(record[0].time_recorded, 'YYYY-MM-DD')
					productModel.getProductPriceByDate(sale_date, function(err, products) {
						if (err)
							throw err;
						else {
							customerModel.queryLocationbyCustomer(function(err, customers) {
								if (err)
									throw err;
								else {
									var order_status = [
										{ name: 'Pending' }, { name: 'Processing' }, { name: 'Completed' }, { name: 'Cancelled' }
									];
									var payment_terms = [
										{ name: 'Cash' }, { name: 'NET 7' }, { name: 'NET 15' }, { name: 'NET 30' }
									];
									var customer_obj = { customer_id: '', customer_name: '', locations: [] };
									var location_obj = { location_id: '', location_name: '' };
									var customer_arr = [];
									var json_customer_arr;
									console.log(record[0]);
									if(record[0].delivery_address != null){
										salesModel.getCustomerLocation(record[0].delivery_address ,function(err, location){
											if(err){
												throw err;
											}
											else{
												console.log(location[0]);
												customer_arr = dataformatter.formatLocByCustomer(customer_arr, customers);
												json_customer_arr = JSON.stringify(customer_arr);

												record[0].scheduled_date = dataformatter.formatDate(record[0].scheduled_date, 'YYYY-MM-DD')
												record[0].due_date = dataformatter.formatDate(record[0].due_date, 'YYYY-MM-DD')
												record[0].total_amt = dataformatter.formatMoney(record[0].total_amt.toFixed(2), '');
												record[0].qty = JSON.stringify(record[0].qty);
												console.log(record[0]);

												
												var html_data = { 
													sale_record: record[0],
													carriers: carriers,
													customers: json_customer_arr,
													customer_list: customer_arr,
													products: products,
													product_json: JSON.stringify(products),
													status: order_status,
													terms: payment_terms,
													customer_location : location[0].location_name
												};
												html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'sales_record_tab');
																						
												res.render('salesDetails', html_data);
											}

										});
									}
									else{
										var html_data = { 
											sale_record: record[0],
											carriers: carriers,
											customers: json_customer_arr,
											customer_list: customer_arr,
											products: products,
											product_json: JSON.stringify(products),
											status: order_status,
											terms: payment_terms,
											customer_location : "N/A"
										};
										html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'sales_record_tab');
																				
										res.render('salesDetails', html_data);
									}
									

									
								}
							});
						}
					});
				}
			});
		}
	});

	
};


/*
exports.getFilteredSaleHistory = function(req, res) {
	var offset = parseInt(req.query.page.offset);
	var limit = parseInt(req.query.page.limit);
	salesModel.getSaleRecords(req.query.sh_filter, offset, limit, function(err, sale_record) {
		if (err)
			throw err;
		else {
			var year, month, day;
			var html_data;
			for (var i = 0; i < sale_record.length; i++) {
				// for scheduled_date to MM/DD/YYYY
				sale_record[i].scheduled_date = dataformatter.formatDate(sale_record[i].scheduled_date, 'MM/DD/YYYY')
				// format due_date to MM/DD/YYYY
				sale_record[i].due_date = dataformatter.formatDate(sale_record[i].due_date, 'MM/DD/YYYY')
				// format total_amt separated by thousands and with decimal
				sale_record[i].total_amt = dataformatter.formatMoney(sale_record[i].total_amt.toFixed(2), 'Php ');
				sale_record[i].price = dataformatter.formatMoney(sale_record[i].price.toFixed(2), '');
			}
			var temp_data = { delivery_receipt: '&nbsp' };
			while (sale_record.length < 9) {
				sale_record.push(temp_data);
			}
			html_data = {
				sales: sale_record
			}
			res.send(html_data);
		}
	});
}

exports.getFilteredSalesCount = function(req, res) {
	salesModel.getSaleRecordCount(req.query.sh_filter, function(err, count) {
		if (err)
			throw err;
		else {
			var html_data = { count: count.length };
			res.send(html_data);
		}
	});
}
*/

/*
exports.getSalesHistory = function(req, res) {
	var status = [
		{ name: 'Pending' }, { name: 'Processing' }, { name: 'Completed' }
	];
	var terms = [
		{ name: 'Cash', id: 'Cash' }, { name: 'NET 7', id: 'NET7' }, { name: 'NET 15', id: 'NET15' }, { name: 'NET 30', id: 'NET30' }
	];
	var payment_status = [
		{ name: 'Paid' }, { name: 'Unpaid' }
	];
	var order_type = [
		{ name: 'Delivery' }, { name: 'Pick-up' }
	];
	var offset = 0;
	var limit = 10;
	salesModel.getSaleRecordCount({}, function(err, count) {
		if (err)
			throw err;
		else {
			if(count.length == 0){

			}
			else{
				var page_obj = dataformatter.formatPage(limit, offset, count[0].count);
				
			}
			var limit = 10;
			var offset = 0;
			customerModel.queryCustomers(function(err, customer_data) {
				if (err)
					throw err;
				else {
					salesModel.getSaleFilters(function(err, filter_data) {
						if (err)
							throw err;
						else {
							if(filter_data.length == 0){

							}
							else{
								//filter_data[0].start_date = dataformatter.formatDate(filter_data[0].start_date, 'MM/DD/YYYY');
							}
							productModel.getProducts(function(err, product_data) {
								if (err)
									throw err;
								else {
									employeeModel.getActiveDrivers(function(err, drivers) {
										if (err)
											throw err;
										else {
											truckModel.getActiveTrucks(function(err, trucks) {
												if (err)
													throw err;
												else {
													customerModel.queryLocationbyCustomer(function(err, customers) {
														if (err) {
															throw err;
															res.redirect('/');
														}
														else {
															productModel.queryProductbyPrice(function(err, products) {
																if (err) {
																	throw err;
																	res.redirect('/');
																}
																else {
																	var filter = {};
																	salesModel.getSaleRecords(filter, offset, limit,  function(err, sale_record) {
																		if (err)
																			throw err;
																		else {
																			// prep data structure for customer and their locations for create order
																			var customer_arr = [];
																			customer_arr = dataformatter.formatLocByCustomer(customer_arr, customers);

																			var data = [ {customers: customer_arr}, {products: products}];
																			data = JSON.stringify(data);	
																			// prep sale record data
																			var year, month, day;
																			for (var i = 0; i < sale_record.length; i++) {
																				// for scheduled_date to MM/DD/YYYY
																				sale_record[i].scheduled_date = dataformatter.formatDate(sale_record[i].scheduled_date, 'MM/DD/YYYY');
																				// format due_date to MM/DD/YYYY
																				sale_record[i].due_date = dataformatter.formatDate(sale_record[i].due_date, 'MM/DD/YYYY');
																				// format total_amt separated by thousands and with decimal
																				sale_record[i].total_amt = dataformatter.formatMoney(sale_record[i].total_amt.toFixed(2), 'Php ');
																				sale_record[i].price = dataformatter.formatMoney(sale_record[i].price.toFixed(2), '');
																			}
																			
																			var html_data = { 
																				num_records: count.length,
																				origin: offset+1,
																				end: sale_record.length+offset,
																				status: status,
																				terms: terms,
																				payment_status: payment_status,
																				order_type: order_type,
																				customers: customer_data,
																				products: product_data,
																				drivers: drivers,
																				trucks: trucks,
																				filter_data: filter_data[0]
																			};
																			var temp_data = { delivery_receipt: '&nbsp' };
																			while (sale_record.length < 9) {
																				sale_record.push(temp_data);
																			}
																			html_data['sales'] = sale_record;
																			html_data['sale_record_data'] = data;

																			html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'sales');
																			html_data = js.innit_pagination(html_data, offset, sale_record.length+offset, count.length);

																			res.render('sales_record', html_data);
																		}
																	})	
																}
															});
														}
													});
												}
											});
										}
									});
								}
							})
						}
					});
				}
			})
		}
	});
};
*/

/*
exports.getSaleRecordDetails = function(req, res) {
	var { dr } = req.params;
	var query = { delivery_receipt: dr };

	salesModel.getSaleRecordDetail(query, function(err, record) {
		if (err)
			throw err;
		else {
			salesModel.getDeliveryCarriers({ delivery_receipt: record[0].delivery_receipt },function(err, carriers) {
				if (err)
					throw err;
				else {
					sale_date = dataformatter.formatDate(record[0].time_recorded, 'YYYY-MM-DD')
					productModel.getProductPriceByDate(sale_date, function(err, products) {
						if (err)
							throw err;
						else {
							customerModel.queryLocationbyCustomer(function(err, customers) {
								if (err)
									throw err;
								else {
									var order_status = [
										{ name: 'Pending' }, { name: 'Processing' }, { name: 'Completed' }, { name: 'Cancelled' }
									];
									var payment_terms = [
										{ name: 'Cash' }, { name: 'NET 7' }, { name: 'NET 15' }, { name: 'NET 30' }
									];
									var customer_obj = { customer_id: '', customer_name: '', locations: [] };
									var location_obj = { location_id: '', location_name: '' };
									var customer_arr = [];
									var json_customer_arr;
									
									customer_arr = dataformatter.formatLocByCustomer(customer_arr, customers);
									json_customer_arr = JSON.stringify(customer_arr);

									record[0].scheduled_date = dataformatter.formatDate(record[0].scheduled_date, 'YYYY-MM-DD')
									record[0].due_date = dataformatter.formatDate(record[0].due_date, 'YYYY-MM-DD')
									record[0].total_amt = dataformatter.formatMoney(record[0].total_amt.toFixed(2), '');

									var html_data = { 
										sale_record: record[0],
										carriers: carriers,
										customers: json_customer_arr,
										customer_list: customer_arr,
										products: products,
										product_json: JSON.stringify(products),
										status: order_status,
										terms: payment_terms
									};
									html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'sales');
									
									res.render('sale_details', html_data);
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.editSaleRecordDetails = function(req, res) {
	var { sale_dr, sale_terms, sale_date, sale_payment_due, sale_customer,
	sale_amt, sale_status, sale_order_type, sale_delivery_loc, sale_product, sale_price, sale_qty,
	sale_damaged, sale_pickup, sale_payment_status, sale_payment_check } = req.body;

	if (sale_pickup === '')
		sale_pickup = null;
	if (sale_damaged === '')
		sale_damaged = 0;

	var payment_det = {
		check_num: sale_payment_check
	};

	var update = {
		scheduled_date: sale_date,
		customer_id: sale_customer,
		qty: sale_qty,
		amount: sale_price,
		due_date: dataformatter.formatDueDate(sale_date, sale_terms),
		order_type: sale_order_type,
		payment_terms: sale_terms,
		order_status: sale_status,
		payment_status: sale_payment_status,
		pickup_plate: sale_pickup
	};

	if (sale_order_type === 'Delivery') {
		var update1 = {
			delivery_address: sale_delivery_loc
		}
	}

	salesModel.updateSaleRecord(update, { delivery_receipt: sale_dr }, function(err, result) {
		if (err)
			throw err;
		else {
			if (sale_order_type === 'Delivery') {
				deliveryDetailModel.singleQuery({ delivery_receipt: sale_dr }, function(err, exists) {
					if (err)
						throw err;
					else {
						if (exists.length) {
							deliveryDetailModel.editDeliveryDetails({ delivery_receipt: sale_dr }, update1, function(err, details) {
								if (err)
									throw err;
								else {
									if (sale_payment_check !== '') {
										salesModel.createPaymentDetails(payment_det, function(err, payment_det) {
											if (err)
												throw err;
											else {
												salesModel.updateSaleRecord({ payment_id: payment_det.insertId }, { delivery_receipt: sale_dr }, function(err, last) {
													if (err)
														throw err;
													else {
														res.redirect('/sales_record/'+sale_dr);
													}
												});
											}
										});
									}
									else
										res.redirect('/sales_record/'+sale_dr);
								}
							});
						}
						else {
							update1['delivery_receipt'] = sale_dr;
							update1['status'] = 'Pending';
							deliveryDetailModel.create(update1, function(err, create) {
								if (err)
									throw err;
								else {
									if (sale_payment_check !== '') {
										salesModel.createPaymentDetails(payment_det, function(err, payment_det) {
											if (err)
												throw err;
											else {
												salesModel.updateSaleRecord({ payment_id: payment_det.insertId }, { delivery_receipt: sale_dr }, function(err, last) {
													if (err)
														throw err;
													else {
														res.redirect('/sales_record/'+sale_dr);
													}
												});
											}
										});
									}
									else
										res.redirect('/sales_record/'+sale_dr);
								}
							});
						}
					}
				});
			}
			else {
				deliveryDetailModel.singleQuery({ delivery_receipt: sale_dr }, function(err, q) {
					if (err)
						throw err;
					else {
						var pickup_update = {
							delivery_details: null
						}
						if (q.length) {
							pickup_update['qty'] = parseInt(sale_qty) + parseInt(q[0].damaged_bags);
						}
						salesModel.updateSaleRecord(pickup_update, { delivery_receipt: sale_dr}, function(err, edit_res) {
							if (err)
								throw err;
							else {
								deliveryDetailModel.deleteDeliveryDetails({ delivery_receipt: sale_dr }, function(err, delete_res) {
									if (err)
										throw err;
									else {
										if (sale_payment_check !== '') {
											salesModel.createPaymentDetails(payment_det, function(err, payment_det) {
												if (err)
													throw err;
												else {
													salesModel.updateSaleRecord({ payment_id: payment_det.insertId }, { delivery_receipt: sale_dr }, function(err, last) {
														if (err)
															throw err;
														else {
															res.redirect('/sales_record/'+sale_dr);
														}
													});
												}
											});
										}
										else
											res.redirect('/sales_record/'+sale_dr);
									}
								});
							}
						});
					}
				});
			}
		}
	});
};

exports.confirmPayment = function(req, res) {
	var { dr } = req.params;
	var check_num = req.body.sale_payment_check;
	salesModel.updateSaleRecord({ payment_status: 'Paid' }, { delivery_receipt: dr }, function(err, payment_status) {
		if (err)
			throw err;
		else {
			salesModel.createPaymentDetails({ check_num: check_num }, function(err, payment_det) {
				if (err)
					throw err;
				else {
					salesModel.updateSaleRecord({ payment_id: payment_det.insertId }, { delivery_receipt: dr }, function(err, last) {
						if (err) {
							req.flash('dialog_error_msg', 'Oops something went wrong!');
							res.redirect('/sales_record/'+dr);
						}
						else {
							req.flash('dialog_success_msg', 'Successfully confirmed sale!');
							res.redirect('/sales_record/'+dr);
						}
					});
				}
			});
		}
	});
};

exports.confirmOrder = function(req, res) {
	var { dr } = req.params;
	var plate = req.body.sale_pickup;
	var sale_order_type = 'Pick-up';

	salesModel.updateSaleRecord({ order_status: 'Completed', pickup_plate: plate }, { delivery_receipt: dr }, function(err, sale_status) {
		if (err) {
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect('/sales_record/'+dr);
		}
		else {
			if (sale_order_type === 'Delivery') {
				deliveryDetailModel.singleQuery({ delivery_receipt: dr }, function(err, exists) {
					if (err) {
						req.flash('dialog_error_msg', 'Oops something went wrong!');
						res.redirect('/sales_record/'+dr);
					}
					else {
						if (exists.length) {
							deliveryDetailModel.editDeliveryDetails({ delivery_receipt: dr }, { status: 'Completed' }, function(err, details) {
								if (err) {
									req.flash('dialog_error_msg', 'Oops something went wrong!');
									res.redirect('/sales_record/'+dr);
								}
								else {
									req.flash('dialog_success_msg', 'Successfully finished sale order status!');
									res.redirect('/sales_record/'+dr);
								}
							});
						}
						else {
							//Send an error message!!
							req.flash('dialog_error_msg', 'Oops something went wrong!');
							res.redirect('/sales_record/'+dr);
						}
					}
				});
			}
			else if (sale_order_type === 'Pick-up') {
				req.flash('dialog_success_msg', 'Successfully finished sale order status!');
				res.redirect('/sales_record/'+dr);
			}
			else {
				res.send(404);
			}
		}
	});
}
*/