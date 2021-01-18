const reportModel = require('../models/reportModel');
const notificationModel = require('../models/notificationModel');
const homeModel = require('../models/homeModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.viewReports = function(req, res){
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			if (req.session.authority === 'System Admin') {
				console.log('!');
			}
			else if (req.session.authority === 'Sales Employee') {
				reportModel.getMonthlySalesByProduct(function(err, monthlySalesByProduct) {
					if (err)
						throw err;
					else {
						homeModel.getNetIncomeData(function(err, netIncome) {
							if (err)
								throw err;
							else {
								homeModel.getTaskProgress(function(err, taskProgress) {
									if (err)
										throw err;
									else {
										var netMonth, netYear;
										for (var i = 0; i < netIncome.length; i++) {
											if (netIncome[i].type === 'yearly')
												netYear = netIncome[i].net_income;
											else if (netIncome[i].type === 'monthly')
												netMonth = netIncome[i].net_income;
										}
										var html_data = {
											notifCount: notifCount[0],
											monthlySalesByProduct: monthlySalesByProduct,
											netMonth: netMonth,
											netYear: netYear,
											taskProgress: taskProgress[0].order_completion,
											pendingTasks: taskProgress[0].pending_tasks,
										};
										
										html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
										res.render('reports', html_data);
									}
								});
							}
						});
					}
				});
			}
			else if (req.session.authority === 'Purchasing Employee') {
				console.log('!');
			}
			else if (req.session.authority === 'Logistics Employee') {
				console.log('!');
			}
		}
	});
	/* Copy this
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
	res.render('home', html_data);
	*/
}

exports.viewSalesDetailedReport = function(req, res) {
	var type = req.params.type, param = req.query;
	param = param[Object.keys(param)]

	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err)
			throw err;
		else {
			if (type == 'Monthly_Sales') {
				reportModel.filteredMonthlySales(param, function(err, result) {
					if (err)
						throw err;
					else {
						reportModel.filteredMonthlySalesRecord(param, function(err, records) {
							if (err)
								throw err;
							else {
								var html_data = { notifCount: notifCount[0], reportType: type, records: records, data: result[0], metrics: dataformatter.formatReportMetrics(result[0]),
								reportTitle: result[0].product_name+' Monthly Sales', 
								cardObj: { title: result[0].product_name+' Total Sales', data: 'Php '+result[0].total_sales } };
								html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
								res.render('salesDetailedReport', html_data);
							}
						});
					}
				});
			}
			else if (type == 'Monthly_Earnings') {
				reportModel.filteredEarningsPeriod(param, function(err, result) {
					if (err)
						throw err;
					else {
						reportModel.filteredEarningsPeriodRecord(param, function(err, records) {
							if (err)
								throw err;
							else {
								result[0]['product_name'] = 'All';
								var html_data = { notifCount: notifCount[0], reportType: type, records: records, data: result[0], metrics: dataformatter.formatReportMetrics(result[0]),
								reportTitle: result[0].period+'ly Earnings', cardObj: { title: 'Total '+result[0].period+'ly Earnings', data: 'Php '+result[0].total_sales } };
								html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
								res.render('salesDetailedReport', html_data);
							}
						})
					}
				});
			}
			else if (type == 'Order_Progress' && param == 'All') {
				reportModel.getTaskProgress(function(err, result) {
					if (err)
						throw err;
					else {
						reportModel.taskProgressRecords(function(err, records) {
							if (err)
								throw err;
							else {
								result[0]['product_name'] = 'All';
								var html_data = { notifCount: notifCount[0], reportType: type, records: records, data: result[0], metrics: dataformatter.formatReportMetrics(result[0]),
								reportTitle: 'Monthly Task Progress', cardObj: { title: 'Monthly Task Progress', data: result[0].task_progress } };
								html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
								console.log(records);
								res.render('salesDetailedReport', html_data);
							}
						})
					}
				});
			}
			else if (type == 'Order_Progress' && param == 'Pending') {
				reportModel.getPendingRequests(function(err, result) {
					if (err)
						throw err;
					else {
						reportModel.pendingRequestsRecord(function(err, records) {
							if (err)
								throw err;
							else {
								result[0]['product_name'] = 'All';
								var html_data = { notifCount: notifCount[0], reportType: type, records: records, data: result[0], metrics: dataformatter.formatReportMetrics(result[0]),
								reportTitle: 'Pending Orders Report', cardObj: { title: 'Accumulative Pending Orders', data: result[0].total_orders } };
								html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
								res.render('salesDetailedReport', html_data);
							}
						})
					}
				});
			}
		}
	});			
	/*
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
	res.render('salesDetailedReport', html_data);
	*/
}