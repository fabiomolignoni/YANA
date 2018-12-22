//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const request = require('request')
require('dotenv').config()

//=============================
//     VARIABLES FROM ENV
//=============================
const rss_adapter_endpoint = process.env.RSS_ADAPTER || 'localhost:8081/v1'
const news_logic_endpoint = process.env.NEWS_LOGIC || 'http://localhost:8082/v1'
const guardian_key = process.env.GUARDIAN_KEY
const nyt_key = process.env.NYT_KEY
const guardian_endpoint = 'https://content.guardianapis.com/search'
const nyt_endpoint = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/', (req, res) => {
    updateNYTEntries().then(news => {
        res.json(news)
    })
})

function updateNYTEntries() {
    return new Promise(function (resolve, reject) {
        request.get({
            url: nyt_endpoint,
            qs: {
                'api-key': nyt_key,
                'begin_date': parseInt(getNYTDate())
            },
        }, function (err, response, body) {
            console.log("quah")
            body = JSON.parse(body)
            let newsToPost = parseNYTNews(body.response.docs)
            bodyPost = {}
            bodyPost.source = 'new-york-times'
            bodyPost.lang = "en"
            bodyPost.news = newsToPost
            request.post({
                url: news_logic_endpoint + "/news",
                body: bodyPost,
                json: true
            }, function (err, res, bod) {
                resolve(bod)
            })


        })
    })

}

function parseNYTNews(news) {
    let results = []
    for (notizia of news) {
        let current = {}
        current.lang = "en"
        current.url = notizia.web_url
        current.body = notizia.snippet
        current.title = notizia.headline.main
        current.datetime = notizia.pub_date
        results.push(current)
    }
    return results

}

function getNYTDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate() - 1,
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

function updateGuardianEntries() {
    return new Promise(function (resolve, reject) {
        request.get(guardian_endpoint + "?api-key=" + guardian_key + "&type=article&page-size=100",
            function (error, response, body) {
                let news = JSON.parse(body)
                let newsToPost = parseGuardianNews(news.response.results)
                bodyPost = {}
                bodyPost.source = 'the-guardian'
                bodyPost.lang = "en"
                bodyPost.news = newsToPost
                request.post({
                    url: news_logic_endpoint + "/news",
                    body: bodyPost,
                    json: true
                }, function (err, res, bod) {
                    resolve(bod)
                })
            })
    })
}

function parseGuardianNews(news) {
    let results = []
    for (notizia of news) {
        let current = {}
        current.title = notizia.webTitle
        current.url = notizia.webUrl
        current.datetime = notizia.webPubblicationDate
        current.lang = "en"
        results.push(current)
    }
    return results
}

function updateBBCEntries() {
    let all = []
    var pages = ['/world', '/uk', '/business', '/politics',
        '/health', '/education', '/science_and_environment', '/technology', '/entertainment_and_arts']
    for (page of pages) {
        all.push(PostRSSFeed("/bbc" + page, "bbc-news", "en"))
    }
    return all
}

function updateTheVergeEntries() {
    let all = []
    var pages = ['/google', '/apple', '/apps', '/culture', '/microsoft', '/photography', '/policy', '/web']
    for (page of pages) {
        all.push(PostRSSFeed("/the-verge" + page, 'the-verge', 'en'))
    }
    return all
}

function PostRSSFeed(page, source, lang) {
    return new Promise(function (resolve, reject) {
        request.get(rss_adapter_endpoint + page, function (error, response, body) {
            let recieved = JSON.parse(body)
            let newsToSend = {}
            newsToSend.source = source
            newsToSend.lang = lang
            newsToSend.news = recieved.news
            console.log(news_logic_endpoint + "/news")
            request.post({
                url: news_logic_endpoint + "/news",
                body: newsToSend,
                json: true
            }, function (err, res, bod) {
                resolve(bod)
            })
        })
    })
}
/*
function postTheVergeRSSFeed(page) {
    return new Promise(function (resolve, reject) {
        request.get(rss_adapter_endpoint + "/the-verge" + page, function (error, response, body) {
            let recieved = JSON.parse(body)
            let newsToSend = {}
            newsToSend.source = 'the-verge'
            newsToSend.lang = 'en'
            newsToSend.news = recieved.news
            console.log(news_logic_endpoint + "/news")
            request.post({
                url: news_logic_endpoint + "/news",
                body: newsToSend,
                json: true
            }, function (err, res, bod) {
                resolve(bod)
            })
        })
    })
}
    */
module.exports = router