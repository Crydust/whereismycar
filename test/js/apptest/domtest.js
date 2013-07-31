define(['app/dom'], function (dom) {

    QUnit.module('domtest');

    QUnit.test('byId', 2, function (assert) {
        var dummy = dom.byId('dummy');
        assert.ok(dummy === document.getElementById('dummy'), 'dummy');

        var fakeDocument = {
            getElementById: function () {
                return 'expected';
            }
        };
        dummy = dom.byId('dummy', fakeDocument);
        assert.equal(dummy, 'expected', 'fakeDocument');

    });

    QUnit.test('on', 2, function (assert) {
        if (typeof window.__html__ === 'object') {
            document.body.innerHTML = window.__html__['test/fixture.html'];
        }
        var dummy = dom.byId('dummy');
        assert.ok(dummy !== null);
        QUnit.stop();
        dom.on(dummy, 'click', function () {
            assert.ok(true);
            QUnit.start();
            return false;
        });
        simulateEvent(dummy, 'click');
    });

    return {};

});
