define([], function () {
    'use strict';
    
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
    
    return {
        'byId': byId,
        'on': on
    };
    
});