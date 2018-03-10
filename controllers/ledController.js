const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const Led = require('../models/led');

// LEDs: list
exports.led_list = (req, res, next) => {
    Led.find()
    .exec((err, led_list) => {
        if(err){ return next(err); }

        let template_context = {
            title: 'LEDs',
            user: req.session.user,
            led_list: led_list
        };

        res.render('led_list', template_context);
    });
};

// LEDs: detail
exports.led_detail = (req, res, next) => {
    Led.findById(req.params.id)
    .exec(function(err, led){
        if(err){ return next(err); }

        if(led == null) { 
            var err = new Error('LED not found');
            err.status = 404;
            return next(err);
        }
        console.log('brands', led.brands);

        let template_context = {
            title: led.name,
            led: led,
            user: req.session.user
        };
        res.render('led_detail', template_context);
    });
};

// LEDs: update
exports.led_update = [
    // validate
    body('name', 'Name required').isLength({ min: 1 }).trim(),
    body('type', 'type required').isIn(['tube', 'u-bend tube', 'lamp', 'candelabra', 'spot', 'flood', 'flood (outdoor)', 'track', '4 pin', 'fixture']),
    body('ballast', 'ballast required').isIn(['electronic', 'magnetic']),
    body('wattage', 'wattage required').isInt(),
    body('conventional_wattage', 'conventional wattage required').isInt(),
    body('order_number', 'order number required').isInt(),
    body('avg_rated_life', 'avg rated life required').isLength({ min: 1 }).trim(),
    body('lumens', 'lumens required').isLength({ min: 1 }).trim(),
    body('zero_to_fifty', 'installation 0-50 required').exists(),
    body('fifty_one_to_two_hundred', 'installation 51-200 required').exists(),
    body('two_hundred_one_to_five_hundred', 'installation 201-500 required').exists(),
    body('five_hundred_to_one_thousand', 'installation 500-1000 required').exists(),
    body('min_visit_cost', 'min visit cost required').exists(),
    body('premium_ceiling_multiplier', 'premium ceiling multiplier required').exists(),
    body('brands', 'brand required').exists(),
    body('colors', 'color required').exists(),
    body('net_cost', 'net cost required').exists(),
    body('sale_price', 'sale price required').exists(),
    body('non_led_price', 'non led price required').exists(),
    body('zero_to_fifty', 'installation 0-50 must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('fifty_one_to_two_hundred', 'installation 51-200  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('two_hundred_one_to_five_hundred', 'installation 201-500  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('five_hundred_to_one_thousand', 'installation 500-1000  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('min_visit_cost', 'min visit cost  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('premium_ceiling_multiplier', 'premium ceiling multiplier  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('net_cost', 'net cost  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('sale_price', 'sale price  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('non_led_price', 'non led price  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    // Sanitize
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        Led.findById(req.params.id)
        .exec((err, led) => {
            if(err){ return next(err); }

            if(led == null) { 
                var err = new Error('LED not found');
                err.status = 404;
                return next(err);
            }
            let errors = validationResult(req);

            let template_context = {
                title: led.name,
                led: led
            };

            if( !errors.isEmpty() ){
                template_context.errors = errors.array();
                res.render('led_detail', template_context);
            } else {
                // update LED
                if(req.files.rep_logo){
                    let bitmap = req.files.led_image.data.toString('base64');
                    let mimetype = req.files.led_image.mimetype;
                    let encoded_image = `data:${mimetype};base64,${bitmap}`
                    led.image = encoded_image;
                }
                led.name = req.body.name;
                led.type = req.body.type;
                led.ballast = req.body.ballast;
                led.wattage = req.body.wattage;
                led.conventional_wattage = req.body.conventional_wattage;
                led.order_number = req.body.order_number;
                led.rated_average_life = req.body.avg_rated_life;
                led.lumens = req.body.lumens;
                led.installation_costs.zero_to_fifty = req.body.zero_to_fifty;
                led.installation_costs.fifty_one_to_two_hundred = req.body.fifty_one_to_two_hundred;
                led.installation_costs.two_hundred_one_to_five_hundred = req.body.two_hundred_one_to_five_hundred;
                led.installation_costs.five_hundred_to_one_thousand = req.body.five_hundred_to_one_thousand;
                led.installation_costs.min_visit_cost = req.body.min_visit_cost;
                led.installation_costs.premium_ceiling_multiplier = req.body.premium_ceiling_multiplier;
                led.brands = req.body.brands;
                led.colors = req.body.colors;
                led.pricing.net_cost = req.body.net_cost;
                led.pricing.sale_price = req.body.sale_price;
                led.pricing.non_led_price = req.body.non_led_price;

                led.save((err, updated_led) => {
                    if(err){ return next(err); }
                    template_context.led = updated_led;
                    res.render('led_detail', template_context);
                });
                

            }
        });
    }
];

// LEDs: create form
exports.led_create_form = (req, res, next) => {
    res.render('led_detail', {title: 'New LED', user: req.session.user});
};

// LEDs:create
exports.led_create = [
    // validate
    body('name', 'Name required').isLength({ min: 1 }).trim(),
    body('type', 'type required').isIn(['tube', 'u-bend tube', 'lamp', 'candelabra', 'spot', 'flood', 'flood (outdoor)', 'track', '4 pin', 'fixture']),
    body('ballast', 'ballast required').isIn(['electronic', 'magnetic']),
    body('wattage', 'wattage required').isInt(),
    body('conventional_wattage', 'conventional wattage required').isInt(),
    body('order_number', 'order number required').isInt(),
    body('avg_rated_life', 'avg rated life required').isLength({ min: 1 }).trim(),
    body('lumens', 'lumens required').isLength({ min: 1 }).trim(),
    body('zero_to_fifty', 'installation 0-50 required').exists(),
    body('fifty_one_to_two_hundred', 'installation 51-200 required').exists(),
    body('two_hundred_one_to_five_hundred', 'installation 201-500 required').exists(),
    body('five_hundred_to_one_thousand', 'installation 500-1000 required').exists(),
    body('min_visit_cost', 'min visit cost required').exists(),
    body('premium_ceiling_multiplier', 'premium ceiling multiplier required').exists(),
    body('brands', 'brand required').exists(),
    body('colors', 'color required').exists(),
    body('net_cost', 'net cost required').exists(),
    body('sale_price', 'sale price required').exists(),
    body('non_led_price', 'non led price required').exists(),
    body('zero_to_fifty', 'installation 0-50 must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('fifty_one_to_two_hundred', 'installation 51-200  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('two_hundred_one_to_five_hundred', 'installation 201-500  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('five_hundred_to_one_thousand', 'installation 500-1000  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('min_visit_cost', 'min visit cost  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('premium_ceiling_multiplier', 'premium ceiling multiplier  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('net_cost', 'net cost  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('sale_price', 'sale price  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    body('non_led_price', 'non led price  must be 0.00 format').matches(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    // Sanitize
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        let errors = validationResult(req);

        let template_context = {
            title: 'New LED',
        };

        if( !errors.isEmpty() ){
            template_context.errors = errors.array();
            res.render('led_detail', template_context);
        } else {
            let new_led = new Led({
                name: req.body.name,
                type: req.body.type,
                ballast: req.body.ballast,
                wattage: req.body.wattage,
                conventional_wattage: req.body.conventional_wattage,
                order_number: req.body.order_number,
                rated_average_life: req.body.avg_rated_life,
                lumens: req.body.lumens,
                installation_costs: {
                    zero_to_fifty: req.body.zero_to_fifty,
                    fifty_one_to_two_hundred: req.body.fifty_one_to_two_hundred,
                    two_hundred_one_to_five_hundred: req.body.two_hundred_one_to_five_hundred,
                    five_hundred_to_one_thousand: req.body.five_hundred_to_one_thousand,
                    min_visit_cost: req.body.min_visit_cost,
                    premium_ceiling_multiplier: req.body.premium_ceiling_multiplier
                },
                brands: req.body.brands,
                colors: req.body.colors,
                pricing: {
                    net_cost: req.body.net_cost,
                    sale_price: req.body.sale_price,
                    non_led_price: req.body.non_led_price
                },
                zero_to_fifty: req.body.zero_to_fifty,
                fifty_one_to_two_hundred: req.body.fifty_one_to_two_hundred,
                two_hundred_one_to_five_hundred: req.body.two_hundred_one_to_five_hundred,
                five_hundred_to_one_thousand: req.body.five_hundred_to_one_thousand,
                min_visit_cost: req.body.min_visit_cost,
                premium_ceiling_multiplier: req.body.premium_ceiling_multiplier,
                net_cost: req.body.net_cost,
                sale_price: req.body.sale_price,
                non_led_price: req.body.non_led_price,   
            });

            if( req.files.led_image ){
                let bitmap = req.files.led_image.data.toString('base64');
                let mimetype = req.files.led_image.mimetype;
                let encoded_image = `data:${mimetype};base64,${bitmap}`
                new_led.image = encoded_image;
            }
            new_led.save((err, led) => {
                if(err){
                    template_context.errors = [{msg: 'failed to create LED'}];
                    res.render('led_detail', template_context);
                }
                res.redirect(led.detail_page);
            });
            
        }   
    }
];

exports.remove = (req, res, next) => {
    Led.findByIdAndRemove(req.body.led_id, (err) => {
        if(err){ return next(err); }
        res.status(200).send();
    });
};