'use strict';

var header = require('./modules/header'),   
    ajaxspiner = require('./helpers/ajaxspiner'),
    util = require('./helpers/util');

var pages = {
    homepage: require('./pages/home.page'),
    searchresultpage: require('./pages/searchresult.page')
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