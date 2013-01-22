/*jslint browser: true, sloppy: true, vars: true */
/*global define: false */

define(['promises-a', './network', './geography'], function (defer, network, geography) {
    'use strict';

    /** @const @type {number} */
    var SIGNIFICANT_DIGITS_FOR_GEOCODE = 6;
    /** @const @type {Function} */
    var NOOP = function () {};

    function extractAddress(data) {
        var deferred = defer();
        if (data && data.Status && data.Status.code === 200) {
            deferred.fulfill(data.Placemark[0].address);
        } else {
            deferred.reject(new Error('could not read address'));
        }
        return deferred.promise;
    }

    function reverseGeocode(latlng) {
        var deferred = defer();
        if (latlng instanceof geography.LatLng) {
            // it seems this url no longer returns a jsonp reply
            // so we use a proxy
            //var url = 'http://maps.google.com/maps/geo'
            var url;
            //>>excludeStart("prod", pragmas.prod);
            var hostname = window.location.hostname;
            if (hostname === 'localhost') {
                url = 'http://www.crydust.be/lab/whereismycar/geo/' +
                    '?output=jsonp&callback=?&q=' +
                    latlng.toUrlValue(SIGNIFICANT_DIGITS_FOR_GEOCODE);
                deferred.fulfill(network.getJsonp(url).then(extractAddress));
            } else {
            //>>excludeEnd("prod");
                url = 'geo/?output=json&q=' +
                    latlng.toUrlValue(SIGNIFICANT_DIGITS_FOR_GEOCODE);
                deferred.fulfill(network.getJson(url).then(extractAddress));
            //>>excludeStart("prod", pragmas.prod);
            }
            //>>excludeEnd("prod");
        } else {
            deferred.reject(new Error('latlng is of wrong type'));
        }
        return deferred.promise;
    }
    
    return {
        'reverseGeocode': reverseGeocode
    };

});