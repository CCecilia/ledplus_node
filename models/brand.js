const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        max: 2,
        uppercase: true
    },
    retail_energy_provider: {
        type: Schema.ObjectId,
        ref: 'RetailEnergyProvider',
        required: true
    },
    logo: {
        type: String
    }
});

module.exports = mongoose.model('Brand', BrandSchema);