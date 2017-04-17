'use strict';

var ajaxspiner = require('./ajaxspiner');

function isMobile() {
    var mobileAgentHash = ['mobile', 'tablet', 'phone', 'ipad', 'ipod', 'android', 'blackberry', 'windows ce', 'opera mini', 'palm'];
    var    idx = 0;
    var isMobile = false;
    var userAgent = (navigator.userAgent).toLowerCase();

    while (mobileAgentHash[idx] && !isMobile) {
        isMobile = (userAgent.indexOf(mobileAgentHash[idx]) >= 0);
        idx++;
    }
    return isMobile;
}

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
    isMobile: isMobile,
    isAuthenticated: isAuthenticated,
    openAjaxPopup: openAjaxPopup
};

module.exports = util;