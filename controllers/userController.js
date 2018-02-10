const RetailEnergyProvider = require('../models/retailEnergyProvider');
const User = require('../models/user');
const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Login Page
exports.login_form = function(req, res) {
    res.render('login', {title: 'Login'});
};

// Login Form
exports.login = [
    // Validate/Sanitize fields
    body('email', 'Email required').isLength({ min: 1 }).trim(),
    body('password', 'Password required').isLength({ min: 1 }).trim(),
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('login', { title: 'LED Plus', errors: errors.array()});
            return;
        } else {
            User.findOne({ 'email' :  req.body.email }, function(err, user) {
                if(err) {return next(err);}

                if (!user || !user.validPassword(req.body.password)) {
                    res.render('login', { title: 'LED Plus', errors: [{msg: 'Incorrect username/password'}]});
                    return;
                } else {
                    req.session.user = user;
                    res.redirect(user.dashboard);
                }
            });
        }
    }
];


// Register Page
exports.register_form = function(req, res, next) {
    RetailEnergyProvider.find({},'name')
    .exec(function (err, reps) {
      if (err) { return next(err); }
      let template_context = {
        title: 'Register', 
        rep_list: reps
      }
      res.render('register', template_context);
    }); 
};

// Register Form
exports.register = [
    // Validate/Sanitize fields
    body('retail_energy_provider', 'REP required').isLength({ min: 1 }).trim(),
    body('email', 'Email required').isLength({ min: 1 }).trim(),
    body('password', 'Password required').isLength({ min: 1 }).trim(),
    body('confirm_password', 'Confirm Password required').isLength({ min: 1 }).trim(),
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        let errors = validationResult(req);

        let user = new User({
            email: req.body.email,
            password: req.body.password,
            retail_energy_provider: req.body.retail_energy_provider
        });

        if (!errors.isEmpty() || req.body.password !== req.body.confirm_password) {
            RetailEnergyProvider.find({},'name')
            .exec(function (err, reps) {
                if (err) { return next(err); }

                let template_context = {
                    title: 'Register', 
                    rep_list: reps,
                    user: user,
                    errors: errors.array()
                }

                res.render('register', template_context);
            });
        } else {
            //  hash password
            user.password = user.generateHash(req.body.password);

            // save user
            user.save(function(err){
                if(err) { return next(err); }

                req.session.user = user;

                res.redirect(user.dashboard);
            });
        }
    }
];

// Dashboard
exports.dashboard = function(req, res) {
    async.parallel({
        user: function(callback){
            User.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results){
        if (err) { return next(err); }

        if (results.user==null) {
            let err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        template_context = {
            title: 'Dashboard',
            user: results.user
        };

        res.render('dashboard', template_context);
    });  
};

// Logout
exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
};