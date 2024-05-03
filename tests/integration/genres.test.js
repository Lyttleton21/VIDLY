const request = require('supertest');
const {Genre} = require('../../models/genres');
const {User} = require('../../models/users');
let server;

describe('/api/genres', () => {
    beforeEach(() => server = require('../../index'));
    afterEach(async() => {
        await server.close();
        await Genre.collection.deleteMany();
    });

    describe('GET /', () => {
        it('should return all genres',async () => {
            await Genre.collection.insertMany([
                { name: 'Genre1'},
                { name: 'Genre2'},
                { name: 'Genre3'},
            ]);

        const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            // expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'Genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({name: 'Genre1'});
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invaild id passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return 401 if user is not login', async () => {
            const res = await request(server)
            .post('/api/genres/')
            .send({name: 'genre5'});

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/genres/')
            .set('x-auth-token', token)
            .send({name: '1234'});

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            const token = new User().generateAuthToken();

            const name = new Array(52).join('a')

            const res = await request(server)
            .post('/api/genres/')
            .set('x-auth-token', token)
            .send({name: name});

            expect(res.status).toBe(400);
        });

        it('should save genre if it is vaild', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/genres/')
            .set('x-auth-token', token)
            .send({name: 'genre12'});

            const genre = await Genre.find({name: 'genre12'});
            expect(genre).not.toBeNull();
        });

        it('should return a genre if it is vaild', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/genres/')
            .set('x-auth-token', token)
            .send({name: 'genre12'});

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre12');
        });
    });
});

