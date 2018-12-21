//=============================
//           IMPORT
//=============================
const express = require('express')
const router = express.Router({ mergeParams: true })
const request = require('request')
require('dotenv').config()

module.exports = router