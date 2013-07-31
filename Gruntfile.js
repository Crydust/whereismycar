/*jshint camelcase: false */
/*global module:false */

var path = require('path');

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8888,
                    base: '.'
                }
            }
        },
        qunit: {
            all: {
                options: {
                    urls: ['http://localhost:8888/test/index.html']
                }
            }
        },
        jshint: {
            src: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: ['Gruntfile.js', 'src/js/*.js', 'src/js/app/**/*.js']
                }
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                files: {
                    src: ['test/js/**/*.js']
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    appDir: 'src',
                    dir: 'publish',
                    name: 'main',
                    pragmas: {
                        prod: true
                    },
                    optimize: 'uglify2',
                    optimizeCss: 'standard'
                }
            },
            compileAlmond: {
                options: {
                    baseUrl: 'src/js',
                    out: 'publish/js/main.js',
                    name: 'vendor/almond',
                    include: 'main',
                    pragmas: {
                        prod: true
                    },
                    optimize: 'uglify2'
                }
            }
        },
        watch: {
            dev: {
                files: [
                    'Gruntfile.js',
                    'src/**/*.html', 'src/**/*.js', 'src/**/*.css',
                    'test/**/*.html', 'test/**/*.js', 'test/**/*.css'
                ],
                tasks: ['jshint', 'reload']
            },
            lint: {
                files: [
                    'Gruntfile.js',
                    'src/**/*.html', 'src/**/*.js', 'src/**/*.css',
                    'test/**/*.html', 'test/**/*.js', 'test/**/*.css'
                ],
                tasks: ['lint']
            }
        },
        reload: {
            port: 6001,
            proxy: {
                host: 'localhost',
                port: 8888
            }
        },
        'qunit-cov': {
            test: {
                minimum: 0.01,
                srcDir: 'src',
                depDirs: ['test'],
                outDir: 'testResults',
                testFiles: ['test/index.html']
            }
        },
        jssemicoloned: {
            files: [
                'Gruntfile.js',
                'src/**/*.js', '!src/js/vendor/**/*.js',
                'test/**/*.js', '!test/qunit/**/*.js'
            ]
        },
        jsvalidate: {
            files: [
                'Gruntfile.js',
                'src/js/**/*.js',
                'test/js/**/*.js'
            ]
        },
        jsbeautifier: {
            options: {
                indent_size: 4,
                indent_char: ' ',
                indent_level: 0,
                indent_with_tabs: false,
                preserve_newlines: true,
                max_preserve_newlines: 10,
                jslint_happy: true,
                brace_style: 'collapse',
                keep_array_indentation: false,
                keep_function_indentation: false,
                space_before_conditional: true,
                break_chained_methods: false,
                eval_code: false,
                wrap_line_length: 120,
                unescape_strings: false
            },
            gruntfile: {
                options: {
                    keep_array_indentation: true
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
            src: {
                files: {
                    src: ['src/**/*.js', '!src/js/vendor/**/*.js']
                }
            },
            test: {
                files: {
                    src: ['test/**/*.js', '!test/qunit/**/*.js']
                }
            }
        },
        fixmyjs: {
            gruntfile: {
                files: {
                    src: ['Gruntfile.js']
                }
            },
            src: {
                files: {
                    src: ['src/**/*.js', '!src/js/vendor/**/*.js']
                }
            },
            test: {
                files: {
                    src: ['test/**/*.js', '!test/qunit/**/*.js']
                }
            }
        },
        plato: {
            options : {
                jshint : grunt.file.readJSON('.jshintrc')
            },
            src: {
                files: {
                    plato: ['src/**/*.js', '!src/js/vendor/**/*.js']
                }
            }
        },
        karma: {
            unit: {
                configFile: path.resolve('.', 'karma.conf.js'),
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-reload');
    grunt.loadNpmTasks('grunt-qunit-cov');
    grunt.loadNpmTasks('grunt-jssemicoloned');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-karma-0.9.1');

    grunt.registerMultiTask('fixmyjs', 'description', function () {

        var fixmyjs = require('fixmyjs');

        var objectOfOptions = grunt.file.readJSON('.jshintrc');
        
        grunt.file.expand(this.filesSrc).forEach(function (filepath) {
            grunt.log.write('Running fixmyjs  on ' + filepath + '  ');
            var stringOriginalCode = grunt.file.read(filepath);
            if (stringOriginalCode[0] === '#' && stringOriginalCode[1] === '!') {
                grunt.log.ok('Skipped');
            } else {
                var stringFixedCode = fixmyjs.fix(stringOfCode, objectOfOptions);
                if (stringOriginalCode !== stringFixedCode) {
                    grunt.file.write(filepath, stringFixedCode);
                    grunt.log.ok('Fixed');
                } else {
                grunt.log.ok();
                }
            }
        });
        
        return true;
    });

    grunt.registerTask('simpleHashres', function () {
        var renameFile = function (dir, from, to) {
            var crypto = require('crypto');
            var text = grunt.file.read(dir + '/' + from);
            var hash = crypto.createHash('md5');
            hash.update(text);
            var hashHex = hash.digest('hex').slice(0, 8);
            var newName = to.replace('${hash}', hashHex);
            grunt.file.copy(dir + '/' + from, dir + '/' + newName);
            return newName;
        };

        var replacement = grunt.file.read('publish/index.html');
        var jsFileName = renameFile('publish/js', 'main.js', '${hash}.main.cache.js');
        replacement = replacement.replace('="js/main.js"', '="js/' + jsFileName + '"');
        var cssFileName = renameFile('publish/css', 'style.css', '${hash}.style.cache.css');
        replacement = replacement.replace('="css/style.css"', '="css/' + cssFileName + '"');
        grunt.file.write('publish/index.html', replacement);
    });

    grunt.registerTask('replaceDataMainBySrc', function () {
        var original = grunt.file.read('publish/index.html');
        var replacement = original.replace(
            /<script data-main="([^"]+)" src="[^"]+"><\/script>/,
            '<script src="$1"></script>');
        grunt.file.write('publish/index.html', replacement);
    });

    grunt.registerTask('test', ['lint', 'connect:server', 'qunit:all']);
    grunt.registerTask('testCov', ['lint', 'test', 'qunit-cov']);
    grunt.registerTask('default', ['lint']);
    grunt.registerTask('lint', ['jsvalidate', 'jshint']);
    grunt.registerTask('beautify', ['jsvalidate', 'jssemicoloned', 'fixmyjs', 'jshint']);
    grunt.registerTask('dev', ['lint', 'connect:server', 'reload', 'watch:dev']);
    grunt.registerTask('publish', ['test', 'requirejs:compile']);
    grunt.registerTask('publishAlmond', ['test', 'requirejs:compileAlmond', 'simpleHashres', 'replaceDataMainBySrc']);

};
