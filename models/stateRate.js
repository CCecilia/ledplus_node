const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StateRateSchema = new Schema({
    state: {
        type: String,
        max: 2,
        uppercase: true,
        required: true
    },
    supply_rate: {
        type: Number,
        required: true
    },
     delivery_rate: {
        type: Number,
        default: 0
     }
});

module.exports = mongoose.model('StateRate', StateRateSchema);