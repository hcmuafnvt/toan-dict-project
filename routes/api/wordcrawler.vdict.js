var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var listOfWords;
var selectedWord = null;
var crawlingCount = 0;    

Word.model.find({name: /^a/}).sort({name: 1}).exec(function(err, result) {
    listOfWords = result;
    console.log('list of words of vdict : ', listOfWords.length);
});

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
                createdBy: '58e7b53dfacb8f2f0968e17b'
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
    var crawler = new simplecrawler('https://vdict.com/browse.php');

    crawler.on('fetchstart', function(queueItem, resources) {        
        if(queueItem.depth === 2) {
            console.time('fetchTime');
            console.log('====> fetchstart %s', queueItem.url);
            for(var i = 0; i < listOfWords.length; i++) {                
                if('https://vdict.com' + listOfWords[i].vdictHref === unescape(queueItem.url)) {
                    selectedWord = listOfWords[i];                                             
                    listOfWords.splice(i, 1);
                    break;                
                }
            }

            crawlingCount++;
            console.log(crawlingCount);
            if((crawlingCount % 1000) === 0) {                
                console.log('===============================Waiting 3 minutes=====================');
                crawler.stop();
                setTimeout(function() {
                    console.log('==============================start crawling======================');
                    crawler.start();
                }, 180000);
            }               
        }          
    });

    crawler.on('queueadd', function(queueItem) {
        //console.log('+ queueadd %s ', queueItem.url);
    });

    crawler.discoverResources = function(buffer, queueItem) {        
        return listOfWords.map(function(word) {
            return 'https://vdict.com' + word.vdictHref;
        });        
    };

    crawler.on('fetchredirect', function(oldQueueItem, redirectQueueItem, responseObject) {
        console.log('fetchredirect');
        console.log('oldQueueItem : ', oldQueueItem.url);
        console.log('redirectQueueItem : ', redirectQueueItem.url);
    });

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {        
        if(queueItem.depth === 1) return;        

        console.log('--------' + queueItem.url.substring(queueItem.url.lastIndexOf('/') + 1, queueItem.url.length) + '---------------');
        console.timeEnd('fetchTime');

        console.time('fetchcomplete');        
        var $ = cheerio.load(responseBody.toString("utf8"));
        var $mainContents = $('#result-contents').find('> .phanloai, > .idioms, > .list1');        
        if($mainContents.length === 0 || selectedWord == null || $mainContents.length === 0) {
            return;
        }                   
            
        var translateToVi = {};        
        var types = [];
        $mainContents.each(function() {
            var $self = $(this);

            if($self.hasClass('phanloai')) {                   
                types.push({
                    type: 'gramb',
                    name: $self.text()
                });
            }

            if($self.hasClass('idioms')) {                   
                types.push({
                    type: 'gramb',
                    name: $self.text()
                });
            }

            if($self.hasClass('list1')) {
                var examples = [];
                $self.find('.list2 li').each(function() {
                    var $span = $(this).find('.example-original');
                    var sentence = $span.text();
                    $span.remove();
                    examples.push({
                        sentence: sentence,
                        mean: $(this).text().trim()
                    });
                });

                types.push({
                    type: 'mean',
                    mean: $self.find('> li b').text(),
                    examples: examples
                });
            }
        });

        translateToVi.types = types;     
        
        var con = this.wait();
        selectedWord.mainViMean = $('#result-contents').find('> .list1').first().find('> li b').text();           
        selectedWord.translateToVi = translateToVi;        
        selectedWord.save(function(err) {
            if(err) console.log(err);
            console.timeEnd('fetchcomplete');
            console.log('of : ', selectedWord.name);
            con();
        });              
    });

    crawler.on('complete', function() {
        res.apiResponse('Crawling completed');
        console.timeEnd('crawling');        
    });

    //crawler.maxConcurrency = 1;
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