define(['./defer', './geography', './again'], function (defer, geography, again) {
    'use strict';

    var win = window;

    function isGeolocationSupported() {
        return win.navigator.hasOwnProperty('geolocation');
    }

    function getCurrentPosition() {
        var deferred = defer(),
        timeoutid;
        if (isGeolocationSupported()) {
            var timeoutHandler = function () {
                deferred.reject(new Error('Timed out'));
            };
            var successHandler = function (geoPosition) {
                win.clearTimeout(timeoutid);
                deferred.resolve(geoPosition);
            };
            var errorHandler = function (geoPositionError) {
                win.clearTimeout(timeoutid);
                deferred.reject(geoPositionError);
            };
            var options = {
                enableHighAccuracy: true,
                timeout: 5000, //ms
                maximumAge: 10000 //ms
            };
            timeoutid = win.setTimeout(timeoutHandler, 5000);
            win.navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
        } else {
            /*
            win.setTimeout(function () {
                deferred.resolve({
                    'timestamp': 1359302664666,
                    'coords': {
                        'speed': null,
                        'heading': null,
                        'altitudeAccuracy': null,
                        'accuracy': 666,
                        'altitude': null,
                        'longitude': 3.7228666,
                        'latitude': 51.0522666
                    }
                });
            }, 1000);
            */
            deferred.reject(new Error('Geolocation unsupported'));
        }
        return deferred.promise;
    }

    function convertPositionToLatLng(position) {
        return new geography.LatLng(position.coords.latitude, position.coords.longitude);
    }

    return {
        isSupported: isGeolocationSupported,
        getCurrentPosition: again(getCurrentPosition),
        convertPositionToLatLng: convertPositionToLatLng
    };
});