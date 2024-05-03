const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const {User} = require('../models/users');
const express = require('express');
const router = express.Router();

function validate(req){
    const schema = {
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(3).required()
    }
    return Joi.validate(req, schema);
}

router.post('/', async (req, res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Invaild Email or Password');

        const vaildPassword = await bcrypt.compare(req.body.password, user.password);
        if(!vaildPassword) return res.status(400).send('Invaild Email or Password');

        const token = user.generateAuthToken();
        res.send(token);
});


module.exports = router;