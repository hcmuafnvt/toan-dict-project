var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    List = keystone.list('List');

// get all words
router.get('/', keystone.middleware.api, function (req, res) {
    Word.model.find(function (err, words) {
        if (err) return res.apiError('database error', err);
        res.apiResponse({ words: words });
    });
});

// create a word and assign to list
router.post('/', keystone.middleware.api, function (req, res) {
    if(!req.body.word || !req.body.listId) return res.apiError('validated error');

    Word.model.findOne({slug: req.body.word.trim()}, function(err, word) {
        if(err || word) {            
            addWordToList(req, res, word._id, req.body.listId);
        } else {
            var wordData = {
                name: req.body.word,                
                translateToEn: req.body.translateToEn,
                translateToVi: req.body.translateToVi,
                createdBy: res.locals.user.id
            },
            newWord = new Word.model(wordData);

            newWord.save(function(err, word) {
                if(err) return res.apiError('created word with error', err);            
                addWordToList(req, res, word._id, req.body.listId);
            });
        }        
    });
});

////////////////////////////////////////
//private functions
function addWordToList(req, res, wordId, listId) {
    List.model.findById(listId).exec(function(err, list) {
        if(err) return res.apiError('database error', err);
        if(!list) return res.apiError('not found');

        var words = list.words;
        if(words.indexOf(wordId) !== -1) {
            return res.apiResponse({msg: 'word existed in list'});
        } else {
            words.push(wordId);
            var data = {            
                words: words
            }
            
            list.getUpdateHandler(req).process(data, function(err) {
                if(err) return res.apiError('create error', err);

                res.apiResponse({msg: 'added successfully'});
            });
        }        
    });          
}

module.exports = router;
