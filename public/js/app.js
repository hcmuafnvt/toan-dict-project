'use strict';

var header = require('./modules/header'),    
    util = require('./helpers/util');

var pages = {
    homepage: require('./pages/home.page'),
    searchresultpage: require('./pages/searchresult.page'),
    learnpage: require('./pages/learn.page'),
    wordcrawlerpage: require('./pages/wordcrawler.page')
}

function loadJavascriptForPage() {
    if(typeof window.pageContext === 'undefined' || typeof window.pageContext.pageName === 'undefined') {
        return;
    }

    if(typeof pages[window.pageContext.pageName] !== 'undefined') {
        pages[window.pageContext.pageName].init();
    }    
}

var app = {
    init: function() {    
        header.init();
        loadJavascriptForPage()
    }
};

$(function() {
    app.init();    
});