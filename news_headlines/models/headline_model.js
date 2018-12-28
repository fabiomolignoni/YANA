var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Source = require('./source_model')
/*
  Headline Schema. An headline is defined by a source, a title, a url (unique)
  and a category. Other optionals fields are author, body and tags. Tags,
  if not defined, is set as [].
*/
var HeadlineSchema = new Schema({
    source: {
        type: String,
        ref: 'Source',
        required: true
    },
    author: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    datetime: {
        type: Date,
        default: Date.now()
    },
    body: {
        type: String
    },
    category: { // category has a list of possible values
        type: String,
        required: true,
        enum: ['economy', 'business', 'entertainment', 'sport', 'health', 'science-environment', 'technology', 'politics', 'general']
    },
    tags: {
        type: Array,
        default: []
    }
}, {
        versionKey: false
    });

/*
    Before saving, if tags or datetime are not defined, it set them with some default values
*/
HeadlineSchema.pre('save', function (next) {
    Source.findOne({ _id: this.source }, function (err, found) {
        if (found) {
            if (this.datetime === null || this.datetime === undefined) {
                this.datetime = Date.now()
            }
            if (this.tags === null || this.tags === undefined) {
                this.tags = []
            }
            return next()
        }
        else {
            let e = new Error({ error: "Source not found" })
            e.errmsg = "Source not found"
            return next(e);
        }
    });

})

module.exports = mongoose.model('Headline', HeadlineSchema)