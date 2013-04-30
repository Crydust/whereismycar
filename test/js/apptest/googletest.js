define(['app/google', 'app/geography'], function (google, geography) {

    QUnit.module('google');

    QUnit.test('bla', 4, function (assert) {
        var url = google.staticImageUrl(new geography.LatLng(1, 2));
        assert.ok(url !== null);
        assert.ok(url !== undefined);
        assert.equal(typeof url, 'string');
        assert.equal(url,
            'http://maps.googleapis.com/maps/api/staticmap?sensor=true' +
            '&size=160x104&zoom=15&center=1.000000%2C2.000000' +
            '&markers=color%3A0X44AAFF%7Csize%3Atiny%7C1.000000%2C2.000000');
    });

    return {};

});
