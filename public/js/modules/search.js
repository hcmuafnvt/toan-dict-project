'use strict';

function bindAutoComplete(data) {
    var $searchSuggestion = $('#search-suggestion');    
    $searchSuggestion.empty(); 

    if(data == null) {
        return;
    }

    var len = data.suggestions.length;
    var result = '<ul>';    
    $.each(data.suggestions, function(index, item) {        
        result += '<li><a href="/search?word=' + item.select + '&type=vi">' + $(item.data).html() + '</a></li>';
    });
    $searchSuggestion.append(result + '</ul>');
}

function searchAutocomplete() {
    $("#word").on('input', function() {
        var $self = $(this);
        var word = $self.val().trim();
        if(word === '') {
            bindAutoComplete(null);
            return;
        } 

        $.ajax({
            url: "/api/vidict/autocomplete/" + $(this).val().trim(),              
            method: "GET",
            dataType: "json",
            success: function (data) {      
                bindAutoComplete(data);
            }
        });     
    });    
}

function init() {
    searchAutocomplete();
}

module.exports = {
    init: init
};
