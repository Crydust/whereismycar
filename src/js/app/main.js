/*jslint browser: true, sloppy: true, vars: true */
/*global define: false */
define(['./model', './dom', 'json3', './geolocation', './google', './objects', './view', 'domReady!'], function (model, dom, JSON3, geolocation, google, objects, view) {
    'use strict';
    
    function log(message) {
        //>>excludeStart("prod", pragmas.prod);
        if (objects.betterTypeof(message) !== 'string') {
            message = JSON3.stringify(message, null, 4);
        }
        dom.byId('debug_output').innerHTML = message;
        window.console.log(message);
        //>>excludeEnd("prod");
    }
    
    function main() {
        // 1. show stored location
        var data = model.get();
        //log(data);
        
        // 2. load current location
        var positionPromise = geolocation.getCurrentPosition();
        positionPromise
        .then(function (position) {
            data.current.timestamp = position.timestamp;
            if (data.current.timestamp > 14000000000000) {
                data.current.timestamp = Math.floor(data.current.timestamp / 1000);
            }
            data.current.latitude = position.coords.latitude;
            data.current.longitude = position.coords.longitude;
            data.current.accuracy = position.coords.accuracy;
            data.current.address = null;
            data.current.img = null;
            //log(data);
        });
        var latlngPromise = positionPromise
        .then(geolocation.convertPositionToLatLng);

        // image url
        latlngPromise
        .then(function (latlng) {
            data.current.img = google.staticImageUrl(latlng);
            //log(data);
        });
        
        
        // 3. show distance and heading
        
        
        // 4. do reverse geolocation
        latlngPromise
        .then(google.reverseGeocode)
        .then(function (address) {
            data.current.address = address;
            //log(data);
            view.update(data);
        }, function (reason) {
            dom.byId('debug_output').innerHTML += 'error ' + reason;
        });
        
        // store
        dom.on(dom.byId('store_current_location_button'), 'click', function () {
            data.stored = objects.copy(data.current);
            //log(data);
            model.store();
            view.update(data);
            return false;
        });
    }

    main();

    return {};
});