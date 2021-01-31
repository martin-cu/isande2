const reportModel = require('../models/reportModel');
const notificationModel = require('../models/notificationModel');
const homeModel = require('../models/homeModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.viewReports = function(req, res){
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err) {
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect('/home');
		}
		else {
			if (req.session.authority === 'System Admin') {
				console.log('!');
			}
			else if (req.session.authority === 'Sales Employee') {
				reportModel.getSalesByCustomerReport(function(err, salesByCustomer) {
					if (err) {
						req.flash('dialog_error_msg', 'Oops something went wrong!');
						res.redirect('/home');
					}
					else {
						var html_data = {
							notifCount: notifCount[0],
							salesByCustomer: dataformatter.aggregateSalesByCustomer(salesByCustomer)
						};
						
						html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
						res.render('reports', html_data);
					}
					/*
					else {
						reportModel.getMonthlySalesByProduct(function(err, monthlySalesByProduct) {
							if (err) {
								req.flash('dialog_error_msg', 'Oops something went wrong!');
								res.redirect('/home');
							}
							else {
								homeModel.getNetIncomeData(function(err, netIncome) {
									if (err) {
										req.flash('dialog_error_msg', 'Oops something went wrong!');
										res.redirect('/home');
									}
									else {
										homeModel.getTaskProgress(function(err, taskProgress) {
											if (err) {
												req.flash('dialog_error_msg', 'Oops something went wrong!');
												res.redirect('/home');
											}
											else {
												var netMonth, netYear;
												for (var i = 0; i < netIncome.length; i++) {
													if (netIncome[i].type === 'yearly')
														netYear = netIncome[i].net_income;
													else if (netIncome[i].type === 'monthly')
														netMonth = netIncome[i].net_income;
												}
												var m = dataformatter.aggregateSalesByCustomer(salesByCustomer);
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
					*/
				});
			}
			else if (req.session.authority === 'Purchasing Employee') {
				html_data = {
					notifCount: notifCount[0]
				}
				html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
				res.render('reports', html_data);
			}
			else if (req.session.authority === 'Logistics Employee') {
				html_data = {
					notifCount: notifCount[0]
				}
				html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
				res.render('reports', html_data);
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

	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	var dateRange = {
		firstDay: dataformatter.formatDate(new Date(y, m, 1), 'MM DD, YYYY'),
		lastDay: dataformatter.formatDate(new Date(y, m + 1, 0), 'MM DD, YYYY')
	}	

	if (type === 'monthlySalesByCustomer') {
		reportModel.getSalesByCustomerReport(function(err, salesByCustomer) {
			if (err) {
				req.flash('dialog_error_msg', 'Oops something went wrong!');
				res.redirect('/home');
			}
			else {
				var html_data = { 
					reports: true,
					dateRange: dateRange,
					reportData: dataformatter.aggregateSalesByCustomer(salesByCustomer),
					pageLength: dataformatter.aggregateSalesByCustomer(salesByCustomer).pages.length
				};
				html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
				res.render('salesByCustomerReport', html_data);
			}
		});
	}
	else {
		
	}
	/*
	notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
		if (err) {
			req.flash('dialog_error_msg', 'Oops something went wrong!');
			res.redirect('/home');
		}
		else {
			if (type == 'Monthly_Sales') {
				reportModel.filteredMonthlySales(param, function(err, result) {
					if (err) {
						req.flash('dialog_error_msg', 'Oops something went wrong!');
						res.redirect('/home');
					}
					else {
						reportModel.filteredMonthlySalesRecord(param, function(err, records) {
							if (err) {
								req.flash('dialog_error_msg', 'Oops something went wrong!');
								res.redirect('/home');
							}
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
					if (err) {
						req.flash('dialog_error_msg', 'Oops something went wrong!');
						res.redirect('/home');
					}
					else {
						reportModel.filteredEarningsPeriodRecord(param, function(err, records) {
							if (err) {
								req.flash('dialog_error_msg', 'Oops something went wrong!');
								res.redirect('/home');
							}
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
					if (err) {
						req.flash('dialog_error_msg', 'Oops something went wrong!');
						res.redirect('/home');
					}
					else {
						reportModel.taskProgressRecords(function(err, records) {
							if (err) {
								req.flash('dialog_error_msg', 'Oops something went wrong!');
								res.redirect('/home');
							}
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
					if (err) {
						req.flash('dialog_error_msg', 'Oops something went wrong!');
						res.redirect('/home');
					}
					else {
						reportModel.pendingRequestsRecord(function(err, records) {
							if (err) {
								req.flash('dialog_error_msg', 'Oops something went wrong!');
								res.redirect('/home');
							}
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
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'reports_tab');
	res.render('salesDetailedReport', html_data);
	*/
}