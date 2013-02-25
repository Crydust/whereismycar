define(['app/geolocation', 'app/geography'], function(geolocation, geography) {

    module('geolocation');

    test('convertPositionToLatLng', 4, function(){
        var latlng = geolocation.convertPositionToLatLng({
            coords: {
                latitude: 1,
                longitude: 2
            }
        });
        ok(latlng !== null);
        ok(latlng instanceof geography.LatLng);
        equal(latlng.lat(), 1);
        equal(latlng.lng(), 2);
    });
    
    return {};

});