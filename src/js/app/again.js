define(["require", "exports"], function(require, exports) {
    
    function again(func, maxTries) {
        if (typeof maxTries === "undefined") { maxTries = 3; }
        return function (input) {
            var deferred = deferModule.defer();
            var remainingTries = maxTries;
            function run() {
                func(input).then(function (output) {
                    deferred.resolve(output);
                }, function (reason) {
                    remainingTries -= 1;
                    if(remainingTries > 0) {
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
})
//@ sourceMappingURL=again.js.map
