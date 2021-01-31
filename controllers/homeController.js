const homeModel = require('../models/homeModel');
const notificationModel = require('../models/notificationModel');
const recommendationModel = require('../models/recommendationModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.viewDashboard = function(req, res){
	res.locals.success_msg = 'sdasda';
	res.locals.error_msg = null;
	if (req.session.authority === 'System Admin') {
		console.log('!');
	}
	else if (req.session.authority === 'Sales Employee') {
		notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
			if (err) {
				res.locals.error_msg = 'error';
				res.redirect('/logout');
			}
			else {
				homeModel.getNetIncomeData(function(err, netIncome) {
					if (err) {
						req.flash('dialog_error_msg', err);
						res.redirect('/logout');
					}
					else {
						homeModel.getTaskProgress(function(err, taskProgress) {
							if (err) {
								req.flash('dialog_error_msg', err);
								res.redirect('/logout');
							}
							else {
								homeModel.getOverdueUnpaid(function(err, overDueOrders) {
									if (err) {
										req.flash('dialog_error_msg', err);
										res.redirect('/logout');
									}
									else {
										homeModel.getRecentSales(function(err, recentOrders) {
											if (err) {
												req.flash('dialog_error_msg', err);
												res.redirect('/logout');
											}
											else {
												homeModel.getMonthlySales(function(err, monthlySale) {
													if (err) {
														req.flash('dialog_error_msg', err);
														res.redirect('/logout');
													}
													else {
														var netMonth, netYear;
														for (var i = 0; i < netIncome.length; i++) {
															if (netIncome[i].type === 'yearly')
																netYear = netIncome[i].net_income;
															else if (netIncome[i].type === 'monthly')
																netMonth = netIncome[i].net_income;
														}
														html_data = {
															notifCount: notifCount[0],
															netMonth: netMonth,
															netYear: netYear,
															taskProgress: taskProgress[0].order_completion,
															pendingTasks: taskProgress[0].pending_tasks,
															recentOrders: recentOrders,
															overDueOrders: overDueOrders,
															monthlyEarnings: JSON.stringify(dataformatter.groupedMonthlySales(monthlySale)),
														};

														html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'dashboard_tab');
														res.render('home', html_data);	
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
	else if (req.session.authority === 'Purchasing Employee') {
		notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
			if (err) {
				req.flash('dialog_error_msg', err);
				res.redirect('/logout');
			}
			else {
				homeModel.getOrderedBags(function(err, orderedBags) {
					if (err) {
						req.flash('dialog_error_msg', err);
						res.redirect('/logout');
					}
					else {
						homeModel.getPurchaseProgress(function(err, taskProgress) {
							if (err) {
								req.flash('dialog_error_msg', err);
								res.redirect('/logout');
							}
							else {
								homeModel.getRecentOrders(function(err, recentOrders) {
									if (err) {
										req.flash('dialog_error_msg', err);
										res.redirect('/logout');
									}
									else {
										homeModel.getMonthlyPurchases(function(err, monthlyPurchases) {
											if (err) {
												req.flash('dialog_error_msg', err);
												res.redirect('/logout');
											}
											else {
												recommendationModel.getRecommendation2(function(err, recommendation) {
													if (err) {
														req.flash('dialog_error_msg', err);
														res.redirect('/logout');
													}
													else {
														/*
														var netMonth, netYear;
														for (var i = 0; i < netIncome.length; i++) {
															if (netIncome[i].type === 'yearly')
																netYear = netIncome[i].net_income;
															else if (netIncome[i].type === 'monthly')
																netMonth = netIncome[i].net_income;
														}
														*/
														var html_data = {
															recommendInventory: recommendation,
															notifCount: notifCount[0],
															//netMonth: netMonth,
															//netYear: netYear,
															orderedBags: orderedBags,
															taskProgress: taskProgress[0].task_progress,
															pendingTasks: taskProgress[0].pending,
															recentOrders: recentOrders,
															monthlyEarnings: JSON.stringify(dataformatter.groupedMonthlyPurchases(monthlyPurchases))
														};
														html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'dashboard_tab');
														res.render('home', html_data);	
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
	else if (req.session.authority === 'Logistics Employee') {
		notificationModel.getUnseenNotifCount(req.session.employee_id, function(err, notifCount) {
			if (err) {
				req.flash('dialog_error_msg', err);
				res.redirect('/logout');
			}
			else {
				homeModel.getPerfectOrderRate(function(err, perfectOrderRate) {
					if (err) {
						req.flash('dialog_error_msg', err);
						res.redirect('/logout');
					}
					else {
						homeModel.getDeliveryByDestination(function(err, deliveryByDestination) {
							if (err) {
								req.flash('dialog_error_msg', err);
								res.redirect('/logout');
							}
							else {
								homeModel.getPendingDeliveries(5, function(err, pendingDeliveries) {
									if (err) {
										req.flash('dialog_error_msg', err);
										res.redirect('/logout');
									}
									else {
										var html_data = {
											notifCount: notifCount[0],
											pendingDeliveries: pendingDeliveries,
											perfectOrderRate: JSON.stringify(dataformatter.transformPerfectOrderRate(perfectOrderRate)),
											monthlyByDestination: JSON.stringify(dataformatter.groupedDeliveryByLoc(deliveryByDestination))
										};

										html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'dashboard_tab');
										res.render('home', html_data);	
									}
								});
							}
						});
					}
				});
			}
		});
	}
	/* Copy this
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'dashboard_tab');
	res.render('home', html_data);
	*/
}

