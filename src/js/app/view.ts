import objects = module('./objects');
import dom = module('./dom');
import modelModule = module('./model');
import timeago = module('./timeago');
import geography = module('./geography');
import svg = module('./svg');
import geometry = module('./geometry');
import google = module('./google');

var defaultTimestamp = 0;
var defaultImage = 'img/spacer.gif';
var defaultAddress = 'Planet Earth';

function cleanData(rawData:any):any {
    var data = objects.copy(rawData);
    data.current.timestamp = objects.nullToDefault(data.current.timestamp, defaultTimestamp);
    data.stored.timestamp = objects.nullToDefault(data.stored.timestamp, defaultTimestamp);
    data.current.img = objects.nullToDefault(data.current.img, defaultImage);
    data.stored.img = objects.nullToDefault(data.stored.img, defaultImage);
    data.current.address = objects.nullToDefault(data.current.address, defaultAddress);
    data.stored.address = objects.nullToDefault(data.stored.address, defaultAddress);
    return data;
}

function calculateRadarDotCoordinates(distance_m:number, heading_deg:number, bearing_deg:number, centerX_px:number, centerY_px:number, maxDistance_m:number, maxDistance_px:number):geometry.Point {
    var radius_px = Math.min(maxDistance_px, distance_m * maxDistance_px / maxDistance_m);
    var angle_dec = (270 + heading_deg + bearing_deg) % 360;
    var angle_rad = geometry.toRad(angle_dec);
    var x = Math.round(centerX_px + (radius_px * Math.cos(angle_rad)));
    var y = Math.round(centerY_px + (radius_px * Math.sin(angle_rad)));
    return new geometry.Point(x, y);
}

function updateRadar(bearing_deg:number, compassHeading_deg:number, distance_m:number):void {
    var radarContentDocument = svg.getSvgContentDocumentById('radar');
    if (radarContentDocument !== null) {
        var dot = <SVGSVGElement>dom.byId('dot', radarContentDocument);
        var radarDotCoordinates = calculateRadarDotCoordinates(
                distance_m, compassHeading_deg, bearing_deg,
                160, 160, 300, 135);
        svg.setSvgCircleCenter(dot, radarDotCoordinates);
    }
}

function updateCompass(bearing_deg:number, compassHeading_deg:number):void {
    var compassContentDocument = svg.getSvgContentDocumentById('compass');
    if (compassContentDocument !== null) {
        svg.setSvgElementRotate((<SVGSVGElement>dom.byId('dial', compassContentDocument)), -1 * bearing_deg);
        svg.setSvgElementRotate((<SVGSVGElement>dom.byId('needle', compassContentDocument)), compassHeading_deg);
    }
}

var currentData = cleanData(modelModule.defaults);

var updateCurrentImageTime = 0;
var updateStoredImageTime = 0;

export function update(data:any):void {
    var newData = cleanData(data);
    var currentTime = new Date().getTime();
    
    //status
    if (currentData.status !== newData.status) {
        (<HTMLElement>dom.byId('debug_output')).innerHTML = newData.status;
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
            (<HTMLImageElement>dom.byId('current_position_img')).src = newData.current.img;
        }
    }

    //stored img
    if (currentTime - updateStoredImageTime > 5000 &&
            currentData.stored.img !== newData.stored.img) {
        updateStoredImageTime = currentTime;
        (<HTMLImageElement>dom.byId('stored_position_img')).src = newData.stored.img;
    }

    //current address
    if (currentData.current.address !== newData.current.address) {
        (<HTMLElement>dom.byId('current_position_formatted_address')).innerHTML = newData.current.address;
    }

    //stored address
    if (currentData.stored.address !== newData.stored.address) {
        (<HTMLElement>dom.byId('stored_position_formatted_address')).innerHTML = newData.stored.address;
    }

    //timestamp
    if (currentData.stored.timestamp !== newData.stored.timestamp) {
        (<HTMLElement>dom.byId('stored_position_timestamp')).innerHTML = timeago.inWords(newData.stored.timestamp);
    }

    //direction
    if (currentData.bearing !== newData.bearing ||
            currentData.distance !== newData.distance) {
        (<HTMLElement>dom.byId('direction_current_to_stored')).innerHTML = newData.distance + 'm ' + geography.computeCompassDirection(newData.bearing);
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
