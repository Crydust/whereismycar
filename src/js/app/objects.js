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

    function copy(obj) {
        var result = null;
        if (obj === null) {
            return null;
        } else if (obj === undefined) {
            return undefined;
        } else {
            switch (betterTypeof(obj)) {
            case 'object':
                result = {};
                for (var n in obj) {
                    if (obj.hasOwnProperty(n)) {
                        result[n] = copy(obj[n]);
                    }
                }
                break;
            case 'array':
                result = [];
                for (var i = 0, leni = obj[n].length; i < leni; i++) {
                    result[i] = copy(obj[i]);
                }
                break;
            case 'number':
                result = + obj;
                break;
            case 'boolean':
                result = !! obj;
                break;
            case 'string':
                result = '' + obj;
                break;
            }
        }
        return result;
    }

    return {
        'nullToDefault': nullToDefault,
        'betterTypeof': betterTypeof,
        'copy': copy
    };
    
});