//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const https = require('https')
require('dotenv').config()
//=============================
//     VARIABLES FROM ENV
//=============================
const headlines_endpoint = process.env.NEWSHEADLINES_URL | 'localhost:8080/v1'

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//        POST v1/news
// get a set of news and post them
// into the news_headlines ws.
// it also checks that that news
// is not already in the DB
//=============================
router.post('/', (req, res) => {

})


function getNews() {
    return new Promise(function (resolve, reject) {
        https
    })
}