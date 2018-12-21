//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const https = require('https')
const request = require('request')
const utf8 = require('utf8')
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
    let recievedNews = JSON.parse(req.body.news)
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

    // 
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
    return Promise.all([getNewsCategory(news.title), getNewsTags(news.body)]).then(function (listOfResults) {

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