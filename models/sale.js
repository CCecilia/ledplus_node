const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const _ = require('underscore');

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

    return moment(this.service_start_date).format('MM/DD/YYYY');
});

SaleSchema.virtual('calculations').get(function(){
    let maintenance_cost = 0;
    let wattage_reduction_total = 0;
    let supply_rate = this.supply_charges / this.monthly_kwh;
    let delivery_rate = this.delivery_charges / this.monthly_kwh;
    let estimated_annual_supply_charges = supply_rate * this.yearly_kwh
    let estimated_annual_delivery_charges = delivery_rate * this.yearly_kwh
    
    for(let i = 0; i < this.leds.length; i++){
        maintenance_cost += (this.leds[i].delamping_count + this.leds[i].led_count) * this.leds[i].non_led_price
        wattage_reduction_total += this.leds[i].wattage_reduction
    }

    let projected = this.yearly_kwh - wattage_reduction_total

    let calculations = {
        annual_maintenance_cost: maintenance_cost,
        annual_consumption_reduction: wattage_reduction_total,
        projected_usage: projected,
        supply_rate: supply_rate,
        delivery_rate: delivery_rate,
        estimated_annual_supply_charges: estimated_annual_supply_charges,
        estimated_annual_delivery_charges: estimated_annual_delivery_charges,
        estimated_annual_charges: estimated_annual_delivery_charges + estimated_annual_supply_charges,
    };

    return calculations;
});

SaleSchema.virtual('rate').get(function(){
    let rate;
    let total_installation_cost = 0;
    let rates = _.where(
        this.agent.retail_energy_provider.rates, 
        {
            'state': this.service_address.state,
            'utility': this.utility.name,
            'team_code': this.agent.team_code,
            'service_class': this.service_class.name
    });
    
    let filtered_rates = [];
    
    for( let i=0; i < rates.length; i++ ){
        if( Date.parse(rates[i].start_date) === Date.parse(this.service_start_date_pretty) && Date.parse(rates[i].cut_off_date) >= Date.now() ){
            if( this.yearly_kwh > rates[i].annual_usage_min && this.yearly_kwh < rates[i].annual_usage_max ){
                filtered_rates.push(rates[i]);
            } 
        }
    };
    
    if( filtered_rates.length > 0 ){
        rate = _.sortBy(filtered_rates, 'rate')[0]
    }

    for(let i = 0; i < this.leds.length; i++){
        console.log(this.leds[i]);
    }

    return rate;
});

module.exports = mongoose.model('Sale', SaleSchema);