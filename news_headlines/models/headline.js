var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Headline', HeadlineSchema);