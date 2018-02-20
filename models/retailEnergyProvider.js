const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RetailEnergyProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rates: {
        type: Array
    }
});

module.exports = mongoose.model('RetailEnergyProvider', RetailEnergyProviderSchema);