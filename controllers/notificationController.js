const notificationModel = require('../models/notificationModel');

exports.getNotifs = function(req, res) {
	res.locals.success_msg = null;
	res.locals.error_msg = null;
	notificationModel.getNotifs(req.query.employee_id, function(err, notifs) {
		if (err) {
			req.flash('dialog_error_msg', err);
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
	res.locals.success_msg = null;
	res.locals.error_msg = null;
	notificationModel.setAsSeen(req.body.employee_id, function(err, result) {
		if (err) {
			req.flash('dialog_error_msg', err);
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