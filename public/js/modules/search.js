'use strict';

function searchAutocomplete() {
    // hide search result when hide device keyboard
    document.addEventListener('focusout', function(e) {
        $('#search-suggestion').hide().empty();
    });

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
            url: "/api/vidict/autocomplete/" + $(this).val().trim() + '/' + pagesize,              
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

    var len = data.length;
    var result = '<ul>';    
    // $.each(data, function(index, item) {        
    //     result += '<li><a href="/search?word=' + item.select + '&type=vi">' + $(item.data).html() + '</a></li>';
    // });
    $.each(data, function(index, word) {        
        result += '<li><a href="/search?word=' + word.name + '&type=vi">' + word.name + '</a></li>';
    });
    $searchSuggestion.append(result + '</ul>');
    $searchSuggestion.show();
}

function selectSearchType() {
    $('.select-icons').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.select-types-content').toggleClass('active');
    });

    $('.select-types-content li').on('click', function(e) {
        e.preventDefault();
        var $self = $(this);
        $('.select-types-content li').removeClass('active');
        $self.addClass('active');
    });
}

function init() {
    searchAutocomplete();   
    selectSearchType();
}

module.exports = {
    init: init
};
