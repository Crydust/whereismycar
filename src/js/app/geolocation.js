define(function (require) {
    'use strict';

    var deferModule = require('./defer');
    var geography = require('./geography');

    var defer = deferModule.defer;

    function isSupported() {
        return window.navigator.hasOwnProperty('geolocation');
    }

    function getCurrentPosition() {
        var deferred = defer(),
        timeoutid;
        if (isSupported()) {
            var timeoutHandler = function () {
                deferred.reject(new Error('Timed out'));
            };
            var successHandler = function (geoPosition) {
                window.clearTimeout(timeoutid);
                deferred.resolve(geoPosition);
            };
            var errorHandler = function (geoPositionError) {
                window.clearTimeout(timeoutid);
                deferred.reject(geoPositionError);
            };
            var options = {
                enableHighAccuracy: true,
                timeout: 5000, //ms
                maximumAge: 10000 //ms
            };
            timeoutid = window.setTimeout(timeoutHandler, 5000);
            window.navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
        } else {
            /*
            window.setTimeout(function () {
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

    function convertPositionToLatLng(obj) {
        return new geography.LatLng(obj.coords.latitude, obj.coords.longitude);
    }

    return {
        isSupported: isSupported,
        getCurrentPosition: getCurrentPosition,
        convertPositionToLatLng: convertPositionToLatLng
    };

});