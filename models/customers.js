const mongoose = require('mongoose');
const Joi = require('joi');
const boolean = require('joi/lib/types/boolean');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50
    },
    isGold: {
        type: Boolean, 
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50
    }
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(course) {
    const schema = {
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

function updateValidateCustomer(course) {
    const schema = {
        name: Joi.string().min(3),
        isGold: Joi.boolean(),
        phone: Joi.string().min(3)
    };
    return Joi.validate(course, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.updateValidateCustomer = updateValidateCustomer;