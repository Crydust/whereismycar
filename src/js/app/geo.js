/*jslint browser: true, sloppy: true, vars: true */
/*global define: false */

define(['./util'], function (util) {
    'use strict';

    /** @const @type {number} */
    var SIGNIFICANT_DIGITS_FOR_GEOCODE = 6;
    /** @const @type {string} */
    var GOOGLE_API_KEY = 'REPLACEME';
    /** @const @type {string} */
    var JSONP_CALLBACK_NAME = '_f1';
    /** @const @type {number} */
    var JSONP_TIMEOUT_MS = 2000;
    /** @const @type {number} */
    var GEOCODERSTATUS_OK = 0;
    /** @const @type {number} */
    var GEOCODERSTATUS_ERROR = 1;
    /** @const @type {Function} */
    var NOOP = function () {};
    
    /**
     * @constructor
     * @param {number} lat
     * @param {number} lng
     */
    function LatLng(lat, lng) {
        this.latitude = lat;
        this.longitude = lng;
    }
    
    /**
     * @return {number}
     */
    LatLng.prototype.lat = function () {
        return this.latitude;
    };
    
    /**
     * @return {number}
     */
    LatLng.prototype.lng = function () {
        return this.longitude;
    };
    
    /**
     * @param {number=} precision
     * @return {string}
     */
    LatLng.prototype.toUrlValue = function (precision) {
        precision = precision || 6;
        return this.latitude.toFixed(precision) + ',' +
            this.longitude.toFixed(precision);
    };

    /**
     * Returns the distance between two points in m
     * (using Haversine formula)
     *
     * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
     *       Sky and Telescope, vol 68, no 2, 1984
     *
     * @param {LatLng} from
     * @param {LatLng} to
     * @param {number=} radius
     * @return {number} distance in meters
     */
    function computeDistanceBetween(from, to, radius) {
        // earth radius  as used in gps systems (WGS-84)
        radius = radius || 6378137;

        var lat1 = util.toRad(from.lat());
        var lon1 = util.toRad(from.lng());
        var lat2 = util.toRad(to.lat());
        var lon2 = util.toRad(to.lng());

        var dLat = lat2 - lat1;
        var dLon = lon2 - lon1;

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = radius * c;

        return d.toFixed(1);
    }

    /**
     * Returns the (initial) bearing from this point to the supplied point, in degrees
     *   see http://williams.best.vwh.net/avform.htm#Crs
     *
     * @param {LatLng} from
     * @param {LatLng} to
     * @return {number} heading in degrees
     */
    function computeHeading(from, to) {
        var lat1 = util.toRad(from.lat());
        var lon1 = util.toRad(from.lng());
        var lat2 = util.toRad(to.lat());
        var lon2 = util.toRad(to.lng());

        var dLon = lon2 - lon1;

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = Math.atan2(y, x);

        return (util.toDeg(brng) + 360) % 360;
    }
    
    function reverseGeocode(latlng, handler) {
        // it seems this url no longer returns a jsonp reply
        // so we use a proxy
        //var url = 'http://maps.google.com/maps/geo'
        var url = 'geo' +
            '?q=' + latlng.toUrlValue(SIGNIFICANT_DIGITS_FOR_GEOCODE) +
            '&output=json' +
            '&sensor=false' +
            '&key=' + encodeURIComponent(GOOGLE_API_KEY) +
            '&callback=' + encodeURIComponent(JSONP_CALLBACK_NAME);
        var timeoutID = window.setTimeout(function () {
            window[JSONP_CALLBACK_NAME] = NOOP;
            handler('', GEOCODERSTATUS_ERROR);
        }, JSONP_TIMEOUT_MS);
        window[JSONP_CALLBACK_NAME] = function (data) {
            window.clearTimeout(timeoutID);
            if (data && data.Status && data.Status.code === 200) {
                handler(data.Placemark[0].address, GEOCODERSTATUS_OK);
            } else {
                handler('', GEOCODERSTATUS_ERROR);
            }
        };
        util.loadJsonp(url);
    }
    
    return {
        'LatLng': LatLng,
        'computeDistanceBetween': computeDistanceBetween,
        'computeHeading': computeHeading,
        'reverseGeocode': reverseGeocode,
        'GEOCODERSTATUS_OK': GEOCODERSTATUS_OK,
        'GEOCODERSTATUS_ERROR': GEOCODERSTATUS_ERROR
    };

});