//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const sourceActions = require('../modules/source_actions')

//=============================
//          GET sources
// get all sources in the DB via news_headline
//=============================
router.get('/', (req, res) => {
    sourceActions.getAllSources().then(val => {
        res.status(200).json(val)
    })
})

//=============================
//          GET sources/:id
// get source with that particular id
//=============================
router.get('/:id', (req, res) => {
    sourceActions.getSingleSource(req.params.id).then(val => {
        res.status(200).json(val)
    }).catch(e => {
        res.status(404).json({ "errors": [{ "msg": e }] })
    })
})

module.exports = router