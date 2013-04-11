define(['app/objects'], function (objects) {

    QUnit.module('objects');

    QUnit.test('nullToDefault', 6, function (assert) {
        assert.strictEqual(objects.nullToDefault(null, 'default'), 'default', 'null obviously defaults');
        assert.strictEqual(objects.nullToDefault(undefined, 'default'), 'default', 'undefined is kinda null');
        assert.strictEqual(objects.nullToDefault(NaN, 'default'), 'default', 'NaN is kinda null');
        assert.strictEqual(objects.nullToDefault(false, 'default'), false, 'false is not null');
        assert.strictEqual(objects.nullToDefault(0, 'default'), 0, 'zero is not null');
        assert.strictEqual(objects.nullToDefault(null), 'Unknown', 'default undefined then expect Unknown');
    });

    QUnit.test('betterTypeof', 7, function (assert) {
        assert.strictEqual(objects.betterTypeof(''), 'string', 'string');
        assert.strictEqual(objects.betterTypeof(0), 'number', 'number');
        assert.strictEqual(objects.betterTypeof(true), 'boolean', 'boolean');
        assert.strictEqual(objects.betterTypeof([]), 'array', 'array');
        assert.strictEqual(objects.betterTypeof({}), 'object', 'object');
        assert.strictEqual(objects.betterTypeof(null), 'null', 'null');
        assert.strictEqual(objects.betterTypeof(undefined), 'undefined', 'undefined');
    });

    QUnit.test('copy', 10, function (assert) {
        assert.strictEqual(objects.copy(''), '', 'string');
        assert.strictEqual(objects.copy(0), 0, 'number');
        assert.strictEqual(objects.copy(true), true, 'boolean');
        assert.deepEqual(objects.copy([]), [], 'array');
        assert.deepEqual(objects.copy({}), {}, 'object');
        assert.strictEqual(objects.copy(null), null, 'null');
        assert.strictEqual(objects.copy(undefined), undefined, 'undefined');
        assert.deepEqual(objects.copy(['', 0, true, [], {}, null, undefined]),
            ['', 0, true, [], {}, null, undefined], 'array nonempty');
        assert.deepEqual(objects.copy({a: '', b: 0, c: true, e: [], f: {}, g: null, h: undefined}),
            {a: '', b: 0, c: true, e: [], f: {}, g: null, h: undefined}, 'object nonempty');
        assert.deepEqual(objects.copy({a: '', b: 0, c: true, e: ['', 0, true, [], {}, null, undefined], f: {a: '', b: 0, c: true, e: [], f: {}, g: null, h: undefined}, g: null, h: undefined}),
            {a: '', b: 0, c: true, e: ['', 0, true, [], {}, null, undefined], f: {a: '', b: 0, c: true, e: [], f: {}, g: null, h: undefined}, g: null, h: undefined}, 'object kitchen sink');
    });

    return {};

});
