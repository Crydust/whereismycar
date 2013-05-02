var tests = Object.keys(window.__karma__.files).filter(function (file) {
      return /\/test\/js\/apptest\/.+test\.js$/.test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src/js',
    paths: {
        'app': 'app',
        'apptest': '../../test/js/apptest'
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});