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
     * @param {string} id
     * @param {Document=} doc
     * @return {Element}
     */
    function byId(id, doc) {
        doc = doc || document;
        return doc.getElementById(id);
    }
    
    /**
     * Add an event handler
     * @param {Element} element
     * @param {string} name
     * @param {Function} handler
     */
    function on(element, name, handler) {
        var wrappedHandler = function (e) {
            var result = handler(e);
            if (result === false && e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            }
            return result;
        };
        if (element.addEventListener) {
            element.addEventListener(name, wrappedHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, wrappedHandler);
        } else {
            var oldHandler = element['on' + name];
            if (oldHandler) {
                element['on' + name] = function () {
                    oldHandler.apply(this, arguments);
                    return wrappedHandler.apply(this, arguments);
                };
            } else {
                element['on' + name] = wrappedHandler;
            }
        }
    }
    
    /**
     * @param {Element} element
     * @return {Point}
     */
    function calcSvgElementCenter(element) {
        var bbox = element.getBBox();
        return new Point(
            bbox.x + bbox.width / 2,
            bbox.y + bbox.height / 2
        );
    }
    
    /**
     * @param {Element} element
     * @param {number} degrees
     */
    function setSvgElementRotate(element, degrees) {
        var center = calcSvgElementCenter(element);
        element.setAttribute('transform', 'rotate(' + degrees + ',' + center.x + ',' + center.y + ')');
    }
    
    /**
     * @param {Element} element
     * @param {Point} center
     */
    function setSvgCircleCenter(element, center) {
        if (element !== null) {
            element.setAttribute('cx', center.getX());
            element.setAttribute('cy', center.getY());
        }
    }
    
    /**
     * @param {string} id
     * @return {Document}
     */
    function getSvgContentDocumentById(id) {
        var contentDocument = null;
        var element = byId(id);
        if (element) {
            contentDocument = element.contentDocument || (element.getSVGDocument && element.getSVGDocument()) || null;
        }
        return contentDocument;
    }
    
    /**
     * @param {*|null} theValue
     * @param {*} theDefault
     */
    function nullToDefault(theValue, theDefault) {
        if (theValue === null || theValue === undefined ||
                (typeof theValue === 'number' && isNaN(theValue))) {
            if (theDefault === undefined) {
                theDefault = 'Unknown';
            }
            return theDefault;
        } else {
            return theValue;
        }
    }
    
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

    function loadJsonp(url) {
        var script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    
    
    var EMPY_OBJECT = {};
    function betterTypeof(obj) {
        return EMPY_OBJECT.toString.call(obj).slice(8, -1).toLowerCase();
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        'byId': byId,
        'on': on,
        'nullToDefault': nullToDefault,
        'toRad': toRad,
        'toDeg': toDeg,
        'Point': Point,
        'getSvgContentDocumentById': getSvgContentDocumentById,
        'setSvgCircleCenter': setSvgCircleCenter,
        'setSvgElementRotate': setSvgElementRotate,
        'loadJsonp': loadJsonp,
        'betterTypeof': betterTypeof,
        'capitalizeFirstLetter': capitalizeFirstLetter
    };
    
});