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

function lookupHighlightText() {
    if (util.isMobile()) {
        var selectionEndTimeout;
        document.onselectionchange = function () {
            selectionEndTimeout = setTimeout(function () {
                // reset selection timeout
                selectionEndTimeout = null;
                showTranslateButton();
            }, 500);
        }
    } else {
        $('body').on('mouseup', function (e) {
            e.preventDefault();
            showTranslateButton();
        });
    }

    $('#translate-text').on('click', function (e) {
        e.preventDefault();
        $.magnificPopup.open({                        
            type: 'ajax',            
            items: { src: '/api/translate/en-vi' },
            ajax: {
                settings: {
                    method: 'POST',
                    'content-type': 'application/json',
                    data: {text :  $('#translate-text').data('text')}
                }
            },
            callbacks: {
                parseAjax: function(mfpResponse) {
                    var $translatePopup = $('#translate-popup-wrapper');
                    $translatePopup.find('.content').html('<p>' + mfpResponse.data.translated + '</p>');
                    mfpResponse.data = $('#translate-popup-wrapper').html();                
                },
                ajaxContentAdded: function() {
                    // Ajax content is loaded and appended to DOM
                    //console.log(this.content);
                }
            }
        });
    });

    // $('#translate-text').magnificPopup({
    //     type: 'ajax',
    //     // ajax: {
    //     //     settings: {
    //     //         method: 'POST',
    //     //         'content-type': 'application/json',
    //     //         data: {text :  $('#translate-text').data('text')}
    //     //     }
    //     // },
    //     callbacks: {
    //         // parseAjax: function(mfpResponse) {
    //         //     var $translatePopup = $('#translate-popup-wrapper');
    //         //     $translatePopup.find('.content').html('<p>' + mfpResponse.data.translated + '</p>');
    //         //     mfpResponse.data = $('#translate-popup-wrapper').html();                
    //         // },
    //         // ajaxContentAdded: function() {
    //         //     // Ajax content is loaded and appended to DOM
    //         //     //console.log(this.content);
    //         // }
    //         open: function () {
    //             $.ajax({
    //                 url: "/api/translate/en-vi",
    //                 method: "POST",
    //                 data: { text: $('#translate-text').data('text') },
    //                 success: function (data) {
    //                     if (data.success == true) {
    //                         var $translatePopup = $('#translate-popup-wrapper');
    //                         $translatePopup.find('.content').html('<p>' + data.translated + '</p>');
    //                         parent.html($('#translate-popup-wrapper').html());
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // })
}

function showTranslateButton() {
    var $translateText = $('#translate-text');
    var text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection) {
        text = document.selection.createRange().text;
    }

    if (text != '') {
        $translateText.data('text', text);
        $translateText.addClass('active');
    } else {
        $translateText.removeClass('active');
    }
}

var app = {
    init: function () {
        header.init();
        loadJavascriptForPage();
        lookupHighlightText();
    }
};

$(function () {
    app.init();
});