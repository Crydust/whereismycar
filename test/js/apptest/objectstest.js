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

    test('betterTypeof', 7, function(){
        strictEqual(objects.betterTypeof(''), 'string', 'string');
        strictEqual(objects.betterTypeof(0), 'number', 'number');
        strictEqual(objects.betterTypeof(true), 'boolean', 'boolean');
        strictEqual(objects.betterTypeof([]), 'array', 'array');
        strictEqual(objects.betterTypeof({}), 'object', 'object');
        strictEqual(objects.betterTypeof(null), 'null', 'null');
        strictEqual(objects.betterTypeof(undefined), 'undefined', 'undefined');
    });
    
    test('copy', 10, function(){
        strictEqual(objects.copy(''), '', 'string');
        strictEqual(objects.copy(0), 0, 'number');
        strictEqual(objects.copy(true), true, 'boolean');
        deepEqual(objects.copy([]), [], 'array');
        deepEqual(objects.copy({}), {}, 'object');
        strictEqual(objects.copy(null), null, 'null');
        strictEqual(objects.copy(undefined), undefined, 'undefined');
        deepEqual(objects.copy(['', 0, true, [], {}, null, undefined]),
            ['', 0, true, [], {}, null, undefined], 'array nonempty');
        deepEqual(objects.copy({a:'', b:0, c:true, e:[], f:{}, g:null, h:undefined}),
            {a:'', b:0, c:true, e:[], f:{}, g:null, h:undefined}, 'object nonempty');
        deepEqual(objects.copy({a:'', b:0, c:true, e:['', 0, true, [], {}, null, undefined], f:{a:'', b:0, c:true, e:[], f:{}, g:null, h:undefined}, g:null, h:undefined}),
            {a:'', b:0, c:true, e:['', 0, true, [], {}, null, undefined], f:{a:'', b:0, c:true, e:[], f:{}, g:null, h:undefined}, g:null, h:undefined}, 'object kitchen sink');
    });
    
    return {};

});