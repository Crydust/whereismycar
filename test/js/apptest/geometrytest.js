define(['app/geometry'], function(geometry) {

    module('geometry');

    test('Point', 2, function(){
        var p = new geometry.Point(0, 1);
        strictEqual(p.getX(), 0, 'getX');
        strictEqual(p.getY(), 1, 'getY');
    });

    test('toDeg', 5, function(){
        strictEqual(geometry.toDeg(0), 0, '0 is 0 deg');
        strictEqual(geometry.toDeg(Math.PI/2), 90, 'pi/2 is 90 deg');
        strictEqual(geometry.toDeg(Math.PI), 180, 'pi is 180 deg');
        strictEqual(geometry.toDeg(Math.PI*3/2), 270, 'pi*3/2 is 270 deg');
        strictEqual(geometry.toDeg(Math.PI*2), 360, 'pi*2 is 360 deg');
    });

    test('toRad', 5, function(){
        strictEqual(geometry.toRad(0), 0, '0 is 0 deg');
        strictEqual(geometry.toRad(90), Math.PI/2, 'pi/2 is 90 deg');
        strictEqual(geometry.toRad(180), Math.PI, 'pi is 180 deg');
        strictEqual(geometry.toRad(270), Math.PI*3/2, 'pi*3/2 is 270 deg');
        strictEqual(geometry.toRad(360), Math.PI*2, 'pi*2 is 360 deg');
    });

    return {};

});