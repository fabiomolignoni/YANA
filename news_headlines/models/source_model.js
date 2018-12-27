var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 Source schema. A source is defined by a string id, a name, a language, a unique url and a description.
 All the elements are required.
*/
var SourceSchema = new Schema({
    _id: { type: String },
    name: { type: String, required: true },
    lang: { type: String, required: true, enum: ['en', 'ita'] },
    url: { type: String, required: true, unique: true },
    description: { type: String, required: true }
},
    {
        versionKey: false
    })


module.exports = mongoose.model('Source', SourceSchema)