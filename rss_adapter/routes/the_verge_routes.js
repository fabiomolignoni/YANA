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
        prom.push(theVergeXml2Json(page + "/rss/index.xml"))
    }
    Promise.all(prom).then(results => {
        let finalJson = {}
        finalJson.title = "The Verge - News"
        let news = []
        for (x of results) {
            news = news.concat(x.news)
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
//     GET APPLE NEWS
//=============================
router.get('/apple', (req, res) => {
    theVergeXml2Json('/apple/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//       GET APPS NEWS
//=============================
router.get('/apps', (req, res) => {
    theVergeXml2Json('/apps/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//      GET CULTURE NEWS
//=============================
router.get('/culture', (req, res) => {
    theVergeXml2Json('/culture/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET MICROSOFT NEWS
//=============================
router.get('/microsoft', (req, res) => {
    theVergeXml2Json('/microsoft/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET PHOTOGRAPHY NEWS
//=============================
router.get('/photography', (req, res) => {
    theVergeXml2Json('/photography/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//       GET POLICY NEWS
//=============================
router.get('/policy', (req, res) => {
    theVergeXml2Json('/policy/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//       GET WEB NEWS
//=============================
router.get('/web', (req, res) => {
    theVergeXml2Json('/web/rss/index.xml').then(jsonRSS => {
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
        request(endpoint + path, function (error, response, body) {
            convert.xmlDataToJSON(body).then(jsonPage => {
                response = {}
                response.title = "The Verge - News"
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
                response.totalResults = allNews.length
                response.news = allNews
                resolve(response)
            }).catch(e => {
                console.log(e)
                reject(Error("internal error"))
            })
        })
    })
}
module.exports = router