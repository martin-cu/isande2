const userModel = require('../models/userModel');
const employeeModel = require('../models/employeeModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const js = require('../public/assets/js/session.js');

exports.registerUser = function(req, res) {
	const errors = validationResult(req);

	console.log(req.body);
	
	if (errors.isEmpty()) {
		const saltRounds = 10;
		console.log(req.body);
		var {employee_id, user_role, username, email, password, confirm_password} = req.body;
		userModel.singleQuery(username, function(err, result) {
			if (result.length != 0) {
				// found a match, return to reg employee with error
				var err_log = 'There was an error in your registration. ';
				if (result[0].email === email)
					err_log += 'Email is already taken please try again. ';
				if (result[0].username === username)
					err_log += 'Username is already taken please try again. ';
				console.log(err_log);
		        req.flash('error_msg', err_log);
		        res.redirect('/register_employee');
			}
			else {
				bcrypt.hash(password, saltRounds, (err, hashed) => {
					const newUser = {
						username: username,
						email: email,
						role_id: user_role,
						employee_id: employee_id,
						password: hashed
					};
					userModel.create(newUser, function(err, status) {
						if (err) {
							req.flash('error_msg', 'Problem with database registration: '+err);
							res.redirect('/register_employee');
						}
						else {
							req.flash('success_msg', 'You are now registered!');
							res.redirect('/resources/users');
						}
					});
				});
			};
		});
	}
	else {
		const messages = errors.array().map((item) => item.msg);
		req.flash('error_msg', messages.join(' '));
		res.redirect('/resources_users')
	}
};

exports.queryAll = function(req, res) {
	var offset = 0;
	var limit = 10;
	var { offset, limit } = req.query;
	userModel.queryUserCount({}, function(err, count){
		if (err)
			throw err;
		else {
			var page_obj = dataformatter.formatPage(limit, offset, count[0].count);
			var limit = 10;
			var offset = 0;
			userModel.queryAll(offset, limit, function(err, result) {
				if (err) 
					throw err;
				else {
					offset = parseInt(offset);
					var temp_data = { status: '&nbsp' };
					var html_data = { 
					num_records: count[0].count,
					origin: offset+1,
					end: result.length+offset,
					users: result
					};
					html_data = js.innit_pagination(html_data, offset, result.length+offset, count[0].count);

					while (result.length < 10) {
						result.push(temp_data);
					}
					
					html_data = js.init_session(html_data, req.session.authority, req.session.initials, req.session.username, 'resources');
					
					res.render('user_table', html_data);
			}
			});
		}
	});
};



exports.queryAllPagination = function(req,res){
	var offset = parseInt(req.query.offset);
	var limit = 10;
	console.log(offset);
	userModel.queryUserCount({}, function(err, count){
		if (err)
			throw err;
		else{
			userModel.queryAll(offset, limit, function(err, result){
				// if(limit > )
				if(limit > result.length)
					limit = offset + result.length;
				else
					limit = offset + 10;
				res.send({
					data : result,
					offset : offset + 1,
					limit : limit,
					count : result.length
				});
			});
		}
	});
}

exports.myAccount = function(req, res) {
	userModel.singleQuery(req.session.username, function(err, result) {
		if (err) {
			req.flash('error_msg', 'Something went wrong');
			res.redirect('/dashboard');
		}
		else {
			if (req.session.authority == 1) {
				res.render('change_pass', {
					admin: "1",
					user: req.session.name,
					result: result
				});
			}
			else {
				res.render('change_pass', {
					user: req.session.name,
					result: result
				});
			}
		}
	});
};

exports.changePassword = function(req, res) {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const saltRounds = 10;
		var {oldP, newP, conP} = req.body;

		userModel.singleQuery(req.session.username, function(err, result) {
			if (err) {
				// found a match, return to login with error
		        req.flash('error_msg', 'Oops something went wrong');
		        res.redirect('/manage_accounts/change_password');
			}
			else {
				bcrypt.compare(oldP, result[0].password, (err, comp) => {
					if (comp) {
						// Hash password
						bcrypt.hash(newP, saltRounds, (err, hashed) => {
							var update = 'password = lqkJmHoBJY'+hashed+'lqkJmHoBJY';
							var query = 'lqkJmHoBJY'+req.session.username+'lqkJmHoBJY';
							userModel.update(query, update, function(err, result1)  {
							  if (err) {
							  	req.flash('error_msg', err);
								res.redirect('/manage_accounts/my_account/change_password');
							  }
							  else {
							  	req.flash('success_msg', 'Successfully updated new password!');
								res.redirect('/manage_accounts/my_account/change_password');
							  }

							});
						});
					} 
					else {
						// passwords don't match
						req.flash('error_msg', 'Incorrect password. Please try again.');
						res.redirect('/manage_accounts/my_account/change_password');
					}
				});
			};
		});
	}
	else {
		const messages = errors.array().map((item) => item.msg);
		req.flash('error_msg', messages.join(' '));
		res.redirect('/manage_accounts/my_account/change_password');
	}
}

