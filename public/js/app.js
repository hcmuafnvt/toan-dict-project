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
    if (typeof window.pageContext === 'undefined' || typeof window.pageContext.pageName === 'undefined') {
        return;
    }

    if (typeof pages[window.pageContext.pageName] !== 'undefined') {
        pages[window.pageContext.pageName].init();
    }
}

var selectionEndTimeout;
function lookupHighlightText() {
    if (util.isMobile()) {
        document.onselectionchange = userSelectionChanged;
        $('#btn-translate').on('click', function (e) {
            e.preventDefault();
            alert($(this).data('text'));
        });
    } else {
        $('body').on('mouseup', function (e) {
            e.preventDefault();           

            var text = '';
            if (window.getSelection) {
                text = window.getSelection().toString();                
            } else if (document.selection) {
                text = document.selection.createRange().text;
            }

            if (text != '') {
                $('#translate-text').addClass('active');                
            } else {
                $('#translate-text').removeClass('active');
            }
        });
    }
}

function userSelectionChanged() {
    // wait 500 ms after the last selection change event
    // if (selectionEndTimeout) {
    //     clearTimeout(selectionEndTimeout);
    // }

    selectionEndTimeout = setTimeout(function () {
        // reset selection timeout
        selectionEndTimeout = null;
        var text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection) {
            text = document.selection.createRange().text;
        }
        if (text != '') {
            $('#btn-translate').data('text', text);
            $('#btn-translate').show();
        } else {
            $('#btn-translate').hide();
        }
    }, 1000);
}

var app = {
    init: function () {
        header.init();
        loadJavascriptForPage();
        lookupHighlightText();
        $('.tooltipster').tooltipster({
            functionPosition: function (instance, helper, position) {
                console.log(position);
                position.coord.top = 10;
                position.coord.left = 10;
                return position;
            }
        });
    }
};

$(function () {
    app.init();
});