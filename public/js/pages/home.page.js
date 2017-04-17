'use strict';
var util = require('../helpers/util');

function handleWindowScroll() {
    var $window = $(window);
    $window.scroll(function() {        
        var $window = $(window);
        if($window.width() < 1024 || util.isMobile()) return;

        if($window.scrollTop() >= 300) {                
            $('.search-section').addClass('fix-top').css({'z-index': '99999'});
            $('.about-section').css({'margin-top': '300px'});
        } else {                
            $('.search-section').removeClass('fix-top').css({'z-index': '1'});              
            $('.about-section').css({'margin-top': '0px'});
        }  
    });
}


function init() {
    handleWindowScroll();
}

module.exports = {
    init: init
}