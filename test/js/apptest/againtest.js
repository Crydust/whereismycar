define(['app/again', 'app/defer'], function(againModule, deferModule) {

    var again = againModule.again;
    var defer = deferModule.defer;
    
    module('again');

    test('success', 4, function(){
        stop();
        var counter = 2;
        var funcToRun = function(){
            var deferred = defer();
            counter--;
            if (counter <= 0) {
                ok(true, 'done');
                deferred.resolve(true);
            } else {
                ok(true, 'not done yet');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var wrappedFunc = again(funcToRun, 3);
        wrappedFunc().then(function () {
            equal(counter, 0, 'zero remaining');
            ok(true, 'done recieved');
            start();
        }, function () {
            ok(false, 'unexpected');
            start();
        });
    });
    
    test('fail', 5, function(){
        stop();
        var counter = 10;
        var funcToRun = function(){
            var deferred = defer();
            counter--;
            if (counter <= 0) {
                ok(false, 'done unexpected');
                deferred.resolve(true);
            } else {
                ok(true, 'not done yet');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var wrappedFunc = again(funcToRun, 3);
        wrappedFunc().then(function () {
            ok(false, 'done recieved unexpected');
            start();
        }, function () {
            equal(counter, 7, 'seven remaining');
            ok(true, 'not done, as expected');
            start();
        });
    });
    
    return {};

});