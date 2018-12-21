var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SourceSchema = new Schema({
    source_id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    lang: { type: String, required: true, enum: ['en', 'ita'] },
    url: { type: String, required: true },
    description: { type: String, required: true }
}, {
        versionKey: false
    });

module.exports = mongoose.model('Source', SourceSchema)