//=============================
//           IMPORT
//=============================
const request = require('request')
require('dotenv').config()

//=============================
//     VARIABLES FROM ENV
//=============================
const news_headlines_endpoint = process.env.NEWS_HEADLINES || 'localhost:8080/v1'

//=============================
//      GET ALL SOURCES
// performs a get to the service news_headline and takes the sources
//=============================
var getAllSources = function () {
    return new Promise(function (resolve, reject) {
        request(news_headlines_endpoint + "/sources", function (err, response, body) {
            resolve(JSON.parse(body))
        })
    })
}

//=============================
//      GET SINGLE SOURCES
// performs a get to the service news_headline and takes a particular source
// if it doesn't exist, it returns an error via rejection
//=============================
var getSingleSource = function (id) {
    return new Promise(function (resolve, reject) {
        request(news_headlines_endpoint + "/sources/" + id, function (err, response, body) {
            if (response.statusCode != 200) {
                reject("internal error")
            } else {
                let res = JSON.parse(body)
                if (res.length == 0) {
                    reject("Source not found")
                } else {
                    resolve(res)
                }
            }
        })
    })
}

module.exports.getAllSources = getAllSources
module.exports.getSingleSource = getSingleSource