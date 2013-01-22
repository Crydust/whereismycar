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

require(['app/main', 'domReady!'], function (app) {
    'use strict';
    app();
});