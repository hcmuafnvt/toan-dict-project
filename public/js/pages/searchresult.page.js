'use strict';

var util = require('../helpers/util'),
    ajax = require('../helpers/ajax');

function openAddWordPopup() {
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

function addWordToList() {
    var $addToListPopup = $('#add-to-list-popup');
    $addToListPopup.on('click', 'button', function(e) {
        e.preventDefault();
        var data = {
            word: $addToListPopup.find('.hero-title').text(),
            translateToEn: '',
            translateToVi: document.getElementById('content_selectable').outerHTML,
            listId: $addToListPopup.find('#list').val()
        }

        console.log(data);

        $.ajax({
            url: '/api/words',
            method: 'POST',
            data: data,
            success: function(result) {
                console.log(result);
            },
            error: function(err) {
                console.log(err);
            }
        })
    })
}

function init() {
    //openAddWordPopup();
    //addWordToList();
}

module.exports = {
    init: init
}