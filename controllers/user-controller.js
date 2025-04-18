const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
    pageClass: 'login-page',
  });
};

exports.getSignup = (req, res) => {
  res.render('signup', {
    pageTitle: 'Sign Up',
    pageClass: 'signup-page'
  });
};

exports.postSignup = async (req, res) => {
  const { firstName, lastName, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/auth/signup');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    req.flash('error', 'Email already in use.');
    return res.redirect('/auth/signup');
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    roles: ['user']
  });

  await user.save();

  req.session.user = user;
  req.session.isLoggedIn = true;
  req.flash('success', `Welcome, ${firstName}!`);
  res.redirect('/');
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.session.user = user;
    req.session.isLoggedIn = true;
    req.flash('success', `Welcome, ${user.firstName}!`);

    req.session.save(err => {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
