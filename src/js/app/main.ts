import model = module('./model');
import dom = module('./dom');
import JSON3 = module('vendor/json3');
import geolocation = module('./geolocation');
import google = module('./google');
import objects = module('./objects');
import view = module('./view');
import geography = module('./geography');
import svg = module('./svg');
import geometry = module('./geometry');
//import domReady = module('vendor/domReady!');

function log(message) {
    //>>excludeStart("prod", pragmas.prod);
    if (objects.betterTypeof(message) !== 'string') {
        message = JSON3.stringify(message, null, 4);
    }
    (<HTMLElement>dom.byId('debug_output')).innerHTML += message;
    window.console.log(message);
    //>>excludeEnd("prod");
}


export function main() {
    var data = model.read();
    var isReverseGeoCoding = false;
    
    var isDirty = true;
    var radarContentDocument = null;
    var sweeper = null;
    var sweeperCenter = new geometry.Point(160, 160);
    function step(timestamp) {
        if (isDirty) {
            isDirty = false;
            view.update(data);
        }
        if (radarContentDocument === null) {
            radarContentDocument = svg.getSvgContentDocumentById('radar');
        }
        if (sweeper === null) {
            sweeper = <SVGSVGElement>dom.byId('sweeper', radarContentDocument);
        }
        if (sweeper !== null) {
            svg.setSvgElementRotate(sweeper, ((timestamp % 6000) / 6000) * 360, sweeperCenter);
        }
        window.requestAnimationFrame(step);
    }
    step(0);
    
    function onDeviceorientation(event) {
        var success = false;
        if (event.webkitCompassHeading !== undefined &&
                event.webkitCompassHeading !== null &&
                event.webkitCompassHeading > 0 &&
                event.webkitCompassAccuracy >= 0 &&
                event.webkitCompassAccuracy <= 30) {
            data.compass = <any>(360 - event.webkitCompassHeading);
            success = true;
        } else if (event.alpha !== null && event.absolute) {
            data.compass = <any>(360 - event.alpha);
            success = true;
        }
        if (success) {
            isDirty = true;
        }
    }
    
    function handlePosition(position) {
        //copy position into data
        data.current.timestamp = position.timestamp;
        if (data.current.timestamp > 14000000000000) {
            data.current.timestamp = <any>Math.floor(data.current.timestamp / 1000);
        }
        data.current.latitude = position.coords.latitude;
        data.current.longitude = position.coords.longitude;
        data.current.accuracy = position.coords.accuracy;
        data.heading = position.coords.heading;
        //use position to compute distance and bearing
        var currentLatLng = new geography.LatLng(data.current.latitude, data.current.longitude);
        var storedLatLng = new geography.LatLng(data.stored.latitude, data.stored.longitude);
        geography.computeDistanceBetween(currentLatLng, storedLatLng);
        data.distance = <any>geography.computeDistanceBetween(currentLatLng, storedLatLng);
        data.bearing = <any>geography.computeHeading(currentLatLng, storedLatLng);
        data.current.img = <any>google.staticImageUrl(currentLatLng);
        isDirty = true;
        // do reverse geolocation
        if (!isReverseGeoCoding && data.current.accuracy < 150) {
            isReverseGeoCoding = true;
            google.reverseGeocode(currentLatLng)
            .then(function (address) {
                data.current.address = address;
                data.status = 'Done.';
                log(data);
                isDirty = true;
                isReverseGeoCoding = false;
            }, function (reason) {
                data.status = 'error ' + reason + '\n';
                isDirty = true;
                isReverseGeoCoding = false;
            });
        }
    }
    
    function updatePosition() {
        data.status = 'Loading ...\n';
        isDirty = true;
        isReverseGeoCoding = false;

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
        model.write();
        isDirty = true;
        return false;
    });
    //update
    dom.on(dom.byId('update_current_location_button'), 'click', function () {
        updatePosition();
        return false;
    });
    
    updatePosition();

}

