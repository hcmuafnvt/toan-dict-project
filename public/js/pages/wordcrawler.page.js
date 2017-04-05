'use strict';

function submit() {
    $('#btn-submit').on('click', function(e) {
        e.preventDefault();
        console.log('crawler');
        var postData = {
            url: $('#url').val(),
            fromindex: $('#fromindex').val(),
            toindex: $('#toindex').val()
        };        

        $.ajax({
            url: '/api/wordcrawler',
            method: 'POST',
            data: postData,
            success: function(result) {
                $('#msg').text(result).removeClass('hide');                
            },
            error: function(error) {
                $('#msg').text(error).removeClass('hide');
            }
        });
    });    
}

function init() {
    submit();
}

module.exports = {
    init: init
}