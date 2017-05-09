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

function handleSearchList() {
    $('#txtListName').on('focus blur', function(e) {
        e.preventDefault();        
        $('.lib-types').slideDown();
         $(this).attr('placeholder', 'Nhập tên bộ từ  cần tìm');
    });
    $('#txtListName').on('blur', function(e) {
        e.preventDefault();        
        $('.lib-types').slideUp();
        $(this).attr('placeholder', 'Tìm kiếm bộ từ');
    });

    $('.btn-search-list').on('click', function(e) {
        $('.sub-menu').toggleClass('active-search');
    });
}

function init() {
    selectSearchType();
    handleSearchList();
}

module.exports = {
    init: init
}