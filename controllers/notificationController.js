const notificationModel = require('../models/notificationModel');

exports.getNotifs = function(req, res) {
	notificationModel.getNotifs(req.query.employee_id, function(err, notifs) {
		if (err)
			throw err;
		else {
			var html_data = {
				notifs: notifs
			}
			res.send(html_data);
		}
	});
};

exports.seenNotifs = function(req, res) {
	notificationModel.setAsSeen(req.body.employee_id, function(err, result) {
		if (err)
			throw err;
		else {
			var html_data = {
				updatedNotif: result
			}
			res.send(html_data);
		}
	});
}