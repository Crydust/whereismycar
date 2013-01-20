/*jslint browser: true, vars: true */
/*global define: false */

define([], function () {
    'use strict';
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        'capitalizeFirstLetter': capitalizeFirstLetter
    };
    
});