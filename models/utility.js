const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UtilitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        max: 2,
        uppercase: true
    },
    max_account_digits: {
        type: Number,
        default: 12
    },
    zone_lookup: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Utility', UtilitySchema);