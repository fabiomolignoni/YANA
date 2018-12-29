//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const newsActions = require('../modules/news_actions')

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/', (req, res) => {
    Promise.all(newsActions.updateNYTEntries(),
        newsActions.updateBBCEntries(),
        newsActions.updateGuardianEntries(),
        newsActions.updateTheVergeEntries()).then(values => {
            res.status(201).json(values)
        }).catch(e => {
            res.status(500).json({ "errors": [{ "msg": "Dandelion limit exceeded. Try tomorrow." }] })
        })
})

router.get('/', (req, res) => {
    let params = {}
    params.source = req.query.source
    params.datetime = req.query.datetime
    params.category = req.query.category
    params.from = req.query.from
    params.to = req.query.to
    params.q = req.query.q
    params.page = req.query.page
    params.pageSize = req.query.pageSize
    newsActions.getNews(params).then(results => {
        res.json(results)
    })
})

router.get('/:tags', (req, res) => {
    let params = {}
    params.source = req.query.source
    params.datetime = req.query.datetime
    params.category = req.query.category
    params.from = req.query.from
    params.to = req.query.to
    params.q = req.query.q
    params.page = req.query.page
    params.pageSize = req.query.pageSize
    params.tags = req.params.tags
    newsActions.getNews(params).then(results => {
        res.json(results)
    })
})

module.exports = router