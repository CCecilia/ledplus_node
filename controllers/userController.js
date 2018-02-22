const RetailEnergyProvider = require('../models/retailEnergyProvider');
const User = require('../models/user');
const Sale = require('../models/sale');
const Led = require('../models/led');
const Utility = require('../models/utility');
const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const moment = require('moment');
const _ = require('underscore');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
exports.dashboard = function(req, res, next) {
    User.findById(req.params.id)
    .exec(function(err, user){
        if (err) { return next(err); }

        if (user==null) {
            let err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        if( user.admin ){
            async.parallel({
                sale_count: function(callback){
                    Sale.count(callback);
                },
                user_count: function(callback){
                    User.count(callback);
                },
                rep_count: function(callback){
                    RetailEnergyProvider.count(callback);
                },
                rate_count: function(callback){
                    RetailEnergyProvider.find().
                    exec(function(err, rep_list){
                        if (err) { return next(err); }
                        let count = 0;

                        for( let i = 0; i < rep_list.length; i++){
                            count += rep_list[i].rates.length;
                        }

                        callback(null, count);
                    });
                },
                daily_chart_data: function(callback){
                    //  aggregate daily sales data
                    Sale.aggregate([
                        { 
                            $match: { 
                                date_created: { 
                                    $gte: new Date(moment().subtract(7, 'days')),
                                    $lt: new Date(moment())
                                }
                            }
                        },
                        {
                            $group: {
                                _id : { 
                                    month: { $month: "$date_created" }, 
                                    day: { $dayOfMonth: "$date_created" }, 
                                    year: { $year: "$date_created" } 
                                },
                                total_sales: {$sum: 1}
                            }
                        }
                    ])
                    .exec(function(err, sale_list){
                        if (err) { console.log(err); return next(err); }

                        // format for chartist on the front
                        let daily_chart_data = {
                            1: {
                                label: 'M', 
                                count: 0
                            },
                            2: {
                                label: 'T', 
                                count: 0
                            },
                            3: {
                                label: 'W', 
                                count: 0
                            },
                            4: {
                                label: 'T', 
                                count: 0
                            },
                            5: {
                                label: 'F',
                                count: 0
                            },
                            6: {
                                label: 'S', 
                                count: 0
                            },
                            7: {
                                label: 'S', 
                                count: 0
                            }
                        };

                        let formatted_daily_chart_data = {
                            labels: [],
                            series: [[]]
                        };

                        for( let i = 0; i < sale_list.length; i++){
                            let day_number = moment(`${sale_list[i]._id.year}-${sale_list[i]._id.month}-${sale_list[i]._id.day}`, "YYYY-MM-DD").isoWeekday();
                            daily_chart_data[day_number].count = sale_list[i].total_sales;
                        }

                        for( day in daily_chart_data ){
                            formatted_daily_chart_data.labels.push(daily_chart_data[day].label);
                            formatted_daily_chart_data.series[0].push(daily_chart_data[day].count);
                        }
                        
                        callback(err, formatted_daily_chart_data);
                    });
                },
                utility_chart_data: function(callback){
                    //  aggregate daily sales data
                    //  using lookup to populate utility data: name
                    Sale.aggregate([
                        {
                            $lookup: {
                                from: 'utilities',
                                localField: 'utility',
                                foreignField: '_id',
                                as: 'utility'
                            }
                        },
                        {
                            $project: {
                                utility: {
                                    $arrayElemAt: [ '$utility', 0 ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id : { 
                                    utility: '$utility'
                                },
                                total_sales: {$sum: 1}
                            }
                        }
                    ])
                    .exec(function(err, sale_list){
                        if (err) { console.log(err); return next(err); }

                        let utility_chart_data = {
                            labels: [],
                            series: [[]]
                        };

                        for( let i = 0; i < sale_list.length; i++ ){
                            utility_chart_data.labels.push(sale_list[i]._id.utility.name);
                            utility_chart_data.series[0].push(sale_list[i].total_sales);
                        }
                        ;
                        callback(err, utility_chart_data)
                    });
                },
                top_sellers: function(callback){
                    Sale.aggregate([
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'agent',
                                foreignField: '_id',
                                as: 'agent'
                            }
                        },
                        {
                            $project: {
                                agent: {
                                    $arrayElemAt: [ '$agent', 0 ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id : { 
                                    agent: '$agent'
                                },
                                total_sales: {$sum: 1}
                            }
                        },
                        { 
                            $sort : { 
                                total_sales : 1
                            } 
                        },
                        { 
                            $limit : 5 
                        }
                    ])
                    .exec(callback);
                }
            }, function(err, results){
                if (err) { console.log(err); return next(err); }
                console.log(results.top_sellers[0]._id);
                template_context = {
                    title: 'Dashboard',
                    user: user,
                    sale_count: results.sale_count,
                    user_count: results.user_count,
                    rep_count: results.rep_count,
                    rate_count: results.rate_count,
                    daily_chart_data: results.daily_chart_data,
                    utility_chart_data: results.utility_chart_data,
                    today: moment().format('MM/DD/YYYY'),
                    top_sellers: results.top_sellers
                };
                
                res.render('dashboard', template_context);
            });
        } else {

                template_context = {
                    title: 'Dashboard',
                    user: user
                };

                res.render('dashboard', template_context);
        }
    });
          
};

// Logout
exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
};