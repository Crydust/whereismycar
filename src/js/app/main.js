define(['./model', './dom', 'json3', './geolocation', './google', './objects', './view', './geography', 'domReady!'], function (model, dom, JSON3, geolocation, google, objects, view, geography) {
    'use strict';
    
    function log(message) {
        //>>excludeStart("prod", pragmas.prod);
        if (objects.betterTypeof(message) !== 'string') {
            message = JSON3.stringify(message, null, 4);
        }
        dom.byId('debug_output').innerHTML += message;
        window.console.log(message);
        //>>excludeEnd("prod");
    }
    
    
    function main() {
        var data = model.get();
        var isReverseGeoCoding = false;
        
        var raf = null;
        function updateView() {
            if (raf === null) {
                raf = window.requestAnimationFrame(function () {
                    view.update(data);
                    raf = null;
                });
            }
        }
        
        function onDeviceorientation(event) {
            var success = false;
            if (event.webkitCompassHeading !== undefined &&
                    event.webkitCompassHeading !== null &&
                    event.webkitCompassHeading > 0 &&
                    event.webkitCompassAccuracy >= 0 &&
                    event.webkitCompassAccuracy <= 30) {
                data.compass = (360 - event.webkitCompassHeading);
                success = true;
            } else if (event.alpha !== null && event.absolute) {
                data.compass = (360 - event.alpha);
                success = true;
            }
            if (success) {
                updateView();
            }
        }
        
        function handlePosition(position) {
            //copy position into data
            data.current.timestamp = position.timestamp;
            if (data.current.timestamp > 14000000000000) {
                data.current.timestamp = Math.floor(data.current.timestamp / 1000);
            }
            data.current.latitude = position.coords.latitude;
            data.current.longitude = position.coords.longitude;
            data.current.accuracy = position.coords.accuracy;
            data.heading = position.coords.heading;
            //use position to compute distance and bearing
            var currentLatLng = new geography.LatLng(data.current.latitude, data.current.longitude);
            var storedLatLng = new geography.LatLng(data.stored.latitude, data.stored.longitude);
            geography.computeDistanceBetween(currentLatLng, storedLatLng);
            data.distance = geography.computeDistanceBetween(currentLatLng, storedLatLng);
            data.bearing = geography.computeHeading(currentLatLng, storedLatLng);
            updateView();
            // do reverse geolocation
            if (!isReverseGeoCoding && data.current.accuracy < 150) {
                data.current.address = null;
                isReverseGeoCoding = true;
                google.reverseGeocode(currentLatLng)
                .then(function (address) {
                    data.current.address = address;
                    log(data);
                    data.status = 'Done.';
                    updateView();
                    isReverseGeoCoding = false;
                }, function (reason) {
                    data.status = 'error ' + reason + '\n';
                    updateView();
                    isReverseGeoCoding = false;
                });
            }
        }
        
        updateView();
        
        function updatePosition() {
            data.status = 'Loading ...\n';
            isReverseGeoCoding = false;
            updateView();

            geolocation.getCurrentPosition()
            .then(handlePosition)
            .then(function () {
                //listen to compass
                dom.on(window, 'deviceorientation', onDeviceorientation);
                //continously listen to position
                navigator.geolocation.watchPosition(
                    handlePosition,
                    function noop() {},
                    {
                        enableHighAccuracy: true,
                        timeout: 5000, //ms
                        maximumAge: 0 //ms
                    }
                );

            });
            
        }
        
        // store
        dom.on(dom.byId('store_current_location_button'), 'click', function () {
            data.stored = objects.copy(data.current);
            //log(data);
            model.store();
            updateView();
            return false;
        });
        //update
        dom.on(dom.byId('update_current_location_button'), 'click', function () {
            updatePosition();
            return false;
        });
        
        updatePosition();

    }

    main();

    return {};
});