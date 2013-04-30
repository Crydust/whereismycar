define(function () {
    'use strict';

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype = {
        getX: function () {
            return this.x;
        },
        getY: function () {
            return this.y;
        }
    };

    function toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function toDeg(radians) {
        return radians * 180 / Math.PI;
    }

    return {
        Point: Point,
        toRad: toRad,
        toDeg: toDeg
    };

});
