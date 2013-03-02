/*global module:false */
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
        watch: {
            dev: {
                files: [
                    'Gruntfile.js',
                    'src/**/*.html', 'src/**/*.js', 'src/**/*.css',
                    'test/**/*.html', 'test/**/*.js', 'test/**/*.css'
                ],
                tasks: ['jshint', 'reload']
            },
            devts: {
                files: [
                    'Gruntfile.js',
                    'src/**/*.html', 'src/**/*.css',
                    'src/**/*.ts',
                    'test/**/*.html', 'test/**/*.js', 'test/**/*.css'
                ],
                tasks: ['typescript']
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
                'src/js/*.js', 'src/js/app/*.js',
                'test/js/**/*.js'
            ]
        },
        typescript: {
            base: {
                src: ['src/ts/**/*.ts'],
                dest: 'src/js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es5
                    base_path: 'src/ts',
                    sourcemap: true,
                    declaration: true
                }
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
    grunt.loadNpmTasks('grunt-typescript');

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
    
    grunt.registerTask('test', ['connect:server', 'qunit:all']);
    grunt.registerTask('testCov', ['test', 'qunit-cov']);
    grunt.registerTask('default', ['jssemicoloned', 'jshint', 'test']);
    grunt.registerTask('publish', ['default', 'requirejs:compile', 'simpleHashres', 'replaceDataMainBySrc']);
    grunt.registerTask('publishAlmond', ['default', 'requirejs:compile', 'requirejs:compileAlmond', 'simpleHashres', 'replaceDataMainBySrc']);
    grunt.registerTask('dev', ['connect:server', 'reload', 'watch:dev']);
    grunt.registerTask('devts', ['typescript', 'connect:server', 'watch:devts']);
    
};
