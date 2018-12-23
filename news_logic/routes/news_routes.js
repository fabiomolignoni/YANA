//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const https = require('https')
const request = require('request')
const utf8 = require('utf8')
const stringSimilarity = require('string-similarity')
require('dotenv').config()

//=============================
//     VARIABLES FROM ENV
//=============================
const headlines_endpoint = process.env.HEADLINES_URL || 'localhost:8080/v1'
const dandelion_endpoint = process.env.DANDELION_URL || 'https://api.dandelion.eu/datatxt/'
const dandelion_token = process.env.DANDELION_TOKEN

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//        POST v1/news
// get a set of news and post them
// into the news_headlines ws.
// it also checks that that news
// is not already in the DB
//=============================
router.post('/', (req, res) => {
    let recievedNews = undefined
    if (typeof req.body.news === 'string') {
        recievedNews = JSON.parse(req.body.news)
    } else {
        recievedNews = req.body.news
    }
    let dict = {}
    Promise.all(getNotPostedNews(recievedNews)).then(val => {
        let toBeInserted = []
        for (x of val) {
            if (x.body[0] == undefined) {
                toBeInserted.push(recievedNews.filter(function (el) {
                    return el.url == x.params.url
                })[0])
            } else {
                dict[x.params.url] = { "errors": [{ "msg": "Already in our systems" }] }
            }
        }
        Promise.all(setCompleteNews(toBeInserted)).then(results => {
            Promise.all(postAllNews(results, req.body.source, req.body.lang)).then(postData => {
                for (index in postData) {
                    let current = postData[index]
                    if (current.body.statusCode != 201) {
                        dict[recievedNews[index].url] = { "errors": current.body.errors }
                    } else {
                        dict[recievedNews[index].url] = { "id": current.body._id }
                    }
                }
                // results
                let result = []
                for (let key in dict) {
                    current = {}
                    current.url = key
                    current.response = dict[key]
                    result.push(current)
                }
                res.json(result)
            })
        })
    })
})

//=============================
//        GET v1/news
//=============================
router.get('/', function (req, res) {
    var pageSize = req.query.pageSize == undefined ? 10 : parseInt(req.query.pageSize)
    if (pageSize > 100) {
        pageSize = 100
    } else if (pageSize < 10) {
        pageSize = 10
    }
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    let params = {}
    if (req.query.source != undefined) {
        params.source = req.query.source
    }
    if (req.query.datetime != undefined) {
        params.datetime = req.query.datetime
    }
    if (req.query.category != undefined) {
        params.category = req.query.category
    }
    if (req.query.from != undefined) {
        params.from = req.query.from
    }
    if (req.query.to != undefined) {
        params.to = req.query.to
    }
    if (req.query.lang != undefined) {
        params.lang = req.query.lang
    }
    getNews(params).then(results => {
        results = results.body
        let reqTitle = req.query.q
        let reqTags = req.query.tags
        if (reqTags != undefined) {
            reqTags = reqTags.split("|")
            var similarityIndex = []
            for (x of results) {
                let maxIndex = 0
                for (tag of x.tags) {
                    for (reqtag of reqTags) {
                        maxIndex = Math.max(maxIndex, stringSimilarity.compareTwoStrings(reqtag, tag))
                    }
                }
                if (maxIndex > 0.78) {
                    similarityIndex.push([x, maxIndex])
                }
            }
            similarityIndex.sort(function (a, b) { return b[1] - a[1] })
            results = similarityIndex.map(function (value, index) { return value[0] })
        }
        if (reqTitle != undefined) {
            let similarityIndex = []
            for (x of results) {
                index = (stringSimilarity.compareTwoStrings(reqTitle, x.title))
                if (index > 0.2) {
                    similarityIndex.push([x, index])
                }
            }
            similarityIndex.sort(function (a, b) { return b[1] - a[1] })
            results = similarityIndex.map(function (value, index) { return value[0] })
        }
        finalJSON = {}
        finalJSON.totalResults = results.length
        finalJSON.news = results.slice(pageSize * page, pageSize * page + pageSize)
        res.json(finalJSON)
    })
})


function setCompleteNews(news) {
    var all = []
    for (notizia of news) {
        all.push(setNewsParameters(notizia))
    }
    return all
}

function postAllNews(news, source, lang) {
    var all = []
    for (notizia of news) {
        notizia.source = source
        notizia.lang = lang
        all.push(postANews(notizia))
    }
    return all
}

function getNotPostedNews(news) {
    var all = []
    for (notizia of news) {
        all.push(getNews({ 'url': notizia.url }))
    }
    return all
}

//=============================
//         POST A NEWS
// crea una nuova headline e
// ritorna l'id della entry
//=============================
function postANews(news) {
    return new Promise(function (resolve, reject) {
        request.post({
            url: "https://" + headlines_endpoint + "/v1/headlines",
            body: news,
            json: true
        }, function optionalCallback(err, httpResponse, body) {
            body.statusCode = httpResponse.statusCode
            resolve({ body })
        })
    })
}

//=============================
//     SET COMPLETE NEWS
// ritorna una notizia con tags
//         e categoria
//=============================
function setNewsParameters(news) {
    let tagsSource = news.body
    if (tagsSource == undefined || tagsSource == "") {
        tagsSource = news.title
    }
    return Promise.all([getNewsCategory(news.title), getNewsTags(tagsSource)]).then(function (listOfResults) {

        if (listOfResults[0].categories.length > 0) {
            news.category = listOfResults[0].categories[0].name
        } else {
            news.category = "general"
        }
        let tags = []
        for (element of listOfResults[1].annotations) {
            if (element.confidence > 0.75 && element.title != "") {
                tags.push(element.title)
            }
        }
        news.tags = tags.join("|")
        return news
    })
}

//=============================
//       GET NEWS CATEGORY
// ritorna la categoria di una notizia
// utilizza API di Dandelion
//=============================
function getNewsCategory(title) {
    title = utf8.encode(title)
    return new Promise(function (resolve, reject) {
        let url = dandelion_endpoint + 'cl/v1/?model=54cf2e1c-e48a-4c14-bb96-31dc11f84eac&token=' + dandelion_token
        url += '&text=' + title + "&min_score=0.2"
        url = encodeURI(url)
        https.get(url, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var finalResponse = JSON.parse(body);
                resolve(finalResponse)
            });
        })
    })
}

//=============================
//        GET NEWS TAGS
// ritorna i tag per una notizia
// utilizza API di Dandelion
//=============================
function getNewsTags(title) {
    return new Promise(function (resolve, reject) {
        let url = dandelion_endpoint + 'nex/v1/?token=' + dandelion_token
        url += '&text=' + title
        url = encodeURI(url)
        https.get(url, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var finalResponse = JSON.parse(body);
                resolve(finalResponse)
            });
        })
    })
}

//=============================
//        GET NEWS
// prende news secondo params
//=============================
function getNews(params) {
    return new Promise(function (resolve, reject) {
        urlNews = "https://" + headlines_endpoint + "/v1/headlines?"
        for (name in params) {
            urlNews += name + "=" + params[name] + "&"
        }
        request(urlNews, function (error, response, body) {
            resolve({ "params": params, "body": JSON.parse(body) })
        })
    })
}

module.exports = router