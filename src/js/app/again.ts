import deferModule = module('./defer');

export function again(func:Function, maxTries:number = 3):Function {
    return function (input):deferModule.Promise {
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
