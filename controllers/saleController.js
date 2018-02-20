const User = require('../models/user');
const ServiceClass = require('../models/serviceClass');
const Utility = require('../models/utility');
const SubType = require('../models/subType');
const Led = require('../models/led');
const Sale = require('../models/sale');
const AnnualScaler = require('../models/annualConsumptionScaler');
const RetailEnergyProvider = require('../models/retailEnergyProvider');
const async = require('async');
const _ = require('underscore');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// remove 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// titling
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function baseRate( sale_id ) {
    Sale.findById(sale_id)
    .populate({path: 'agent', populate: {path: 'retail_energy_provider'}})
    .populate('utility', 'name')
    .populate('service_class', 'name')
    .exec(function(err, sale){
        if(err) { 
            console.log(err);
            return err;
        }

        if(sale === null){
            var err = new Error('Sale not found');
            err.status = 404;
            return next(err);
        }

        let rates = _.where(
            sale.agent.retail_energy_provider.rates, 
            {
                'state': sale.service_address.state,
                'utility': sale.utility.name,
                'team_code': 'AFF',
                // 'service_class': sale.service_class.name
                'service_class': 'SC2'
        });

        if(!rate){
            return {error_msg: 'no rate found'};
        }

        let filtered_rates = [];

        for( let i=0; i < rates.length; i++ ){
            // if( Date.parse(rates[i].start_date) === Date.parse(sale.service_start_date_pretty) && Date.parse(rates[i].cut_off_date) >= Date.now() ){
            if( Date.parse(rates[i].start_date) === Date.parse('2/1/2017') && Date.parse(rates[i].cut_off_date) >= Date.parse('1/10/2017') ){
                if( sale.yearly_kwh > rates[i].annual_usage_min && sale.yearly_kwh < rates[i].annual_usage_max ){
                    filtered_rates.push(rates[i]);
                } 
            }
        };

        if( filtered_rates.length === 0 ){
            return {error_msg: 'no rate found after filtering'};
        }

        let rate = _.sortBy(filtered_rates, 'rate')[0]
        
        return rate
    });
};

// Sales List
exports.sales_list = function(req, res, next) {
    let user = req.session.user;
    // let user = {
    //     _id: ObjectId("5a7e269087cf600907bb3ae8"),
    //     admin: false,
    //     email : 'christian.cecilia1@gmail.com',
    //     password : '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
    //     retail_energy_provider : ObjectId('5a7e0075110dfbb0b28b7152')
    // }
    async.parallel({
        sales: function(callback){
            Sale.find({ agent: ObjectId("5a7e269087cf600907bb3ae8") })
            .sort({ date_created: -1 })
            .populate('subtype')
            .exec(callback);
        }
    },function(err, results){
        if(err){return next(err);}
        console.log(results.sales);
        
        let template_context = {
            title: 'Sales',
            sales: results.sales,
            user: user
        };

        res.render('sales', template_context);
    });
};

