define(['app/util'], function(util) {

    module('util');

    test('nullToDefault', 6, function(){
        strictEqual(util.nullToDefault(null, 'default'), 'default', 'null obviously defaults');
        strictEqual(util.nullToDefault(undefined, 'default'), 'default', 'undefined is kinda null');
        strictEqual(util.nullToDefault(NaN, 'default'), 'default', 'NaN is kinda null');
        strictEqual(util.nullToDefault(false, 'default'), false, 'false is not null');
        strictEqual(util.nullToDefault(0, 'default'), 0, 'zero is not null');
        strictEqual(util.nullToDefault(null), 'Unknown', 'default undefined then expect Unknown');
    });

    test('toDeg', 5, function(){
        strictEqual(util.toDeg(0), 0, '0 is 0 deg');
        strictEqual(util.toDeg(Math.PI/2), 90, 'pi/2 is 90 deg');
        strictEqual(util.toDeg(Math.PI), 180, 'pi is 180 deg');
        strictEqual(util.toDeg(Math.PI*3/2), 270, 'pi*3/2 is 270 deg');
        strictEqual(util.toDeg(Math.PI*2), 360, 'pi*2 is 360 deg');
    });

    test('toRad', 5, function(){
        strictEqual(util.toRad(0), 0, '0 is 0 deg');
        strictEqual(util.toRad(90), Math.PI/2, 'pi/2 is 90 deg');
        strictEqual(util.toRad(180), Math.PI, 'pi is 180 deg');
        strictEqual(util.toRad(270), Math.PI*3/2, 'pi*3/2 is 270 deg');
        strictEqual(util.toRad(360), Math.PI*2, 'pi*2 is 360 deg');
    });

    return {};

});