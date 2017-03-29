'use strict';

var util = require('../helpers/util'),
    ajax = require('../helpers/ajax');

function addToList() {
    $('#addToList').on('click', function(e) {
        e.preventDefault();
        if(!util.isAuthenticated()) {
            $.magnificPopup.open({
                items: {
                    src: '.authen-popup'                    
                }
            });
            return;
        } else {
            $.magnificPopup.open({
                items: {
                    src: '.add-to-list-popup'
                },
                callbacks: {
                    beforeOpen: function() {
                        var options = '';
                        ajax.get('/api/lists').done(function(lists) {
                            $.each(lists, function(index, list) {
                                options += '<option value="' + list._id + '">' + list.title + '</option>';
                            });
                            $('.add-to-list-popup #list').empty();
                            $('.add-to-list-popup #list').append(options);
                        }).fail(function(err) {
                            console.log(err);
                        });
                    }
                }
            });
        }
    });
}

function init() {
    addToList();
}

module.exports = {
    init: init
}