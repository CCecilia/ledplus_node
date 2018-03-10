const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

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
        street_address_line_two: {
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
    utility: {
        type: Schema.ObjectId,
        ref: 'Utility'
    },
    account_number: {
        utility_account: {
            type: String,
            unique: true
        },
        rep_account: {
            type: String,
            unique: true
        }
    },
    status: {
        enrolled: {
            type: Boolean,
            default: true
        },
        enrollment_date: {
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
        ship_date: {
            projected: {
                type: Date
            },
            actual: {
                type: Date
            },
            next: {
                type: Date
            },
            last: {
                type: Date
            }
        },
        status: {
            type: String,
            default: 'pending'
        },
        frequency: {
            type: Number,
            default: 0
        },
        shipments: {
            type: Number,
            default: 0
        },
        packages: {
            type: Number,
            default: 0
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

ResidentialSaleSchema.virtual('full_name').get(function () {
    return `${this.name.first_name} ${this.name.last_name}`;
});

ResidentialSaleSchema.virtual('full_address').get(function () {
    return `${this.address.street_address} ${this.address.city} ${this.address.state} ${this.address.zip_code}`;
});

ResidentialSaleSchema.virtual('date_created_pretty').get(() => moment(this.date_created).format('MMMM DD, YYYY'));

module.exports = mongoose.model('ResidentialSale', ResidentialSaleSchema);