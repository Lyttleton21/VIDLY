const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchmea = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength:3,
        maxlength:255
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        minlength:3,
        maxlength:1024
    }
});

userSchmea.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, process.env.JWTPRIVATEKEY);
    return token;
}

const User = mongoose.model('user', userSchmea);

function validateUser(user){
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(3).required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;