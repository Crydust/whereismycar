define(function (require) {
    'use strict';

    var deferModule = require('./defer');

    var defer = deferModule.pending;

    function again(func, maxTries) {
        if (typeof maxTries === 'undefined') {
            maxTries = 3;
        }
        return function (input) {
            var deferred = defer();
            var remainingTries = maxTries;
            function runAgain(reason) {
                remainingTries--;
                if (remainingTries > 0) {
                    run();
                } else {
                    deferred.reject(reason);
                }
            }
            function run() {
                try {
                    func(input).then(function (output) {
                        deferred.fulfill(output);
                    }, function (reason) {
                        runAgain(reason);
                    });
                } catch (reason) {
                    runAgain(reason);
                }
            }
            run();
            return deferred.promise;
        };
    }

    return {
        again: again
    };

});