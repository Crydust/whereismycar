define(['app/geography'], function(geography) {

    suite('geography');

    test('LatLng', function(){
        var latlng = new geography.LatLng(0, 1);
        assert.strictEqual(latlng.lat(), 0, 'lat');
        assert.strictEqual(latlng.lng(), 1, 'lng');
        assert.strictEqual(latlng.toUrlValue(), '0.000000,1.000000', 'toUrlValue');
    });
    
    test('computeDistanceBetween', function(){
        //paris
        var pontDeNeuilly = new geography.LatLng(48.8867, 2.2547);
        var placeCharlesDeGaulle = new geography.LatLng(48.8735, 2.2958);
        var placeDeLaConcorde = new geography.LatLng(48.8655, 2.3207);
        assert.closeTo(geography.computeDistanceBetween(placeCharlesDeGaulle, placeDeLaConcorde), 2000, 50);
        assert.closeTo(geography.computeDistanceBetween(pontDeNeuilly, placeCharlesDeGaulle), 3350, 50);
        assert.closeTo(geography.computeDistanceBetween(pontDeNeuilly, placeDeLaConcorde), 5350, 50);
        //greenwich
        var cuttySarkSubway = new geography.LatLng(51.4814, -0.0102);
        var charltonWay = new geography.LatLng(51.4751, 0.0103);
        assert.closeTo(geography.computeDistanceBetween(cuttySarkSubway, charltonWay), 1609, 50);
        //new york
        var newYorkPublicLibrary = new geography.LatLng(40.75278, -73.9814);
        var marcusGaveyPark = new geography.LatLng(40.80323, -73.94459);
        assert.closeTo(geography.computeDistanceBetween(newYorkPublicLibrary, marcusGaveyPark), 6400, 50);
        
    });
    
    test('computeHeading', function(){
        //paris
        var pontDeNeuilly = new geography.LatLng(48.8867, 2.2547);
        var placeCharlesDeGaulle = new geography.LatLng(48.8735, 2.2958);
        var placeDeLaConcorde = new geography.LatLng(48.8655, 2.3207);
        assert.closeTo(geography.computeHeading(placeCharlesDeGaulle, placeDeLaConcorde), 116, 5);
        assert.closeTo(geography.computeHeading(pontDeNeuilly, placeCharlesDeGaulle), 116, 5);
        assert.closeTo(geography.computeHeading(pontDeNeuilly, placeDeLaConcorde), 116, 5);
        assert.closeTo(geography.computeHeading(placeDeLaConcorde, placeCharlesDeGaulle), 296, 5);
        assert.closeTo(geography.computeHeading(placeCharlesDeGaulle, pontDeNeuilly), 296, 5);
        assert.closeTo(geography.computeHeading(placeDeLaConcorde, pontDeNeuilly), 296, 5);
        //greenwich
        var cuttySarkSubway = new geography.LatLng(51.4814, -0.0102);
        var charltonWay = new geography.LatLng(51.4751, 0.0103);
        assert.closeTo(geography.computeHeading(cuttySarkSubway, charltonWay), 116, 5);
        assert.closeTo(geography.computeHeading(charltonWay, cuttySarkSubway), 296, 5);
        //new york
        var newYorkPublicLibrary = new geography.LatLng(40.75278, -73.9814);
        var marcusGaveyPark = new geography.LatLng(40.80323, -73.94459);
        assert.closeTo(geography.computeHeading(newYorkPublicLibrary, marcusGaveyPark), 28, 5);
        assert.closeTo(geography.computeHeading(marcusGaveyPark, newYorkPublicLibrary), 208, 5);
    });
    
    
    return {};

});