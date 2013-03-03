import domModule = module('./dom');
import geometryModule = module('./geometry');

var byId = domModule.byId;
var Point = geometryModule.Point;

/**
 * @param {Element} element
 * @return {Point}
 */
function calcSvgElementCenter(element:SVGSVGElement):geometryModule.Point {
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
export function setSvgElementRotate(element:SVGSVGElement, degrees:number, center:geometryModule.Point = calcSvgElementCenter(element)):void {
    element.setAttribute('transform', 'rotate(' + degrees + ',' + center.getX() + ',' + center.getY() + ')');
}

/**
 * @param {Element} element
 * @param {Point} center
 */
export function setSvgCircleCenter(element:SVGSVGElement, center:geometryModule.Point):void {
    if (element !== null) {
        element.setAttribute('cx', '' + center.getX());
        element.setAttribute('cy', '' + center.getY());
    }
}

/**
 * @param {string} id
 * @return {Document}
 */
export function getSvgContentDocumentById(id:string):Document {
    var contentDocument = null;
    var element = <HTMLObjectElement>byId(id);
    if (element) {
        contentDocument = element.contentDocument || (element.getSVGDocument && element.getSVGDocument()) || null;
    }
    return contentDocument;
}
