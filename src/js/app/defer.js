define(function (require) {
    'use strict';

    var defer = require('vendor/promises-a');

    function deferWithResolve() {
        var result = defer();
        result.resolve = result.fulfill;
        return result;
    }

    return {
        defer: deferWithResolve
    };

});
