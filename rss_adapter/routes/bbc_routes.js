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
        prom.push(bbcXml2Json(page + "/rss.xml"))
    }
    Promise.all(prom).then(results => {
        let finalJson = {}
        finalJson.title = "BBC - News"
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
        request(endpoint + path, function (error, response, body) {
            convert.xmlDataToJSON(body).then(jsonPage => {
                var result = {}
                result.title = 'BBC - News'
                var news = []
                for (let item of jsonPage.rss.channel[0].item) {
                    currentNews = {}
                    currentNews.title = item.title[0]
                    currentNews.body = item.description[0]
                    currentNews.url = item.link[0]
                    currentNews.datetime = new Date(item.pubDate[0])
                    news.push(currentNews)
                }
                result.totalResults = news.length
                result.news = news
                resolve(result)
            }).catch(e => {
                console.log(e)
                reject(Error("internal error"))
            })
        })
    })
}

module.exports = router
