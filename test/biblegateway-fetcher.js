"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let bible = require('../biblegateway-fetcher');
let should = chai.should();

/*
 * Test the getVersions function
 */
describe('getVersions', () => {
    it('should GET all the versions', (done) => {
        bible.getVersions().then((data) => {
            /*res.should.have.status(200);*/
            data.hasOwnProperty("status");
            data.status.should.be.eql("ok");

            data.should.have.all.keys(['status', 'languages', 'versions']);

            data.languages.should.be.a('array');
            data.languages.length.should.be.above(0);
            data.languages.should.deep.include({
                "shortcode": "EN",
                "defaultVersion": "KJ21",
                "name": "—English (EN)—"
            });

            data.versions.should.be.a('array');
            data.versions.length.should.be.above(0);
            data.versions.should.deep.include({
                "id": "KJ21",
                "name": "21st Century King James Version (KJ21)",
                "lang": "EN"
            });

            done();

        });
    });
});

/*
* Test the search function
*/
describe('search', () => {
    it('should return searchdata', (done) => {
        bible.search("In the beginning God created the heaven and the earth.", "KJ21").then((data) => {
        /*res.should.have.status(200);*/
        data.hasOwnProperty("status");
        data.status.should.be.eql("ok");

        data.should.have.all.keys(['status', 'version', 'searchTerm', 'result']);

        data.result.should.be.a('array');
        data.result.length.should.be.above(0);
        data.result.should.deep.include({ title: 'Genesis 1:1',
            context: 'Genesis 1:1-3',
            chapter: 'Genesis 1',
            text: 'In the beginning God created the heaven and the earth.' }
        );
        done();

        });
    });
});

/*
 * Test the search function
 */
describe('getPassageByReference', () => {
    it('should return verse', (done) => {
        bible.getPassageByReference("Gen 1:1", "KJ21")

        .catch( (reason) => {
            console.log("promise was rejected due to " + reason);
            done();
        })

        .then((data) => {
            console.log(data);
            data.hasOwnProperty("status");
            data.status.should.be.eql("ok");

            data.hasOwnProperty("message");
            data.message.should.be.eql("Success");

            data.should.have.all.keys(['status', 'message', 'verses']);

            data.verses.should.be.a('array');
            data.verses.length.should.be.above(0);
            data.verses.should.deep.include({ id: 'Gen-1-1',
                    book: 'Gen',
                    chapter: '1',
                    verse: '1',
                    version: 'KJ21',
                    text: 'In the beginning God created the heaven and the earth.' }
            );
            done();

        });


    });
});


