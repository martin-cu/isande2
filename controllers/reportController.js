const reportModel = require('../models/reportModel');
const homeModel = require('../models/homeModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

exports.viewReports = function(req, res){
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
									monthlySalesByProduct: monthlySalesByProduct,
									netMonth: netMonth,
									netYear: netYear,
									taskProgress: taskProgress[0].order_completion,
									pendingTasks: taskProgress[0].pending_tasks,
								};
								
								html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'reports_tab');
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
	/* Copy this
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'reports_tab');
	res.render('home', html_data);
	*/
}

exports.viewSalesDetailedReport = function(req, res) {
	var type = req.params.type, param = req.query;
	param = param[Object.keys(param)]

	if (type == 'Monthly_Sales') {
		reportModel.filteredMonthlySales(param, function(err, result) {
			if (err)
				throw err;
			else {
				reportModel.filteredMonthlySalesRecord(param, function(err, records) {
					if (err)
						throw err;
					else {
						var html_data = { records: records, data: result[0], metrics: dataformatter.formatReportMetrics(result[0]),
						reportTitle: result[0].product_name+' Monthly Sales', 
						cardObj: { title: result[0].product_name+' Total Sales', data: 'Php '+result[0].total_sales } };
						html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'reports_tab');
						res.render('salesDetailedReport', html_data);
					}
				});
			}
		});
	}
	else if (type == 'Monthly_Earnings') {

	}
	else if (type == 'Order_Progress') {

	}
	/*
	var html_data = { };
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'reports_tab');
	res.render('salesDetailedReport', html_data);
	*/
}