const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SubTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    estimated_hours: {
        monday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        },
        tuesday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        },
        wednesday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        },
        thursday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        },
        friday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        },
        saturday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        },
        sunday: {
            type: Number,
            default: 0,
            min: 0,
            max: 24
        }, 
        total: {
            type: Number,
            default: 0,
            min: 0,
            max: 8760,
        }
    }
});

module.exports = mongoose.model('SubType', SubTypeSchema);