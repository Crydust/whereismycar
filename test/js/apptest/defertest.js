define(['app/defer'], function(deferModule) {
    
    var defer = deferModule.defer;
    
    module('defer');

    test('resolve', 1, function(){
        stop();
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            strictEqual(value, expected);
            start();
        }, function () {
            start();
        });
        deferrable.resolve(expected);
    });

    test('reject', 1, function(){
        stop();
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function () {
            start();
        }, function (reason) {
            strictEqual(reason, expected);
            start();
        });
        deferrable.reject(expected);
    });
    
    test('chain', 1, function(){
        stop();
        var expectedPart1 = 'expectedPart1';
        var expectedPart2 = 'expectedPart1';
        var expected = expectedPart1 + expectedPart2;
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            return value + expectedPart2;
        }).then(function (value) {
            strictEqual(value, expected);
            start();
        }, function () {
            start();
        });
        deferrable.resolve(expectedPart1);
    });
    
    test('throw', 1, function(){
        stop();
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            throw 'error';
        }).then(function () {
            start();
        }, function () {
            ok(true);
            start();
        });
        deferrable.resolve('unexpected');
    });
    
    return {};

});