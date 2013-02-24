define(['./defer'], function (defer) {
    'use strict';

    function again(func, maxTries) {
        return function (input) {
            var deferred = defer();
            var remainingTries = maxTries || 3;
            function run() {
                func(input).then(function (output) {
                    deferred.resolve(output);
                }, function (reason) {
                    //>>excludeStart("prod", pragmas.prod);
                    //window.console.log('again because ', reason);
                    //>>excludeEnd("prod");
                    remainingTries -= 1;
                    if (remainingTries > 0) {
                        run();
                    } else {
                        deferred.reject(reason);
                    }
                });
            }
            run();
            return deferred.promise;
        };
    }

    return again;
});