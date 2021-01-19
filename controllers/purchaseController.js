const customerModel = require('../models/customerModel');
const productModel = require('../models/productModel');
const purchaseModel = require('../models/purchaseModel');
const notificationModel = require('../models/notificationModel');
const recommendationModel = require('../models/recommendationModel');
const deliveryDetailModel = require('../models/deliveryDetailModel');
const js = require('../public/assets/js/session.js');
const dataformatter = require('../public/assets/js/dataformatter.js');

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
}

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
					
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, req.session.employee_id, 'purchase_record_tab');
					res.render('purchasingDetails', html_data);
				}
			});
		}
	});
}