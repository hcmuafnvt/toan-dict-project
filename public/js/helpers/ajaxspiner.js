'use strict';

var ajaxspiner = {},
    spinner,
    spinnerContainer,
    defaultOpts = {
        lines: 11, // The number of lines to draw
        length: 15, // The length of each line
        width: 6, // The line thickness
        radius: 15, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 0.8, // Corner roundness (0..1)
        color: '#00C3FF', // #rgb or #rrggbb or array of colors
        opacity: 0.15, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: 'absolute' // Element positioning
    };

ajaxspiner.start = function (options) {
    options = options || {};
    spinnerContainer = options.spinnerContainer || 'body';
    var spinnerSize = options.spinnerSize || 'large',
        isSpinnerLoadingText = options.isSpinnerLoadingText || false,
        isOverlayDiv = typeof options.isOverlayDiv !== 'undefined' ? options.isOverlayDiv : true,
        opts;

    switch (spinnerSize) {
        case 'small':
            opts = $.extend(defaultOpts, { lines: 11, length: 8, width: 3, radius: 6 });
            break;
        case 'medium':
            opts = $.extend(defaultOpts, { lines: 11, length: 10, width: 5, radius: 11 });
            break;
        default: //large size for page
            opts = defaultOpts;
            break;
    }
    //var baseClass = this;
    var target = document.querySelector(spinnerContainer);

    //check and add "position: relative" for spinner container
    if (target.style.position !== 'absolute' || target.style.position !== 'relative') {
        target.style.position = 'relative';
    }

    //add ajax overlay div
    if (isOverlayDiv !== false) {
        var overlayDiv = document.createElement('div');
        overlayDiv.classList.add('ajax-overlay');
        target.appendChild(overlayDiv);
    }

    spinner = new Spinner(opts).spin(target);
    if (typeof isSpinnerLoadingText !== 'undefined' && isSpinnerLoadingText === true) {
        var spinnerLoadingTextDiv = document.createElement('div');
        var textNote = document.createTextNode('Loading more ...');
        spinnerLoadingTextDiv.appendChild(textNote);
        spinnerLoadingTextDiv.classList.add('spinnerLoadingText');        
        spinnerLoadingTextDiv.classList.add(spinnerSize);
        spinner.el.appendChild(spinnerLoadingTextDiv);
    }
};

ajaxspiner.stop = function () {
    spinner.stop();
    $(spinnerContainer).find('.ajax-overlay').remove();
};

module.exports = ajaxspiner;