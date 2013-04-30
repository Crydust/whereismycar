define(['app/strings'], function (strings) {

    QUnit.module('strings');

    QUnit.test('capitalizeFirstLetter', 3, function (assert) {
        assert.strictEqual(strings.capitalizeFirstLetter('abc'), 'Abc', 'three chars');
        assert.strictEqual(strings.capitalizeFirstLetter('a'), 'A', 'one char');
        assert.strictEqual(strings.capitalizeFirstLetter(null), null, 'null');
    });

    QUnit.test('trim', 6, function (assert) {
        assert.strictEqual(strings.trim(''), '', 'empty string');
        assert.strictEqual(strings.trim('a'), 'a', 'no change');
        assert.strictEqual(strings.trim(' a'), 'a', 'trim left');
        assert.strictEqual(strings.trim('a '), 'a', 'trim right');
        assert.strictEqual(strings.trim('a'), 'a', 'trim both');
        assert.strictEqual(strings.trim(null), null, 'null');
    });


    QUnit.test('sprintf', 5, function (assert) {
        assert.strictEqual(
            strings.sprintf('%s %s', 'a', 'b'),
            'a b',
            'position');
        assert.strictEqual(
            strings.sprintf('%0s %1s %0s %1s', 'a', 'b'),
            'a b a b',
            'position');
        assert.strictEqual(
            strings.sprintf('%% b:%0b c:%0c d:%0d u:%0u f:%0.1f o:%0o s:%0s x:%0x X:%0X', '42.31'),
            '% b:101010 c:* d:42 u:42 f:42.3 o:52 s:42.31 x:2a X:2A',
            '42.31');
        assert.strictEqual(
            strings.sprintf('%% b:%0b c:%0c d:%0d u:%0u f:%0.1f o:%0o s:%0s x:%0x X:%0X', '42.35'),
            '% b:101010 c:* d:42 u:42 f:42.4 o:52 s:42.35 x:2a X:2A',
            '42.35');
        assert.strictEqual(
            strings.sprintf('%% b:%0b c:%0c d:%0d u:%0u f:%0.1f o:%0o s:%0s x:%0x X:%0X', '42.599'),
            '% b:101011 c:* d:43 u:43 f:42.6 o:53 s:42.599 x:2b X:2B',
            '42.599');
    });

    return {};

});
