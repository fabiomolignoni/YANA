//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const async = require('async')
const https = require('https')
const request = require('request')
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
    let postNews = JSON.parse(req.body.news)
    let allIds = []
    getNews({ "source": req.body.source }).then(news => {
        let lastTimeUpdated = getLastDatetime(news)
        if (lastTimeUpdated < getLastDatetime(postNews)) { // there is NOT NEWS INSIDE THE DATA
            for (notizia of postNews) {
                currentDate = new Date(notizia.datetime)
                if (lastTimeUpdated < currentDate) {
                    notizia.source = req.body.source
                    setCompleteNews(notizia).then(val => {
                        postANews(notizia).then(id => {
                            res.json(id)
                            // qui in futuro set array
                        }).catch(e => {
                            res.json(e)
                        })
                    })
                }
            }
        }
        // capire come gestire "wait until fatto tutte postANews"        
        // res.json(allIds)
    })
})

//=============================
//        GET v1/news
//=============================
router.get('/', function (req, res) {
    // 
})

//=============================
//         POST A NEWS
// crea una nuova headline e
// ritorna l'id della entry
//=============================
function postANews(news) {
    // capire come fare una post
    console.log("post a news")
    return new Promise(function (resolve, reject) {
        request.post({
            url: "https://" + headlines_endpoint + "/v1/headlines",
            body: news,
            json: true
        }, function optionalCallback(err, httpResponse, body) {
            if (err || httpResponse.statusCode !== 200) {
                reject(body)
            } else {
                resolve(body._id)
            }
        });
        /*
        console.log("in post a enws")
        var options = {
            hostname: headlines_endpoint,
            path: '/v1/headlines',
            method: 'POST',
            port: 443,
            json: true,
            body: news,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log("inizio postanews")
        console.log(options.hostname)
        try {
            https.request(options, function (res) {
                var body = '';
                console.log(res.statusCode)
                res.on('data', function (chunk) {
                    body += chunk;
                    console.log(chunk)
                });
                res.on('end', function () {
                    console.log(body)
                    var finalResponse = JSON.parse(body);
                    resolve(finalResponse._id)
                });
            })
        } catch (e) {
            console.log(e)
            console.log("==========0")
        }
        */
    })
}

//=============================
//     SET COMPLETE NEWS
// ritorna una notizia con tags
//         e categoria
//=============================
function setCompleteNews(news) {
    return Promise.all([getNewsCategory(news.title), getNewsTags(news.title)]).then(function (listOfResults) {
        news.category = listOfResults[0].categories[0].name
        let tags = []
        for (element of listOfResults[1].annotations) {
            if (element.confidence > 0.75) {
                tags.push(element.title)
            }
        }
        news.tags = tags
        return news
    })
    /*
    async.parallel({
        category: function (callback) {
            callback(null, getNewsCategory(news.title))
        },
        tags: function (callback) {
            callback(null, getNewsTags(news.title))
        }
    }, function (err, results) {
        console.log(results.category)
        console.log(results.tags)
        Qui filtro categoria (top 1) e tags (tutte quelle con accuracy >0.7)
        poi setto news.category e news.tags e restituisco
        
    })
    */
}

//=============================
//       GET NEWS CATEGORY
// ritorna la categoria di una notizia
// utilizza API di Dandelion
//=============================
function getNewsCategory(title) {
    return new Promise(function (resolve, reject) {
        let url = dandelion_endpoint + 'cl/v1/?model=54cf2e1c-e48a-4c14-bb96-31dc11f84eac&min_score=0.2&token=' + dandelion_token
        url += '&text=' + title
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
//      GET LAST DATETIME
// ritorna il datetime più recente
// all'interno di una lista di news
//=============================
function getLastDatetime(allNews) {
    currentLast = new Date(1)
    for (news of allNews) {
        currentDate = new Date(news.datetime)
        if (currentLast < currentDate) {
            currentLast = currentDate
        }
    }
    return currentLast
}
//=============================
//        GET NEWS
// prende news secondo params
//=============================
function getNews(params) {
    urlNews = "https://" + headlines_endpoint + "/v1/headlines?"
    for (name in params) {
        urlNews += name + "=" + params[name] + "&"
    }
    return new Promise(function (resolve, reject) {
        https.get(urlNews, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var finalResponse = JSON.parse(body);
                resolve(finalResponse)
            });
        }).on('error', function (e) {
            ;
            reject("internal error")
        })
    })
}
module.exports = router