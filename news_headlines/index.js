//=============================
//           IMPORT
//=============================
var express = require("express")        // handling server
var morgan = require('morgan')          // Used for debugging
var mongoose = require('mongoose')      // handling database
var bodyParser = require('body-parser')
const expressValidator = require('express-validator')
require('dotenv').config()              // to handle environment variables
//=============================
//          SETTINGS
//=============================
var app = express();                    // define app
var port = process.env.PORT || 8080;    // Set port
var headline_routes = require('./routes/headline_routes.js')
var source_routes = require('./routes/source_routes.js')

app.use(expressValidator())
app.use(morgan('dev'))                  // Used in dev mode to see the requests the server receive.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());             // Useful to extract data from a POST
mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true }) // connect to the database

//=============================
//          ROUTES
//=============================
app.use('/v1/sources', source_routes)   // set routes
app.use('/v1/headlines', headline_routes)   // set routes
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
//        START SERVER
//=============================
app.listen(port)                // start server
console.log('Server started on port ' + port)