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
            compileTs: {
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
            compileAlmondTs: {
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
            devTs: {
                files: [
                    'Gruntfile.js',
                    'src/**/*.html', 'src/**/*.css',
                    'src/js/**/*.ts',
                    'test/**/*.html', 'test/**/*.js', 'test/**/*.css'
                ],
                tasks: ['typescript', 'reload']
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
            options: {
                module: 'amd', //or commonjs
                target: 'es3', //or es5
                base_path: 'src/js',
                sourcemap: false,
                declaration: false,
                comments: true
            },
            devTs: {
                options: {
                    sourcemap: true
                },
                src: ['src/js/**/*.ts'],
                dest: 'src/js'
            },
            publishTs: {
                src: ['src/js/**/*.ts'],
                dest: 'src/js'
            }
        },
        copy: {
            devTs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.*', '!**/*.ts', '!**/*.js'],
                        dest: 'publish/',
                        filter: 'isFile'
                    }
                ]
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
    grunt.loadNpmTasks('grunt-contrib-copy');

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
    grunt.registerTask('cleanTs', function () {
        grunt.file['delete']('publish/');
        grunt.file.expand('src/js/**/*.js.map').forEach(function (element) {
            grunt.file['delete'](element);
        });
        grunt.file.expand('src/js/**/*.js').forEach(function (element) {
            if (grunt.file.exists(element.replace(/\.js$/, '.ts'))) {
                grunt.file['delete'](element);
            }
        });
    });
    
    grunt.registerTask('test', ['default', 'connect:server', 'qunit:all']);
    grunt.registerTask('testCov', ['test', 'qunit-cov']);
    grunt.registerTask('default', ['cleanTs', 'jssemicoloned', 'jshint', 'typescript:devTs']);
    grunt.registerTask('dev', ['default', 'connect:server', 'reload', 'watch:devTs']);
    grunt.registerTask('publish', ['cleanTs', 'typescript:publishTs', 'test', 'requirejs:compileTs']);
    grunt.registerTask('publishAlmond', ['test', 'cleanTs', 'typescript:publishTs', 'copy:devTs', 'requirejs:compileAlmondTs', 'simpleHashres', 'replaceDataMainBySrc']);
    
};
