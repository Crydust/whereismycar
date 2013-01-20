/*jslint */
/*global require:false */

//>>excludeStart("prod", pragmas.prod);
require.config({
    baseUrl: 'js/vendor',
    packages: [
        {
            'name': 'app',
            'location': '../app'
        }
    ],
    paths: {
        'geoPosition': 'javascript-mobile-desktop-geolocation/js/geoPosition'
    }
});
//>>excludeEnd("prod");

require(['app', 'domready!'], function (app) {
    'use strict';
    app();
});