exports.updateAccount = function(req, res) {
	var user = req.params.username;
	var { userfield, newval, passval1, passval2, authority } = req.body;
	var query = 'lqkJmHoBJY'+user+'lqkJmHoBJY';
	var saltRounds = 10;
	var update = '';
	if (userfield == 'fName') {
		update += 'first_name = lqkJmHoBJY' + newval+'lqkJmHoBJY';
	}
	else if (userfield == 'lName') {
		update += 'last_name = lqkJmHoBJY' + newval+'lqkJmHoBJY';
	}
	else if (userfield == 'pass') {
		if (passval1 != passval2) {
			req.flash('error_msg', 'Passwords must match');
			res.redirect('/manage_accounts/'+user);
		}
		else {
			bcrypt.hash(passval1, saltRounds, (err, hashed) => {
				update += 'password = lqkJmHoBJY'+hashed+'lqkJmHoBJY';
				userModel.update(query, update, function(err, result2)  {
				  if (err) {
				  	req.flash('error_msg', 'Something went wrong please try again');
					res.redirect('/manage_accounts/'+user);
				  }
				  else {
				  	req.flash('success_msg', 'Successfully updated user account');
					res.redirect('/manage_accounts/'+user);
				  }
				});
			});
		}
	}
	else if (userfield == 'role') {
		update +='authority ='+authority;
	}
	if (userfield != 'pass') {
		userModel.update(query, update, function(err, result2)  {
		  if (err) {
		  	req.flash('error_msg', 'Something went wrong please try again');
			res.redirect('/manage_accounts/'+user);
		  }
		  else {
		  	req.flash('success_msg', 'Successfully updated user account');
			res.redirect('/manage_accounts/'+user);
		  }
		});
	}
}

exports.loginUser = function(req, res) {
	const errors = validationResult(req);

	if(errors.isEmpty()) {
		const saltRounds = 10;
		var {username, password} = req.body;
		console.log(username);
		console.log('hi' + password);
		userModel.singleQuery(username, function(err, userQuery) {
			if (err) throw err;
			else {
				if (err) {
					req.flash('error_msg', 'Invalid login credentials');
					res.redirect('/login')
				}
				else {
				/*	if (userQuery.length >= 1) {
						var name = userQuery[0].first_name[0] + '.' + userQuery[0].last_name[0];
						req.session.initials = name;
						req.session.authority = userQuery[0].role_id;
						req.session.username = userQuery[0].username;

						console.log(req.session.authority);
						res.redirect('/home');
					}
					else
						console.log('2');*/
					if (userQuery.length >= 1 && userQuery[0].password == password){
						console.log('nakaset na ' + userQuery);
						//for default set password and non encrypted in the db at the moment
							
								console.log(userQuery[0]);
								var name = userQuery[0].first_name[0] + '.' + userQuery[0].last_name[0];
								req.session.initials = name;
								req.session.authority = userQuery[0].role_id;
								req.session.username = userQuery[0].username;
								req.session.tab = true;
								res.redirect('/home');		
						
						/*else {
							// passwords don't match
							req.flash('error_msg', 'Incorrect password. Please try again.');
							res.redirect('/login')
						}*/

					}
					

					else if (userQuery.length >= 1) {
						bcrypt.compare(password, userQuery[0].password, (err, result) => {
							// passwords match (result == true)
							console.log('for encrypted' + result);
							if (result) {

								// Update session object once matched!
								/*req.session.name = userQuery[0].last_name + ' ' + userQuery[0].first_name;
								req.session.authority = userQuery[0].authority;
								req.session.username = userQuery[0].username;*/

								var name = userQuery[0].first_name[0] + '.' + userQuery[0].last_name[0];
								req.session.initials = name;
								req.session.authority = userQuery[0].role_id;
								req.session.username = userQuery[0].username;
								req.session.tab = true;
								res.redirect('/home');								
							} 
							else {
								// passwords don't match
								req.flash('error_msg', 'Incorrect password. Please try again.');
								res.redirect('/login')
							}
						});
					}


					else {
						req.flash('error_msg', 'Invalid username please try again');
						res.redirect('/login')
					}
					
				}
			}
		});

	}
	else {
		const messages = errors.array().map((item) => item.msg);
		req.flash('error_msg', messages.join(' '));
		res.redirect('/login')
	}
};

exports.logout = function(req, res) {
	if (req.session) {
		req.session.destroy(() => {
			res.clearCookie('connect.sid');
			res.redirect('/login');
    	});
  	}
};