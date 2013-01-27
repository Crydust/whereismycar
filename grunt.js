/*global module:false */
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-reload');
    grunt.loadNpmTasks('grunt-jssemicoloned');

    // readOptionalJSON
    // by Ben Alman
    // https://gist.github.com/2876125
    function readOptionalJSON(filepath) {
        var data = {};
        try {
            data = grunt.file.readJSON(filepath);
            grunt.verbose.write('Reading ' + filepath + '...').ok();
        } catch (e) {}
        return data;
    }

    // Project configuration.
    grunt.initConfig({
        jssemicoloned: {
            files: ['src/**/*.js', 'test/**/*.js']
        },
        lint: {
            src: ['grunt.js', 'src/js/*.js', 'src/js/app/**/*.js'],
            test: ['test/js/**/*.js'],
            vendor: ['src/js/vendor/**/*.js', 'test/qunit/**/*.js']
        },
        jsvalidate: {
            src: ['*.js', 'src/**/*.js', 'test/**/*.js'],
            publish: ['publish/**/*.js']
        },
        server: {
            port: 8888
        },
        qunit: {
            files: ['http://localhost:8888/test/index.html?noglobals=true']
        },
        reload: {
            port: 6001,
            proxy: {
                host: 'localhost',
                port: 8888
            }
        },
        watch: {
            files: [
                'grunt.js',
                'src/**/*.html', 'src/**/*.htm', 'src/**/*.js',
                'test/**/*.html', 'test/**/*.htm', 'test/**/*.js'
            ],
            tasks: 'jsvalidate:src lint:src reload'
        },
        jshint: {
            options: readOptionalJSON('.jshintrc'),
            globals: {}
        },
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'src/js/main.js',
                    appDir: 'src',
                    dir: 'publish',
                    name: '../main',
                    pragmas: {
                        prod: true
                    },
                    optimize: 'uglify2',
                    optimizeCss: 'standard'
                }
            },
            compileAlmond: {
                options: {
                    mainConfigFile: 'src/js/main.js',
                    baseUrl: 'src/js/vendor',
                    out: 'publish/js/main.js',
                    name: 'almond',
                    include: '../main',
                    pragmas: {
                        prod: true
                    },
                    optimize: 'uglify2'
                }
            }
        },
        hashres: {
            publish: {
                files: [
                    'publish/css/style.css',
                    'publish/js/main.js',
                    'publish/js/vendor/require.js'
                ],
                out: 'publish/index.html'
            }
        }
    });

    grunt.registerTask('replaceDataMainBySrc', function () {
        var original = grunt.file.read('publish/index.html');
        var replacement = original.replace(
            /<script data-main="([^"]+)" src="[^"]+"><\/script>/,
            '<script src="$1"></script>');
        grunt.file.write('publish/index.html', replacement);
    });

    // Default task.
    grunt.registerTask('test', 'server qunit');
    //removed jssemicoloned
    grunt.registerTask('default', 'jsvalidate:src lint:src test');
    grunt.registerTask('publish', 'default requirejs:compile hashres:publish jsvalidate:publish');
    grunt.registerTask('publishAlmond', 'default requirejs:compile requirejs:compileAlmond hashres:publish replaceDataMainBySrc jsvalidate:publish');
    grunt.registerTask('dev', 'server reload watch');

};
