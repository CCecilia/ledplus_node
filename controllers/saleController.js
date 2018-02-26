const User = require('../models/user');
const ServiceClass = require('../models/serviceClass');
const Utility = require('../models/utility');
const SubType = require('../models/subType');
const Led = require('../models/led');
const Sale = require('../models/sale');
const StateRate = require('../models/stateRate');
const AnnualScaler = require('../models/annualConsumptionScaler');
const RetailEnergyProvider = require('../models/retailEnergyProvider');
const async = require('async');
const _ = require('underscore');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug')('sale');

// titling
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Sales List
exports.sales_list = function(req, res, next) {
    async.parallel({
        sales: function(callback){
            if(req.session.user.admin){
                Sale.find()
                .populate('subtype')
                .exec(callback);
            } else {
                Sale.find({ agent: ObjectId("5a7e269087cf600907bb3ae8") })
                .populate('subtype')
                .exec(callback);
            }  
        }
    },function(err, results){
        if(err){
            debug(`error @ sales list: ${err}`);
            return next(err);
        }
        
        let template_context = {
            title: 'Sales',
            sales: results.sales,
            user: req.session.user
        };

        res.render('sales', template_context);
    });
};

// new Sale: page
exports.new_sale = function(req, res, next) {
    async.parallel({
        subtype_list: function(callback){
            SubType.find()
            .sort({name: 1})
            .exec(callback);
        },
        utility_list: function(callback) {
            Utility.find()
            .sort({name: 1})
            .exec(callback);
        },
        service_class_list: function(callback) {
            ServiceClass.find()
            .sort({name: 1})
            .exec(callback);
        },
        led_list: function(callback){
            Led.find()
            .sort({order_number: 1})
            .exec(callback);
        }
    }, function(err, results){
        if(err){
            debug(`error @ new sale: ${err}`);
            return next(err);
        }

        template_context = {
            title: 'New Sale',
            subtype_list: results.subtype_list,
            led_list: results.led_list,
            utility_list: results.utility_list,
            service_class_list: results.service_class_list,
            user: req.session.user
        };

        res.render('new_sale', template_context);
    });
};

// new sale: estimate yearly usage
exports.estimate_yearly = function(req, res, next){
    let weight = 0.0804;  // default weight
    AnnualScaler.findOne({
        state: String(req.body.state).toUpperCase(),
        utility: ObjectId(req.body.utility),
        service_class: ObjectId(req.body.service_class)
    }).exec(function(err, found_scaler){
        if(err){
            debug(`error @ estimate yearly: ${err}`);
            res.json({
                'status': 500,
                'error': 'Error during annual scaler find'
            })
        }

        if( found_scaler ){
            // change default weight
            weight = found_scaler.month[req.body.bill_month]
        }
        
        res.json({
            'status': 200,
            'estimated_annual_usage': Math.round(req.body.monthly_kwh / weight)
        });
    });
};

// new sale: create
exports.create = function(req, res, next){
    new_sale = new Sale({
        agent: ObjectId(req.session.user._id),
        business_name: req.body.business_name,
        authorized_representative: req.body.authorized_representative,
        service_address: req.body.service_address,
        billing_address: req.body.billing_address,
        subtype: ObjectId(req.body.subtype),
        annual_hours_of_operation: req.body.annual_hours_of_operation,
        utility: ObjectId(req.body.utility),
        service_class: ObjectId(req.body.service_class),
        account_number: req.body.account_number,
        service_start_date: req.body.service_start_date,
        monthly_kwh: req.body.monthly_kwh,
        yearly_kwh: req.body.yearly_kwh,
        supply_charges: req.body.supply_charges,
        delivery_charges: req.body.delivery_charges,
        bill_image: req.body.bill_image,
        leds: req.body.leds
    });
    new_sale.save(function(err){
        if(err){
            debug(`error @ create sale: ${err}`);
            return next(err);
        }
        res.json({status: 200, sale_url: new_sale.sale_page});
    });
};

// Sale
exports.sale = function(req, res, next) {
    async.parallel({
        sale: function(callback){
            Sale.findById(req.params.id)
            .populate('subtype')
            .populate('utility', 'name')
            .populate('service_class')
            .populate({path: 'agent', populate: {path: 'retail_energy_provider'}})
            .exec(callback);
        },
        state_rate: function(callback){
            Sale.findById(req.params.id, {'service_address.state': 1})
            .exec(function(err, sale){
                if(err){
                    debug(`error @ finding state rate: ${err}`);
                }
                StateRate.findOne({state: sale.service_address.state})
                .exec(callback);
            }); 
        }
    },function(err, results){
        if(err){
            debug(`error @ sale: ${err}`);
            return next(err);
        }

        if( results.sale === null ) { 
            var err = new Error('Sale not found');
            debug(`error @ sale: ${err}`);
            err.status = 404;
            return next(err);
        }
        
        // handle 3-5, 3-10yr savings
        if( results.sale.rate && results.state_rate ){
            results.sale.rate.three_five_year_savings = (results.sale.calculations.annual_consumption_reduction * results.state_rate.supply_rate) * 3;
            results.sale.rate.three_ten_year_savings = (results.sale.calculations.annual_consumption_reduction * results.state_rate.supply_rate) * 8;
            results.sale.rate.five_year_savings = results.sale.rate.three_five_year_savings + results.sale.rate.two_year_supply_savings;
            results.sale.rate.ten_year_savings = results.sale.rate.three_ten_year_savings + results.sale.rate.two_year_supply_savings;
        }

        let template_context = {
            title: results.sale.business_name.toProperCase(),
            user: req.session.user,
            sale: results.sale
        };

        res.render('sale', template_context);
    }) 
};