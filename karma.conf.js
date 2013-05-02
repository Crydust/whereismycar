// @see http://karma-runner.github.io/0.8/config/configuration-file.html
// @see http://karma-runner.github.io/0.8/plus/RequireJS.html

// list of files / patterns to load in the browser
files = [
  QUNIT,
  QUNIT_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,
  {pattern: 'src/js/**/*.js', included: false},
  {pattern: 'test/js/**/*test.js', included: false},
  'test/qunit/qunit-close-enough.js',
  'test/karma.js'
];

// list of files to exclude
exclude = [
    'src/js/main.js',
    'src/js/vendor/almond.js',
    'src/js/vendor/require.js',
    'src/js/vendor/domReady.js'
];

preprocessors = {
    'src/js/app/**/*.js': 'coverage'
};

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['dots', 'junit', 'coverage'];

junitReporter = {
    outputFile: 'karma/test-results.xml'
};

coverageReporter = {
  type: 'cobertura',
  dir: 'karma/coverage/',
  file: 'coverage.xml'
};

browsers = ['PhantomJS'];
