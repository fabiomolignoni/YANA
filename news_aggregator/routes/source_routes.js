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
const news_headlines_endpoint = process.env.NEWS_HEADLINES || 'localhost:8080/v1'

router.get('/', (req, res) => {
    request(news_headlines_endpoint + "/sources", function (err, response, body) {
        res.json(JSON.parse(body))
    })
})

router.get('/:id', (req, res) => {
    request(news_headlines_endpoint + "/sources/" + req.params.id, function (err, response, body) {
        res.json(JSON.parse(body))
    })
})

module.exports = router