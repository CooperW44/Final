module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn || !req.session.user || !req.session.user.roles.includes('admin')) {
      return res.redirect('/auth/login');
    }
    next();
  };
  