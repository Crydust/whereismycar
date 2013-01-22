//Main file for loading RequireJS necessary bits

require.config({
    baseUrl: '../src/js/vendor',
    paths: {
        'app': '../app',
        'apptest': '../../../test/js/apptest'
    },
    urlArgs: "bust=" + (+new Date())
});

require(['apptest/suite'], function(){
    QUnit.start();
});