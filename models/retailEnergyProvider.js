const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RetailEnergyProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    rates: {
        type: Array
    },
    rep_margin: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('RetailEnergyProvider', RetailEnergyProviderSchema);