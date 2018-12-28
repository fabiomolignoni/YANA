var convert = require('xml-to-json-promise')
const request = require('request')

var bbc_endpoint = "http://feeds.bbci.co.uk/news"
var the_verge_endpoint = "https://www.theverge.com"


//=============================
//     THE VERGE XML 2 JSON
// Get the xml file from https://<endpoint>/<path>
// It converts the xml into suitable json
// Returns a promise
//=============================
function theVergeXml2Json(path) {
    return new Promise(function (resolve, reject) {
        request(the_verge_endpoint + path, function (error, response, body) {
            convert.xmlDataToJSON(body).then(jsonPage => { // convert xml to json
                response = {}
                response.title = jsonPage.feed.title[0]
                response.link = jsonPage.feed.link[0].$.href
                response.lastUpdated = new Date(jsonPage.feed.updated[0])
                allNews = []
                for (entry of jsonPage.feed.entry) {
                    // set news parameters
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
        request(bbc_endpoint + path, function (error, response, body) {
            if (response.statusCode != 200) {
                reject(Error("internal error"))
            }
            convert.xmlDataToJSON(body).then(jsonPage => { // convert xml to json
                var result = {}
                result.title = jsonPage.rss.channel[0].title[0]
                result.link = jsonPage.rss.channel[0].link[0]
                result.lastUpdated = new Date(jsonPage.rss.channel[0].lastBuildDate[0])
                var news = []
                for (let item of jsonPage.rss.channel[0].item) {
                    // set news parameters
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
                reject(Error("internal error"))
            })
        })
    })
}

module.exports.bbcXml2Json = bbcXml2Json
module.exports.theVergeXml2Json = theVergeXml2Json