const notificationModel = require('../models/notificationModel');

exports.getNotifs = function(req, res) {
	notificationModel.getNotifs(req.query.employee_id, function(err, notifs) {
		if (err) {
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/logout');
		}
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
		if (err) {
			req.flash('error_msg', 'Oops something went wrong!');
			res.redirect('/logout');
		}
		else {
			var html_data = {
				updatedNotif: result
			}
			res.send(html_data);
		}
	});
}