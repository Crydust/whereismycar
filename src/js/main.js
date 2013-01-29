/*jslint */
/*global require:false */

//>>excludeStart("prod", pragmas.prod);
require.config({
    baseUrl: 'js/vendor',
    paths: {
        'app': '../app'
    }
});
//>>excludeEnd("prod");

// requestAnimationFrame polyfill
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function () {
    'use strict';
    var win = window;
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !win.requestAnimationFrame; x++) {
        win.requestAnimationFrame = win[vendors[x] + 'RequestAnimationFrame'];
        win.cancelRequestAnimationFrame = win[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!win.requestAnimationFrame) {
        win.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = win.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!win.cancelAnimationFrame) {
        win.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

require(['app/main'], function () {
    'use strict';
});