'use strict';

var util = require('../helpers/util'),
    ajax = require('../helpers/ajax');

function initPage() {
    var $moreExamples = $('.more-examples');
    $moreExamples.each(function() {
        if($(this).find('.ex').length === 0) $(this).remove();
    });
}

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

function selectDictType() {
    $('.select-dict-type li, .menu-dict-type li').on('click', function(e) {
        e.preventDefault();
        window.location.href = '/definition/' + $(this).data('type') + '/' + $('.word-name').text().trim().toLowerCase();
    });
}

function expandCollapseTypeOfWord() {
    $('.type-of-word').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.l1-group').slideToggle();
        $(this).toggleClass('collapsed');
    })
}

function expandCollapseMoreExamples() {
    $('.btn-more-exg').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.exg').slideToggle();
        $(this).toggleClass('collapsed');
    })
}

function init() {
    initPage();
    selectDictType();
    expandCollapseTypeOfWord();
    expandCollapseMoreExamples();
}

module.exports = {
    init: init
}