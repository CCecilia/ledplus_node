const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    customer_data: {
        renewal: {
            type: Boolean,
            default: false
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
                max: 2
            },
            zip_code: {
                type: Number,
            }
        },
        subtype: {
            type: Schema.ObjectId,
            ref: 'Subtype',
            required: true
        },
        annual_hours_of_operation: {
            type: Number
        }
    },
    leds: {
        type: Array,
        required: false

    },
    bill_data: {
        billing_address: {
            street_address: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String,
                max: 2
            },
            zip_code: {
                type: Number,
            }            
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
        bill_type: {
            type: String
        },
        service_start_date: {
            type: Date
        },
        kwh: {
            type: Number
        },
        supply_charges: {
            type: Number
        },
        delivery_charges: {
            type: Number
        }
    }
});

module.exports = mongoose.model('Sale', SaleSchema);