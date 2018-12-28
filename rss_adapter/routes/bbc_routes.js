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
})

//=============================
//        GET WORLD NEWS
//=============================
router.get('/world', (req, res) => {
    xml2json.bbcXml2Json('/world/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//        GET UK NEWS
//=============================
router.get('/uk', (req, res) => {
    xml2json.bbcXml2Json('/uk/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET BUSINESS NEWS
//=============================
router.get('/business', (req, res) => {
    xml2json.bbcXml2Json('/business/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//     GET POLITICS NEWS
//=============================
router.get('/politics', (req, res) => {
    xml2json.bbcXml2Json('/politics/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//      GET HEALTH NEWS
//=============================
router.get('/health', (req, res) => {
    xml2json.bbcXml2Json('/health/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//    GET EDUCATION NEWS
//=============================
router.get('/education', (req, res) => {
    xml2json.bbcXml2Json('/education/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
// GET SCIENCE/ENVIRONMENT NEWS
//=============================
router.get('/science_and_environment', (req, res) => {
    xml2json.bbcXml2Json('/science_and_environment/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
//    GET TECHNOLOGY NEWS
//=============================
router.get('/technology', (req, res) => {
    xml2json.bbcXml2Json('/technology/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})

//=============================
// GET ENTERTAINMENT/ARTS NEWS
//=============================
router.get('/entertainment_and_arts', (req, res) => {
    xml2json.bbcXml2Json('/entertainment_and_arts/rss.xml').then(jsonRSS => {
        res.status(200).send(jsonRSS)
    }).catch(e => {
        res.status(500).send({ "errors": [{ "msg": "internal error" }] })
    })
})


module.exports = router
