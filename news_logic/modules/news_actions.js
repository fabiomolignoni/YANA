//=============================
//           IMPORT
//=============================
const request = require('request')
const utf8 = require('utf8')
const stringSimilarity = require('string-similarity')
var settle = require('promise-settle')
require('dotenv').config()

//=============================
//     VARIABLES FROM ENV
//=============================
const headlines_endpoint = process.env.HEADLINES_URL || 'localhost:8080/v1'
const dandelion_endpoint = process.env.DANDELION_URL || 'https://api.dandelion.eu/datatxt/'
const dandelion_token = process.env.DANDELION_TOKEN


//=============================
//        POST NEWS
// given a set of news it takes only the news not yet posted
// it defines a category and a set of tags for that news
// and then post all the news to news_headlines
//=============================
var postNews = function (data) {
    return new Promise(function (resolve, reject) {
        let recievedNews = undefined
        // recivedNews parse news as json if data being sent is a string
        try {
            if (typeof data.news === 'string') {
                recievedNews = JSON.parse(data.news)
            } else {
                recievedNews = data.news
            }
        } catch (e) {
            reject(new Error("News is not an array"))
        }

        let dict = {} // sum of all results of the post, it will be returned
        let toBeInserted = [] // news that are not already in the DB

        getNews({ "source": data.source }).then(results => { // take all news for that source
            let urlList = results.map(function (item) { // take only url
                return item.url
            })

            for (current of recievedNews) { // take only news that needs to be posted
                if (urlList.includes(current.url)) {
                    dict[current.url] = { "errors": [{ "msg": "News already in our systems" }] }
                } else {
                    toBeInserted.push(current)
                }
            }
            settle(setCompleteNews(toBeInserted)).then(results => { // set complete news
                let validResults = []
                results.forEach((element, index) => { // I take only the news that are complete
                    if (element.isFulfilled()) {
                        validResults.push(element.value())
                    } else {
                        dict[recievedNews[index].url] = { "errors": [element.reason().message] }
                    }
                })
                settle(postAllNews(validResults, data.source)).then(postData => { // post all news
                    for (index in postData) {
                        if (postData[index].isFulfilled()) {
                            let current = postData[index].value()
                            dict[validResults[index].url] = { "news": current.body }
                        } else { // if there are errors post errors
                            dict[validResults[index].url] = { "errors": current.body.errors }
                        }
                    }
                    // results
                    let result = [] // now transform a dictionary into an array to return the results
                    for (let key in dict) {
                        current = {}
                        current.url = key
                        current.response = dict[key]
                        result.push(current)
                    }
                    resolve(result) // return the results
                })
            }).catch(e => {
                console.log(e)
                reject(new Error("Error while trying to get news from DB"))
            })
        }).catch(error => {
            reject(new Error("internal error"))
        })
    })
}

//=============================
//   GET NEWS WITH PARAMETERS
// allows to do get to news_headlines with advanced parameters
// it implements pagination (pageSize default = 10, max 100) 
// other than basic parameters (e.g: category, source), it allows
// to select by tags and by title similarity
// returns set of news
//=============================
function getNewsWithParameters(params) {
    return new Promise(function (resolve, reject) {
        // set pagination parameters
        var pageSize = params.pageSize == undefined ? 10 : parseInt(params.pageSize)
        if (pageSize > 100) {
            pageSize = 100
        } else if (pageSize < 10) {
            pageSize = 10
        }
        var page = params.page == undefined ? 0 : parseInt(params.page)

        getNews(params).then(results => { // get news with parameters of the user
            let reqTitle = params.q
            let reqTags = params.tags

            if (reqTags != undefined) { // if there are tags filter by tags
                reqTags = reqTags.split("|")
                var similarityIndex = []
                correctNews = []
                for (x of results) { // for all news...
                    let nCorrectTags = 0
                    for (reqtag of reqTags) { // for all tags
                        for (tag of x.tags) { // for all tags of the news verify if it match with some requested tag
                            if (stringSimilarity.compareTwoStrings(reqtag, tag) > 0.5) {
                                nCorrectTags += 1
                                break
                            }
                        }
                        if (nCorrectTags == reqTags.length) { // if the news matches with all requested tags...
                            correctNews.push(x) // ... push it into the results
                        }
                    }
                }
                results = correctNews
            }
            if (reqTitle != undefined) {
                let similarityIndex = []
                for (x of results) { // for all news...
                    index = (stringSimilarity.compareTwoStrings(reqTitle, x.title)) // calculate title similarity
                    if (index > 0.2) { // if they are quite similar push it into the results
                        similarityIndex.push([x, index])
                    }
                }
                similarityIndex.sort(function (a, b) { return b[1] - a[1] }) // sort the results by relevance
                results = similarityIndex.map(function (value, index) { return value[0] })
            } else { // if don't have to sort by title similarity, sort by time
                results = results.sort(function (a, b) {
                    a = new Date(a.datetime)
                    b = new Date(b.datetime)
                    return b - a
                })

            }
            // create final json
            finalJSON = {}
            finalJSON.totalResults = results.length
            finalJSON.page = page
            finalJSON.pageSize = pageSize
            finalJSON.news = results.slice(pageSize * page, pageSize * page + pageSize)
            resolve(finalJSON) // return json
        }).catch(e => {
            reject("internal error")
        })
    })
}

