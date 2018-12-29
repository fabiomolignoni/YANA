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

//=============================
//         UPDATE NEWS
// It updates the news_headline service with the new news of the 4 sources
//=============================
function updateNews() {
    return Promise.all([updateNYTEntries(), // update news for each source
    updateBBCEntries(),
    updateGuardianEntries(),
    updateTheVergeEntries()])
}

//=============================
//          GET  NEWS
// returns news that match with "params"
// it invokes news_logic service
//=============================
function getNews(params) {
    return new Promise(function (resolve, reject) { // do get request to news_logic
        request({ url: news_logic_endpoint + "/news", qs: params }, function (err, response, body) {
            if (response.statusCode != 200) {
                reject(response.statusCode)
            } else {
                resolve(JSON.parse(body))
            }
        })
    })
}

//=============================
//      UPDATE NYT ENTRIES
// takes news from nyt api and update the news_logic service
//=============================
function updateNYTEntries() {
    return new Promise(function (resolve, reject) {
        request.get({ // do get to the api
            url: nyt_endpoint,
            qs: {
                'api-key': nyt_key, // api setting
                'begin_date': parseInt(getNYTDate())
            },
        }, function (err, response, body) {
            if (response.statusCode != 200) {
                reject(response.statusCode)
            } else {
                body = JSON.parse(body)
                let newsToPost = parseNYTNews(body.response.docs) // parse news 
                postNews('new-york-times', newsToPost).then(res => { // post the news
                    resolve(res)
                }).catch(e => {
                    resolve({ "errors": "impossible to save NYT news" })
                })
            }
        })
    })

}

//=============================
//       PARSE NYT NEWS
// transform nyt news in a more suitable way
//=============================
function parseNYTNews(news) {
    let results = []
    for (notizia of news) {
        let current = {} // create news in a proper format
        current.url = notizia.web_url
        current.body = notizia.snippet
        current.title = notizia.headline.main
        current.datetime = notizia.pub_date
        results.push(current)
    }
    return results // return results

}

//=============================
//        GET NYT DATE
// parse current date for the nyt api
//=============================
function getNYTDate() {
    var d = new Date(), // date format suitable for the nyt api
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate() - 1,
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

//=============================
//      UPDATE GUARDIAN ENTRIES
// takes news from guardian api and update the news_headline service
//=============================
function updateGuardianEntries() {
    return new Promise(function (resolve, reject) {
        request.get(guardian_endpoint + "?api-key=" + guardian_key + "&type=article&page-size=100",
            function (error, response, body) { // do get to the guardian api, setting the key
                if (response.statusCode != 200) {
                    reject(response.statusCode)
                } else {
                    let news = JSON.parse(body)
                    let newsToPost = parseGuardianNews(news.response.results) // get parsed news
                    postNews('the-guardian', newsToPost).then(res => { // post the news 
                        resolve(res)
                    }).catch(e => {
                        resolve({ "errors": "impossible to save Guardian news" })
                    })
                }
            })
    })
}

//=============================
//     PARSE GUARDIAN NEWS
// transform guardian news in a more suitable way
//=============================
function parseGuardianNews(news) { // parse guardian news eith default json fields
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

//=============================
//    UPDATE BBC ENTRIES
// takes news from rss adapter service and update the news_headline service
//=============================
function updateBBCEntries() {
    let all = []
    var pages = ['/world', '/uk', '/business', '/politics',
        '/health', '/education', '/science_and_environment', '/technology', '/entertainment_and_arts']
    for (page of pages) {
        all.push(PostRSSFeed("/bbc" + page, "bbc-news")) // post news for each possible page
    }
    return Promise.all(all)
}

//=============================
//  UPDATE THE VERGE ENTRIES
// takes news from rss adapter service and update the news_headline service
//=============================
function updateTheVergeEntries() {
    let all = []
    var pages = ['/google', '/apple', '/apps', '/culture', '/microsoft', '/photography', '/policy', '/web']
    for (page of pages) {
        all.push(PostRSSFeed("/the-verge" + page, 'the-verge')) // post news for each possible page
    }
    return Promise.all(all)
}

//=============================
//          POST NEWS
// given a set ofnews and its source, it post it on the news_logic service
//=============================
function postNews(source, news) {
    return new Promise(function (resolve, reject) {
        let newsToSend = {}
        newsToSend.source = source // set source
        newsToSend.news = news
        request.post({ // do the post and add the news
            url: news_logic_endpoint + "/news",
            body: newsToSend,
            json: true
        }, function (err, response, bod) {
            if (response.statusCode != 201) {
                reject(response.statusCode) // error while posting the data
            } else {
                resolve(bod)
            }
        })
    })
}

//=============================
//       POST RSS FEED
// given a page of the rss adapter service, it posts all its news
//=============================
function PostRSSFeed(page, source) {
    return new Promise(function (resolve, reject) {
        request.get(rss_adapter_endpoint + page, function (error, response, body) {
            // get rss adapter page
            if (response.statusCode != 200) {
                reject(response.statusCode)
            } else {
                let recieved = JSON.parse(body)
                postNews(source, recieved.news).then(result => { // post news of that page
                    resolve(result)
                }).catch(e => {
                    resolve({ "errors": "impossible to save rss feed on " + page })
                })
            }
        })
    })
}

module.exports.updateNews = updateNews
module.exports.getNews = getNews