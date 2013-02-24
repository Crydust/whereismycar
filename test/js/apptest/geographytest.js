define(['app/geography'], function(geography) {

    module('geography');

    test('LatLng', 3, function(){
        var latlng = new geography.LatLng(0, 1);
        strictEqual(latlng.lat(), 0, 'lat');
        strictEqual(latlng.lng(), 1, 'lng');
        strictEqual(latlng.toUrlValue(), '0.000000,1.000000', 'toUrlValue');
    });
    
    test('computeDistanceBetween', 5, function(){
        //paris
        var pontDeNeuilly = new geography.LatLng(48.8867, 2.2547);
        var placeCharlesDeGaulle = new geography.LatLng(48.8735, 2.2958);
        var placeDeLaConcorde = new geography.LatLng(48.8655, 2.3207);
        QUnit.close(geography.computeDistanceBetween(placeCharlesDeGaulle, placeDeLaConcorde), 2000, 50);
        QUnit.close(geography.computeDistanceBetween(pontDeNeuilly, placeCharlesDeGaulle), 3350, 50);
        QUnit.close(geography.computeDistanceBetween(pontDeNeuilly, placeDeLaConcorde), 5350, 50);
        //greenwich
        var cuttySarkSubway = new geography.LatLng(51.4814, -0.0102);
        var charltonWay = new geography.LatLng(51.4751, 0.0103);
        QUnit.close(geography.computeDistanceBetween(cuttySarkSubway, charltonWay), 1609, 50);
        //new york
        var newYorkPublicLibrary = new geography.LatLng(40.75278, -73.9814);
        var marcusGaveyPark = new geography.LatLng(40.80323, -73.94459);
        QUnit.close(geography.computeDistanceBetween(newYorkPublicLibrary, marcusGaveyPark), 6400, 50);
        
    });
    
    test('computeHeading', 10, function(){
        //paris
        var pontDeNeuilly = new geography.LatLng(48.8867, 2.2547);
        var placeCharlesDeGaulle = new geography.LatLng(48.8735, 2.2958);
        var placeDeLaConcorde = new geography.LatLng(48.8655, 2.3207);
        QUnit.close(geography.computeHeading(placeCharlesDeGaulle, placeDeLaConcorde), 116, 5);
        QUnit.close(geography.computeHeading(pontDeNeuilly, placeCharlesDeGaulle), 116, 5);
        QUnit.close(geography.computeHeading(pontDeNeuilly, placeDeLaConcorde), 116, 5);
        QUnit.close(geography.computeHeading(placeDeLaConcorde, placeCharlesDeGaulle), 296, 5);
        QUnit.close(geography.computeHeading(placeCharlesDeGaulle, pontDeNeuilly), 296, 5);
        QUnit.close(geography.computeHeading(placeDeLaConcorde, pontDeNeuilly), 296, 5);
        //greenwich
        var cuttySarkSubway = new geography.LatLng(51.4814, -0.0102);
        var charltonWay = new geography.LatLng(51.4751, 0.0103);
        QUnit.close(geography.computeHeading(cuttySarkSubway, charltonWay), 116, 5);
        QUnit.close(geography.computeHeading(charltonWay, cuttySarkSubway), 296, 5);
        //new york
        var newYorkPublicLibrary = new geography.LatLng(40.75278, -73.9814);
        var marcusGaveyPark = new geography.LatLng(40.80323, -73.94459);
        QUnit.close(geography.computeHeading(newYorkPublicLibrary, marcusGaveyPark), 28, 5);
        QUnit.close(geography.computeHeading(marcusGaveyPark, newYorkPublicLibrary), 208, 5);
    });
    
    test('computeCompassDirection', 13, function(){
        equal(geography.computeCompassDirection(0), 'North');
        equal(geography.computeCompassDirection(90), 'East');
        equal(geography.computeCompassDirection(180), 'South');
        equal(geography.computeCompassDirection(270), 'West');
        equal(geography.computeCompassDirection(45), 'Northeast');
        equal(geography.computeCompassDirection(135), 'Southeast');
        equal(geography.computeCompassDirection(225), 'Southwest');
        equal(geography.computeCompassDirection(315), 'Northwest');
        equal(geography.computeCompassDirection(-1), 'North');
        equal(geography.computeCompassDirection(1), 'North');
        equal(geography.computeCompassDirection(359), 'North');
        equal(geography.computeCompassDirection(360), 'North');
        equal(geography.computeCompassDirection(405), 'Northeast');
    });
    
    return {};

});