var keystone = require('keystone'),
    Word = keystone.list('Word');

/**
 * Word List
 */

// get all words
exports.getWords = function (req, res) {
    Word.model.find(function (err, words) {
        if (err) return res.apiError('database error', err);
        res.apiResponse({ words: words });
    });
};

// create a word
exports.createWord = function (req, res) {
    var item = Word.model();
    item.getUpdateHandler(req).process(req.body, function (err) {
        if (err) return res.apiError('error', err);
        res.apiResponse({ word: item });
    })
};
