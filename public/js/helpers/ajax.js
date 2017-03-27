'use strict';

var ajaxspiner = require('./ajaxspiner'),
    util = require('./util'),
    ajax = {};

// function addAccessTokenToAjaxHeader(self, xhr) {
//     if (window.user.userId !== 0) {
//         if (typeof window.expat.access_token === 'undefined') {
//             self.getAccessToken();
//             if (typeof window.expat.access_token === 'undefined') {
//                 xhr.abort();
//             } else {
//                 xhr.setRequestHeader("Authorization", "Bearer " + window.expat.access_token);
//             }
//         } else {
//             xhr.setRequestHeader("Authorization", "Bearer " + window.expat.access_token);
//         }
//     }
// }

ajax.get = function (url, options) {    
    var deferred = $.Deferred();
    var ajaxSpinnerInstance;
    var opts = $.extend({}, options);    

    $.ajax({
        method: 'GET',
        url: url,
        contentType: 'application/json',
        beforeSend: function (xhr) {
            // if (opts.isDisplaySpinner !== false) {
            //     ajaxSpinnerInstance = new AjaxSpinner(opts.spinnerSize, opts.spinnerContainer, opts.isSpinnerLoadingText, opts.isOverlayDiv);
            //     ajaxSpinnerInstance.startSpinner();
            // }

            //addAccessTokenToAjaxHeader(self, xhr);
        },
        success: function (data) {
            deferred.resolve(data);
        },
        error: function (error) {            
            deferred.reject(error);
        },
        complete: function () {
            // if (opts.isDisplaySpinner !== true) {
            //     ajaxSpinnerInstance.stopSpinner();
            // }
        }
    });

    return deferred.promise();
};

ajax.delete = function (url, options) {    
    var deferred = $.Deferred();
    var ajaxSpinnerInstance;
    var opts = $.extend({}, options);
    
    $.ajax({
        method: 'DELETE',
        url: url,
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (typeof opts.isDisplaySpinner === 'undefined' || opts.isDisplaySpinner === true) {
                ajaxSpinnerInstance = new AjaxSpinner(opts.spinnerSize, opts.spinnerContainer, opts.isSpinnerLoadingText, opts.isOverlayDiv);
                ajaxSpinnerInstance.startSpinner();
            }

            if (url.indexOf('/api/') !== -1) {
                addAccessTokenToAjaxHeader(self, xhr);
            }
        },
        success: function (data) {
            deferred.resolve(data);
        },
        error: function (error) {
            window.expat.access_token = undefined;
            deferred.reject(error);
        },
        complete: function () {
            if (typeof opts.isDisplaySpinner === 'undefined' || opts.isDisplaySpinner === true) {
                ajaxSpinnerInstance.stopSpinner();
            }
        }
    });

    return deferred.promise();
};

/*
 * - url : api url
 * - options
 *  + spinnerSize : spinner size (small, medium, large), default is large
 *  + spinnerContainer : container to append spinner and overlay, default is body
 *  + spinnerContainer : By default, spinner is showed. Set value to false to hide spinner
 *  + isSpinnerLoadingText : used to add "Loading ..." text under spinner icon
 *  + isOverlayDiv : for display overlay div, default is true
 * - postData : api post data
 */
BaseClass.prototype.sendPost = function (url, options, postData) {
    var self = this;
    var deferred = $.Deferred();
    var ajaxSpinnerInstance;
    var opts = $.extend({}, options);
    postData = $.extend({ LoginUserId: expat.user.userId }, postData);

    var contentType = typeof opts.contentType !== 'undefined' ? opts.contentType : 'application/x-www-form-urlencoded; charset=UTF-8';
    if (opts.isStringify) {
        postData = JSON.stringify(postData);
    }

    if (url.indexOf('/api/') !== -1) {
        contentType = 'application/json';
        postData = JSON.stringify(postData);
    }
    var ajaxOptions = {
        method: 'POST',
        url: url,
        data: postData,
        contentType: contentType,
        //dataType: 'json',
        beforeSend: function (xhr) {
            if (typeof opts.isDisplaySpinner === 'undefined' || opts.isDisplaySpinner === true) {
                ajaxSpinnerInstance = new AjaxSpinner(opts.spinnerSize, opts.spinnerContainer, opts.isSpinnerLoadingText, opts.isOverlayDiv);
                ajaxSpinnerInstance.startSpinner();
            }

            if (url.indexOf('/api/') !== -1) {
                addAccessTokenToAjaxHeader(self, xhr);
            }
        },
        success: function (data) {
            deferred.resolve(data);
        },
        error: function (error) {
            window.expat.access_token = undefined;
            deferred.reject(error);
        },
        complete: function () {
            if (typeof opts.isDisplaySpinner === 'undefined' || opts.isDisplaySpinner === true) {
                ajaxSpinnerInstance.stopSpinner();
            }
        }
    };

    $.ajax(ajaxOptions);

    return deferred.promise();
};

/*
 * - url : jquery template url
 * - tmplId : template id
 * - tmplData : data to bind into template
 */
BaseClass.prototype.generateTmpl = function (url, tmplId, tmplData) {
    var baseClass = this;
    var deferred = $.Deferred();

    var $tmplId = $(tmplId);
    if ($tmplId.length) {
        deferred.resolve(bindTmpl($tmplId, tmplData));
    }
    else {
        baseClass.sendGet(url, { isDisplaySpinner: false }).done(function (template) {
            $('body').append(template);
            deferred.resolve(bindTmpl($(tmplId), tmplData));
        }).fail(function (error) {
            deferred.reject(error);
        });
    }

    return deferred;
};

//========================================
// Private functions

function bindTmpl($tmplId, tmplData) {
    $.template($tmplId.attr('id'), $tmplId);
    if (typeof tmplData !== 'undefined') {
        return $.tmpl($tmplId.attr('id'), tmplData);
    }
    return $.tmpl($tmplId.attr('id'));
}


