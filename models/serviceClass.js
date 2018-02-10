const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ServiceClassSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ServiceClass', ServiceClassSchema);