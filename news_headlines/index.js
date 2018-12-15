//=============================
//           IMPORT
//=============================
var express = require("express")        // handling server
var morgan = require('morgan')          // Used for debugging
var mongoose = require('mongoose')      // handling database
var bodyParser = require('body-parser')
require('dotenv').config()              // to handle environment variables
//=============================
//          SETTINGS
//=============================
var app = express();                    // define app
var port = process.env.PORT || 8080;    // Set port
var headline_routes = require('./routes/headline_routes.js')

app.use(morgan('dev'))                  // Used in dev mode to see the requests the server receive.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());             // Useful to extract data from a POST
mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true }) // connect to the database

//=============================
//          ROUTES
//=============================
app.use('/v1/headlines', headline_routes)   // set routes

//=============================
//        START SERVER
//=============================
app.listen(port)                // start server
console.log('Server started on port ' + port)