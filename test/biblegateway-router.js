"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

/*
 * Test the /GET versions route
 *
describe('/GET versions', () => {
    it('should GET all the versions', (done) => {
        chai.request(server)
        .get('/biblegateway-api/versions')
        .end((err, res) => {

            res.should.have.status(200);
            res.body.hasOwnProperty("status");
            res.body.status.should.be.eql("ok");

            res.body.should.have.all.keys(['status', 'languages', 'versions']);



            res.body.languages.should.be.a('array');
            res.body.languages.length.should.be.above(0);
            res.body.languages.should.deep.include({
                "shortcode": "EN",
                "defaultVersion": "KJ21",
                "name": "—English (EN)—"
            });

            res.body.versions.should.be.a('array');
            res.body.versions.length.should.be.above(0);
            res.body.versions.should.deep.include({
                "id": "KJ21",
                "name": "21st Century King James Version (KJ21)",
                "lang": "EN"
            });

            done();
        });
    });
});



/*
 * Test the /GET versions route
 *
describe('/GET versions', () => {
    it('should GET all the versions', (done) => {
        chai.request(server)
        .get('/biblegateway-api/versions')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.all.keys(['status', 'languages', 'versions']);

            res.body.status.should.be.eql("ok");

            res.body.languages.should.be.a('array');
            res.body.languages.length.should.be.above(0);
            res.body.languages.should.deep.include({
                "shortcode": "EN",
                "defaultVersion": "KJ21",
                "name": "—English (EN)—"
            });

            res.body.versions.should.be.a('array');
            res.body.versions.length.should.be.above(0);
            res.body.versions.should.deep.include({
                "id": "KJ21",
                "name": "21st Century King James Version (KJ21)",
                "lang": "EN"
            });

            done();
        });
    });
});
    */