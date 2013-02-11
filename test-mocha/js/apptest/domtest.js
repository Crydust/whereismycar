define(['app/dom'], function(dom) {

    suite('domtest');

    test('byId', function(){
        var dummy = dom.byId('dummy');
        assert.equal(dummy, document.getElementById('dummy'), 'dummy');

        var fakeDocument = {
            getElementById: function () {
                return 'expected';
            }
        };
        dummy = dom.byId('dummy', fakeDocument);
        assert.equal(dummy, 'expected', 'fakeDocument');
    });

    test('on', function(done){
        fixtures.load('dummy.html');
        var dummy = dom.byId('dummy', fixtures.window().document);
        dom.on(dummy, 'click', function(){
            assert.ok(true);
            fixtures.cleanUp();
            done();
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