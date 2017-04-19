'use strict';

var util = require('../helpers/util');

function initpage() {
    //bind search input
    var searchType = $('#hdfType').val();
    var $wordInput = $('#word');
    if(searchType === 'en-vi') { //en-vi
        $wordInput.attr('placeholder', 'English - Vietnamese');
    } else if(searchType === 'en-en') { //en-en
        $wordInput.attr('placeholder', 'English - English');
    } else if(searchType === 'vi-en') { //vi-en
        $wordInput.attr('placeholder', 'Vietnamese - English');
    }

    //bind data for dict type
    $('.dict-type li').removeClass('active');
    $('.dict-type').find('li[data-type="' + searchType + '"]').addClass('active');
}

function searchAutocomplete() {
    $("#word").on('input', function(e) {        
        console.time('autocomplete');    
        var $self = $(this);
        var word = $self.val().trim();
        $self.data('word', word);
        if(word.length < 1) {
            //$('#btn-clearinput').removeClass('active');
            bindAutoComplete(null);
            return;
        } 

        //$('#btn-clearinput').addClass('active');

        var pagesize = 5, wWidth = $(window).width();
        if(wWidth >= 768 && wWidth < 1024) {
            pagesize = 8;
        } else if (wWidth >= 1024) {
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

    $('#btn-clearinput').on('click', function(e) {
        e.preventDefault();
        console.log('asdsa');
    });
}

//private function
function bindAutoComplete(data) {
    var $searchSuggestion = $('#search-suggestion');    
    $searchSuggestion.empty(); 

    if(data == null || data.length === 0) {
        $searchSuggestion.trigger('hide');
        return;
    }

    var tmplSearchSuggestion = 
    '<ul>' +
        '{{each words}}' +
            '<li>' +
                '<a class="autosearch-item" href="/search?word=${name}&type=vi">' +
                    '<p class="word-name"><span class="name">${name}</span> <span class="phonetic-spelling">${phoneticSpelling}</span></p>' +
                    '<p class="word-mean">{{if mainType}}<span class="main-type">[${mainType}]</span>{{/if}} {{if mainViMean}}{{html mainViMean}}{{else}}{{html mainEnMean}}{{/if}}</p>' +
                '</a>' +                
            '</li>' +
        '{{/each}}' +
    '</ul>';    
    $.tmpl(tmplSearchSuggestion, {words: data}).appendTo('#search-suggestion');
    $searchSuggestion.trigger('show');
}

function submitForm() {
    $('.frmSearch').on('submit', function(e) {
        //$('#word').attr('disabled', 'true');
        e.preventDefault();
        window.location.href = '/definition/' + $('#hdfType').val() + '/' + $('#word').val().trim();
    });
}

function showHideSearchSuggestion() {
    $('#search-suggestion').on('show', function(e) {
        e.preventDefault();        
        $(this).slideDown();
        $('.search-section').css({'position': 'absolute'});

    });

    $('#search-suggestion').on('hide', function(e) {
        e.preventDefault();
        $(this).hide().empty();
        $('.search-section').css({'position': 'fixed'});
    });
}

function selectSearchType() {
    var $selectTypeContent = $('.select-types-content');
    $('.select-icons').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('active');
        $('#search-suggestion').trigger('hide');
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
        $('#word').attr('placeholder', $self.text()).val('').data('word', '').focus();
    });
}

function handleClickOnWindow() {  
    if(/iP/i.test(navigator.userAgent)) {
        $('*:not("a")').css('cursor', 'pointer');
    };
    
    $(document).click(function() {
        $('#search-suggestion').trigger('hide');
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
    $('#home-page #word').focus();
    initpage();
    searchAutocomplete();
    submitForm();
    selectSearchType();
    handleClickOnWindow();    
    handleKeyDown();
    showHideSearchSuggestion();
    //inputFocusOut();
}

module.exports = {
    init: init
};
