var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var listOfWords;
var crawlingCount = 0;    

Word.model.find({name: /^d/}).sort({name: 1}).exec(function(err, result) {
    listOfWords = result;
    console.log('list of words of oxford : ', listOfWords.length);
});

// crawling mean of word
router.get('/getword', keystone.middleware.api, function (req, res) {    
    console.time('crawling');
    var crawler = new simplecrawler('https://en.oxforddictionaries.com/');

    crawler.on('fetchstart', function(queueItem, resources) {        
        if(queueItem.depth === 2) {
            crawlingCount++;
            console.log('====> (%d) fetchstart %s', crawlingCount, queueItem.url);
            console.time('fetchTime');           
           
            if((crawlingCount % 100) === 0) {                
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
            return 'https://en.oxforddictionaries.com/definition/' + word.name.replace(/ /g, '_');
        });        
    };

    crawler.on('fetchredirect', function(oldQueueItem, redirectQueueItem, responseObject) {
        console.log('fetchredirect');
        console.log('oldQueueItem : ', oldQueueItem.url);
        console.log('redirectQueueItem : ', redirectQueueItem.url);
        var selectedWord = null;
        for(var i = 0; i < listOfWords.length; i++) {                
            if('https://en.oxforddictionaries.com/definition/' + listOfWords[i].name.replace(/ /g, '_') === unescape(oldQueueItem.url)) {
                selectedWord = listOfWords[i];                                             
                listOfWords.splice(i, 1);
                break;                
            }
        }
        if(selectedWord !== null) {
            selectedWord.isEnRedirected = true;
            selectedWord.save(function() {            
                //TODO sth
            });
        }        
    });

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {        
        if(queueItem.depth === 1) return;        

        console.log('--------' + queueItem.url.substring(queueItem.url.lastIndexOf('/') + 1, queueItem.url.length) + '---------------');
        console.timeEnd('fetchTime');

        console.time('fetchcomplete');        
        var $ = cheerio.load(responseBody.toString("utf8"));
        var $mainContents = $('.entryWrapper');        
        if($mainContents.length === 0 || $mainContents.find('.no-exact-matches').length > 0) {
            return;
        }                   
            
        var translateToEn = {};

        // grambs
        if($mainContents.find('> .gramb').length > 0) {
            translateToEn.grambs = [];
            $mainContents.find('> .gramb').each(function(idx, gramb) {
                var grambObj = {};
                var $gramb = $(gramb);                
                grambObj.typeOfWord = $gramb.find('.pos').first().text();
                if(grambObj.typeOfWord === '') return;
                grambObj.level1 = [];
                $gramb.find('.semb > li').each(function(idx, level1) {
                    //level 1
                    var level1Obj = {};
                    var $level1 = $(level1);

                    if($level1.find('.derivative_of').length > 0) {
                        level1Obj.mean = $level1.find('.derivative_of').first().html();
                    } else {
                        level1Obj.mean = $level1.find('.trg p .ind').text();
                    }   
                    
                    level1Obj.examples = [];
                    $level1.find('> .trg > .exg .ex').each(function() {
                        var ex = '';
                        if($(this).find('.form-groups').length > 0) {
                            ex += '<span class="level1-strong-mean">' + $(this).find('.form-groups strong').text() + '</span>';
                        }
                        if($(this).find('.grammatical_note').length > 0) {
                            ex += '<span class="no-object">' + $(this).find('.grammatical_note').text() + '</span>';
                        }                            
                        ex += $(this).find('em').text();
                        level1Obj.examples.push(ex);
                    });
                    if(level1Obj.examples.length < 5) {
                        var $otherExamples = $level1.find('> .trg > .examples .ex');
                        if($otherExamples.length > 0) {
                            $otherExamples.slice(0, 5 - level1Obj.examples.length).each(function() {                                
                                var ex = '';
                                if($(this).find('.form-groups').length > 0) {
                                    ex += '<span class="level1-strong-mean">' + $(this).find('.form-groups strong').text() + '</span>';
                                }
                                if($(this).find('.grammatical_note').length > 0) {
                                    ex += '<span class="no-object">' + $(this).find('.grammatical_note').text() + '</span>';
                                }                            
                                ex += $(this).find('em').text();
                                level1Obj.examples.push(ex);
                            });
                        } 
                    }

                    //level 2
                    level1Obj.level2 = [];
                    $level1.find('.subSense').each(function(idx, level2) {
                        var level2Obj = {};
                        var $level2 = $(level2);
                        
                        var level2Mean = '';
                        if($level2.find('.form-groups').length > 0) {
                            level2Mean += '<span class="level2-strong-mean">' + $level2.find('.form-groups strong').text() + '</span>';
                        }
                        if($level2.find('.grammatical_note').length > 0) {
                            level2Mean += '<span class="no-object">' + $level2.find('.grammatical_note').text() + '</span>';
                        }                            
                        level2Mean += $level2.find('.ind').text();
                        level2Obj.mean = level2Mean;
                        
                        level2Obj.examples = [];
                        $level2.find('> .trg > .exg .ex').each(function() {
                            var ex = '';
                            if($(this).find('.form-groups').length > 0) {
                                ex += '<span class="level2-strong-ex">' + $(this).find('.form-groups strong').text() + '</span>';
                            }
                            if($(this).find('.grammatical_note').length > 0) {
                                ex += '<span class="no-object">' + $(this).find('.grammatical_note').text() + '</span>';
                            }                            
                            ex += $(this).find('em').text();
                            level2Obj.examples.push(ex);
                        });
                        if(level2Obj.examples.length < 2) {
                            var $otherExamples = $level2.find('> .trg > .examples .ex');
                            if($otherExamples.length > 0) {
                                $otherExamples.slice(0, 2 - level2Obj.examples.length).each(function() {                                
                                    var ex = '';
                                    if($(this).find('.form-groups').length > 0) {
                                        ex += '<span class="level2-strong-mean">' + $(this).find('.form-groups strong').text() + '</span>';
                                    }
                                    if($(this).find('.grammatical_note').length > 0) {
                                        ex += '<span class="no-object">' + $(this).find('.grammatical_note').text() + '</span>';
                                    }                            
                                    ex += $(this).find('em').text();
                                    level2Obj.examples.push(ex);
                                });
                            } 
                        }
                        level1Obj.level2.push(level2Obj);
                    });

                    grambObj.level1.push(level1Obj);
                })
                translateToEn.grambs.push(grambObj);
            });            
        }

        // etymology
        if($mainContents.find('> .etymology').length > 0) {
            translateToEn.etymologys = [];
            $mainContents.find('> .etymology').each(function(idx, etymology) {
                var etymologyObj = {};
                var $etymology = $(etymology);                
                etymologyObj.typeOfWord = $etymology.find('.phrases-title').first().text();
                if(etymologyObj.typeOfWord === '') return;
                etymologyObj.level1 = [];
                var $listPhases = $etymology.find('.gramb > li');
                var $listMeansAndEx = $etymology.find('.gramb .semb');
                for(var i = 0; i < $listPhases.length; i++) {                
                    //level 1
                    var level1Obj = {};
                    var $level1Phase = $listPhases.eq(i);
                    var $level1Mean = $listMeansAndEx.eq(i);

                    level1Obj.phase = $level1Phase.find('.trg .ind').text();
                    level1Obj.mean = $level1Mean.find('.trg').first().find('.ind').text();

                    level1Obj.examples = [];
                    $level1Mean.find('.trg').eq(1).find('> .exg .ex').each(function() {
                        var ex = '';
                        if($(this).find('.form-groups').length > 0) {
                            ex += '<span class="level1-strong-mean">' + $(this).find('.form-groups strong').text() + '</span>';
                        }
                        if($(this).find('.grammatical_note').length > 0) {
                            ex += '<span class="no-object">' + $(this).find('.grammatical_note').text() + '</span>';
                        }                            
                        ex += $(this).find('em').text();
                        level1Obj.examples.push(ex);
                    });
                    if(level1Obj.examples.length < 2) {
                        var $otherExamples = $level1Mean.find('.trg').eq(1).find('> .examples .ex');
                        if($otherExamples.length > 0) {
                            $otherExamples.slice(0, 2 - level1Obj.examples.length).each(function() {                                
                                var ex = '';
                                if($(this).find('.form-groups').length > 0) {
                                    ex += '<span class="level1-strong-mean">' + $(this).find('.form-groups strong').text() + '</span>';
                                }
                                if($(this).find('.grammatical_note').length > 0) {
                                    ex += '<span class="no-object">' + $(this).find('.grammatical_note').text() + '</span>';
                                }                            
                                ex += $(this).find('em').text();
                                level1Obj.examples.push(ex);
                            });
                        } 
                    }                    

                    etymologyObj.level1.push(level1Obj);
                }                
                translateToEn.etymologys.push(etymologyObj);
            });            
        }        
        
        var selectedWord = null;
        for(var i = 0; i < listOfWords.length; i++) {                
            if('https://en.oxforddictionaries.com/definition/' + listOfWords[i].name.replace(/ /g, '_') === unescape(queueItem.url)) {
                selectedWord = listOfWords[i];                                             
                listOfWords.splice(i, 1);
                break;                
            }
        }

        if(selectedWord == null) {
            console.log('~~~~~~~~~~~~~~~~ because fetch redirect link : ', queueItem.url);
            return;
        }

        var con = this.wait();
        if($mainContents.find('.derivative_of').length > 0) {
            selectedWord.mainEnMean = $mainContents.find('.derivative_of').first().html();
        } else {
            selectedWord.mainEnMean = $mainContents.find('.ind').first().text();
        }        

        selectedWord.phoneticSpelling = $mainContents.find('.phoneticspelling').first().text();
        selectedWord.soundLink = $mainContents.find('.speaker').first().find('audio').attr('src');
        selectedWord.mainType = $mainContents.find('.pos').first().text();
        selectedWord.translateToEn = translateToEn;
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
        console.log('listOfWords : ', listOfWords.length);        
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