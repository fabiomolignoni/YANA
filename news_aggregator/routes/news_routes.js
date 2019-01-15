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

//=============================
//          GET news
// get all news filtered by parameters sent by the user
//=============================
router.get('/', (req, res) => {
    let params = {} // set parameters
    params.source = req.query.source
    params.datetime = req.query.datetime
    params.category = req.query.category
    params.from = req.query.from
    params.to = req.query.to
    params.q = req.query.q
    params.page = req.query.page
    params.pageSize = req.query.pageSize
    params.tags = req.query.tags // set tags
    newsActions.getNews(params).then(results => { // get news
        res.json(results)
    })
})


//=============================
//        GET v1/news/:id
// return news by a particular id
//=============================
router.get('/:id', function (req, res) {
    newsActions.getNewsWithId(req.params.id).then(result => {
        res.status(200).json(result)
    }).catch(e => {
        console.log(e)
        res.status(404).json({ "errors": [{ "msg": e }] })
    })
})

module.exports = router