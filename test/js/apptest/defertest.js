define(['app/defer'], function(defer) {

    module('defer');

    test('resolve', 1, function(){
        stop();
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            strictEqual(value, expected);
            (typeof done === 'function' ? done : start)();
        }, function () {
            (typeof done === 'function' ? done : start)();
        });
        deferrable.resolve(expected);
    });

    test('reject', 1, function(){
        stop();
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function () {
            (typeof done === 'function' ? done : start)();
        }, function (reason) {
            strictEqual(reason, expected);
            (typeof done === 'function' ? done : start)();
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
            (typeof done === 'function' ? done : start)();
        }, function () {
            (typeof done === 'function' ? done : start)();
        });
        deferrable.resolve(expectedPart1);
    });
    
    test('throw', 1, function(){
        stop();
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            throw 'error';
            return value;
        }).then(function () {
            (typeof done === 'function' ? done : start)();
        }, function () {
            ok(true);
            (typeof done === 'function' ? done : start)();
        });
        deferrable.resolve('unexpected');
    });
    
    return {};

});