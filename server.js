"use strict";

    // See:
// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// https://scotch.io/tutorials/scraping-the-web-with-node-js and
// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4





// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');

let biblegateway = require('./biblegateway-routes');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
let router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here


router.route('/versions')
    .get(biblegateway.getVersions);


router.route('/search/:version/:term')
    .get(biblegateway.search);


// Genesis 4:32-12
router.route('/passage/:version/:PassageReference')
    .get(biblegateway.getPassageByReference);

// Genesis/4/32-12
router.route('/passage/:version/:book/:chapter/:verse')
    .get(biblegateway.getPassageByBookChapterVerse);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Biblegateway-api listening on port ' + port);

module.exports = app; // for testing

