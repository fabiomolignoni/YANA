//=============================
//           IMPORT
//=============================
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



function getNews(params) {
    return new Promise(function (resolve, reject) {
        request({ url: news_logic_endpoint + "/news", qs: params }, function (err, response, body) {
            if (response.statusCode != 200) {
                reject(response.statusCode)
            } else {
                resolve(JSON.parse(body))
            }
        })
    })
}



function updateNYTEntries() {
    return new Promise(function (resolve, reject) {
        request.get({
            url: nyt_endpoint,
            qs: {
                'api-key': nyt_key,
                'begin_date': parseInt(getNYTDate())
            },
        }, function (err, response, body) {
            if (response.statusCode != 200) {
                reject(response.statusCode)
            } else {
                body = JSON.parse(body)
                let newsToPost = parseNYTNews(body.response.docs)
                postNews('new-york-times', newsToPost).then(res => {
                    resolve(res)
                }).catch(e => {
                    reject("impossible to save NYT news")
                })
            }
        })
    })

}

function parseNYTNews(news) {
    let results = []
    for (notizia of news) {
        let current = {}
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
                if (response.statusCode != 200) {
                    reject(response.statusCode)
                } else {
                    let news = JSON.parse(body)
                    let newsToPost = parseGuardianNews(news.response.results)
                    postNews('the-guardian', newsToPost).then(res => {
                        resolve(res)
                    }).catch(e => {
                        reject("impossible to save the guardian news")
                    })
                }
            })
    })
}

function parseGuardianNews(news) {
    let results = []
    for (notizia of news) {
        let current = {}
        current.title = notizia.webTitle
        current.url = notizia.webUrl
        current.datetime = new Date(notizia.webPublicationDate)
        results.push(current)
    }
    return results
}

function updateBBCEntries() {
    let all = []
    var pages = ['/world', '/uk', '/business', '/politics',
        '/health', '/education', '/science_and_environment', '/technology', '/entertainment_and_arts']
    for (page of pages) {
        all.push(PostRSSFeed("/bbc" + page, "bbc-news"))
    }
    return all
}

function updateTheVergeEntries() {
    let all = []
    var pages = ['/google', '/apple', '/apps', '/culture', '/microsoft', '/photography', '/policy', '/web']
    for (page of pages) {
        all.push(PostRSSFeed("/the-verge" + page, 'the-verge'))
    }
    return all
}

function postNews(source, news) {
    return new Promise(function (resolve, reject) {
        let newsToSend = {}
        newsToSend.source = source
        newsToSend.news = news
        request.post({
            url: news_logic_endpoint + "/news",
            body: newsToSend,
            json: true
        }, function (err, response, bod) {
            if (response.statusCode != 201) {
                reject("errore qui")
            } else {
                resolve(bod)
            }
        })
    })
}

function PostRSSFeed(page, source) {
    return new Promise(function (resolve, reject) {
        request.get(rss_adapter_endpoint + page, function (error, response, body) {
            if (response.statusCode != 200) {
                reject(response.statusCode)
            } else {
                let recieved = JSON.parse(body)
                postNews(source, recieved.news).then(result => {
                    resolve(result)
                }).catch(e => {
                    reject("impossible to save page " + page)
                })
            }
        })
    })
}

module.exports.updateGuardianEntries = updateGuardianEntries
module.exports.updateNYTEntries = updateNYTEntries
module.exports.updateBBCEntries = updateBBCEntries
module.exports.updateTheVergeEntries = updateTheVergeEntries
module.exports.getNews = getNews