/*jslint */
/*global require:false */

//>>excludeStart("prod", pragmas.prod);
require.config({
    packages: [
        'app'
    ],
    paths: {
        'domready': 'vendor/domReady',
        'json': 'vendor/json3',
        'signals': 'vendor/signals'
    }
});
//>>excludeEnd("prod");

require(['app', 'domready!'], function (app, doc) {
    'use strict';
    app();
});