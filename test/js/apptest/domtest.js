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

    QUnit.test('on', 1, function (assert) {
        if (typeof window.__html__ === 'object') {
            document.body.innerHTML = window.__html__['fixture.html'];
        }
        var dummy = dom.byId('dummy');
        if (dummy !== null) {
            QUnit.stop();
            dom.on(dummy, 'click', function () {
                assert.ok(true);
                QUnit.start();
                return false;
            });
            (function fireEvent(element, event) {
                if (document.createEvent) {
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent(event, true, true);
                    return !element.dispatchEvent(evt);
                } else {
                    var evt2 = document.createEventObject();
                    return element.fireEvent('on' + event, evt2);
                }
            }(dummy, 'click'));
        } else {
            assert.ok(true, 'html fixture not loaded?');
        }
    });

    return {};

});
