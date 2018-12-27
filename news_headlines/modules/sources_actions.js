
var Source = require('../models/source_model')
var possibleLanguages = ['en', 'ita']

var postSource = function (data) {
    Source.create({ // Create new headline in DB and return the representation with status 201
        _id: data._id.replace(' ', ''),
        name: data.name,
        description: data.description,
        url: data.url,
        lang: data.lang,
    }).then(source => res.status(201).json(source)).catch(e => {
        res.status(422).json({ errors: [{ msg: "error while saving data" }] })
    });
}