/*global console: false */
define(function (require) {
    'use strict';

    var deferModule = require('./defer');

    function again(func, maxTries) {
        console.log('again');
        if (typeof maxTries === 'undefined') {
            maxTries = 3;
        }
        console.log('maxTries = ', maxTries);
        return function (input) {
            var deferred = deferModule.defer();
            var remainingTries = maxTries;
            function run() {
                console.log('run');
                try {
                    func(input).then(function (output) {
                        deferred.resolve(output);
                    }, function (reason) {
                        remainingTries--;
                        if (remainingTries > 0) {
                            run();
                        } else {
                            deferred.reject(reason);
                        }
                    });
                } catch (e) {
                    remainingTries--;
                    if (remainingTries > 0) {
                        run();
                    } else {
                        deferred.reject(e);
                    }
                }
                console.log('end run');
            }
            run();
            return deferred.promise;
        };
    }

    return {
        again: again
    };

});