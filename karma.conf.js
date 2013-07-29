// Karma configuration
// Generated on Tue Jul 30 2013 00:53:47 GMT+0200 (Romance Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['qunit', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'test/qunit/qunit-close-enough.js',
      'test/karma.js',
      {pattern: 'src/js/**/*.js', included: false},
      {pattern: 'test/js/**/*test.js', included: false}
    ],


    // list of files to exclude
    exclude: [
      'src/js/main.js',
      'src/js/vendor/almond.js',
      'src/js/vendor/require.js',
      'src/js/vendor/domReady.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit', 'coverage'],


    // web server port
    port: 9877,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,
    
    
    junitReporter: {
        outputFile: 'karma/test-results.xml'
    },

    preprocessors: {
        'src/js/**/*.js': 'coverage',
        'test/js/**/*.js': 'coverage'
    },
    coverageReporter: {
        type: 'cobertura',
        dir: 'karma/coverage/',
        file: 'coverage.xml'
    }
  });
};
