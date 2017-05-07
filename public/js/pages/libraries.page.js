'use strict';

var util = require('../helpers/util'),
    ajax = require('../helpers/ajax');

function selectSearchType() {
    var $selectTypeContent = $('.lib-types');
    $('.filter-lib').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('active');        
        $selectTypeContent.toggleClass('active');       
    });
    
    $selectTypeContent.on('click', 'li', function(e) {
        e.preventDefault();
        var $self = $(this);
        $selectTypeContent.find('li').removeClass('active');
        $self.addClass('active');        
        $selectTypeContent.removeClass('active');
        $('.filter-lib').removeClass('active');        
    });
}

function init() {
    selectSearchType();
}

module.exports = {
    init: init
}