//=============================
//           IMPORT
//=============================
var express = require("express")        // handling server
var morgan = require('morgan')          // Used for debugging
var bodyParser = require('body-parser')
//=============================
//          SETTINGS
//=============================
var app = express();                    // define app
var port = process.env.PORT || 8081;    // Set port
var bbc_routes = require('./routes/bbc_routes.js')
var the_verge_routes = require('./routes/the_verge_routes.js')

app.use(morgan('dev'))                  // Used in dev mode to see the requests the server receive.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());             // Useful to extract data from a POST

//=============================
//          ROUTES
//=============================
app.use('/v1/the-verge', the_verge_routes)   // set routes
app.use('/v1/bbc', bbc_routes)   // set routes
//=============================
//        START SERVER
//=============================
app.listen(port)                // start server
console.log('Server started on port ' + port)