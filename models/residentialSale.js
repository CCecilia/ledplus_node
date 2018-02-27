const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ResidentialSaleSchema = new Schema({
    name: {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        }
    },
    address:{
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
    ship_date: {
        projected: {
            type: Date
        },
        actual: {
            type: Date
        }
    },
    utility: {
        type: Schema.ObjectId,
        ref: 'Utility'
    },
    account_number: {
        utility_account: {
            type: String
        },
        rep_account: {
            type: String
        }
    },
    status: {
        enrolled: {
            type: Boolean,
            default: false
        },
        enrollent_date: {
            type: Date
        },
        canceled: {
            type: Boolean,
            default: false
        },
        cancellation_date: {
            type: Date
        }
    },
    shipping: {
        status: {
            type: String
        },
        frequency: {
            type: Number
        },
        shipments: {
            type: Number
        },
        packages: {
            type: Number
        },
        led_package: {
            type: String
        },
        tracking_number: {
            type: String
        }
    },
    company: {
        retail_energy_provider: {
            type: Schema.ObjectId,
            ref: 'RetailEnergyProvider'
        },
        brand: {
            type: Schema.ObjectId,
            ref: 'Brand'
        },
        channel: {
            type: String
        }
    },
    date_created: {
        type: Date, 
        default: Date.now
    },
    last_updated: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('ResidentialSale', ResidentialSaleSchema);