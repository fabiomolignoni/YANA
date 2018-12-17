//=============================
//           IMPORT
//=============================
const express = require('express')
const http = require('https')
const router = express.Router()
var convert = require('xml-to-json-promise');
var endpoint = "https://www.theverge.com"

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//       GET GOOGLE NEWS
//=============================
router.get('/google', (req, res) => {
    theVergeXml2Json('/google/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
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
        xmlPage = ''
        // get xml data
        http.get(endpoint + path, function (vergeRes) {
            vergeRes.on("data", function (data) { // create xml file
                xmlPage += data
            });
            vergeRes.on('end', function () {
                convert.xmlDataToJSON(xmlPage).then(jsonPage => { // parse xml to json
                    var resJson = {}
                    // basic informations 
                    resJson.title = jsonPage.feed.title[0]
                    resJson.link = jsonPage.feed.link[0].$.href
                    resJson.lastModified = new Date(jsonPage.feed.updated[0])
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
                    resJson.news = allNews
                    resolve(resJson)
                }).catch(e => {
                    reject(Error("internal error"))
                })
            })
        }).on('error', function (e) {
            reject(Error("internal error"))
        })
    })
}
module.exports = router