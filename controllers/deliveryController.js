const notificationModel = require('../models/notificationModel');
const homeModel = require('../models/homeModel');
const purchaseModel = require('../models/purchaseModel');
const salesModel = require('../models/salesModel');
const deliveryModel = require('../models/deliveryModel');
const productModel = require('../models/productModel');
const truckModel = require('../models/truckModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.getSingleDeliveryInfo = function(req, res) {
	var query;

	if (req.query.type === 'Restock')
		query = { supplier_lo: req.query.id };
	else
		query = { dr: req.query.id };

	deliveryModel.getSingleDeliveryInfo(query, function(err, record) {
		if (err)
			throw err;
		else {
			//record[0].formattedDate = dataformatter.formatDate(record[0].formattedDate, 'mm DD, YYYY');
			var html_data = {
				deliveryInfo: record[0]
			}
			res.send(html_data);
		}
	});
}

exports.ajaxChangeDriver = function(req, res) {
	truckModel.getSelectedTruck({ plate_no: req.query.plate_no }, function(err, truckData) {
		if (err)
			throw err;
		else {
			var html_data = {
				truckData: truckData[0]
			}
			res.send(html_data);
		}
	});
}

exports.changeCalendar = function(req, res) {
	deliveryModel.getTrackDelivery(req.query.offset, function(err, orders) {
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

exports.scheduleDelivery = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			truckModel.getWeeklyTruckData(function(err, trucks) {
				if (err)
					throw err;
				else {
					homeModel.getPendingDeliveries(5, function(err, pendingDeliveries) {
						if (err)
							throw err;
						else {
							homeModel.getPendingDeliveries(9999999999, function(err, pendingList) {
								if (err){
									throw err;
									console.log("ERRORRRR");
								}

								else {
									for (var i = 0; i < pendingList.length; i++) {
										if (pendingList[i].order_type === 'Sell-out')
											pendingList[i].purchase_lo = pendingList[i].delivery_receipt;
									}
									
									var ids = [];
									for (var i = 0 ; i < pendingDeliveries.length; i++)
										ids.push(pendingDeliveries[i].purchase_lo);

									homeModel.getPendingDate(ids, function(err, dates){
										if(err){
											throw err;
										}
										else{
											for(var x = 0; x < dates.length; x++){
												for(var y = 0; y < pendingDeliveries.length; y++)
													if(pendingDeliveries[y].purchase_lo == dates[x].id)
														pendingDeliveries[y]["date"] = dates[x].date;
											}
											
											var html_data = {
												notifCount: notifCount[0],
												truckList: trucks,
												pendingDeliveries: pendingDeliveries,
												pendingList: pendingList,
												selectedItem: { id: req.query.id, type: req.query.type }
											}
											
											html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'schedule_delivery_tab');
											res.render('scheduleDelivery', html_data);
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

exports.updateDelivery = function(req, res) {
	var type, id = req.body.deliveryReference || req.body.confirmReference;
	type = id[0]+id[1];
	id = id.substring(2);
	if (req.body.orderStatus === 'Processing') { //Going processing
		if (type === 'DR') {
			var update1 = { order_status: req.body.orderStatus };
			var update2 = { status: req.body.orderStatus, plate_no: req.body.deliveryTruck, driver: req.body.deliveryDriverId };
			var query = { delivery_receipt: id };
			salesModel.updateSaleDeliveryRecord(update1, update2, query, function(err, updatedSaleRecord) {
				if (err)
					throw err;
				else {
					var query = {
					url: '"/view_sales_details/' + req.body.deliveryReference.slice(2)+'"',
					desc:  'Delivery Processing',
					id: req.session.employee_id,
					roles: dataformatter.getNotifRoles('S'),
					contents: 'Order ' + req.body.deliveryReference.slice(2) + ' is being processed'
					}
					/* Creating a Sale Record for Delivery sends a notification to Logistics */
					notificationModel.createNotif(query, function(err, notif) {
						if (err)
							throw err;
						else {
							salesModel.getSaleRecordDetail({delivery_receipt : req.body.deliveryReference.slice(2)}, function(err, details){
								if(err){
									throw err;
									req.flash('dialog_error_msg', 'Error scheduling delivery!');
									res.redirect('/schedule_delivery');
								}
								else{
									productModel.subtractProductQty(details[0].product_name , details[0].qty, function(err){
										if(err){
											throw err;
										}
										else{
											req.flash('dialog_success_msg', 'Successfully updated delivery!');
											res.redirect('track_deliveries');
										}
									});
								}
							});
						}
					});
				}
			});
		}
		else {
			var update = { status: req.body.orderStatus, plate_num: req.body.deliveryTruck, driver: req.body.deliveryDriverId };
			var query = { supplier_lo: id };
			purchaseModel.updatePurchaseDetails(update, query, function(err, updatedSaleRecord) {
				if (err)
					throw err;
				else {
					var query = {
					url: '"/view_purchase_details/' + req.body.deliveryReference.slice(2)+'"',
					desc:  'Delivery Processing',
					id: req.session.employee_id,
					roles: dataformatter.getNotifRoles('P'),
					contents: 'Purchase ' + req.body.deliveryReference.slice(2) + ' is being processed'
					}
					/* Creating a Sale Record for Delivery sends a notification to Logistics */
					notificationModel.createNotif(query, function(err, notif) {
						if (err)
							throw err;
						else {
							req.flash('dialog_success_msg', 'Successfully updated delivery!');
							res.redirect('track_deliveries');
						}
					});
				}
			});
		}
	}
	else { //Going to be completed
		if (type === 'DR') {
			var update1 = { order_status: req.body.orderStatus };
			var update2 = { status: req.body.orderStatus, damaged_bags: req.body.confirmDamaged, date_completed: req.body.confirmDateCompleted };
			var query = { delivery_receipt: id };
			salesModel.updateSaleDeliveryRecord(update1, update2, query, function(err, updatedSaleRecord) {
				if (err)
					throw err;
				else {
					productModel.updateProductQtySales(query, function(err, updatedInventory) {
						if (err)
							throw err;
						else {
							var query = {
							url: '"/view_sales_details/' + req.body.confirmReference.slice(2)+'"',
							desc:  'Delivery Done',
							id: req.session.employee_id,
							roles: dataformatter.getNotifRoles('S'),
							contents: 'Order ' + req.body.confirmReference.slice(2) + ' is completed'
							}
							/* Creating a Sale Record for Delivery sends a notification to Logistics */
							notificationModel.createNotif(query, function(err, notif) {
								if (err)
									throw err;
								else {
									req.flash('dialog_success_msg', 'Successfully updated delivery!');
									res.redirect('track_deliveries');
								}
							});
						}
					});
				}
			});
		}
		else {
			var supplier_dr = req.body.confirmSupplierDR, time_out = req.body.confirmTimeOut;
			if (supplier_dr === '')
				supplier_dr = null;

			var update = { status: req.body.orderStatus, time_out: req.body.confirmTimeOut, supplier_dr : req.body.confirmSupplierDR };
			var query = { supplier_lo: id };
			purchaseModel.updatePurchaseDetails(update, query, function(err, updatedSaleRecord) {
				if (err)
					throw err;
				else {
					productModel.updateProductQty(query, function(err, updatedInventory) {
						if (err)
							throw err;
						else {
							var query = {
							url: '"/view_purchase_details/' + req.body.confirmReference.slice(2)+'"',
							desc:  'Delivery Done',
							id: req.session.employee_id,
							roles: dataformatter.getNotifRoles('P'),
							contents: 'Purchase ' + req.body.confirmReference.slice(2) + ' is completed'
							}
							/* Creating a Sale Record for Delivery sends a notification to Logistics */
							notificationModel.createNotif(query, function(err, notif) {
								if (err)
									throw err;
								else {
									purchaseModel.getPurchaseRecordDetails({supplier_lo : req.body.confirmReference.slice(2)}, function(err, purchase){
										if(err){
											throw err;
										}
										else{
											console.log(purchase[0]);
											productModel.addProductQty(purchase[0].product_name, purchase[0].qty,  function(err){
												if(err){
													throw err;
													console.log("Error adding product quantity");
												}
												else{
													req.flash('dialog_success_msg', 'Successfully updated delivery!');
													res.redirect('track_deliveries');
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
}

exports.getConfirmDelivery = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			deliveryModel.getProcessingDeliveries(8, function(err, processingDeliveries) {
				if (err)
					throw err;
				else {
					deliveryModel.getProcessingDeliveries(9999999999, function(err, processingDeliveriesAll) {
						if (err)
							throw err;
						else {
							truckModel.getAllTrucks(function(err, trucks) {
								if (err)
									throw err;
								else {
									html_data = {
										curDate: dataformatter.formatDate(new Date(), 'YYYY-MM-DD'),
										notifCount: notifCount[0],
										processingDeliveries: processingDeliveries,
										processingDeliveriesAll: processingDeliveriesAll,
										truckList: trucks
									};
									
									html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'confirm_delivery_tab');
									res.render('confirmDelivery', html_data);
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.getTrackDelivery = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			deliveryModel.getTrackDelivery(0, function(err, orders) {
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
						weeklyOrders: dataformatter.groupByDayofWeek(dates, orders),
						today: dataformatter.formatDate(new Date(), 'mm DD, YYYY')
					}
					
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'track_orders_tab');
					res.render('trackDeliveryOrders', html_data);
				}
			});
		}
	});
}

exports.getDeliveryRecords = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			deliveryModel.getDeliveryRecordsAll(function(err, deliveries) {
				if (err)
					throw err;
				else {
					var blanks = [];
					var x = 0;
					while(deliveries.length+x <= 9) {
						blanks.push('temp');
						x++;
					}
					html_data = {
						notifCount: notifCount[0],
						deliveries: deliveries,
						blanks: blanks
					};
					
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'delivery_record_tab');
					res.render('deliveryRecordTable', html_data);
				}
			});
		}
	});
}

exports.viewDeliveryDetails = function(req, res) {
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			deliveryModel.getSingleDeliveryInfo({ purchase_lo: req.params.id }, function(err, deliveryInfo) {
				if (err)
					throw err;
				else {
					console.log(deliveryInfo[0]);
					//deliveryInfo[0].formattedDate = dataformatter.formatDate(deliveryInfo[0].formattedDate, 'YYYY-MM-DD');
					html_data = {
						notifCount: notifCount[0],
						deliveryInfo: deliveryInfo[0]
					};
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'delivery_record_tab');
					res.render('deliveryDetails', html_data);
				}
			});
		}
	});
}