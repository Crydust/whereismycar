define(['app/geometry'], function(geometry) {

    QUnit.module('geometry');

    QUnit.test('Point', 2, function(assert){
        var p = new geometry.Point(0, 1);
        assert.strictEqual(p.getX(), 0, 'getX');
        assert.strictEqual(p.getY(), 1, 'getY');
    });

    QUnit.test('toDeg', 5, function(assert){
        assert.strictEqual(geometry.toDeg(0), 0, '0 is 0 deg');
        assert.strictEqual(geometry.toDeg(Math.PI/2), 90, 'pi/2 is 90 deg');
        assert.strictEqual(geometry.toDeg(Math.PI), 180, 'pi is 180 deg');
        assert.strictEqual(geometry.toDeg(Math.PI*3/2), 270, 'pi*3/2 is 270 deg');
        assert.strictEqual(geometry.toDeg(Math.PI*2), 360, 'pi*2 is 360 deg');
    });

    QUnit.test('toRad', 5, function(assert){
        assert.strictEqual(geometry.toRad(0), 0, '0 is 0 deg');
        assert.strictEqual(geometry.toRad(90), Math.PI/2, 'pi/2 is 90 deg');
        assert.strictEqual(geometry.toRad(180), Math.PI, 'pi is 180 deg');
        assert.strictEqual(geometry.toRad(270), Math.PI*3/2, 'pi*3/2 is 270 deg');
        assert.strictEqual(geometry.toRad(360), Math.PI*2, 'pi*2 is 360 deg');
    });

    return {};

});
