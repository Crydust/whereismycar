/*jslint browser: true, sloppy: true, vars: true */
/*global define: false */

define(['./util', './timeago', './geo', './model', 'json'], function (util, timeago, geo, model, json) {
    'use strict';

    //constants
    var IMAGEUPDATE_MIN_DELAY_MS = 10000; // 1 s
    var GEOCODE_MIN_DELAY_MS = 4000; // 4 s
    var EXPENSIVE_UPDATE_MAX_ACCURACY_M = 70;
    var EXPENSIVE_UPDATE_MIN_DELTA_M = 25;
    var SIGNIFICANT_DIGITS_FOR_STATIC_MAP = 6;
    var LOCAL_STORAGE_KEY = 'stored_position';
    var EMPTY_STRING = '';

    //cached values to prevent going over usage limits
    var previousGeocodeTime = null;
    var previousGeocodePosition = null;
    var previousImageUpdateTime = null;
    var previousImageUpdatePosition = null;

    function setStatus(message) {
        util.byId('status').innerHTML = message;
    }
    function isBrowserSupported() {
        // avoid meory leak in ie9
        // see https://github.com/Modernizr/Modernizr/issues/513
        //var isGeolocationSupported = ('geolocation' in navigator);
        var isGeolocationSupported = navigator.hasOwnProperty('geolocation');
        // check for localStorage just like in modernizr
        var isLocalStorageSupported = false;
        var dummy = 'dummy';
        try {
            window.localStorage.setItem(dummy, dummy);
            window.localStorage.removeItem(dummy);
            isLocalStorageSupported = true;
        } catch (e) {
        }
        return isGeolocationSupported && isLocalStorageSupported;
    }
    function serializePosition(position) {
        return json.stringify(position);
    }
    function deserializePosition(serialized) {
        return json.parse(serialized);
    }
    function storePosition() {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, serializePosition(model.stored_position));
    }
    function loadPosition() {
        var serialized = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (serialized !== null) {
            model.stored_position = deserializePosition(serialized);
        }
    }
    function isCurrentPositionGeocodeAllowed() {
        var now = new Date().getTime();
        var position = new geo.LatLng(model.current_position.latitude, model.current_position.longitude);
        if (model.current_position.accuracy < EXPENSIVE_UPDATE_MAX_ACCURACY_M &&
                (previousGeocodeTime === null || previousGeocodeTime < now - GEOCODE_MIN_DELAY_MS) &&
                (previousGeocodePosition === null || geo.computeDistanceBetween(previousGeocodePosition, position) > EXPENSIVE_UPDATE_MIN_DELTA_M)) {
            previousGeocodeTime = now;
            previousGeocodePosition = position;
            return true;
        } else {
            return false;
        }
    }
    function isCurrentPositionImageUpdateAllowed() {
        //return false;
        var now = new Date().getTime();
        var position = new geo.LatLng(model.current_position.latitude, model.current_position.longitude);
        if (model.current_position.accuracy < EXPENSIVE_UPDATE_MAX_ACCURACY_M &&
                (previousImageUpdateTime === null || previousImageUpdateTime < now - IMAGEUPDATE_MIN_DELAY_MS) &&
                (previousImageUpdatePosition === null || geo.computeDistanceBetween(previousImageUpdatePosition, position) > EXPENSIVE_UPDATE_MIN_DELTA_M)) {
            previousImageUpdateTime = now;
            previousImageUpdatePosition = position;
            return true;
        } else {
            return false;
        }
    }
    function staticImageUrl(coordinates) {
        return EMPTY_STRING +
            'http://maps.googleapis.com/maps/api/staticmap' +
            '?sensor=true' +
            '&size=160x104' +
            (window.devicePixelRatio > 1 ? '&scale=2' : EMPTY_STRING) +
            '&zoom=15' +
            '&center=' + encodeURIComponent(coordinates.toUrlValue(SIGNIFICANT_DIGITS_FOR_STATIC_MAP)) +
            '&markers=' + encodeURIComponent('color:0X44AAFF|size:tiny|' + coordinates.toUrlValue(SIGNIFICANT_DIGITS_FOR_STATIC_MAP));
    }
    function walkingDirectionsUrl(start_coordinates, destination_coordinates) {
        return EMPTY_STRING +
            'maps://' +
            '?saddr=' + encodeURIComponent(start_coordinates.toUrlValue(SIGNIFICANT_DIGITS_FOR_STATIC_MAP)) +
            '&daddr=' + encodeURIComponent(destination_coordinates.toUrlValue(SIGNIFICANT_DIGITS_FOR_STATIC_MAP));
    }
    function updateCurrentPositionImage() {
        if (isCurrentPositionImageUpdateAllowed()) {
            model.updateImageCount += 1;
            model.current_position.img_src = staticImageUrl(
                new geo.LatLng(model.current_position.latitude, model.current_position.longitude)
            );
            util.byId('current_position_img').src = model.current_position.img_src;
        }
    }
    function updateStoredPositionImage() {
        if (model.stored_position.latitude !== null &&
                model.stored_position.longitude !== null) {
            var newImgSrc = staticImageUrl(
                new geo.LatLng(model.stored_position.latitude, model.stored_position.longitude)
            );
            if (model.stored_position.img_src !== newImgSrc) {
                model.stored_position.img_src = newImgSrc;
                storePosition();
            }
            util.byId('stored_position_img').src = model.stored_position.img_src;
        }
    }
    function calculateDistanceAndBearing() {
        if (model.current_position.latitude !== null &&
                model.current_position.longitude !== null &&
                model.stored_position.latitude !== null &&
                model.stored_position.longitude !== null) {
            var latlng1 = new geo.LatLng(model.current_position.latitude, model.current_position.longitude);
            var latlng2 = new geo.LatLng(model.stored_position.latitude, model.stored_position.longitude);
            //model.distance_m = haversine(latlng1, latlng2);
            model.distance_m = geo.computeDistanceBetween(latlng1, latlng2);
            model.bearing_deg = geo.computeHeading(latlng1, latlng2);
        }
    }
    function calculateRadarDotCoordinates(distance_m, heading_deg, bearing_deg, centerX_px, centerY_px, maxDistance_m, maxDistance_px) {
        var radius_px = Math.min(maxDistance_px, distance_m * (maxDistance_px / maxDistance_m));
        var angle_dec = (270 + heading_deg + bearing_deg) % 360;
        var angle_rad = util.toRad(angle_dec);
        var x = Math.round(centerX_px + (radius_px * Math.cos(angle_rad)));
        var y = Math.round(centerY_px + (radius_px * Math.sin(angle_rad)));
        return new util.Point(x, y);
    }
    function updateRadar() {
        var radarContentDocument = util.getSvgContentDocumentById('radar');
        if (radarContentDocument !== null) {
            var dot = util.byId('dot', radarContentDocument);
            if (dot !== null) {
                var centerX_px = 160;
                var centerY_px = 160;
                var maxDistance_m = 300;
                var maxDistance_px = 135;
                var bearing_deg = util.nullToDefault(model.bearing_deg, 0);
                var compassHeading_deg = util.nullToDefault(model.compassHeading_deg, 0);
                var distance_m = util.nullToDefault(model.distance_m, 0);
                var radarDotCoordinates = calculateRadarDotCoordinates(distance_m, compassHeading_deg, bearing_deg, centerX_px, centerY_px, maxDistance_m, maxDistance_px);
                util.setSvgCircleCenter(dot, radarDotCoordinates);
            }
        }
    }
    function timestampReplacer(key, value) {
        if (key === 'timestamp') {
            return timeago.inWords(value);
        }
        return value;
    }
    function updateDebugText() {
        util.byId('debug_output').innerHTML = json.stringify(model, timestampReplacer, 4);
    }
    function updateView() {
        updateCurrentPositionImage();
        updateStoredPositionImage();
        calculateDistanceAndBearing();
        updateRadar();
        model.updateViewCount += 1;
        util.byId('current_position_formatted_address').innerHTML = util.nullToDefault(model.current_position.formatted_address, 'Earth');
        util.byId('stored_position_formatted_address').innerHTML = util.nullToDefault(model.stored_position.formatted_address, 'Earth');
        util.byId('stored_position_timestamp').innerHTML = util.nullToDefault(timeago.inWords(model.stored_position.timestamp), 'Stored');
        updateDebugText();
    }
    function onGeocodeCurrentPosition(result, status) {
        if (status === geo.GEOCODERSTATUS_OK) {
            setStatus('5. Got address ...');
            model.current_position.formatted_address = result;
            updateView();
        } else {
            setStatus('Getting address failed :-(');
            model.current_position.formatted_address = null;
        }
    }
    function geocodeCurrentPosition() {
        if (isCurrentPositionGeocodeAllowed()) {
            model.updateAdressCount += 1;
            setStatus('4. Getting address ...');
            var latlng = new geo.LatLng(model.current_position.latitude, model.current_position.longitude);
            geo.reverseGeocode(latlng, onGeocodeCurrentPosition);
        }
    }
    function onCurrentPositionSuccess(position) {
        setStatus('3. Got position ...');
        model.current_position.timestamp = (new Date()).getTime();
        model.current_position.latitude = position.coords.latitude;
        model.current_position.longitude = position.coords.longitude;
        model.current_position.accuracy = position.coords.accuracy;
        model.heading_deg = position.coords.heading;
        updateView();
        geocodeCurrentPosition();
    }
    function onCurrentPositionError(error) {
        setStatus('Getting position failed :-(');
        //switch (error.code) {
        //case error.PERMISSION_DENIED:
        //case error.POSITION_UNAVAILABLE:
        //case error.TIMEOUT:
            //setStatus(error.message);
            //break;
        //}
    }
    function onStoreCurrentLocationButtonClick(e) {
        //don't just copy a reference to the object!
        model.stored_position = deserializePosition(serializePosition(model.current_position));
        storePosition();
        updateView();
        return false;
    }
    function onGetWalkingDirectionsButtonClick(e) {
        window.open(walkingDirectionsUrl(
            new geo.LatLng(model.current_position.latitude, model.current_position.longitude),
            new geo.LatLng(model.stored_position.latitude, model.stored_position.longitude)));
        return false;
    }
    function updateCompass() {
        var compassContentDocument = util.getSvgContentDocumentById('compass');
        if (compassContentDocument !== null) {
            util.setSvgElementRotate(util.byId('dial', compassContentDocument), -1 * util.nullToDefault(model.bearing_deg, 0));
            util.setSvgElementRotate(util.byId('needle', compassContentDocument), util.nullToDefault(model.compassHeading_deg, 0));
        }
    }
    function onDeviceorientation(event) {
        var success = false;
        if (event.webkitCompassHeading !== undefined &&
                event.webkitCompassHeading !== null &&
                event.webkitCompassHeading > 0 &&
                event.webkitCompassAccuracy >= 0 &&
                event.webkitCompassAccuracy <= 30) {
            model.compassHeading_deg = (360 - event.webkitCompassHeading);
            success = true;
        } else if (event.alpha !== null && event.absolute) {
            model.compassHeading_deg = (360 - event.alpha);
            success = true;
        }
        if (success) {
            updateCompass();
            updateRadar();
            updateDebugText();
        }
    }
    function onCompassLoaded() {
        // will this happen?
    }
    function onDomReady() {
        setStatus('2. Getting position ...');
        loadPosition();
        navigator.geolocation.watchPosition(
            onCurrentPositionSuccess,
            onCurrentPositionError,
            {
                enableHighAccuracy: true,
                timeout: 5000, //ms
                maximumAge: 0 //ms
            }
        );
        util.on(util.byId('store_current_location_button'), 'click', onStoreCurrentLocationButtonClick);
        util.on(util.byId('get_walking_directions_button'), 'click', onGetWalkingDirectionsButtonClick);
        util.on(util.byId('compass'), 'load', onCompassLoaded);
        util.on(window, 'deviceorientation', onDeviceorientation);
    }
    function initApplication() {
        setStatus('1. Initializing ...');
        if (isBrowserSupported()) {
            onDomReady();
        } else {
            setStatus('Browser not supported :-(');
        }
    }

    return initApplication;

});