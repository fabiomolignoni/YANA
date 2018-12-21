//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
var convert = require('xml-to-json-promise')
const request = require('request')

var endpoint = "http://feeds.bbci.co.uk/news"
var pages = ['/world', '/uk', '/business', '/politics',
    '/health', '/education', '/science_and_environment', '/technology', '/entertainment_and_arts']
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
        prom.push(bbcXml2Json(endpoint + page + "/rss.xml"))
    }
    Promise.all(prom).then(results => {
        let finalJson = {}
        finalJson.title = "BBC - News"
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
//       BBC XML 2 JSON
// Get the xml file from http://<endpoint>/<path>
// It converts the xml into suitable json
// Returns a promise
//=============================
function bbcXml2Json(path) {
    return new Promise(function (resolve, reject) {
        xmlPage = ''
        // get xml data
        request(path, function (error, response, body) {
            convert.xmlDataToJSON(body).then(jsonPage => {
                var news = []
                for (let item of jsonPage.rss.channel[0].item) {
                    currentNews = {}
                    currentNews.title = item.title[0]
                    currentNews.body = item.description[0]
                    currentNews.url = item.link[0]
                    currentNews.datetime = new Date(item.pubDate[0])
                    news.push(currentNews)
                }
                resolve(news)
            }).catch(e => {
                console.log(e)
                reject(Error("internal error"))
            })
        })
    })
}

module.exports = router
