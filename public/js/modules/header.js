'use strict';

function toggleMenu() {
    $('.toggle-menu').on('click', function(e) {
        e.preventDefault();        
        $('body').toggleClass('mobile-menu');       
    })
} 

function handleSearch() {
    //show search-type selectbox when focus on search textbox
    $('#txtSearch').on('focus', function(e) {
        e.preventDefault();
        $('.search-type').slideDown('slow');
    });
}

function init() {    
    toggleMenu();
    handleSearch();
}

module.exports = {
    init: init 
}