const {User} = require('../../models/users');
const request = require('supertest');
let server;

describe('auth middleware', () => {
    beforeEach(() => server = require('../../index'));
    afterEach(async() => {
         await server.close() });

    let token;

    const exec = () => {
        return request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({name: 'genre5'});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invaild', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is vaild', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});