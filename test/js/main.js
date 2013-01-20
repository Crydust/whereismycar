//Main file for loading RequireJS necessary bits

require.config({
    baseUrl: '../src/js/vendor',
    packages: [
        {
            name: 'app',
            location: '../app'
        },
        {
            name: 'apptest',
            location: '../../../test/js/apptest'
        }
    ]
});

require(['apptest'], function(){
    QUnit.start();
});