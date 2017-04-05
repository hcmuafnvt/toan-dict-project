var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');



// crawling words
router.post('/', keystone.middleware.api, function (req, res) {
    console.time('crawling');
    var fromindex, toindex, isDiscoverResources = false;    
    if(!req.body.url || !req.body.fromindex || !req.body.toindex) return res.apiError('validated error');

    var crawler = new simplecrawler(req.body.url);

    crawler.on('fetchstart', function(queueItem, resources) {        
        fromindex = req.body.fromindex;
        toindex = req.body.toindex;
        //console.log('====> fetchstart %s', queueItem.url);
    });

    crawler.on('queueadd', function(queueItem) {
        console.log('+ queueadd %s ', queueItem.url);
    });

    crawler.discoverResources = function(buffer, queueItem) {
        console.log('discoverResources : ', queueItem.url);
        // var $ = cheerio.load(buffer.toString("utf8")), $mainContents;
        // $mainContents = $('.result-list a'); //en - vi dict
        // return $mainContents.find("a[href]").map(function () {
        // //console.log($(this).attr("href"));
        // return $(this).attr("href");
        // }).get();

        if(!isDiscoverResources) {
            console.log('has discoverResources');
            isDiscoverResources = true;
            var urls = [];
            for(var i = parseInt(req.body.fromindex); i <= parseInt(req.body.toindex); i++) {
                urls.push('https://vdict.com/z%5E,1,0,0,' +  i + '.html');
            }            
            return urls;  
        }        
    };

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {        
        var self = this;
        var con = self.wait();
        var $ = cheerio.load(responseBody);
        var $words = $('.result-list a');      
        
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
            console.log('fetchcomplete : ', queueItem.url);
            con();
        });              
    });

    crawler.on('complete', function() {
        res.apiResponse('Crawling completed');
        console.timeEnd('crawling');        
    });

    //crawler.interval = 1000; // 1 second
    crawler.maxConcurrency = 3;
    crawler.maxDepth = 2;
    crawler.decodeResponses=true;

    crawler.start();    
});

module.exports = router;