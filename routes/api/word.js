var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word');

// get all words
router.get('/', keystone.middleware.api, function (req, res) {
    Word.model.find(function (err, words) {
        if (err) return res.apiError('database error', err);
        res.apiResponse({ words: words });
    });
});

// create a word
router.post('/', keystone.middleware.api, function (req, res) {
    var item = Word.model();
    item.getUpdateHandler(req).process(req.body, function (err) {
        if (err) return res.apiError('error', err);
        res.apiResponse({ word: item });
    })
});

module.exports = router;
