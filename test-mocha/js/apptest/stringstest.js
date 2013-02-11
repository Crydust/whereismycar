define(['app/strings'], function(strings) {

    suite('strings');

    test('capitalizeFirstLetter', function(){
        assert.strictEqual(strings.capitalizeFirstLetter('abc'), 'Abc', 'three chars');
        assert.strictEqual(strings.capitalizeFirstLetter('a'), 'A', 'one char');
        assert.strictEqual(strings.capitalizeFirstLetter(null), null, 'null');
    });

    return {};

});