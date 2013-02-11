define(['app/again', 'app/defer'], function(again, defer) {

    suite('again');

    test('sucess', function(){
        var counter = 2;
        var funcToRun = function(){
            var deferred = defer();
            counter--;
            if (counter <= 0) {
                assert.ok(true, 'not done yet');
                deferred.resolve(true);
            } else {
                assert.ok(true, 'done');
                deferred.reject(false);
            }
            return deferred.promise;
        };
        var wrappedFunc = again(funcToRun, 3);
        wrappedFunc().then(function () {
            assert.equal(counter, 0, 'zero remaining');
            assert.ok(true, 'done recieved');
            done();
        }, function () {
            assert.ok(false, 'unexpected');
            done();
        });
    });
    
    test('fail', function(){
        var counter = 10;
        var funcToRun = function(){
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
            done();
        }, function () {
            assert.equal(counter, 7, 'seven remaining');
            assert.ok(true, 'not done, as expected');
            done();
        });
    });
    
    return {};

});