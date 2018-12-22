var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
    source: {
        type: String,
        ref: 'Source',
        required: true
    },
    author: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true,
        enum: ['en', 'ita']
    },
    imageUrl: {
        type: String,
        default: ""
    },
    datetime: {
        type: Date,
        default: Date.now()
    },
    body: {
        type: String,
        default: ""
    },
    category: {
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

HeadlineSchema.pre('save', function (next) {
    if (this.imageUrl === null || this.imageUrl === undefined) {
        this.imageUrl = ''
    }
    if (this.datetime === null || this.datetime === undefined) {
        this.datetime = Date.now
    }
    if (this.body === null || this.body === undefined) {
        this.body = ''
    }
    if (this.tags === null || this.tags === undefined) {
        this.tags = []
    }
    next()
})

module.exports = mongoose.model('Headline', HeadlineSchema)