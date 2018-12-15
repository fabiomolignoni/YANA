//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');
var Headline = require('../models/headline_model')

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//    OPTIONS v1/headlines/*
//=============================
router.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

//=============================
//      POST v1/headlines
//=============================
router.post('/', [
    check('source', "source is not defined").exists(),
    check("author", "author is not defined").exists(),
    check("title", "title is not defined").exists(),
    check("url", "url is not defined or is not an URL").isURL(),
    check("category", "category is not definied or is not valid").isIn(['technology', 'business'])]
    , (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            Headline.create({
                source: req.body.source,
                author: req.body.author,
                title: req.body.title,
                url: req.body.url,
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
//     DA FIXARE VALIDAZIONE
//=============================
router.put('/:id', (req, res) => {
    Headline.findById(req.params.id, function (err, headline) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            if (req.body.source !== undefined)
                headline.source = req.body.source
            if (req.body.author !== undefined)
                headline.author = req.body.author
            if (req.body.title !== undefined)
                headline.title = req.body.title
            if (req.body.url !== undefined)
                headline.url = req.body.url
            if (req.body.imageUrl !== undefined)
                headline.imageUrl = req.body.imageUrl
            if (req.body.datetime !== undefined)
                headline.datetime = req.body.datetime
            if (req.body.body !== undefined)
                headline.body = req.body.body
            if (req.body.category !== undefined)
                headline.category = req.body.category
            if (req.body.tags !== undefined)
                headline.tags = req.body.tags
        }
        headline.save(function (err) {
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
