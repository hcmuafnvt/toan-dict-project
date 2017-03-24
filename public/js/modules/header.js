'use strict';

var search = require('./search');

function toggleMenu() {
    $('.toggle-menu').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('mobile-menu');
    })
}

function init() {
    toggleMenu();
    search.init();
}

module.exports = {
    init: init
}