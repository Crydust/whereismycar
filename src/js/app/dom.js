define(function () {
    'use strict';

    function byId(id, doc) {
        if (typeof doc === 'undefined') {
            doc = document;
        }
        return doc.getElementById(id);
    }

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
        }
    }

    return {
        byId: byId,
        on: on
    };
});