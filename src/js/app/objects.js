define(function () {
    'use strict';

    /**
     * @param {*|null} theValue
     * @param {*} theDefault
     */
    function nullToDefault(theValue, theDefault) {
        if (typeof theDefault === 'undefined') {
            theDefault = 'Unknown';
        }
        if (theValue === null || theValue === undefined ||
            (typeof theValue === 'number' && isNaN(theValue))) {
            return theDefault;
        } else {
            return theValue;
        }
    }

    var EMPY_OBJECT = {};

    function betterTypeof(obj) {
        if (obj === null) {
            return 'null';
        }
        if (obj === undefined) {
            return 'undefined';
        }
        return EMPY_OBJECT.toString.call(obj).slice(8, -1).toLowerCase();
    }

    function copy(obj) {
        var result = null;
        switch (betterTypeof(obj)) {
        case 'null':
            result = null;
            break;
        case 'undefined':
            result = undefined;
            break;
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
            for (var i = 0, leni = obj.length; i < leni; i++) {
                result[i] = copy(obj[i]);
            }
            break;
        case 'number':
            result = +obj;
            break;
        case 'boolean':
            result = !! obj;
            break;
        case 'string':
            result = '' + obj;
            break;
        }
        return result;
    }

    /**
     * equivalent of Object.create
     */
    function beget(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }

    function extend(A, B) {
        A.prototype = beget(B.prototype);
        A.prototype.constructor = A;
    }

    function isArray(vArg) {
        return Object.prototype.toString.call(vArg) === '[object Array]';
    }

    function toArray(vArg) {
        var result = [];
        for (var i = 0, leni = vArg.length; i < leni; i++) {
            result.push(vArg[i]);
        }
        return result;
    }

    return {
        nullToDefault: nullToDefault,
        betterTypeof: betterTypeof,
        copy: copy,
        beget: beget,
        extend: extend,
        isArray: isArray,
        toArray: toArray
    };

});
