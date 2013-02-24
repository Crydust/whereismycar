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

    test('on', 1, function(){
        stop();
        var dummy = dom.byId('dummy');
        dom.on(dummy, 'click', function(){
            ok(true);
            start();
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