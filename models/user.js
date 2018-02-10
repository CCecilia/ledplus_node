const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    retail_energy_provider: {
        type: Schema.ObjectId,
        ref: 'RetialEnergyProvider',
        required: true
    },
    admin: {
        type: Boolean, 
        default: false
    }
});

UserSchema.virtual('dashboard').get(function(){
    let id = this._id;
    return `/users/dashboard/${id}/`;
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);