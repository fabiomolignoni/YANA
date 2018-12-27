
var Source = require('../models/source_model')
var possibleLanguages = ['en', 'ita']

var postSource = function (data) {
    return Source.create({ // Create new headline in DB and return the representation with status 201
        _id: data._id.replace(' ', ''),
        name: data.name,
        description: data.description,
        url: data.url,
        lang: data.lang,
    });
}

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
module.exports.postSource = postSource
module.exports.searchSources = searchSources
module.exports.getSourceById = getSourceById
module.exports.updateSource = updateSource
module.exports.deleteSource = deleteSource