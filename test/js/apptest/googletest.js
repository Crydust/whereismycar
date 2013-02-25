define(['app/google', 'app/geography'], function(google, geography) {

    module('google');

    test('bla', 4, function(){
        var url = google.staticImageUrl(new geography.LatLng(1, 2));
        ok(url !== null);
        ok(url !== undefined);
        equal(typeof url, 'string');
        equal(url, 'http://maps.googleapis.com/maps/api/staticmap?sensor=true&size=160x104&zoom=15&center=1.000000%2C2.000000&markers=color%3A0X44AAFF%7Csize%3Atiny%7C1.000000%2C2.000000');
    });
    
    return {};

});