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
//           POST NEWS
// update all the news of the DB
// takes from bbc, the verge, nyt and independent.
//=============================
router.post('/', (req, res) => {
    newsActions.updateNews().then(results => {
        let finalData = []
        finalData.push(results[0].value()) // NYT news

        finalData.push(results[1].value()) // Guardian News
        let bbc = []
        results[2].value().forEach(element => { // bbc news - from array of arrays to array
            bbc = bbc.concat(element.value())
        })
        finalData.push(bbc)
        let theverge = []
        results[3].value().forEach(element => {// the verge - from array of arrays to array
            theverge = theverge.concat(element.value())
        })
        finalData.push(theverge)
        res.status(201).json(finalData)
    })
})


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
    newsActions.getNews(params).then(results => { // get news
        res.json(results)
    })
})

//=============================
//          GET news/:tags
// get all news filtered by parameters sent by the user
// and that match with the tags specified in the path
//=============================
router.get('/:tags', (req, res) => {
    let params = {} // set parameters
    params.source = req.query.source
    params.datetime = req.query.datetime
    params.category = req.query.category
    params.from = req.query.from
    params.to = req.query.to
    params.q = req.query.q
    params.page = req.query.page
    params.pageSize = req.query.pageSize
    params.tags = req.params.tags // set tags
    newsActions.getNews(params).then(results => { // get news
        res.json(results)
    })
})

module.exports = router