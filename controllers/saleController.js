const User = require('../models/user');
const ServiceClass = require('../models/serviceClass');
const Utility = require('../models/utility');
const SubType = require('../models/subType');
const Led = require('../models/led');
const Sale = require('../models/sale');
const ResidentialSale = require('../models/residentialSale');
const StateRate = require('../models/stateRate');
const AnnualScaler = require('../models/annualConsumptionScaler');
const RetailEnergyProvider = require('../models/retailEnergyProvider');
const Brand = require('../models/brand');
const async = require('async');
const _ = require('underscore');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug')('sale');
// const fileUpload = require('express-fileupload');
// const fs = require('fs');
const moment = require('moment');

// titling
String.prototype.toProperCase = () => {
    return this.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Sales List
exports.sales_list = (req, res, next) => {
    async.parallel({
        sales: (callback) => {
            if(req.session.user.admin){
                Sale.find()
                .populate('subtype')
                .exec(callback);
            } else {
                Sale.find({ agent: req.session.user._id })
                .populate('subtype')
                .exec(callback);
            }  
        },
        resi_sales: (callback) => {
            ResidentialSale.find()
            .populate('company.retail_energy_provider', 'name')
            .populate('company.brand', 'name')
            .populate('utility', 'name')
            .exec(callback);
        }
    }, (err, results) => {
        if(err){
            debug(`error @ sales list: ${err}`);
            return next(err);
        }
        
        let template_context = {
            title: 'Sales',
            sales: results.sales,
            user: req.session.user,
            resi_sales: results.resi_sales
        };

        res.render('sales', template_context);
    });
};

// new Sale: page
exports.new_sale = (req, res, next) => {
    async.parallel({
        subtype_list: (callback) => {
            SubType.find()
            .sort({name: 1})
            .exec(callback);
        },
        utility_list: (callback) =>  {
            Utility.find()
            .sort({name: 1})
            .exec(callback);
        },
        service_class_list: (callback) =>  {
            ServiceClass.find()
            .sort({name: 1})
            .exec(callback);
        },
        led_list: (callback) => {
            Led.find()
            .sort({order_number: 1})
            .exec(callback);
        }
    }, (err, results) => {
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
exports.estimate_yearly = (req, res, next) => {
    let weight = 0.0804;  // default weight
    AnnualScaler.findOne({
        state: String(req.body.state).toUpperCase(),
        utility: ObjectId(req.body.utility),
        service_class: ObjectId(req.body.service_class)
    }).exec((err, found_scaler) => {
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
exports.create = (req, res, next) => {
    let new_sale = new Sale({
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
    new_sale.save((err) => {
        if(err){
            debug(`error @ create sale: ${err}`);
            return next(err);
        }
        res.json({status: 200, sale_url: new_sale.sale_page});
    });
};

// Sale
exports.sale = (req, res, next) => {
    async.parallel({
        sale: (callback) => {
            Sale.findById(req.params.id)
            .populate('subtype')
            .populate('utility', 'name')
            .populate('service_class')
            .populate({path: 'agent', populate: {path: 'retail_energy_provider'}})
            .exec(callback);
        },
        state_rate: (callback) => {
            Sale.findById(req.params.id, {'service_address.state': 1})
            .exec((err, sale) => {
                if(err){
                    debug(`error @ finding state rate: ${err}`);
                }
                StateRate.findOne({state: sale.service_address.state})
                .exec(callback);
            }); 
        }
    }, (err, results) => {
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

// Resi Sales Upload: pending
exports.handle_pending_sale = (req, res, next) => {
    async.parallel({
        retail_energy_provider: (callback) => {
            RetailEnergyProvider.findOne({name: req.body.company}, {_id: 1})
            .exec(callback);
        },
        brand: (callback) => {
            Brand.findOne({name: req.body.brand}, {_id: 1})
            .exec(callback);
        },
        existing_customer_check: (callback) => {
            ResidentialSale.findOne(
                {$or: [
                    {"account_number.utility_account": req.body.utility_account_number}, 
                    {"account_number.rep_account": req.body.rep_customer_id}
                ]
            })
            .exec(callback);
        },
        utility: (callback) => {
            Utility.findOne({name: req.body.utility}, {_id: 1})
            .exec(callback);
        }
    }, (err, results) =>{
        if( err ){
            debug(`error @ resi sales upload: ${err}`);
            req.body.error_msg = 'Error during sale extrapalation';
            return res.send({status: 500, sale: req.body});
        }

        if( !results.retail_energy_provider ){
            req.body.error_msg = 'Failed to identify REP';
            return res.send({status: 500, sale: req.body});
        }

        if( !results.brand ){
            req.body.error_msg = 'Failed to identify brand';
            return res.send({status: 500, sale: req.body});
        }
                    
        if( !results.utility ){
            req.body.error_msg = 'Failed to identify utility';
            return res.send({status: 500, sale: req.body});
        }

        // update existing sale
        if( results.existing_customer_check ){
                sale_to_update.name.first_name = req.body.first_name;
                sale_to_update.name.last_name = req.body.last_name;
                sale_to_update.address.street_address = req.body.address_line_one;
                sale_to_update.address.street_address_line_two = req.body.address_line_two;
                sale_to_update.address.city = req.body.city;
                sale_to_update.address.state = req.body.state;
                sale_to_update.address.zip_code = req.body.state;
                sale_to_update.utility = results.utility._id;
                sale_to_update.account_number.utility_account = req.body.utility_account_number;
                sale_to_update.account_number.rep_account = req.body.rep_customer_id;

                if( req.body.cancellation_date ){
                    sale_to_update.status.enrolled = false
                    sale_to_update.status.canceled = true
                    sale_to_update.status.cancellation_date = Date(req.body.cancellation_date);
                }

                sale_to_update.shipping.ship_date.projected = Date(req.body.projected_ship_date);
                sale_to_update.shipping.packages = req.body.number_of_packages;
                sale_to_update.shipping.led_package = req.body.led_type;


                res.send({status: 200});
        } else {
            let new_sale = new ResidentialSale({
                name: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                },
                address: {
                    street_address: req.body.address_line_one,
                    street_address_line_two: req.body.address_line_two,
                    city: req.body.city,
                    state: req.body.state,
                    zip_code: req.body.zip_code,
                },
                status: {
                    enrollment_date: Date(req.body.enrollment_date)
                },
                shipping: {
                        ship_date: {
                        projected: Date(req.body.projected_ship_date),
                        packages: req.body.number_of_packages,
                        led_package: req.body.led_type
                    }
                },
                utility: results.utility._id,
                account_number: {
                    utility_account: req.body.utility_account_number,
                    rep_account: req.body.rep_customer_id
                },
                company: {
                    retail_energy_provider: results.retail_energy_provider._id,
                    brand: results.brand._id,
                    channel: req.body.channel
                },
                last_updated: Date.now()
            });

            // Create new
            new_sale.save((err, sale_created) => {
                if( err ){
                    req.body.error_msg = `Failed to save: ${err}`;
                    return res.send({status: 500, sale: req.body});
                }
                req.body._id = sale_created._id;
                res.send({status: 201,  sale:req.body});
            }); 
        }
    });
};