//=============================
//           IMPORT
//=============================
const express = require('express')
const request = require('request')
const router = express.Router()
var convert = require('xml-to-json-promise');

var endpoint = "https://www.theverge.com"
var pages = ['/google', '/apple', '/apps', '/culture', '/microsoft', '/photography', '/policy', '/web']

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get("/", (req, res) => {
    let prom = []
    for (page of pages) {
        prom.push(theVergeXml2Json(endpoint + page + "/rss/index.xml"))
    }
    Promise.all(prom).then(results => {
        console.log(results.length)
        let finalJson = {}
        finalJson.title = "The Verge - News"
        let news = []
        for (x of results) {
            news = news.concat(x)
        }
        finalJson.totalResults = news.length
        finalJson.news = news
        res.status(200).json(finalJson)
    }).catch(e => {
        console.log(e)
        res.status(500).send({ "errors": [{ "msg": "Internal error" }] })
    })
})
//=============================
//     THE VERGE XML 2 JSON
// Get the xml file from https://<endpoint>/<path>
// It converts the xml into suitable json
// Returns a promise
//=============================
function theVergeXml2Json(path) {
    return new Promise(function (resolve, reject) {
        request(path, function (error, response, body) {
            convert.xmlDataToJSON(body).then(jsonPage => {
                allNews = []
                for (entry of jsonPage.feed.entry) {
                    actualNews = {}
                    actualNews.datetime = new Date(entry.updated)
                    actualNews.title = entry.title[0]
                    actualNews.body = entry.content[0]._
                    actualNews.url = entry.link[0].$.href
                    actualNews.author = entry.author[0].name[0]
                    allNews.push(actualNews)
                }
                resolve(allNews)
            }).catch(e => {
                console.log(e)
                reject(Error("internal error"))
            })
        })
    })
}
module.exports = router