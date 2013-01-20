/*jslint browser: true, vars: true */
/*global define: false */

define([], function () {
    'use strict';

    /**
     * @param {*|null} theValue
     * @param {*} theDefault
     */
    function nullToDefault(theValue, theDefault) {
        if (theValue === null || theValue === undefined ||
                (typeof theValue === 'number' && isNaN(theValue))) {
            if (theDefault === undefined) {
                theDefault = 'Unknown';
            }
            return theDefault;
        } else {
            return theValue;
        }
    }
    
    var EMPY_OBJECT = {};
    function betterTypeof(obj) {
        return EMPY_OBJECT.toString.call(obj).slice(8, -1).toLowerCase();
    }

    return {
        'nullToDefault': nullToDefault,
        'betterTypeof': betterTypeof
    };
    
});