//=============================
//        GET NEWS
// get news from news_headline service
// params is parameters of the get 
// return a promise
//=============================
function getNews(params) {
    return new Promise(function (resolve, reject) {
        urlNews = "https://" + headlines_endpoint + "/v1/headlines?"
        for (name in params) {
            urlNews += name + "=" + params[name] + "&"
        }
        request(urlNews, function (error, response, body) { // do the get to the service
            if (response.statusCode != 200) { // if there's some error reject
                reject(response.statusCode)
            } else {
                resolve(JSON.parse(body))
            }
        })
    })
}

//=============================
//      SET COMPLETE NEWS
// given a set of news returns a set of promises
// with .then you can access to the complete news (with category and tags)
//=============================
function setCompleteNews(news) {
    var all = []
    for (notizia of news) {
        all.push(setNewsParameters(notizia))
    }
    return all
}


//=============================
//     SET NEWS PARAMETERS
// given a news returns it with a category and a set of tags
//=============================
function setNewsParameters(news) {
    return new Promise(function (resolve, reject) {

        let tagsSource = news.body // for tags is better use body, but if it is undefined, we use title
        if (tagsSource == undefined || tagsSource == "") {
            tagsSource = news.title
        }
        settle([getNewsCategory(news.title), getNewsTags(tagsSource)]).then(function (listOfResults) {
            if (listOfResults[0].isFulfilled() && listOfResults[1].isFulfilled()) {
                listOfResults[0] = listOfResults[0].value()
                listOfResults[1] = listOfResults[1].value()
                if (listOfResults[0].categories.length > 0) {
                    news.category = listOfResults[0].categories[0].name
                } else {
                    news.category = "general" // if dandelion was not able to set the category returns as general
                }
                let tags = []
                for (element of listOfResults[1].annotations) { // take tags only with confidence >0.75
                    if (element.confidence > 0.75 && element.title != "") {
                        tags.push(element.title)
                    }
                }
                news.tags = tags.join("|")
                resolve(news)
            } else {
                reject(new Error("Dandelion quota exceeded. Try tomorrow."))
            }
        })

    })
}

//=============================
//       GET NEWS CATEGORY
// returns category of a news using dandelion
// returns a promise
//=============================
function getNewsCategory(title) {
    title = utf8.encode(title)
    return new Promise(function (resolve, reject) {
        // create the url
        let url = dandelion_endpoint + 'cl/v1/?model=54cf2e1c-e48a-4c14-bb96-31dc11f84eac&token=' + dandelion_token
        url += '&text=' + title + "&min_score=0.2"
        url = encodeURI(url)
        request(url, function (error, response, body) { // take category from dandelion
            if (response.statusCode != 200) {
                reject(new Error("Dandelion quota exceeded. Impossible to set a category"))
            } else {
                var finalResponse = JSON.parse(body);
                resolve(finalResponse)
            }
        })
    })
}

//=============================
//        GET NEWS TAGS
// given a news it returns its tags using dandelion
// returns a promise
//=============================
function getNewsTags(title) {
    return new Promise(function (resolve, reject) {
        // create url
        let url = dandelion_endpoint + 'nex/v1/?token=' + dandelion_token
        url += '&text=' + title
        url = encodeURI(url)
        request(url, function (error, response, body) { // take tags from dandelion
            if (response.statusCode != 200) {
                reject(new Error("Dandelion quota exceeded. Impossible to set tags"))
            } else {
                var finalResponse = JSON.parse(body);
                resolve(finalResponse)
            }
        })
    })
}


function postAllNews(news, source) {

    var all = []
    for (let notizia of news) {
        notizia.source = source
        all.push(postANews(notizia))
    }
    return all
}


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

module.exports.postNews = postNews
module.exports.getNewsWithParameters = getNewsWithParameters