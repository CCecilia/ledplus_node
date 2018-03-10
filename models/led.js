const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LedSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        max: 20,
        default: 'tube'
    },
    ballast: {
        type: String,
        max: 20,
        default: 'Electronic'
    },
    pricing: {
        net_cost: {
            type: Number,
            required: true
        },
        sale_price: {
            type: Number,
            required: true
        },
        non_led_price: {
            type: Number,
            required: true
        }
    },
    image: {
        type: String,
        default: 'https://s3.amazonaws.com/billphotos/1493933050964T8-LED-Tube-Lighting-series-family.png'
    },
    wattage: {
        type: Number,
        required: true
    },
    conventional_wattage: {
        type: Number,
        required: true
    },
    order_number: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    installation_costs: {
        zero_to_fifty:{
            type: Number,
            default: 0.00
        },
        fifty_one_to_two_hundred:{
            type: Number,
            default: 0.00
        },
        two_hundred_one_to_five_hundred:{
            type: Number,
            default: 0.00
        },
        five_hundred_to_one_thousand:{
            type: Number,
            default: 0.00
        },
        min_visit_cost:{
            type: Number,
            default: 125.00
        },
        premium_ceiling_multiplier:{
            type: Number,
            default: 1.25
        }
    },
    brands: {
        type: Array
    },
    colors: {
        type: Array,
        default: ['5000K', '2700K']
    },
    lumens: {
        type: String,
    },
    rated_average_life: {
        type: String
    }
});

LedSchema.virtual('wattage_difference').get(() => {
    return this.conventional_wattage - this.wattage;
});

LedSchema.virtual('detail_page').get(() => {
    return `/LEDs/details/${this._id}`;
});



module.exports = mongoose.model('Led', LedSchema);