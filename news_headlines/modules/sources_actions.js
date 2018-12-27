//=============================
//           IMPORT
//=============================
var Source = require('../models/source_model')
var possibleLanguages = ['en', 'ita']

//=============================
//        postSource
// it creates a new source in the DB.
// data is the object to push in the DB.
// returns a promise
//=============================
var postSource = function (data) {
    return Source.create({ // Create new source in DB 
        _id: data._id.replace(' ', ''),
        name: data.name,
        description: data.description,
        url: data.url,
        lang: data.lang,
    });
}

//=============================
//      searchSources
// searches for sources in the DB.
// params are the parameters of the search.
// returns a promise
//=============================
var searchSources = function (params) {
    return new Promise(function (resolve, reject) {
        Source.find(params).exec(function (err, sources) {
            if (err) {
                reject({ "errors": [{ "msg": "internal error" }] })
            } else {
                resolve(sources)
            }
        })
    })
}

//=============================
//       getSourceById
// find a source by an ID
// id is the id of the source that you want to find
// returns a promise
//=============================
var getSourceById = function (id) {
    return new Promise(function (resolve, reject) {
        Source.find({ _id: id }).exec(function (err, source) {
            if (err) {
                reject({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
            } else {
                resolve(source)
            }
        })
    })
}

//=============================
//       updateSource
// update a source
// id is the id of the source that you want to update
// data is the data that you want to update (it doesn't need to be complete)
// returns a promise
//=============================
var updateSource = function (id, data) {
    return new Promise(function (resolve, reject) {
        Source.find({ _id: id }).exec(function (err, source) {
            if (err) {
                reject({ "status": 400, "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
            } else {
                // update attribute only if not undefined and if attribute is valid
                if (possibleLanguages.includes(data.lang)) {
                    source.lang = data.lang
                }
                source.url = ((data.url !== undefined) ? data.url : source.url)
                source.name = ((data.name !== undefined) ? data.name : source.name)
                source.description = ((data.description !== undefined) ? data.description : source.description)
            }
            source.save(function (err) { // update entry in DB
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
//       deleteSource
// delete a source by an ID
// id is the id of the source that you want to delete
// returns a promise
//=============================
var deleteSource = function (id) {
    return new Promise(function (resolve, reject) {
        Source.remove({ _id: id }, function (err, source) {
            if (err) {
                reject({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
            } else {
                resolve()
            }
        })
    })
}

// exporting the functions
module.exports.postSource = postSource
module.exports.searchSources = searchSources
module.exports.getSourceById = getSourceById
module.exports.updateSource = updateSource
module.exports.deleteSource = deleteSource