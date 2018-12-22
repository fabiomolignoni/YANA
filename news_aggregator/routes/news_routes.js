//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const request = require('request')
require('dotenv').config()

//=============================
//     VARIABLES FROM ENV
//=============================
const rss_adapter_endpoint = process.env.RSS_ADAPTER || 'localhost:8081/v1'

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/', (req, res) => {

})

function postTheVergeRSSFeed(page) {
    return new Promise(function (resolve, reject) {
        request.get(rss_adapter_endpoint + "/theverge/" + page, function (error, response, body) {
            let recieved = JSON.parse(body)
            request.post({
                url: "https://" + news_logic_endpoint + "/v1/news",
                body: recieved.news,
                json: true
            }, function (err, res, bod) {
                resolve(JSON.parse(body))
            })
        })
    })
}
module.exports = router