define(['app/objects'], function(objects) {

    module('objects');

    test('nullToDefault', 6, function(){
        strictEqual(objects.nullToDefault(null, 'default'), 'default', 'null obviously defaults');
        strictEqual(objects.nullToDefault(undefined, 'default'), 'default', 'undefined is kinda null');
        strictEqual(objects.nullToDefault(NaN, 'default'), 'default', 'NaN is kinda null');
        strictEqual(objects.nullToDefault(false, 'default'), false, 'false is not null');
        strictEqual(objects.nullToDefault(0, 'default'), 0, 'zero is not null');
        strictEqual(objects.nullToDefault(null), 'Unknown', 'default undefined then expect Unknown');
    });

    return {};

});