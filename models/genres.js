const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:5,
        maxlength:50,
        unique: true,
    }
});

const Genre = mongoose.model('genre', genreSchema);

function validateCourse(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateCourse = validateCourse;
exports.genreSchema = genreSchema;
