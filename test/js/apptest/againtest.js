/*global console: false */
define(['app/again', 'app/defer'], function (againModule, deferModule) {

    var again = againModule.again;
    var defer = deferModule.pending;

    QUnit.module('again');

    QUnit.test('success', function (assert) {
        QUnit.stop();
        var counter = 2;
        var funcToRun = function () {
            var deferred = defer();
            counter--;
            if (counter <= 0) {
                assert.ok(true, 'done');
                deferred.fulfill(true);
            } else {
                assert.ok(true, 'not done yet');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var retryingPromiseFactory = again(funcToRun, 3);
        assert.equal(typeof retryingPromiseFactory, 'function', 'retryingPromiseFactory is a function');
        var retryingPromise = retryingPromiseFactory();
        assert.equal(typeof retryingPromise.then, 'function', 'retryingPromise has a then function');
        retryingPromise.then(function () {
            assert.equal(counter, 0, 'zero remaining');
            assert.ok(true, 'done recieved');
            QUnit.start();
        }, function () {
            assert.ok(false, 'unexpected');
            QUnit.start();
        });
    });

    QUnit.test('fail', 5, function (assert) {
        QUnit.stop();
        var counter = 10;
        var funcToRun = function () {
            var deferred = defer();
            counter--;
            if (counter <= 0) {
                assert.ok(false, 'done unexpected');
                deferred.fulfill(true);
            } else {
                assert.ok(true, 'not done yet');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        (again(funcToRun, 3)()).then(function () {
            assert.ok(false, 'done recieved unexpected');
            QUnit.start();
        }, function () {
            assert.equal(counter, 7, 'seven remaining');
            assert.ok(true, 'not done, as expected');
            QUnit.start();
        });
    });

    QUnit.test('success default', 1, function (assert) {
        QUnit.stop();
        var counter = 2;
        var funcToRun = function () {
            var deferred = defer();
            if (counter-- <= 0) {
                deferred.fulfill(true);
            } else {
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var retryingPromise = (again(funcToRun)());
        retryingPromise.then(function () {
            assert.ok(true, 'done recieved');
            QUnit.start();
        });
    });

    QUnit.test('fail default', 1, function (assert) {
        QUnit.stop();
        var counter = 10;
        var funcToRun = function () {
            throw new Error('allways fail');
        };
        var retryingPromise = (again(funcToRun)());
        retryingPromise.then(function () {
            assert.ok(false, 'done recieved unexpected');
            QUnit.start();
        }, function () {
            assert.ok(true, 'not done, as expected');
            QUnit.start();
        });
    });

    return {};

});
