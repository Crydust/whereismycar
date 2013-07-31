/**
 * simulateEvent(element, eventName[, options]) -> Element
 * 
 * - element: element to fire event on
 * - eventName: name of event to fire (only MouseEvents and HTMLEvents interfaces are supported)
 * - options: optional object to fine-tune event properties - pointerX, pointerY, ctrlKey, etc.
 *
 * // => fires "click" event on an element with id=foo
 * simulateEvent(document.getElementById('foo')), 'click');
 *
 * @license protolicious is licensed under the terms of the MIT license
 * @see http://stackoverflow.com/a/6158050/11451
 * @see https://github.com/kangax/protolicious/blob/master/event.simulate.js
 */
var simulateEvent = (function(){
    function extend(destination, source) {
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    }
    var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
    };
    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
    };
    return function simulateEvent(element, eventName) {
        var options = extend(defaultOptions, arguments[2] || {});
        var oEvent, eventType = null;
        for (var name in eventMatchers) {
            if (eventMatchers.hasOwnProperty(name)) {
                if (eventMatchers[name].test(eventName)) {
                    eventType = name;
                    break;
                }
            }
        }
        if (!eventType) {
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
        }
        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType === 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            } else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, options.button,
                    options.pointerX, options.pointerY, options.pointerX, options.pointerY, options.ctrlKey, options.altKey,
                    options.shiftKey, options.metaKey, options.button, /(?:over|out)$/.test(eventName) ? element : null);
            }
            element.dispatchEvent(oEvent);
        } else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    };

}());
