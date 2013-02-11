define(['app/strings'], function(strings) {

    module('strings');

    test('capitalizeFirstLetter', 3, function(){
        strictEqual(strings.capitalizeFirstLetter('abc'), 'Abc', 'three chars');
        strictEqual(strings.capitalizeFirstLetter('a'), 'A', 'one char');
        strictEqual(strings.capitalizeFirstLetter(null), null, 'null');
    });

    return {};

});