'use strict';

var ajaxspiner = require('./ajaxspiner');

function isAuthenticated() {
    if(typeof userId !== 'undefined' && userId !== '')
        return true;
    return false;
}

function openAjaxPopup(url, popupSelector) {    
    $.magnificPopup.open({
        items: {
            src: popupSelector
        },
        callbacks: {
            beforeOpen: function() {
                ajaxspiner.start({
                    spinnerContainer: popupSelector
                });
            }
        }
    });
}

var util = {
    isAuthenticated: isAuthenticated,
    openAjaxPopup: openAjaxPopup
};

module.exports = util;