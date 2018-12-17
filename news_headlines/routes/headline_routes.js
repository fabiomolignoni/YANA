//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');
var Headline = require('../models/headline_model')
var validUrl = require('valid-url');

var possibleCategories = ['economy', 'business', 'entertainment', 'sport', 'health', 'science-environment', 'technlogy', 'politics']
var possibleLanguages = ['en', 'ita']
//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//      POST v1/headlines
//=============================
//  Creates a new resource with parameters in the body
router.post('/', [
    check('source', "source is not defined").exists(),
    check("author", "author is not defined").exists(),
    check("title", "title is not defined").exists(),
    check("url", "url is not defined or is not an URL").isURL(),
    check("category", "category is not definied or is not valid").isIn(possibleCategories)],
    check("lang", "lang is not definied or is not valid").isIn(possibleLanguages)
    , (req, res) => {
        const errors = validationResult(req); // Validation of the input based on previous "check"
        if (!errors.isEmpty()) { // If there are some errors return the errors with status 422
            return res.status(422).json({ errors: errors.array() });
        } else {
            reqDate = new Date(req.body.datetime)
            if (reqDate == 'Invalid Date' || isNaN(reqDate) || reqDate > Date.now) { // if date is not valid set it as now
                reqDate = Date.now
            }
            if (req.body.imageUrl === undefined || !validUrl.isURL(req.body.imageUrl)) {
                req.body.imageUrl = '' // if image is not valid set default value
            }
            Headline.create({ // Create new headline in DB and return the representation with status 201
                source: req.body.source,
                author: req.body.author,
                title: req.body.title,
                url: req.body.url,
                lang: req.body.lang,
                imageUrl: req.body.imageUrl,
                datetime: req.body.datetime,
                body: req.body.body,
                category: req.body.category,
                tags: req.body.tags
            }).then(headline => res.status(201).json(headline));
        }
    })

//=============================
//      GET v1/headlines
//=============================
// retrieve all resources with conditions specificed as parameters
router.get('/', (req, res) => {
    Headline.find(req.query).exec(function (err, headlines) {
        if (err) {
            res.status(500).json({ "errors": [{ "msg": "internal error" }] })
        } else {
            res.status(200).json(headlines)
        }
    });
})

//=============================
//      GET v1/headlines/:id
//=============================
// Retrieve a single resource with the id specified in the URL
router.get('/:id', (req, res) => {
    Headline.findById(req.params.id, function (err, headlines) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            res.status(200).json(headlines)
        }
    });
})

//=============================
//      GET v1/headlines/:id
//=============================
// Update a single resource, id specified in the URL, parameters in the body
router.put('/:id', (req, res) => {
    Headline.findById(req.params.id, function (err, headline) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            // update attribute only if not undefined and if attribute is valid
            if (req.body.url !== undefined && validUrl.isURL(req.body.url)) {
                headline.url = req.body.url
            }
            if (req.body.imageUrl !== undefined && validUrl.isURL(req.body.imageUrl)) {
                headline.imageUrl = req.body.imageUrl
            }
            var reqDate = new Date(req.body.datetime)
            if (reqDate != 'Invalid Date' && !isNaN(reqDate) && reqDate <= Date.now) { // if date is not valid set it as now
                headline.datetime = reqDate
            }
            if (possibleCategories.includes(req.body.category)) {
                headline.category = req.body.category
            }
            if (possibleLanguages.includes(req.body.lang)) {
                headline.lang = req.body.lang
            }
            headline.source = ((req.body.source !== undefined) ? req.body.source : headline.source)
            headline.author = ((req.body.author !== undefined) ? req.body.author : headline.author)
            headline.title = ((req.body.title !== undefined) ? req.body.title : headline.title)
            headline.body = ((req.body.body !== undefined) ? req.body.body : headline.body)
            headline.tags = ((req.body.tags !== undefined) ? req.body.tags : headline.tags)
        }
        headline.save(function (err) { // update entry in DB
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send()
            }
        })
    })
})

//=============================
//   DELETE v1/headlines/:id
//=============================
// Delete a resource with a particular id
router.delete('/:id', (req, res) => {
    Headline.remove({ _id: req.params.id }, function (err, headlines) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            res.status(204).send()
        }
    });
})
module.exports = router
