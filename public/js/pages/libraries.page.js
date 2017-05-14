'use strict';

var util = require('../helpers/util'),
    ajax = require('../helpers/ajax');

function selectSearchType() {
    var $selectTypeContent = $('.lib-types');
        
    $selectTypeContent.on('click', 'li', function(e) {
        e.preventDefault();
        var $self = $(this);
        $selectTypeContent.find('li').removeClass('active');
        $self.addClass('active');        
        $selectTypeContent.removeClass('active');

        //inactive search list
        var $submenu = $('.sub-menu'),
            $libTypes = $('.lib-types');
        $('.btn-search-list input').blur();
        $(window).scrollTop(0);
        $libTypes.removeClass('active');                
        $('.btn-search-list').width(35 + 'px');
        setTimeout(function() {
            $submenu.removeClass('active-search');
        }, 500);            
    });
}

function handleSearchList() {
    var $submenu = $('.sub-menu'),
            $libTypes = $('.lib-types'),
            $window = $(window);
    $('#btn-searchList').on('click', function(e) {        
        if($window.width() >= 768) { //tablet+
            $submenu.addClass('active-search');
            $('.btn-search-list input').focus();            
            $libTypes.addClass('active');
        } else { //mobile
            $('.btn-search-list').width(($window.width() - 118) + 'px');            
            $submenu.addClass('active-search');
            $('.btn-search-list input').focus();
            setTimeout(function() {
                $libTypes.addClass('active');             
            }, 500);  
        }          
    });

    $('#btn-close-searchList').on('click', function(e) {
        if($window.width() >= 768) { //tablet+
            $submenu.removeClass('active-search');
            $('.btn-search-list input').blur();            
            $libTypes.removeClass('active');
        } else { //mobile
            $('.btn-search-list input').blur();
            $(window).scrollTop(0);
            $libTypes.removeClass('active');                
            $('.btn-search-list').width(35 + 'px');
            setTimeout(function() {
                $submenu.removeClass('active-search');
            }, 500);
        }        
    });

    //desktop : focus and blur
    if($window.width() >= 768) {
        $('.btn-search-list input').on('focus', function(e) {
            e.preventDefault();
            $submenu.addClass('active-search');          
            $libTypes.addClass('active');
        }).on('blur', function(e) {
            e.preventDefault();
            $submenu.removeClass('active-search');                    
            $libTypes.removeClass('active');
        });
    }    
}

function init() {
    selectSearchType();
    handleSearchList();
}

module.exports = {
    init: init
}