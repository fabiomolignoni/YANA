//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//      GET v1/news
//=============================
router.get('/:valore', (req, res) => {

})