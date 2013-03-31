import geometry = module('./geometry');

var toRad = geometry.toRad;
var toDeg = geometry.toDeg;

export class LatLng{
    constructor(private latitude:number , private longitude: number) {
    }
    lat():number{
        return this.latitude;
    }
    lng():number{
        return this.longitude;
    }
    toUrlValue(precision:number = 6):string {
        return this.latitude.toFixed(precision) + ',' +
            this.longitude.toFixed(precision);
    };
}

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
 * @return {string} distance in meters
 */
export function computeDistanceBetween(from:LatLng, to:LatLng, radius:number = 6378137):string {
    // earth radius  as used in gps systems (WGS-84)

    var lat1 = toRad(from.lat());
    var lon1 = toRad(from.lng());
    var lat2 = toRad(to.lat());
    var lon2 = toRad(to.lng());

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
export function computeHeading(from:LatLng, to:LatLng):number {
    var lat1 = toRad(from.lat());
    var lon1 = toRad(from.lng());
    var lat2 = toRad(to.lat());
    var lon2 = toRad(to.lng());

    var dLon = lon2 - lon1;

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var brng = Math.atan2(y, x);

    return (toDeg(brng) + 360) % 360;
}

export function computeCompassDirection(angle):string {
    return ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'][Math.floor(((angle + 22.5) % 360) / 45)];
}