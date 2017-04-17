'use strict';

function handleWindowScroll() {
    $(window).scroll(function() {
        var $window = $(window);
        if($(window).width() < 768) {
            if($(window).scrollTop() > 180) {
                $('.search-section').addClass('fixed');
            } else {
                $('.search-section').removeClass('fixed');
            }
        }    
    });
}


function init() {
    handleWindowScroll();
}

module.exports = {
    init: init
}