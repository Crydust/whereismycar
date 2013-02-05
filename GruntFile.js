module.exports = function(grunt) {

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
                    urls: ['http://localhost:8888/test/index.html?noglobals=true']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['grunt.js', 'src/js/*.js', 'src/js/app/**/*.js']
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
            files: [
                'GruntFile.js',
                'src/**/*.html', 'src/**/*.htm', 'src/**/*.js', 'src/**/*.css',
                'test/**/*.html', 'test/**/*.htm', 'test/**/*.js', 'test/**/*.css'
            ],
            tasks: ['jshint', 'reload']
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-reload');
    grunt.loadNpmTasks('grunt-qunit-cov');

    grunt.registerTask('simpleHashres', function () {
        var renameFile = function (dir, from, to) {
            var crypto = require('crypto');
            var hash = crypto.createHash('md5');
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
        replacement = replacement.replace('="js/main.js"', '="' + jsFileName + '"');
        var cssFileName = renameFile('publish/css', 'style.css', '${hash}.style.cache.css');
        replacement = replacement.replace('="css/style.css"', '="' + cssFileName + '"');
        grunt.file.write('publish/index.html', replacement);
    });
    grunt.registerTask('replaceDataMainBySrc', function () {
        var original = grunt.file.read('publish/index.html');
        var replacement = original.replace(
            /<script data-main="([^"]+)" src="[^"]+"><\/script>/,
            '<script src="$1"></script>');
        grunt.file.write('publish/index.html', replacement);
    });
    
    grunt.registerTask('test', ['connect:server', 'qunit:all', 'qunit-cov']);
    grunt.registerTask('default', ['jshint', 'test']);
    grunt.registerTask('publish', ['default', 'requirejs:compile', 'simpleHashres', 'replaceDataMainBySrc']);
    grunt.registerTask('publishAlmond', ['default', 'requirejs:compile', 'requirejs:compileAlmond', 'simpleHashres', 'replaceDataMainBySrc']);
    grunt.registerTask('dev', ['connect:server', 'reload', 'watch']);
    
};
