//=============================
//           IMPORT
//=============================
var express = require("express")        // handling server
var morgan = require('morgan')          // Used for debugging
var bodyParser = require('body-parser')
require('dotenv').config()              // to handle environment variables
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

//=============================
//        START SERVER
//=============================
app.listen(port)                // start server
console.log('Server started on port ' + port)