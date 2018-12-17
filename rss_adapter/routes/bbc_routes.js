//=============================
//           IMPORT
//=============================
const express = require('express')
const http = require('http')
const router = express.Router()
var convert = require('xml-to-json-promise');
var endpoint = "http://feeds.bbci.co.uk/news"

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//        GET WORLD NEWS
//=============================
router.get('/world', (req, res) => {
    bbcXml2Json('/world/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

function bbcXml2Json(path) {
    return new Promise(function (resolve, reject) {
        xmlPage = ''
        // get xml data
        http.get(endpoint + path, function (bbcRes) {
            bbcRes.on("data", function (data) { // create xml file
                xmlPage += data
            });
            bbcRes.on('end', function () {
                convert.xmlDataToJSON(xmlPage).then(jsonPage => { // parse xml to json
                    // basic informations            
                    var resJson = {}
                    resJson.title = jsonPage.rss.channel[0].title[0]
                    resJson.link = jsonPage.rss.channel[0].link[0]
                    resJson.lastModified = new Date(jsonPage.rss.channel[0].lastBuildDate[0])
                    //create array of news
                    var news = []
                    for (let item of jsonPage.rss.channel[0].item) {
                        currentNews = {}
                        currentNews.title = item.title[0]
                        currentNews.body = item.description[0]
                        currentNews.url = item.link[0]
                        currentNews.datetime = new Date(item.pubDate[0])
                        news.push(currentNews)
                    }
                    resJson.news = news
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
