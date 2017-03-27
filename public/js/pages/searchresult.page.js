'use strict';

var util = require('../helpers/util');

function addToList() {
    $('#addToList').on('click', function(e) {
        e.preventDefault();
        if(!util.isAuthenticated()) {
            $.magnificPopup.open({
                items: {
                    src: '.authen-popup', // can be a HTML string, jQuery object, or CSS selector
                    type: 'inline'
                }
            });
            return;
        }
    })
}

function init() {
    addToList();
}

module.exports = {
    init: init
}