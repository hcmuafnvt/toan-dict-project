var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var totalWords = 0;

var listOfWords;

Word.model.find({name: /^a/}).limit(10).exec(function(err, result) {
    listOfWords = result;
    console.log('list of words : ', listOfWords.length);
});

// crawling mean of word
router.get('/getword', keystone.middleware.api, function (req, res) {    
    console.time('crawling');
    var crawler = new simplecrawler('https://en.oxforddictionaries.com/');

    crawler.on('fetchstart', function(queueItem, resources) {
        if(queueItem.depth === 2) {
            console.log('====> fetchstart %s', queueItem.url);
        }        
    });

    crawler.on('queueadd', function(queueItem) {
        //console.log('+ queueadd %s ', queueItem.url);
    });

    crawler.discoverResources = function(buffer, queueItem) {        
        return listOfWords.map(function(word) {
            return 'https://en.oxforddictionaries.com/definition/' + word.name.replace(/ /g, '_');
        });        
    };   

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {
        if(queueItem.depth === 1) return;        

        var $ = cheerio.load(responseBody.toString("utf8"));
        var $mainContents = $('.entryWrapper');        
        if($mainContents.length === 0) {            
            return;
        }       

        var con = this.wait();       
        
        console.log('==== fetchcomplete : ', $mainContents.find('.entryHead .hw').text());

        // var data = {            
        //     translateToEn: $mainContents.html().replace('<?xml version="1.0"?>', '')
        // };        
        
        

        // var selectedWord = listOfWords.filter(function(obj) {            
        //     return ('https://vdict.com' + obj.vdictHref === queueItem.url);
        // });
        
        // selectedWord[0].getUpdateHandler(req).process(data, function(err) {            
        //     con();
        // });      
    });

    crawler.on('complete', function() {
        res.apiResponse('Crawling completed');
        console.timeEnd('crawling');        
    });

    crawler.maxConcurrency = 1;
    crawler.maxDepth = 2;
    crawler.decodeResponses=true;
    crawler.start();   
});

module.exports = router;


// a = 4406
// b = 3231
// c = 10110
// d = 7151
// e = 4103
// f = 3081
// g = 1880
// h = 2532
// i = 3659
// j = 526
// k = 506
// l = 2227
// m = 3035
// n = 1097
// o = 1885
// p = 3640
// q = 308
// r = 2423
// s = 7707
// t = 2737
// u = 2467
// v = 936
// w = 1353
// x = 30
// y = 149
// z = 107