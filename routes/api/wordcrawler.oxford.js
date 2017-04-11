var router = require('express').Router(),
    keystone = require('keystone'),
    Word = keystone.list('Word'),
    simplecrawler = require("simplecrawler"),
    cheerio = require('cheerio'),
    async = require('async');

var totalWords = 0;

var listOfWords;

Word.model.find({name: 'eat'}).exec(function(err, result) {
    listOfWords = result;
    console.log('list of words : ', listOfWords.length);
});

// crawling mean of word
router.get('/getword', keystone.middleware.api, function (req, res) {    
    console.time('crawling');
    var crawler = new simplecrawler('https://en.oxforddictionaries.com/');

    crawler.on('fetchstart', function(queueItem, resources) {        
        if(queueItem.depth === 2) {
            console.time('fetchTime');
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

        // var urls = [
        //     // 'https://en.oxforddictionaries.com/definition/take',
        //     // 'https://en.oxforddictionaries.com/definition/eat',
        //     // 'https://en.oxforddictionaries.com/search?filter=dictionary&query=disputeasdsad',
        //     'https://en.oxforddictionaries.com/definition/take_a_back_seat'
        // ];
        // return urls;     
    };   

    crawler.on("fetchcomplete", function(queueItem, responseBody, response) {
        if(queueItem.depth === 1) return;        

        console.timeEnd('fetchTime');

        console.time('fetchcomplete');
        var con = this.wait(); 
        var $ = cheerio.load(responseBody.toString("utf8"));
        var $mainContents = $('.entryWrapper');        
        if($mainContents.length === 0 || $mainContents.find('.no-exact-matches').length > 0) {
            return;
        }

        var data = {
            mainEnMean: $mainContents.find('.ind').first().text(),
            phoneticSpelling: $mainContents.find('.phoneticspelling').first().text(),
            soundLink: $mainContents.find('.speaker').first().find('audio').attr('src'),
            mainType: $mainContents.find('.pos').first().text()
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
                    level1Obj.mean = $level1.find('.trg p .ind').text();
                    
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


        //console.log(JSON.stringify(translateToEn));
              
        data.translateToEn = translateToEn;
        var selectedWord = listOfWords.filter(function(obj) {            
            return ('https://en.oxforddictionaries.com/definition/' + obj.name.replace(/ /g, '_') === queueItem.url);
        });
        
        selectedWord[0].getUpdateHandler(req).process(data, function(err, word) {
            word.translateToEn = translateToEn;
            word.save(function(err, word1) {
                console.log(word1);
            });
            console.timeEnd('fetchcomplete');
            con();
        });        
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