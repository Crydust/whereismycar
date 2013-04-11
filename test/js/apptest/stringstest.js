define(['app/strings'], function (strings) {

    QUnit.module('strings');

    QUnit.test('capitalizeFirstLetter', 3, function (assert) {
        assert.strictEqual(strings.capitalizeFirstLetter('abc'), 'Abc', 'three chars');
        assert.strictEqual(strings.capitalizeFirstLetter('a'), 'A', 'one char');
        assert.strictEqual(strings.capitalizeFirstLetter(null), null, 'null');
    });

    return {};

});
