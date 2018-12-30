//=============================
//           IMPORT
//=============================
var express = require("express")        // handling server
var morgan = require('morgan')          // Used for debugging
var bodyParser = require('body-parser')
require('dotenv').config()              // to handle environment variables
const newsActions = require('./modules/news_actions')
//=============================
//          SETTINGS
//=============================
var cors = require('cors')
var app = express();                    // define app
var port = process.env.PORT || 8083;    // Set port
var news_routes = require('./routes/news_routes.js')
var source_routes = require('./routes/source_routes.js')

app.use(cors())
app.use(morgan('dev'))                  // Used in dev mode to see the requests the server receive.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());             // Useful to extract data from a POST

//=============================
//          ROUTES
//=============================
app.use('/v1/sources', source_routes)   // set routes
app.use('/v1/news', news_routes)   // set routes
// from here default routes
app.get('*', function (req, res) {
    res.status(404).json({ "errors": [{ "msg": req.method + " on " + req.originalUrl + " is not defined" }] })
})
app.post('*', function (req, res) {
    res.status(404).json({ "errors": [{ "msg": req.method + " on " + req.originalUrl + " is not defined" }] })
})
app.put('*', function (req, res) {
    res.status(404).json({ "errors": [{ "msg": req.method + " on " + req.originalUrl + " is not defined" }] })
})
app.delete('*', function (req, res) {
    res.status(404).json({ "errors": [{ "msg": req.method + " on " + req.originalUrl + " is not defined" }] })
})

//=============================
// UPDATE DATA EVERY 15 MINUTES
//=============================
/*
newsActions.updateNews().then(val => { // call on startup
    console.log("Updated data on startup")
})
setInterval(function () {
    newsActions.updateNews()
}, 15 * 60 * 1000);
*/
//=============================
//        START SERVER
//=============================
app.listen(port)                // start server
console.log('Server started on port ' + port)