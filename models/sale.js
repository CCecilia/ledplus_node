const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const User = require('../models/user');
const ServiceClass = require('../models/serviceClass');
const Utility = require('../models/utility');
const SubType = require('../models/subType');
const async = require('async');

let SaleSchema = new Schema({
    agent: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date_created: {
        type: Date, 
        default: Date.now
    },
    business_name: {
        type: String,
        required: true
    },
    authorized_representative: {
        type: String,
        required: true
    },
    service_address:{
        street_address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String,
            max: 2,
            uppercase: true
        },
        zip_code: {
            type: String,
        }
    },
    billing_address: {
        street_address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String,
            max: 2,   
            uppercase: true
        },
        zip_code: {
            type: String,
        }            
    },
    subtype: {
        type: Schema.ObjectId,
        ref: 'SubType',
        required: false
    },
    annual_hours_of_operation: {
        type: Number
    },
    leds: {
        type: Array
    },
    utility: {
        type: Schema.ObjectId,
        ref: 'Utility'
    },
    zone: {
        type: String
    },
    service_class: {
        type: Schema.ObjectId,
        ref: 'ServiceClass'
    },
    account_number: {
        type: String
    },
    service_start_date: {
        type: Date
    },
    monthly_kwh: {
        type: Number
    },
    yearly_kwh: {
        type: Number
    },
    supply_charges: {
        type: Number
    },
    delivery_charges: {
        type: Number
    },
    bill_image: {
        type: String
    }
});


SaleSchema.virtual('sale_page').get(function(){
    let id = this._id;
    return `/sales/sale/${id}/`;
});

SaleSchema.virtual('date_created_pretty').get(function(){
    return moment(this.date_created).format('MMMM DD, YYYY');
});

SaleSchema.virtual('service_start_date_pretty').get(function(){
    return moment(this.date_created).format('MM/DD/YYYY');
});

SaleSchema.virtual('calculations').get(function(){
    let maintenance_cost = 0;
    let wattage_reduction_total = 0;
    
    for(let i = 0; i < this.leds.length; i++){
        maintenance_cost += (this.leds[i].delamping_count + this.leds[i].led_count) * this.leds[i].non_led_price
        wattage_reduction_total += this.leds[i].wattage_reduction
    }

    let projected = this.yearly_kwh - wattage_reduction_total

    let calculations = {
        annual_maintenance_cost: maintenance_cost,
        annual_consumption_reduction: wattage_reduction_total,
        projected_usage: projected
    };

    return calculations;
});

SaleSchema.virtual('supply_rate').get(function(){
    return this.supply_charges / this.monthly_kwh;
});

SaleSchema.virtual('delivery_rate').get(function(){
    return this.delivery_charges / this.monthly_kwh;
});


module.exports = mongoose.model('Sale', SaleSchema);