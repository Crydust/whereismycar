//Main file for loading RequireJS necessary bits

require.config({
    baseUrl: '../src/js',
    packages: [
        'app',
        {
            name: 'apptest',
            location: '../../test/js/apptest'
        }
    ],
    paths: {
        'domready': 'vendor/domReady',
        'json': 'vendor/json3'
    }
});

require(['apptest'], function(){
    QUnit.start();
});