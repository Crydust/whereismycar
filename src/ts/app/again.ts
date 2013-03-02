import deferModule = module('./defer');

function again(func:Function, maxTries:number = 3) {
    return (input) => {
        var deferred = deferModule.defer();
        var remainingTries = maxTries;
        function run() {
            func(input).then((output) => {
                deferred.resolve(output);
            }, (reason) => {
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
