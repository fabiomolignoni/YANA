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
var app = express();                    // define app
var port = process.env.PORT || 8082;    // Set port
var news_routes = require('./routes/news_routes.js')

app.use(morgan('dev'))                  // Used in dev mode to see the requests the server receive.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());             // Useful to extract data from a POST

//=============================
//          ROUTES
//=============================
app.use('/v1/news', news_routes)   // set routes
// GET NEWS BY FONTE, BY CATEGORY, BY TAGS, LAST 24 HOURS, LAST 48 HOURS, LAST WEEK, LAST MONTH
// SEARCH BY TITLE
// INSERT A SINGLE NEWS AND ADD CATEGORY AND TAGS
// ADD A SET OF NEWS THAT ARE NOT IN THE DB AND ADD CATEGORY AND TAGS

//=============================
//        START SERVER
//=============================
app.listen(port)                // start server
console.log('Server started on port ' + port)