/*jslint browser: true, vars: true */
/*global define: false */

define([], function () {
    'use strict';
    
    /**
     * @constructor
     * @param {number} x
     * @param {number} y
     */
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * @return {number} x
     */
    Point.prototype.getX = function () {
        return this.x;
    };
    /**
     * @return {number} y
     */
    Point.prototype.getY = function () {
        return this.y;
    };

    /**
     * @param {number} degrees
     * @return {number} radians
     */
    function toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * @param {number} radians
     * @return {number} degrees
     */
    function toDeg(radians) {
        return radians * 180 / Math.PI;
    }

    return {
        'toRad': toRad,
        'toDeg': toDeg,
        'Point': Point
    };
    
});