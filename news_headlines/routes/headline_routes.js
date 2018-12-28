//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const { check, validationResult } = require('express-validator/check');
var headlineActions = require('../modules/headlines_actions')
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
    check("title", "title is not defined").exists(),
    check("source", "source is not defined").exists(),
    check("url", "url is not defined or is not an URL").isURL(),
    check("category", "category is not definied or is not valid").isIn(headlineActions.possibleCategories)]

    , (req, res) => {
        const errors = validationResult(req); // Validation of the input based on previous "check"
        if (!errors.isEmpty()) { // If there are some errors return the errors with status 422
            return res.status(422).json({ errors: errors.array() });
        } else {
            headlineActions.postHeadline(req.body).then(headline => {
                res.status(201).json(headline)
            }).catch(e => {
                console.log(e)
                res.status(500).json({ "errors": [{ "msg": e.errmsg }] })
            })
        }
    })

//=============================
//      GET v1/headlines
//=============================
// retrieve all resources with conditions specificed as parameters
router.get('/', (req, res) => {
    headlineActions.searchHeadlines(req.query).then(results => {
        res.status(200).json(results)
    }).catch(e => {
        res.status(500).json(e)
    })
})

//=============================
//      GET v1/headlines/:id
//=============================
// Retrieve a single resource with the id specified in the URL
router.get('/:id', (req, res) => {
    headlineActions.findHeadlineById(req.params.id).then(results => {
        res.status(200).json(results)
    }).catch(e => {
        res.status(404).json(e)
    })
})

//=============================
//      PUT v1/headlines/:id
//=============================
// Update a single resource, id specified in the URL, parameters in the body
router.put('/:id', (req, res) => {
    headlineActions.updateHeadline(req.params.id, req.body).then(() => {
        res.status(204).json()
    }).catch(e => {
        res.status(e.status).json({ "errors": e.errors })
    })
})

//=============================
//   DELETE v1/headlines/:id
//=============================
// Delete a resource with a particular id
router.delete('/:id', (req, res) => {
    headlineActions.deleteHeadline(req.params.id).then(() => {
        res.status(204).send()
    }).catch(e => {
        res.status(404).send(e)
    })
})
module.exports = router
