define(['app/again', 'app/defer'], function (againModule, deferModule) {

    var again = againModule.again;
    var defer = deferModule.defer;

    QUnit.module('again');

    QUnit.test('success', 4, function (assert) {
        QUnit.stop();
        var counter = 2;
        var funcToRun = function () {
            var deferred = defer();
            counter--;
            if (counter <= 0) {
                assert.ok(true, 'done');
                deferred.resolve(true);
            } else {
                assert.ok(true, 'not done yet');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var wrappedFunc = again(funcToRun, 3);
        wrappedFunc().then(function () {
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
                deferred.resolve(true);
            } else {
                assert.ok(true, 'not done yet');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var wrappedFunc = again(funcToRun, 3);
        wrappedFunc().then(function () {
            assert.ok(false, 'done recieved unexpected');
            QUnit.start();
        }, function () {
            assert.equal(counter, 7, 'seven remaining');
            assert.ok(true, 'not done, as expected');
            QUnit.start();
        });
    });

    return {};

});
