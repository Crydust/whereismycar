define(['app/defer'], function (deferModule) {

    var defer = deferModule.pending;

    QUnit.module('defer');

    QUnit.test('resolve', 1, function (assert) {
        QUnit.stop();
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            assert.strictEqual(value, expected);
            QUnit.start();
        }, function () {
            QUnit.start();
        });
        deferrable.fulfill(expected);
    });

    QUnit.test('reject', 1, function (assert) {
        QUnit.stop();
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function () {
            QUnit.start();
        }, function (reason) {
            assert.strictEqual(reason, expected);
            QUnit.start();
        });
        deferrable.reject(expected);
    });

    QUnit.test('chain', 1, function (assert) {
        QUnit.stop();
        var expectedPart1 = 'expectedPart1';
        var expectedPart2 = 'expectedPart1';
        var expected = expectedPart1 + expectedPart2;
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            return value + expectedPart2;
        }).then(function (value) {
            assert.strictEqual(value, expected);
            QUnit.start();
        }, function () {
            QUnit.start();
        });
        deferrable.fulfill(expectedPart1);
    });

    QUnit.test('throw', 1, function (assert) {
        QUnit.stop();
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            throw 'error';
        }).then(function () {
            QUnit.start();
        }, function () {
            assert.ok(true);
            QUnit.start();
        });
        deferrable.fulfill('unexpected');
    });

    return {};

});
