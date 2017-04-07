var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var totalWords = 0;

// crawling words
router.post('/', keystone.middleware.api, function (req, res) {
    console.time('crawling');
    var crawler = new simplecrawler('https://vdict.com/browse.php');

    crawler.on('fetchstart', function(queueItem, resources) {
        if(queueItem.depth === 2 || queueItem.depth === 3) {
            console.log('====> fetchstart %s', queueItem.url);
        }        
        //console.log('====> fetchstart %s', queueItem.url);
    });

    crawler.on('queueadd', function(queueItem) {
        //console.log('+ queueadd %s ', queueItem.url);
    });

    crawler.discoverResources = function(buffer, queueItem) {
        //console.log('discoverResources : ', queueItem.url);
        var $ = cheerio.load(buffer.toString("utf8"));            

        if(queueItem.depth === 1) {            
            var $mainContents = $('.abclist').first(); //en - vi dict
            return $mainContents.find('a[href]').map(function () {           
                return 'https://vdict.com/' + $(this).attr("href");
            }).get();
        }

        if(queueItem.depth === 2) {            
            if($('.pageslist').length === 0) return;
            
            var lastPageOfPageList = $('.pageslist').first().find('a').last().get('0').attribs.href; //en - vi dict                                   
            var numberOfLastPage = parseInt(lastPageOfPageList.substring(lastPageOfPageList.lastIndexOf(',') + 1, lastPageOfPageList.indexOf('.html')));
            var urls = [];
            for(var i=2; i <= numberOfLastPage; i++) {
                urls.push('https://vdict.com' + lastPageOfPageList.substring(0, lastPageOfPageList.lastIndexOf(',') + 1) + i + '.html');
            }
            return urls;
        }    
    };

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {
        if(queueItem.depth === 1) return;

        var self = this;
        var con = self.wait();
        var $ = cheerio.load(responseBody);
        var $words = $('.result-list a');

        totalWords += $words.length;
        console.log('words: ',  $words.length, ', totalWords : ', totalWords);      
        
        async.eachSeries($words, function iteratee(word, callback) {
            var wordData = {
                name: $(word).text(),
                vdictHref: $(word).attr('href'),                
                createdBy: '58d49e2b3a1ed79cd5c2a428'
            },
            
            newWord = new Word.model(wordData);
            newWord.save(function(err, word) {
                if(err) {
                    //console.log('error : ', err.err);
                } else {
                    console.log('success : ', word.name);
                }
                
                callback();
            });
        }, function done() {
            //console.log('fetchcomplete : ', queueItem.url);
            con();
        });              
    });

    crawler.on('complete', function() {
        res.apiResponse('Crawling completed');
        console.timeEnd('crawling');        
    });

    //crawler.interval = 1000; // 1 second
    crawler.maxConcurrency = 3;
    crawler.maxDepth = 3;
    crawler.decodeResponses=true;

    crawler.start();    
});

// crawling mean of word
router.get('/getword', keystone.middleware.api, function (req, res) {
    console.time('crawling');
    var crawler;
    
    Word.model.find({}).limit(20).exec(function(err, words) {
        for(var i = 0; i < words.length; i++) {
            // crawler = new simplecrawler('https://vdict.com/' + words[i].vdictHref);

            // crawler.on("fetchcomplete", function(queueItem, responseBody, response) {
            //     console.log('fetchcomplete : ', queueItem.url);
            //     // var self = this;
            //     // var con = self.wait();
            //     // var $ = cheerio.load(responseBody);
            // });

            // crawler.on('complete', function() {
            //     res.apiResponse('Crawling completed');
            //     console.timeEnd('crawling');        
            // });

            // crawler.maxConcurrency = 1;
            // crawler.maxDepth = 1;
            // crawler.decodeResponses=true;

            // crawler.start();    
            console.log(words.name, ', ');
        }   
    });
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