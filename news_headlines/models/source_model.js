var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SourceSchema = new Schema({
    name: String,
    lang: String,
    url: String,
    description: String
}, {
        versionKey: false
    });

module.exports = mongoose.model('Source', SourceSchema)