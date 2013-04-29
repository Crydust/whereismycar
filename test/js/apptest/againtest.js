/*global console: false */
define(['app/again', 'app/defer'], function (againModule, deferModule) {

    var again = againModule.again;
    var fulfilled = deferModule.fulfilled;
    var rejected = deferModule.rejected;

    QUnit.module('again');

    QUnit.test('success', function (assert) {
        QUnit.stop();
        var counter = 2;
        var funcToRun = function () {
            counter--;
            if (counter <= 0) {
                assert.ok(true, 'done');
                return fulfilled(true);
            } else {
                assert.ok(true, 'not done yet');
                return rejected(false);
            }
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
            counter--;
            if (counter <= 0) {
                assert.ok(false, 'done unexpected');
                return fulfilled(true);
            } else {
                assert.ok(true, 'not done yet');
                return rejected(false);
            }
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
            if (counter-- <= 0) {
                return fulfilled(true);
            } else {
                return rejected(false);
            }
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
            return rejected(false);
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
