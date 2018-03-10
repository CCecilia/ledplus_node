const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    retail_energy_provider: {
        type: Schema.ObjectId,
        ref: 'RetailEnergyProvider',
        required: true
    },
    team_code: {
        type: String,
        default: 'ALL'
    },
    admin: {
        type: Boolean, 
        default: false
    }
});

UserSchema.virtual('dashboard').get(function () {
    return `/users/dashboard/${this._id}/`
});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);