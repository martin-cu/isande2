const homeModel = require('../models/homeModel');
const js = require('../public/assets/js/session.js');

exports.queryOverview = function(req, res){
	var html_data = {};
	html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'home');
	res.render('home', html_data);
}

