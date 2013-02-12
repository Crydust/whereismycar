define(['app/again', 'app/defer'], function(again, defer) {

    describe('Again, keep trying', function() {
        it('should try three times', function() {
            var isDone = false;
            var counter = 2;
            runs(function() {
                var funcToRun = function() {
                    var deferred = defer();
                    counter--;
                    if (counter <= 0) {
                        deferred.resolve(true);
                    } else {
                        deferred.reject(false);
                    }
                    return deferred.promise;
                };
                var wrappedFunc = again(funcToRun, 3);
                wrappedFunc().then(function() {
                    //error recovered
                    isDone = true;
                }, function() {
                    //error not recovered
                    isDone = true;
                });
            });
            waitsFor(function() {
                return isDone;
            });
            runs(function() {
                expect(counter).toBe(0);
            });
        });

        it('should try no more than three times', function() {
            var isDone = false;
            var counter = 10;
            runs(function() {
                var funcToRun = function() {
                    var deferred = defer();
                    counter--;
                    if (counter <= 0) {
                        deferred.resolve(true);
                    } else {
                        deferred.reject(false);
                    }
                    return deferred.promise;
                };
                var wrappedFunc = again(funcToRun, 3);
                wrappedFunc().then(function() {
                }, function() {
                    isDone = true;
                });
            });
            waitsFor(function() {
                return isDone;
            });
            runs(function() {
                expect(counter).toBe(7);
            });
        });

    });

    return {};

});