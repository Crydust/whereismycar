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
        assert.deepEqual(objects.copy(['', 0, true, [], {},
            null, undefined
        ]), ['', 0, true, [], {},
            null, undefined
        ], 'array nonempty');
        assert.deepEqual(objects.copy({
            a: '',
            b: 0,
            c: true,
            e: [],
            f: {},
            g: null,
            h: undefined
        }), {
            a: '',
            b: 0,
            c: true,
            e: [],
            f: {},
            g: null,
            h: undefined
        }, 'object nonempty');
        assert.deepEqual(objects.copy({
            a: '',
            b: 0,
            c: true,
            e: ['', 0, true, [], {},
                null, undefined
            ],
            f: {
                a: '',
                b: 0,
                c: true,
                e: [],
                f: {},
                g: null,
                h: undefined
            },
            g: null,
            h: undefined
        }), {
            a: '',
            b: 0,
            c: true,
            e: ['', 0, true, [], {},
                null, undefined
            ],
            f: {
                a: '',
                b: 0,
                c: true,
                e: [],
                f: {},
                g: null,
                h: undefined
            },
            g: null,
            h: undefined
        }, 'object kitchen sink');
    });

    QUnit.test('beget', 4, function (assert) {
        var desiredProtoType = {
            hello: function () {
                return 'hello world';
            }
        };
        var createdObject = objects.beget(desiredProtoType);
        assert.ok(createdObject !== null);
        assert.equal(typeof createdObject, 'object');
        assert.equal(createdObject.hello, desiredProtoType.hello);
        assert.equal(createdObject.hello(), 'hello world');
    });

    QUnit.test('extend', 18, function (assert) {
        /*jshint maxstatements: 35 */
        function Animal(name) {
            this._name = name;
        }
        Animal.prototype = {
            getName: function () {
                return this._name;
            },
            speak: function () {
                return 'grunt';
            }
        };

        function Bird(name, velocity) {
            Animal.call(this, name);
            this._velocity = velocity;
        }
        objects.extend(Bird, Animal);
        Bird.prototype.getVelocity = function () {
            return this._velocity;
        };
        Bird.prototype.speak = function () {
            return 'whistle';
        };

        function Duck(name, velocity, gender) {
            Bird.call(this, name, velocity);
            this._gender = gender;
        }
        objects.extend(Duck, Bird);
        Duck.prototype.getGender = function () {
            return this._gender;
        };
        Duck.prototype.speak = function () {
            return 'quack';
        };

        var a = new Animal('a');
        var b = new Bird('b', 1);
        var d = new Duck('d', 2, 'M');

        assert.ok(a instanceof Animal, 'a is an Animal');
        assert.ok(!(a instanceof Bird), 'a is not a Bird');
        assert.ok(!(a instanceof Duck), 'a is not a Duck');

        assert.ok(b instanceof Animal, 'b is an Animal');
        assert.ok(b instanceof Bird, 'b is a Bird');
        assert.ok(!(b instanceof Duck), 'b is not an Duck');

        assert.ok(d instanceof Animal, 'd is an Animal');
        assert.ok(d instanceof Bird, 'a is a Bird');
        assert.ok(d instanceof Duck, 'a is a Duck');

        assert.equal(a.speak(), 'grunt');
        assert.equal(b.speak(), 'whistle');
        assert.equal(d.speak(), 'quack');

        assert.equal(a.getName(), 'a');
        assert.equal(b.getName(), 'b');
        assert.equal(d.getName(), 'd');

        assert.equal(b.getVelocity(), 1);
        assert.equal(d.getVelocity(), 2);

        assert.equal(d.getGender(), 'M');
    });


    return {};

});