// new Sale: page
exports.new_sale = function(req, res, next) {
    // let user = req.session.user;
    let user = {
        _id: ObjectId("5a7e269087cf600907bb3ae8"),
        admin: false,
        email : 'christian.cecilia1@gmail.com',
        password : '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
        retail_energy_provider : ObjectId('5a7e0075110dfbb0b28b7152')
    }
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
        template_context = {
            title: 'New Sale',
            subtype_list: results.subtype_list,
            led_list: results.led_list,
            utility_list: results.utility_list,
            service_class_list: results.service_class_list,
            user: user
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
    // user = req.session.user;
    user = {_id: ObjectId("5a7e269087cf600907bb3ae8")};
    new_sale = new Sale({
        agent: user._id,
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
        bill_image: req.body.bill_image
    });

    // handle leds if present
    if(req.body.leds.length > 0){
        new_sale.leds = [];

        let leds = req.body.leds;

        for( i in leds ){
            Led.findById(leds[i].led_id, function(err, led){ 
                if(err){
                    res.json({
                        status: 500, 
                        error_msg: 'Failed to find LED info'
                    }); 
                    return next(err); 
                }

                // get kwh wattage reduction
                let installation_cost = 0;
                let led_wattage_reduction = led.wattage_difference * leds[i].led_count;
                let delamp_wattage_reduction = led.conventional_wattage * leds[i].delamping;
                let total_wattage_reduction = led_wattage_reduction + delamp_wattage_reduction
                let total_kWh_reduction = ( total_wattage_reduction * new_sale.annual_hours_of_operation ) / 1000

                // handle installation by qty of led being installed
                if( leds[i].installation ){
                    if( leds[i].led_count <= 50 ){
                        installation_cost = led.zero_to_fifty * leds[i].led_count
                    } else if( leds[i].led_count >= 51 && leds[i].led_count <= 200 ){
                        installation_cost = led.fifty_one_to_two_hundred * leds[i].led_count
                    } else if( leds[i].led_count >= 201 && leds[i].led_count <= 500 ){
                        installation_cost = led.two_hundred_one_to_five_hundred * leds[i].led_count
                    } else if( leds[i].led_count >= 501){
                        installation_cost = led.five_hundred_to_one_thousand * leds[i].led_count
                    } else {
                        res.json({status: 500, error: 'error calculating installation costs: LED bucket not found'});
                    }

                    // Premium Ceiling Multiplier
                    if( leds[i].ceiling_height === 1 ) {
                        // Add in premium ceiling height multiplier for being over 16 feet
                        installation_cost = installation_cost * led.premium_ceiling_multiplier
                    } 
                }

                let sale_led = {
                    name: led.name,
                    type: led.type,
                    image: led.image,
                    color: leds[i].color,
                    led_count: leds[i].led_count,
                    total_count: leds[i].total_lights,
                    not_replacing_count: leds[i].not_replacing,
                    delamping_count: leds[i].delamping,
                    wattage_reduction: total_kWh_reduction,
                    installation_required: leds[i].installation,
                    ceiling_height: leds[i].ceiling_height,
                    non_led_price: leds[i].non_led_price
                };

                // add led to sale
                new_sale.leds.push(sale_led)  
                new_sale.save(function(err){
                    if(err) { 
                        return next(err); 
                    }
                });
            });
        }
    } else {
        new_sale.save(function(err){
            if(err) { 
                return next(err); 
            }
            console.log('sale created');
        });
    }
    res.json({status: 200, sale_url: new_sale.sale_page});
};

// Sale
exports.sale = function(req, res, next) {
    // let user = req.session.user;
    let user = {
        _id: ObjectId("5a7e269087cf600907bb3ae8"),
        admin: false,
        email : 'christian.cecilia1@gmail.com',
        password : '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
        retail_energy_provider : ObjectId('5a7e0075110dfbb0b28b7152')
    }

    Sale.findById(req.params.id)
    .populate('subtype')
    .populate('utility', 'name')
    .populate('service_class')
    .populate({path: 'agent', populate: {path: 'retail_energy_provider'}})
    .exec(function(err, sale){
        if(err) {return next(err)}

        if( sale===null ) { 
            var err = new Error('Sale not found');
            err.status = 404;
            return next(err);
        }

        let rate;
        let rates = _.where(
            sale.agent.retail_energy_provider.rates, 
            {
                'state': sale.service_address.state,
                'utility': sale.utility.name,
                'team_code': sale.agent.team_code,
                'service_class': sale.service_class.name
        });
        console.log('rates', rates);
        let filtered_rates = [];

        for( let i=0; i < rates.length; i++ ){
            if( Date.parse(rates[i].start_date) === Date.parse(sale.service_start_date_pretty) && Date.parse(rates[i].cut_off_date) >= Date.now() ){
                if( sale.yearly_kwh > rates[i].annual_usage_min && sale.yearly_kwh < rates[i].annual_usage_max ){
                    filtered_rates.push(rates[i]);
                } 
            }
        };

        if( filtered_rates.length > 0 ){
            rate = _.sortBy(filtered_rates, 'rate')[0]
        }

        let template_context = {
            title: sale.business_name.toProperCase(),
            user: user,
            sale: sale,
            rate: rate
        };

        res.render('sale', template_context);
    });
};