//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
var headline = require('..//models/headline');

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//    OPTIONS v1/headlines/*
//=============================
router.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

//=============================
//      POST v1/headlines
//=============================
router.post('/', function (req, res) {
    var headline = new Headline();      // create a new instance of headline
    // set headline parameters
    headline.source = req.body.source
    headline.author = req.body.author
    headline.title = req.body.title
    headline.url = req.body.url
    headline.imageUrl = req.body.imageUrl
    headline.datetime = req.body.datetime
    headline.body = req.body.body
    headline.tags = req.body.tags

    // save the bear and check for errors
    bear.save(function (err) {
        if (err)
            res.send(err);

        res.json({ message: 'Bear created!' });
    });

});

module.exports = router
