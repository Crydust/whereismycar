define(['./defer', './objects', './dom', './model', './timeago', './geography'], function (defer, objects, dom, model, timeago, geography) {
    'use strict';
    
    var win = window;
    var defaultTimestamp = 0;
    var defaultImage = 'img/spacer.gif';
    var defaultAddress = 'Planet Earth';
    
    function cleanData(data) {
        data = objects.copy(data);
        data.current.timestamp = objects.nullToDefault(data.current.timestamp, defaultTimestamp);
        data.stored.timestamp = objects.nullToDefault(data.stored.timestamp, defaultTimestamp);
        data.current.img = objects.nullToDefault(data.current.img, defaultImage);
        data.stored.img = objects.nullToDefault(data.stored.img, defaultImage);
        data.current.address = objects.nullToDefault(data.current.address, defaultAddress);
        data.stored.address = objects.nullToDefault(data.stored.address, defaultAddress);
        return data;
    }
    
    var currentData = cleanData(model.defaults);
    
    function update(data) {
        var deferred = defer();
        var newData = cleanData(data);
        
        var rafid;
        var timeoutid;
        var timeoutHandler = function () {
            win.cancelAnimationFrame(rafid);
            deferred.reject(new Error('Timed out'));
        };
        var rafHandler = function () {
            win.clearTimeout(timeoutid);
            //radar
            //TODO

            //current img
            if (currentData.current.img !== newData.current.img) {
                dom.byId('current_position_img').src = newData.current.img;
            }

            //stored img
            if (currentData.stored.img !== newData.stored.img) {
                dom.byId('stored_position_img').src = newData.stored.img;
            }

            //current address
            if (currentData.current.address !== newData.current.address) {
                dom.byId('current_position_formatted_address').innerHTML = newData.current.address;
            }

            //stored address
            if (currentData.stored.address !== newData.stored.address) {
                dom.byId('stored_position_formatted_address').innerHTML = newData.stored.address;
            }

            //timestamp
            if (currentData.stored.timestamp !== newData.stored.timestamp) {
                dom.byId('stored_position_timestamp').innerHTML = timeago.inWords(newData.stored.timestamp);
            }

            //compass
            if (currentData.stored.latitude !== newData.stored.latitude ||
                    currentData.stored.longitude !== newData.stored.longitude ||
                    currentData.current.latitude !== newData.current.latitude ||
                    currentData.current.longitude !== newData.current.longitude) {
                var storedLatLng = new geography.LatLng(newData.stored.latitude, newData.stored.longitude);
                var currentLatLng = new geography.LatLng(newData.current.latitude, newData.current.longitude);
                var distance = geography.computeDistanceBetween(currentLatLng, storedLatLng);
                var heading = geography.computeHeading(currentLatLng, storedLatLng);
                var direction = geography.computeCompassDirection(heading);
                dom.byId('direction_current_to_stored').innerHTML = distance + 'm ' + direction;
            }

            currentData = newData;
            deferred.resolve(true);
        };
        timeoutid = win.setTimeout(timeoutHandler, 5000);
        rafid = window.requestAnimationFrame(rafHandler);
        
        return deferred.promise;
    }
    
    return {
        'update': update
    };
});