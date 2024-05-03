const {User} = require('../../../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');

describe('userSchmea.methods.generateAuthToken', () => {
    it('should return a vaild JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        }
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        expect(decoded).toMatchObject(payload);
    });
});