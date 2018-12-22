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
})




function updateGuardianEntries() {
    return new Promise(function (resolve, reject) {
        request.get(guardian_endpoint + "?api-key=" + guardian_key + "&type=article&page-size=100",
            function (error, response, body) {
                let news = JSON.parse(body)
                let newsToPost = []
                for (notizia of news.response.results) {
                    newsToPost.push(parseGuardianNews(notizia))
                }
                bodyPost = {}
                bodyPost.source = 'the-guardian'
                bodyPost.lang = "en"
                bodyPost.news = newsToPost
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

function parseGuardianNews(notizia) {
    let result = {}
    result.title = notizia.webTitle
    result.url = notizia.webUrl
    result.datetime = notizia.webPubblicationDate
    result.lang = "en"
    return result
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