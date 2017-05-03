'use strict';

var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    async = require('async'),
    fs = require('fs');

// crawling mean of word
router.get('/', keystone.middleware.api, function (req, res) {
    console.time('getwordlist');

    // Returns the path to the word list which is separated by `\n` 
    const wordListPath = require('word-list');    
    const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
    console.log(wordArray.length);

    var wordData, count=1;
    async.eachSeries(wordArray, function iteratee(word, callback) {
        wordData = {
            name: word,
            createdBy: '58d0aed90c782f66215edf31'
        };        
        var newWord = new Word.model(wordData);

        newWord.save(function(err, word) {
            console.log(count + ' : ' + wordData.name);
            if(err) {
                console.log(err.err);
            }            
            count++;
            callback();
        });
    }, function done() {
        res.apiResponse('Get word-list completed');
        console.log('done!!!!!!');
        console.timeEnd('getwordlist');
    });    
});

module.exports = router;