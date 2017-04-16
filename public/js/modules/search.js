'use strict';

var util = require('../helpers/util');

function searchAutocomplete() {
    // hide search result when hide device keyboard
    // document.addEventListener('focusout', function(e) {
    //     $('#search-suggestion').hide().empty();
    // });

    $("#word").on('input', function() {    
        console.time('autocomplete');    
        var $self = $(this);
        var word = $self.val().trim();
        if(word.length < 1) {
            bindAutoComplete(null);
            return;
        } 

        var pagesize = 5, wWidth = $(window).width();
        if(wWidth >= 768 && wWidth < 1024) {
            pagesize = 8;
        } else {
            pagesize = 20;
        }

        $.ajax({
            url: "/api/vidict/autocomplete/" + $(this).val().trim() + '/' + pagesize + '/' + $('#hdfType').val(),              
            method: "GET",
            dataType: "json",
            success: function (data) {
                bindAutoComplete(data);                
                console.timeEnd('autocomplete');                
            }
        });     
    });    
}

//private function
function bindAutoComplete(data) {
    var $searchSuggestion = $('#search-suggestion');    
    $searchSuggestion.empty(); 

    if(data == null || data.length === 0) {
        $searchSuggestion.hide().empty();
        return;
    }

    var tmplSearchSuggestion = 
    '<ul>' +
        '{{each words}}' +
            '<li>' +
                '<a href="/search?word=${name}&type=vi">' +
                    '<p class="word-name">${name} <span class="phonetic-spelling">${phoneticSpelling}</span></p>' +
                    '<p class="word-mean">{{if mainType}}<span class="main-type">[${mainType}]</span>{{/if}} {{if mainViMean}}{{html mainViMean}}{{else}}{{html mainEnMean}}{{/if}}</p>' +
                '</a>' +                
            '</li>' +
        '{{/each}}' +
    '</ul>';    
    $.tmpl(tmplSearchSuggestion, {words: data}).appendTo('#search-suggestion');
    $searchSuggestion.show();
}

function selectSearchType() {
    var $selectTypeContent = $('.select-types-content');
    $('.select-icons').on('click', function(e) {
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
        $selectTypeContent.find('#hdfType').val($self.data('type'));
        $selectTypeContent.removeClass('active');
        $('.select-icons').removeClass('active');
        $('#word').attr('placeholder', $self.text());
    });
}

function handleClickOnWindow() {  
    if(/iP/i.test(navigator.userAgent)) {
        $('*').css('cursor', 'pointer');
    };
    
    $(document).click(function() {        
        $('.select-types-content').removeClass('active');
        $('.select-icons').removeClass('active');
    });
}

function init() {
    searchAutocomplete();   
    selectSearchType();
    handleClickOnWindow();
}

module.exports = {
    init: init
};
