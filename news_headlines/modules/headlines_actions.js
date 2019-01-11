//=============================
//           IMPORT
//=============================
var Headline = require('../models/headline_model')
var possibleCategories = ['Society', 'Arts', 'Computers', 'Business', 'Health',
    'Science', 'Home', 'Games', 'Recreation', 'Sports']

//=============================
//        postHeadline
// it creates a new headline in the DB.
// data is the object to push in the DB.
// returns a promise
//=============================
var postHeadline = function (data) {
    reqDate = new Date(data.datetime)
    if (reqDate == 'Invalid Date' || isNaN(reqDate) || reqDate > Date.now) { // if date is not valid set it as now
        reqDate = Date.now()
    }
    let tagsArray = []
    if (data.tags != undefined && data.tags != "") {
        tagsArray = data.tags.split("|")
        tagsArray = tagsArray.filter(function (value, index) {
            return tagsArray.indexOf(value) === index
        })
        tagsArray = tagsArray.filter(el => el !== "")
    }
    return Headline.create({ // Create new headline in DB a
        source: data.source,
        author: data.author,
        title: data.title,
        url: data.url,
        datetime: data.datetime,
        body: data.body,
        category: data.category,
        tags: tagsArray
    })
}

//=============================
//      searchHeadlines
// searches for headlines in the DB.
// params are the parameters of the search.
// returns a promise
//=============================
var searchHeadlines = function (params) {
    return new Promise(function (resolve, reject) {
        let query = {}
        if (params.source != undefined) {
            query.source = { $in: params.source.split("|") }
        }
        if (params.url != undefined) {
            query.url = params.url
        }
        if (params.from != undefined || params.to != undefined) {
            query.datetime = {}
            if (params.from != undefined) {
                query.datetime['$gte'] = new Date(params.from)
            }
            if (params.to != undefined) {
                query.datetime['$lte'] = new Date(params.to)
            }
        }
        if (params.category != undefined) {
            query.category = { $in: params.category.split("|") }
        }
        Headline.find(query).exec(function (err, headlines) {
            if (err) {
                console.log(err)
                reject({ "errors": [{ "msg": "internal error" }] })
            } else {
                resolve(headlines)
            }
        })
    })
}

//=============================
//       findHeadlineById
// find an headline by an ID
// id is the id of the headline that you want to find
// returns a promise
//=============================
var findHeadlineById = function (id) {
    return new Promise(function (resolve, reject) {
        Headline.findById(id, function (err, headlines) {
            if (err) {
                reject({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
            } else {
                resolve(headlines)
            }
        })
    })
}

//=============================
//       updateHeadline
// update an headline
// id is the id of the headline that you want to update
// data is the data that you want to update (it doesn't need to be complete)
// returns a promise
//=============================
var updateHeadline = function (id, data) {
    return new Promise(function (resolve, reject) {
        Headline.findById(id, function (err, headline) {
            if (err) {
                reject({ "status": 404, "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
            } else {
                // update attribute only if not undefined and if attribute is valid
                if (data.url !== undefined && validUrl.isUri(data.url)) {
                    headline.url = data.url
                }
                var reqDate = new Date(data.datetime)
                if (reqDate != 'Invalid Date' && !isNaN(reqDate) && reqDate <= Date.now()) { // if date is not valid set it as now
                    headline.datetime = reqDate
                }
                if (possibleCategories.includes(data.category)) {
                    headline.category = data.category
                }
                let tagsArray = []
                if (data.tags != undefined && data.tags != "") {
                    tagsArray = data.tags.split("|")
                    tagsArray = tagsArray.filter(function (value, index) {
                        return tagsArray.indexOf(value) === index
                    })
                    tagsArray = tagsArray.filter(el => el !== "")
                }

                headline.source = ((data.source !== undefined) ? data.source : headline.source)
                headline.author = ((data.author !== undefined) ? data.author : headline.author)
                headline.title = ((data.title !== undefined) ? data.title : headline.title)
                headline.body = ((data.body !== undefined) ? data.body : headline.body)
                headline.tags = (data.tags !== undefined) ? tagsArray : headline.tags
            }
            headline.save(function (err) { // update entry in DB
                if (err) {
                    reject({ "status": 500, "errors": [{ "msg": err }] });
                } else {
                    resolve()
                }
            })
        })
    })
}

//=============================
//       deleteHeadline
// delete an headline by an ID
// id is the id of the headline that you want to delete
// returns a promise
//=============================
var deleteHeadline = function (id) {
    return new Promise(function (resolve, reject) {
        Headline.remove({ _id: id }, function (err, headlines) {
            if (err) {
                reject({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
            } else {
                resolve()
            }
        })
    })
}

// exporting the functions
module.exports.possibleCategories = possibleCategories
module.exports.postHeadline = postHeadline
module.exports.searchHeadlines = searchHeadlines
module.exports.findHeadlineById = findHeadlineById
module.exports.updateHeadline = updateHeadline
module.exports.deleteHeadline = deleteHeadline