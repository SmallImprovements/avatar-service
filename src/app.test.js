const request = require('supertest');
const app = require('./app');
const assert = require('assert');

const BASE_URL = '/api/avatars';

binaryParser = (res, callback) => {
    res.setEncoding('binary');
    res.data = '';
    res.on('data', function(chunk) {
        res.data += chunk;
    });
    res.on('end', function() {
        callback(null, new Buffer(res.data, 'binary'));
    });
};

describe('Avatar service', () => {
    describe('SVG rendering', () => {
        it('should output the correct content type', done => {
            request(app)
                .get(BASE_URL + '/1/JH.svg')
                .expect(200)
                .expect('Content-Type', /image\/svg\+xml/)
                .end(done);
        });
        it('should handle HTML opening braces correctly', done => {
            request(app)
                .get(BASE_URL + '/5/<.svg')
                .expect(200)
                .expect('Content-Type', /image\/svg\+xml/)
                .end(done);
        });
        it('should render an SVG element', done => {
            request(app)
                .get(BASE_URL + '/5/KL.svg')
                .expect(200)
                .parse(binaryParser)
                .end((err, res) => {
                    if (/<svg(.|\n)*?<\/svg>/.test(res.body.toString())) done();
                    else done(new Error());
                });
        });
        it('should render a path element for available glyphs', done => {
            request(app)
                .get(BASE_URL + '/12/PF.svg')
                .expect(200)
                .parse(binaryParser)
                .end((err, res) => {
                    if (/<path(.|\n)*?\/>/.test(res.body.toString())) done();
                    else done(new Error());
                });
        });
        it('should render a text element for unavailable glyphs', done => {
            request(app)
                .get(BASE_URL + '/12/P%E6%A0%91.svg')
                .expect(200)
                .parse(binaryParser)
                .end((err, res) => {
                    if (/<text(.|\n)*?\>/.test(res.body.toString())) done();
                    else done(new Error());
                });
        });
        it('should always render a default color, even if `:index` is out of bounds', done => {
            request(app)
                .get(BASE_URL + '/182736178123761/AW.svg')
                .expect(200)
                .parse(binaryParser)
                .end((err, res) => {
                    if (/#ffeeee/.test(res.body.toString())) done();
                    else done(new Error());
                });
        });
    });
    describe('PNG rendering', () => {
        it('should render an PNG element', done => {
            request(app)
                .get(BASE_URL + '/5/KL.png')
                .expect(200)
                .expect('Content-Type', /image\/png/)
                .end(done);
        });
    });
    describe('Request validation', () => {
        it('should return an error if initials are longer then 2 chars', done => {
            request(app)
                .get(BASE_URL + '/15/ABC.svg')
                .expect(400)
                .end(done);
        });
    });
});
