//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const newsActions = require('../modules/news_actions')
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
    newsActions.postNews(req.body).then(result => {
        res.status(201).json(result)
    })
})

//=============================
//        GET v1/news
// return news that match the parameters
//=============================
router.get('/', function (req, res) {
    newsActions.getNewsWithParameters(req.query).then(result => {
        res.status(200).json(result)
    })
})

module.exports = router