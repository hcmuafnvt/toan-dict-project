var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var fromindex, toindex;

// crawling words
router.post('/', keystone.middleware.api, function (req, res) {
    console.time('crawling');
    if(!req.body.url || !req.body.fromindex || !req.body.toindex) return res.apiError('validated error');

    var crawler = new simplecrawler(req.body.url);

    crawler.on('fetchstart', function(queueItem, resources) {
        fromindex = req.body.fromindex;
        toindex = req.body.toindex;
        console.log('====> fetchstart %s', queueItem.url);
    });

    crawler.on('queueadd', function(queueItem) {
        console.log('+ queueadd %s ', queueItem.url);
    });

    // crawler.discoverResources = function(buffer, queueItem) {
    //     console.log('discoverResources');
    // var $ = cheerio.load(buffer.toString("utf8")), $mainContents;
    // $mainContents = $('.result-list a'); //en - vi dict
    // return $mainContents.find("a[href]").map(function () {
    //    //console.log($(this).attr("href"));
    //    return $(this).attr("href");
    // }).get();

        // var urls = [];
        // for(var i = req.body.fromindex; i <= req.body.toindex; i++) {
        //     urls.push('https://vdict.com/a%5E,1,0,0,' +  i + '.html');
        // }
        // if(fromindex === toindex) {
        //     return '';
        // } else {
        //     fromindex++;
        //     return 'https://vdict.com/a%5E,1,0,0,' +  fromindex + '.html';
        // }        
    // };

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {
        console.log('fetchcomplete');
        var self = this;
        var con = self.wait();
        var $ = cheerio.load(responseBody);

        var $words = $('.result-list a').toArray();
        // var words = [];
        // $words.each(function(i, word) {                              
        //     var wordData = {
        //         name: word.name,
        //         vdictHref: word.attribs.href,                
        //         createdBy: '58d49e2b3a1ed79cd5c2a428'
        //     },
        //     words.push(wordData);
        //     newWord = new Word.model(wordData);

        //     newWord.save(function(err, word) {
        //         //do it
        //     });
        // });
        async.eachSeries($words, function iteratee(word, callback) {
            var wordData = {
                name: $(word).text(),
                vdictHref: $(word).attr('href'),                
                createdBy: '58d49e2b3a1ed79cd5c2a428'
            },
            
            newWord = new Word.model(wordData);
            newWord.save(function(err, word) {
                if(err) console.log(err);
                callback();
            });
        }, function done() {
            console.log('fetchcomplete');
            con();
        });              
    });

    crawler.on('complete', function() {
        res.apiResponse('Crawling completed');
        console.timeEnd('crawling');        
    });

    crawler.interval = 100000; // Ten seconds
    crawler.maxConcurrency = 3;
    crawler.maxDepth = 2;
    crawler.decodeResponses=true;

    crawler.start();    
});

module.exports = router;