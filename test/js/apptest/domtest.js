define(['app/dom'], function(dom) {

    module('domtest');

    test('byId', 2, function(){
        var dummy = dom.byId('dummy');
        equal(dummy, document.getElementById('dummy'), 'dummy');

        var fakeDocument = {
            getElementById: function () {
                return 'expected';
            }
        };
        dummy = dom.byId('dummy', fakeDocument);
        equal(dummy, 'expected', 'fakeDocument');
    });

    test('on', 1, function(done){
        stop();
        fixtures.load('dummy.html');
        var dummy = dom.byId('dummy', fixtures.window().document);
        dom.on(dummy, 'click', function(){
            ok(true);
            fixtures.cleanUp();
            (typeof done === 'function' ? done : start)();
            return false;
        });
        (function fireEvent(element, event) {
            if (document.createEvent) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(event, true, true);
                return !element.dispatchEvent(evt);
            } else {
                var evt = document.createEventObject();
                return element.fireEvent('on' + event, evt);
            }
        }(dummy, 'click'));
    });
    
    return {};

});