const mongoose = require('mongoose');
const winston = require('winston');

if(process.env.NODE_ENV === 'test') {
    module.exports = function(){
        mongoose.connect(process.env.DATABASE_TEST)
        .then(() => winston.info('Connected to MongoDB FOR TESTING......'))
        .catch(() => winston.error('UNABLE TO CONNECT MONGO...'));
    }
} else {
    module.exports = function(){
        mongoose.connect(process.env.DATABASE)
        .then(() => winston.info('Connected to MongoDB....'))
        .catch(() => winston.error('UNABLE TO CONNECT MONGO...'));
    }
}