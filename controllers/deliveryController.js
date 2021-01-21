const notificationModel = require('../models/notificationModel');
const homeModel = require('../models/homeModel');
const purchaseModel = require('../models/purchaseModel');
const salesModel = require('../models/salesModel');
const deliveryModel = require('../models/deliveryModel');
const truckModel = require('../models/truckModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.getSingleDeliveryInfo = function(req, res) {
	if (req.query.type === 'Sell-in' || req.query.type === 'Sell-out') {
		salesModel.getSaleRecordDetail({ delivery_receipt: req.query.id }, function(err, sale_record) {
			if (err)
				throw err;
			else {
				var html_data = {
					deliveryInfo: sale_record[0]
				}
				res.send(html_data);
			}
		});
	}
	else if (req.query.type === 'Restock') {
		var html_data = {

		}
		res.send(html_data);
	}
	else {
		res.send();
	}
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
					homeModel.getPendingDeliveries(10, function(err, pendingDeliveries) {
						if (err)
							throw err;
						else {
							var html_data = {
								notifCount: notifCount[0],
								truckList: trucks,
								pendingDeliveries: pendingDeliveries
								//weeklyDate: dates,
								//weeklyOrders: dataformatter.groupByDayofWeek(dates, orders)
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
						weeklyOrders: dataformatter.groupByDayofWeek(dates, orders)
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