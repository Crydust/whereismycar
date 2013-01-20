/*global module:false */
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-reload');
    grunt.loadNpmTasks('grunt-jssemicoloned');

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
            options: {
                // Enforcing Options
                bitwise: true,
                //camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                quotmark: 'single',
                undef: true,
                //unused: true,
                strict: true,
                trailing: true,
                maxparams: 7,
                maxdepth: 2,
                maxstatements: 50,
                maxcomplexity: 4,
                // Relaxing Options
                //sub: true,
                //boss: true,
                //eqnull: true,
                // Environments
                browser: true,
                // Legacy
                nomen: true,
                //onevar: true,
                white: true
            },
            globals: {}
        },
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'src/js/main.js',
                    appDir: 'src',
                    baseUrl: 'js/vendor',
                    dir: 'publish',
                    name: '../main',
                    pragmas: {
                        prod: true
                    },
                    optimize: 'uglify2',
                    optimizeCss: 'standard',
                    uglify: {
                        max_line_length: 500
                    }
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
    

    // Default task.
    grunt.registerTask('test', 'server qunit');
    grunt.registerTask('default', 'jsvalidate:src lint:src test jssemicoloned');
    grunt.registerTask('publish', 'default requirejs hashres:publish jsvalidate:publish');
    grunt.registerTask('dev', 'server reload watch');

};
