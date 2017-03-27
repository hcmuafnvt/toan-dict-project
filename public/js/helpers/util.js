'use strict';

function isAuthenticated() {
    if(typeof userId !== 'undefined' && userId !== '')
        return true;
    return false;
}

var util = {
    isAuthenticated: isAuthenticated
};

module.exports = util;