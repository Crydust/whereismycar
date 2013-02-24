define(['./defer', './network', './geography'], function (defer, network, geography) {
    'use strict';

    /** @const @type {number} */
    var SIGNIFICANT_DIGITS_FOR_GEOCODE = 6;

    function extractAddress(data) {
        var deferred = defer();
        if (data && data.Status && data.Status.code === 200) {
            deferred.resolve(data.Placemark[0].address);
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
                deferred.resolve(network.getJsonp(url).then(extractAddress));
            } else {
            //>>excludeEnd("prod");
                url = 'geo/?output=json&q=' +
                    latlng.toUrlValue(SIGNIFICANT_DIGITS_FOR_GEOCODE);
                deferred.resolve(network.getJson(url).then(extractAddress));
            //>>excludeStart("prod", pragmas.prod);
            }
            //>>excludeEnd("prod");
        } else {
            deferred.reject(new Error('latlng is of wrong type'));
        }
        return deferred.promise;
    }
    
    function staticImageUrl(latlng) {
        return '' +
            'http://maps.googleapis.com/maps/api/staticmap' +
            '?sensor=true' +
            '&size=160x104' +
            (window.devicePixelRatio > 1 ? '&scale=2' : '') +
            '&zoom=15' +
            '&center=' + encodeURIComponent(latlng.toUrlValue()) +
            '&markers=' + encodeURIComponent('color:0X44AAFF|size:tiny|' + latlng.toUrlValue());
    }

    return {
        'reverseGeocode': reverseGeocode,
        'staticImageUrl': staticImageUrl
    };

});