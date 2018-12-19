//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const https = require('https')
require('dotenv').config()

//=============================
//     VARIABLES FROM ENV
//=============================
const headlines_endpoint = process.env.HEADLINES_URL | 'localhost:8080/v1'
const dandelion_endpoint = process.env.DANDELION_URL | 'https://api.dandelion.eu/datatxt/nex/v1'
const dandelion_token = process.env.DANDELION_TOKEN

//=============================
//     SET DEFAULT HEADERS
//=============================
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/*
//=============================
//        POST v1/news
// get a set of news and post them
// into the news_headlines ws.
// it also checks that that news
// is not already in the DB
//=============================
router.post('/', (req, res) => {
    // get news con last modified
    // OCIO capire come mettere greater or equal
    getNews(req.body.source_id).then(news => {
        if (true) { // there is NOT NEWS INSIDE THE DATA
            // get news pubblicate dopo news.lastModified
            newNews = undefined
            for (news of newNews) {
                setNewsCategoryAndTags(news).then(completeNews => {
                    // OCIO!!!!!!!!!!!!: CAPIRE COME SINCRONIZZARE DUE PARALLELE
                    postANews(req.body.source_id, completeNews)
                    // da decidere come gestire return
                    // asincrona o sincrona? io direi sincrona
                    // crea lista di return e quando contiene tutto not undefined
                    // ritorna valore appropriato
                })
            }
        }
    })
})

//=============================
//        GET v1/news
// get a set of news with advanced filtering:
// search by title similarity, by tags
// by source, by category, by time
// implements paging
//=============================
router.get('/', (req, res) => {
    // get news con last modified
    // OCIO capire come mettere greater or equal
    getNews(req.body.source_id).then(news => {
        // eventuale manipolazione (eg search by tags)
        // ritorno dati
    })
})

//=============================
//        GET v1/news/:id
// get a single news with info
// about the source
//=============================
router.get('/', (req, res) => {
    // get news con last modified
    // OCIO capire come mettere greater or equal
    getNews().then(news => {

    })
    getSource(req.body.source_id).then(source => {

    })
    // OCIO: CAPIRE COME SINCRONIZZARE DUE PARALLELE

})

function postANews(news) {
    urlNews = headlines_endpoint + "/headlines"
    return new Promise(function (resolve, reject) {
        // COME GESTIRE GET DI UN JSON?
        // COME INVIARE PARAMETRI DI UNA GET IN MANIERA COMODA?
        https.post(urlNews, params ?, function (resNews) {
            // RETURN RISULTATI POST
        })
    })
}

function setNewsCategoryAndTags(news) {
    return new Promise(function (resolve, reject) {
        // qua un pelo complicato, devo fare due get a dandelion
        // quando ricevo i valori (check con due boolean in while) invio indietro news completa
    })
}

function getNews(newsParams) {
    urlNews = headlines_endpoint + "/headlines"
    return new Promise(function (resolve, reject) {
        // COME GESTIRE GET DI UN JSON?
        // COME INVIARE PARAMETRI DI UNA GET IN MANIERA COMODA?
        https.get(urlNews, params ?, function (resNews) {
            // RETURN RISULTATI GET
        })
    })
}


function getASource(sourceId) {
    urlNews = headlines_endpoint + "/sources/" + source_id
    return new Promise(function (resolve, reject) {
        // COME GESTIRE GET DI UN JSON?
        // COME INVIARE PARAMETRI DI UNA GET IN MANIERA COMODA?
        https.get(urlNews, params ?, function (resNews) {
            // RETURN RISULTATI GET
        })
    })
}
*/