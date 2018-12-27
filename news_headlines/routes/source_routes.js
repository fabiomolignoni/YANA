//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
var sourceActions = require('../modules/sources_actions')
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
        sourceActions.postSource(req.body).then(source => {
            res.status(201).json(source)
        }).catch(e => {
            res.status(422).json({ errors: [{ msg: e }] })
        })
    }
})

//=============================
//      GET v1/sources
//=============================
// retrieve all resources
router.get('/', (req, res) => {
    sourceActions.searchSources(req.query).then(results => {
        res.status(200).json(results)
    }).catch(e => {
        res.status(500).json(e)
    })
})

//=============================
//    GET v1/sources/:id
//=============================
// Retrieve a single resource with the id specified in the URL
router.get('/:id', (req, res) => {
    sourceActions.getSourceById(req.params.id).then(results => {
        res.status(200).json(results)
    }).catch(e => {
        res.status(404).json(e)
    })
})

//=============================
//    POST v1/sources/:id
//=============================
// Update a single resource, id specified in the URL, parameters in the body
router.put('/:id', (req, res) => {
    sourceActions.updateSource(req.params.id, req.body).then(() => {
        res.status(204).json()
    }).catch(err => {
        res.status(err.status).json({ "errors": err.errors })
    })
})

//=============================
//   DELETE v1/sources/:id
//=============================
// Delete a resource with a particular id
router.delete('/:id', (req, res) => {
    sourceActions.deleteSource(req.params.id).then(() => {
        res.status(204).json()
    }).catch(err => {
        res.status(404).json(err)
    })
})
module.exports = router
