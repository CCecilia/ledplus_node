const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AnnualConsumptionScalerSchema = new Schema({
    state: {
        type: String,
        max: 2
    },
    utility: {
        type: Schema.ObjectId,
        ref: 'Utility'
    },
    service_class: {
        type: Schema.ObjectId,
        ref: 'ServiceClass'
    },
    zone: {
        type: String
    },
    month:{
        january: {
            type: Number
        },
        february: {
            type: Number
        },
        march: {
            type: Number
        },
        april: {
            type: Number
        },
        may: {
            type: Number
        },
        june: {
            type: Number
        },
        july: {
            type: Number
        },
        august: {
            type: Number
        },
        september: {
            type: Number
        },
        october: {
            type: Number
        },
        november: {
            type: Number
        },
        december: {
            type: Number
        },
    }
});

module.exports = mongoose.model('AnnualConsumptionScaler', AnnualConsumptionScalerSchema);