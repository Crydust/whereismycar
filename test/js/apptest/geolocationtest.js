define(['app/geolocation', 'app/geography'], function(geolocation, geography) {

    QUnit.module('geolocation');

    QUnit.test('convertPositionToLatLng', 4, function(assert){
        var latlng = geolocation.convertPositionToLatLng({
            coords: {
                latitude: 1,
                longitude: 2
            }
        });
        assert.ok(latlng !== null);
        assert.ok(latlng instanceof geography.LatLng);
        assert.equal(latlng.lat(), 1);
        assert.equal(latlng.lng(), 2);
    });
    
    return {};

});
