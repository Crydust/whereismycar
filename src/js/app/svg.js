define(['./dom', './geometry'], function (dom, geometry) {
    'use strict';
    
    var byId = dom.byId;
    var Point = geometry.Point;
    
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

    return {
        'getSvgContentDocumentById': getSvgContentDocumentById,
        'setSvgCircleCenter': setSvgCircleCenter,
        'setSvgElementRotate': setSvgElementRotate
    };
    
});