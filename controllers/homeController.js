const homeModel = require('../models/homeModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.viewDashboard = function(req, res){
	if (req.session.authority === 'System Admin') {
		console.log('!');
	}
	else if (req.session.authority === 'Sales Employee') {
		homeModel.getNetIncomeData(function(err, netIncome) {
			if (err)
				throw err;
			else {
				homeModel.getTaskProgress(function(err, taskProgress) {
					if (err)
						throw err;
					else {
						homeModel.getOverdueUnpaid(function(err, overDueOrders) {
							if (err)
								throw err;
							else {
								homeModel.getRecentSales(function(err, recentOrders) {
									if (err)
										throw err;
									else {
										homeModel.getMonthlySales(function(err, monthlySale) {
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
													netMonth: netMonth,
													netYear: netYear,
													taskProgress: taskProgress[0].order_completion,
													pendingTasks: taskProgress[0].pending_tasks,
													recentOrders: recentOrders,
													overDueOrders: overDueOrders,
													monthlyEarnings: JSON.stringify(dataformatter.groupedMonthlySales(monthlySale))
												};
												
												html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'dashboard_tab');
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
	else if (req.session.authority === 'Purchasing Employee') {
		console.log('!');
	}
	else if (req.session.authority === 'Logistics Employee') {
		console.log('!');
	}
	/* Copy this
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'dashboard_tab');
	res.render('home', html_data);
	*/
}

