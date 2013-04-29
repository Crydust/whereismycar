define(function (require) {
    'use strict';

    var objects = require('./objects');
    var dom = require('./dom');
    var modelModule = require('./model');
    var timeago = require('./timeago');
    var geography = require('./geography');
    var svg = require('./svg');
    var geometry = require('./geometry');
    //var google = require('./google');

    var defaultTimestamp = 0;
    var defaultImage = 'img/spacer.gif';
    var defaultAddress = 'Planet Earth';

    function cleanData(rawData) {
        var data = objects.copy(rawData);
        data.current.timestamp = objects.nullToDefault(data.current.timestamp, defaultTimestamp);
        data.stored.timestamp = objects.nullToDefault(data.stored.timestamp, defaultTimestamp);
        data.current.img = objects.nullToDefault(data.current.img, defaultImage);
        data.stored.img = objects.nullToDefault(data.stored.img, defaultImage);
        data.current.address = objects.nullToDefault(data.current.address, defaultAddress);
        data.stored.address = objects.nullToDefault(data.stored.address, defaultAddress);
        return data;
    }

    function calculateRadarDotCoordinates(
            distanceInMeters, headingInDegrees, bearingInDegrees, centerXInPixels, centerYInPixels,
            maxDistanceInMeters, maxDistanceInPixels) {
        var radiusInPixels = Math.min(
                maxDistanceInPixels,
                distanceInMeters * maxDistanceInPixels / maxDistanceInMeters);
        var angleInDegrees = (270 + headingInDegrees + bearingInDegrees) % 360;
        var angleInRadians = geometry.toRad(angleInDegrees);
        var x = Math.round(centerXInPixels + (radiusInPixels * Math.cos(angleInRadians)));
        var y = Math.round(centerYInPixels + (radiusInPixels * Math.sin(angleInRadians)));
        return new geometry.Point(x, y);
    }

    function updateRadar(bearingInDegrees, compassHeadingInDegrees, distanceInMeters) {
        var radarContentDocument = svg.getSvgContentDocumentById('radar');
        if (radarContentDocument !== null) {
            var dot = dom.byId('dot', radarContentDocument);
            var radarDotCoordinates = calculateRadarDotCoordinates(
                    distanceInMeters, compassHeadingInDegrees, bearingInDegrees,
                    160, 160, 300, 135);
            svg.setSvgCircleCenter(dot, radarDotCoordinates);
        }
    }

    function updateCompass(bearingInDegrees, compassHeadingInDegrees) {
        var compassContentDocument = svg.getSvgContentDocumentById('compass');
        if (compassContentDocument !== null) {
            svg.setSvgElementRotate((dom.byId('dial', compassContentDocument)), -1 * bearingInDegrees);
            svg.setSvgElementRotate((dom.byId('needle', compassContentDocument)), compassHeadingInDegrees);
        }
    }

    var currentData = cleanData(modelModule.defaults);

    var updateCurrentImageTime = 0;
    var updateStoredImageTime = 0;

    function update(data) {
        var newData = cleanData(data);
        var currentTime = new Date().getTime();

        //status
        if (currentData.status !== newData.status) {
            (dom.byId('debug_output')).innerHTML = newData.status;
        }

        //current img
        if (currentTime - updateCurrentImageTime > 5000 &&
                data.current.accuracy < 150 &&
                newData.current.latitude !== null &&
                newData.current.longitude !== null) {
            var currentLatLng = new geography.LatLng(currentData.current.latitude, data.current.longitude);
            var newLatLng = new geography.LatLng(newData.current.latitude, newData.current.longitude);
            var distance = parseFloat(geography.computeDistanceBetween(currentLatLng, newLatLng));
            if (currentData.current.img !== newData.current.img &&
                    distance > 30) {
                updateCurrentImageTime = currentTime;
                (dom.byId('current_position_img')).src = newData.current.img;
            }
        }

        //stored img
        if (currentTime - updateStoredImageTime > 5000 &&
                currentData.stored.img !== newData.stored.img) {
            updateStoredImageTime = currentTime;
            (dom.byId('stored_position_img')).src = newData.stored.img;
        }

        //current address
        if (currentData.current.address !== newData.current.address) {
            (dom.byId('current_position_formatted_address')).innerHTML = newData.current.address;
        }

        //stored address
        if (currentData.stored.address !== newData.stored.address) {
            (dom.byId('stored_position_formatted_address')).innerHTML = newData.stored.address;
        }

        //timestamp
        if (currentData.stored.timestamp !== newData.stored.timestamp) {
            (dom.byId('stored_position_timestamp')).innerHTML = timeago.inWords(newData.stored.timestamp);
        }

        //direction
        if (currentData.bearing !== newData.bearing ||
                currentData.distance !== newData.distance) {
            (dom.byId('direction_current_to_stored')).innerHTML =
                    newData.distance + 'm ' + geography.computeCompassDirection(newData.bearing);
        }

        //radar
        if (currentData.bearing !== newData.bearing ||
                currentData.compass !== newData.compass ||
                currentData.distance !== newData.distance) {
            updateRadar(data.bearing, data.compass, newData.distance);
        }

        //compass
        if (currentData.bearing !== newData.bearing ||
                currentData.compass !== newData.compass) {
            updateCompass(data.bearing, data.compass);
        }

        currentData = newData;
    }

    return {
        update: update
    };

});