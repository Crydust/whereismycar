define(function (require) {
    'use strict';

    var domModule = require('./dom');
    var geometryModule = require('./geometry');

    var byId = domModule.byId;
    var Point = geometryModule.Point;

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
     * @param {Point?} center
     */
    function setSvgElementRotate(element, degrees, center) {
        if (typeof center === 'undefined') {
            center = calcSvgElementCenter(element);
        }
        element.setAttribute('transform', 'rotate(' + degrees + ',' + center.getX() + ',' + center.getY() + ')');
    }

    /**
     * @param {Element} element
     * @param {Point} center
     */
    function setSvgCircleCenter(element, center) {
        if (element !== null) {
            element.setAttribute('cx', '' + center.getX());
            element.setAttribute('cy', '' + center.getY());
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

    return {
        setSvgElementRotate: setSvgElementRotate,
        setSvgCircleCenter: setSvgCircleCenter,
        getSvgContentDocumentById: getSvgContentDocumentById
    };

});