exports.isPrivate = (req, res, next) => {
  if (req.session.authority !== undefined) {
    return next();
  } 
  else {
    res.redirect('/login');
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.session.authority !== 'System Admin') {
    req.flash('error_msg', 'Trying to access invalid route!')
    res.redirect('/home')
  }
  else {
    return next();
  }
};

exports.isSales = (req, res, next) => {
  if (!(req.session.authority === 'Sales Employee' || req.session.authority === 'System Admin')) {
    req.flash('error_msg', 'Trying to access invalid route!')
    res.redirect('/home')
  }
  else {
    return next();
  }
}

exports.isPurchasing = (req, res, next) => {
  if (!(req.session.authority === 'Purchasing Employee' || req.session.authority === 'System Admin')) {
    req.flash('error_msg', 'Trying to access invalid route!')
    res.redirect('/home')
  }
  else {
    return next();
  }
}