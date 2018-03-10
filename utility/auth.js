let requireLogin = (req, res, next) => {
  if( !req.session.user ) {
    res.redirect('/');
  } else {
    next();
  }
};

module.exports = requireLogin;