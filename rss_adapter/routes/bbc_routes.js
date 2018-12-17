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

//=============================
//        GET UK NEWS
//=============================
router.get('/uk', (req, res) => {
    bbcXml2Json('/uk/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET BUSINESS NEWS
//=============================
router.get('/business', (req, res) => {
    bbcXml2Json('/business/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET POLITICS NEWS
//=============================
router.get('/politics', (req, res) => {
    bbcXml2Json('/politics/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//      GET HEALTH NEWS
//=============================
router.get('/health', (req, res) => {
    bbcXml2Json('/health/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//    GET EDUCATION NEWS
//=============================
router.get('/education', (req, res) => {
    bbcXml2Json('/education/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
// ZGET SCIENCE/ENVIRONMENT NEWS
//=============================
router.get('/science_and_environment', (req, res) => {
    bbcXml2Json('/science_and_environment/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//    GET TECHNOLOGY NEWS
//=============================
router.get('/technology', (req, res) => {
    bbcXml2Json('/technology/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
// GET ENTERTAINMENT/ARTS NEWS
//=============================
router.get('/entertainment_and_arts', (req, res) => {
    bbcXml2Json('/entertainment_and_arts/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
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
