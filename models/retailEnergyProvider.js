const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RetailEnergyProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('RetailEnergyProvider', RetailEnergyProviderSchema);