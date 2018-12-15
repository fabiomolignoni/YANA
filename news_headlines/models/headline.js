var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
    source: String,
    author: String,
    title: String,
    url: String,
    imageUrl: String,
    datetime: Date,
    body: String,
    category: String,
    tags: Array
});

module.exports = mongoose.model('Headline', HeadlineSchema);