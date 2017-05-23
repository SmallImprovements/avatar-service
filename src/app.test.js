const request = require('supertest');
const app = require('./app');

describe('Avatar service', () => {
    describe('SVG rendering', () => {
        it('should output the correct content type', done => {
            request(app).get('/15/JH.svg').expect(200).expect('Content-Type', /image\/svg\+xml/).end(done);
        });
    });
    describe('Request validation', () => {
        it('should return an error if initials are longer then 2 chars', done => {
            request(app).get('/15/ABC.svg').expect(400).end(done);
        });
    });
});
