const RetailEnergyProvider = require('../models/retailEnergyProvider');
const User = require('../models/user');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// REP: list
exports.rep_list = function(req, res, next) {
    RetailEnergyProvider.find()
    .sort({name: 1})
    .exec(function(err, rep_list){
        if(err){ return next(err); }

        let template_context = {
            title: 'Retail Energy Providers',
            user: req.session.user,
            rep_list: rep_list
        };

        res.render('rep_list', template_context);
    });
};

// REP: detail
exports.details = function(req, res, next) {
    async.parallel({
        rep: function(callback){
            RetailEnergyProvider.findById(req.params.id)
            .exec(callback);
        },
        users: function(callback){
            User.find({retail_energy_provider: ObjectId(req.params.id)})
            .exec(callback);
        }
    }, function(err, results){
        if(err){ return next(err); }

        if(results.rep==null) { 
            var err = new Error('Retail Energy Provider not found');
            err.status = 404;
            return next(err);
        }

        let template_context = {
            title: results.rep.name,
            user: req.session.user,
            rep: results.rep,
            users: results.users
        };
        res.render('rep_detail', template_context);
    });
};

// REP: update
exports.update = [
    body('name', 'Name required').isLength({ min: 1 }).trim(),
    sanitizeBody('name').trim().escape(),
    (req, res, next) => {
        RetailEnergyProvider.findById(req.params.id)
        .exec(function(err, rep){
            if(err){ return next(err); }

            if(rep == null) { 
                var err = new Error('Retail Energy Provider not found');
                err.status = 404;
                return next(err);
            }
            let errors = validationResult(req);

            let template_context = {
                title: rep.name,
                rep: rep,
                user: req.session.user
            };

            if( !errors.isEmpty() ){
                template_context.errors = errors.array();
                res.render('rep_detail', template_context);
            } else {
                // update rep
                rep.name = req.body.name;
                if(req.files.rep_logo){
                    let bitmap = req.files.rep_logo.data.toString('base64');
                    let mimetype = req.files.rep_logo.mimetype;
                    let encoded_image = `data:${mimetype};base64,${bitmap}`
                    rep.logo = encoded_image;
                }

                rep.save(function(err, updated_rep){
                    if(err){ return next(err); }
                    template_context.rep = updated_rep;
                    User.find({retail_energy_provider: ObjectId(req.params.id)})
                    .exec(function(err, users){
                        template_context.users = users
                        res.render('rep_detail', template_context);
                    });
                    
                });
            } 
        });  
    }
];

// REP: upload rates
exports.rate_sheet_upload = function(req, res, next) {
    rates = req.body.data;

    if( rates.length > 0 ){
        RetailEnergyProvider.findById(req.params.id)
        .exec(function(err, rep){
            if(err){ return next(err); }

            rep.rates = rates;

            rep.save(function(err){
                if(err){
                    console.log(err);
                    res.send({status: 500, error_msg: 'unable to save rates'});
                }

                res.send({status: 200});
            })
        });
    } else {
        res.send({status: 500, error_msg: 'no rates found in upload'});
    }  
};