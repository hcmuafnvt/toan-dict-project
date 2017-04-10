var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var totalWords = 0;

var listOfWords;

// Word.model.find({name: /^a/}).limit(10).exec(function(err, result) {
//     listOfWords = result;
//     console.log('list of words : ', listOfWords.length);
// });

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
        // return listOfWords.map(function(word) {
        //     return 'https://en.oxforddictionaries.com/definition/' + word.name.replace(/ /g, '_');
        // });

        var urls = [
            'https://en.oxforddictionaries.com/definition/take'.replace(/ /g, '_'),
            'https://en.oxforddictionaries.com/definition/eat'.replace(/ /g, '_'),
            //'https://en.oxforddictionaries.com/search?filter=dictionary&query=disputeasdsad',
            'https://en.oxforddictionaries.com/definition/take_a_back_seat'
        ];
        return urls;     
    };   

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {
        if(queueItem.depth === 1) return;        

        console.time('fetchcomplete');
        var $ = cheerio.load(responseBody.toString("utf8"));
        var $mainContents = $('.entryWrapper');        
        if($mainContents.length === 0 || $mainContents.find('.no-exact-matches').length > 0) {
            return;
        }

        var translateToEn = {};
        if($mainContents.find('> .gramb').length > 0) {
            translateToEn.grambs = [];
            $mainContents.find('> .gramb').each(function(idx, gramb) {
                var grambObj = {};
                var $gramb = $(gramb);                
                grambObj.typeOfWord = $gramb.find('.pos').first().text();
                if(grambObj.typeOfWord === '') return;
                grambObj.level1 = [];
                $gramb.find('.semb > li').each(function(idx, level1) {
                    var level1Obj = {};
                    var $level1 = $(level1);

                    level1Obj.mean = $level1.find('.trg p .ind').text();

                    level1Obj.exampls = [];
                    $level1.find('> .trg > .exg .ex').each(function() {
                        var ex = '';
                        if($(this).find('.grammatical_note').length > 0) {
                            ex = '<span class="no-object">' + $(this).find('.grammatical_note').text() + '<span>' + $(this).find('em').text();
                        }  else {
                             ex = $(this).find('em').text();
                        }
                        level1Obj.exampls.push(ex);
                    });
                    if(level1Obj.exampls.length < 5) {
                        var $otherExamples = $level1.find('> .trg > .examples .ex');
                        if($otherExamples.length > 0) {
                            $otherExamples.slice(0, 5 - level1Obj.exampls.length).each(function() {                                
                                var ex = '';
                                if($(this).find('.grammatical_note').length > 0) {
                                    ex = '<span class="no-object">' + $(this).find('.grammatical_note').text() + '<span>' + $(this).find('em').text();
                                }  else {
                                    ex = $(this).find('em').text();
                                }
                                level1Obj.exampls.push(ex);
                            });
                        } 
                    }

                    grambObj.level1.push(level1Obj);
                })
                translateToEn.grambs.push(grambObj);
            });

            console.log(JSON.stringify(translateToEn));
        }
              

        //var con = this.wait();       
        
        // var mainEnMean = $mainContents.find('.ind').first().text(),
        //     phoneticSpelling = $mainContents.find('.phoneticSpelling').first().text(),
        //     soundLink = $mainContents.find('.speaker').first().find('audio').attr('src'),
        //     mainType = $mainContents.find('.pos').first().text();
            
        // console.log('==== mainEnMean : ', mainEnMean);
        // console.log('==== phoneticSpelling : ', phoneticSpelling);
        // console.log('==== soundLink : ', soundLink);
        // console.log('==== mainType : ', mainType);

        // var data = {            
        //     translateToEn: $mainContents.html().replace('<?xml version="1.0"?>', '')
        // };        
        
        

        // var selectedWord = listOfWords.filter(function(obj) {            
        //     return ('https://vdict.com' + obj.vdictHref === queueItem.url);
        // });
        
        // selectedWord[0].getUpdateHandler(req).process(data, function(err) {            
        //     con();
        // });      
        console.timeEnd('fetchcomplete');
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