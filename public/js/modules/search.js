'use strict';

var util = require('../helpers/util');

function searchAutocomplete() {
    // hide search result when hide device keyboard
    document.addEventListener('focusout', function(e) {
        $('#search-suggestion').hide().empty();
    });

    $("#word").on('input', function(e) {        
        console.time('autocomplete');    
        var $self = $(this);
        var word = $self.val().trim();
        $self.data('word', word);
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
                    '<p class="word-name"><span class="name">${name}</span> <span class="phonetic-spelling">${phoneticSpelling}</span></p>' +
                    '<p class="word-mean">{{if mainType}}<span class="main-type">[${mainType}]</span>{{/if}} {{if mainViMean}}{{html mainViMean}}{{else}}{{html mainEnMean}}{{/if}}</p>' +
                '</a>' +                
            '</li>' +
        '{{/each}}' +
    '</ul>';    
    $.tmpl(tmplSearchSuggestion, {words: data}).appendTo('#search-suggestion');
    $searchSuggestion.show();

    // $searchSuggestion.find('li').hover(function() {
    //     $('#search-suggestion li').removeClass('active');
    //     $(this).addClass('active');
    // }, function() {
    //     $('#search-suggestion li').removeClass('active');
    // });
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

function handleKeyDown() {
    if(util.isMobile()) { 
        console.log('handleKeyDown : isMobile');
        return;
    }
    
    var $searchSuggestion = $('#search-suggestion');
    var $inutWord = $('#word');    
    $inutWord.on('keydown', function(e) {                     
        if($searchSuggestion.css('display') === 'none') return;        

        var originInputValue = $inutWord.data('word');

        if(e.keyCode === 27) { //esc 
             $searchSuggestion.hide().empty();
             $inutWord.val(originInputValue);
        }
        
        if(e.keyCode === 38) { //up
            var $prev = $searchSuggestion.find('li.active').prev();
            $searchSuggestion.find('li.active').removeClass('active');
            if($prev.length > 0) {                
                $prev.addClass('active');
                $inutWord.val($prev.find('.name').text());
            } else {
                $inutWord.val(originInputValue);
            }
            e.preventDefault();
        } else if(e.keyCode === 40) { //down
            if($searchSuggestion.find('li.active').length > 0) {
                 $searchSuggestion.find('li:not(:last-child).active').removeClass('active').next().addClass('active');                 
            } else {
                $searchSuggestion.find('li:first').addClass('active');
            }
            $inutWord.val($searchSuggestion.find('li.active:first').find('.name').text());
            e.preventDefault();
        }
        var $currentItem = $searchSuggestion.find('li.active:first');
        if($currentItem.length > 0) {
            $searchSuggestion.scrollTop(0);            
            $searchSuggestion.scrollTop(($currentItem.position().top - $searchSuggestion.height()) + $currentItem.height());            
        }        
    });
}

function init() {
    $('#word').focus();
    searchAutocomplete();   
    selectSearchType();
    handleClickOnWindow();    
    handleKeyDown();
}

module.exports = {
    init: init
};
