//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router()
const xml2json = require("../modules/xml2json")


//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//=============================
//       GET GOOGLE NEWS
//=============================
router.get('/google', (req, res) => {
    xml2json.theVergeXml2Json('/google/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET APPLE NEWS
//=============================
router.get('/apple', (req, res) => {
    xml2json.theVergeXml2Json('/apple/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//       GET APPS NEWS
//=============================
router.get('/apps', (req, res) => {
    xml2json.theVergeXml2Json('/apps/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//      GET CULTURE NEWS
//=============================
router.get('/culture', (req, res) => {
    xml2json.theVergeXml2Json('/culture/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET MICROSOFT NEWS
//=============================
router.get('/microsoft', (req, res) => {
    xml2json.theVergeXml2Json('/microsoft/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET PHOTOGRAPHY NEWS
//=============================
router.get('/photography', (req, res) => {
    xml2json.theVergeXml2Json('/photography/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//       GET POLICY NEWS
//=============================
router.get('/policy', (req, res) => {
    xml2json.theVergeXml2Json('/policy/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//       GET WEB NEWS
//=============================
router.get('/web', (req, res) => {
    xml2json.theVergeXml2Json('/web/rss/index.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

module.exports = router