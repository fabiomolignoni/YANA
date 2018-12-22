//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');
var Source = require('../models/source_model')

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
//      POST v1/sources
//=============================
//  Creates a new resource with parameters in the body
router.post('/', [
    check('name', "name is not defined or is not valid").exists(),
    check('_id', "_id is not defined or is not valid").exists(),
    check("description", "description is not defined").exists(),
    check("url", "url is not defined or is not an URL").isURL(),
    check("lang", "lang is not definied or is not valid").isIn(possibleLanguages)
], (req, res) => {
    const errors = validationResult(req); // Validation of the input based on previous "check"
    if (!errors.isEmpty()) { // If there are some errors return the errors with status 422
        return res.status(422).json({ errors: errors.array() });
    } else {
        Source.create({ // Create new headline in DB and return the representation with status 201
            _id: req.body._id.replace(' ', ''),
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            lang: req.body.lang,
        }).then(source => res.status(201).json(source)).catch(e => {
            res.status(422).json({ errors: [{ msg: "error while saving data" }] })
        });
    }
})

//=============================
//      GET v1/sources
//=============================
// retrieve all resources
router.get('/', (req, res) => {
    Source.find(req.query).exec(function (err, sources) {
        if (err) {
            res.status(500).json({ "errors": [{ "msg": "internal error" }] })
        } else {
            res.status(200).json(sources)
        }
    });
})

//=============================
//    GET v1/sources/:id
//=============================
// Retrieve a single resource with the id specified in the URL
router.get('/:id', (req, res) => {
    Source.find({ _id: req.params.id }).exec(function (err, source) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            res.status(200).json(source)
        }
    });
})

//=============================
//    POST v1/sources/:id
//=============================
// Update a single resource, id specified in the URL, parameters in the body
router.put('/:id', (req, res) => {
    Source.find({ _id: req.params.id }).exec(function (err, source) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            // update attribute only if not undefined and if attribute is valid
            if (possibleLanguages.includes(req.body.lang)) {
                source.lang = req.body.lang
            }
            source.url = ((req.body.url !== undefined) ? req.body.url : source.url)
            source.name = ((req.body.name !== undefined) ? req.body.name : source.name)
            source.description = ((req.body.description !== undefined) ? req.body.description : source.description)
        }
        source.save(function (err) { // update entry in DB
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send()
            }
        })
    })
})

//=============================
//   DELETE v1/sources/:id
//=============================
// Delete a resource with a particular id
router.delete('/:id', (req, res) => {
    Source.remove({ _id: req.params.id }, function (err, source) {
        if (err) {
            res.status(404).json({ "errors": [{ "location": "query", "param": "id", "msg": "resource not found" }] })
        } else {
            res.status(204).send()
        }
    });
})
module.exports = router
