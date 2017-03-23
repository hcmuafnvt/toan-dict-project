'use strict';

function toggleMenu() {
    $('.toggle-menu').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('mobile-menu');
    })
}

function bindAutoComplete(data) {
    var $searchSuggestion = $('#search-suggestion');    
    $searchSuggestion.empty(); 

    if(data == null) {
        return;
    }

    var len = data.suggestions.length;
    var result = '<ul>';    
    $.each(data.suggestions, function(index, item) {
        result += '<li data-select=' + item.select + '>' + item.data + '</li>';
    });
    $searchSuggestion.append(result + '</ul>');
}

function handleSearch() {
    //show search-type selectbox when focus on search textbox
    // $('#txtSearch').on('focus', function (e) {
    //     e.preventDefault();
    //     $('.search-type').slideDown('slow');
    // });

    $("#txtSearch").on('input', function() {
        var $self = $(this);
        var word = $self.val().trim();
        if(word === '') {
            bindAutoComplete(null);
            return;
        } 

        $.ajax({
            url: "/api/vidict/suggest/" + $(this).val(),                
            method: "GET",
            dataType: "json",
            success: function (data) {            
                bindAutoComplete(data);
            }
        });     
    });

    $('#search-suggestion').on('click', 'li', function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/find/" + $(this).data('select'),                
            method: "GET",
            dataType: "json",
            success: function (data) {            
                console.log(data.enViData.best.details);
                $('#search-result').html(data.enViData.best.details);
            }
        });    
    });
}

function init() {
    toggleMenu();
    handleSearch();
}

module.exports = {
    init: init
}