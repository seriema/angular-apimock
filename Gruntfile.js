// Generated on 2014-02-20 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      version: require('./bower.json').version,
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'test'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      test: {
        options: {
          port: 9001,
          base: [
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= yeoman.app %>'
          ]
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        src: ['<%= yeoman.dist %>/angular-apimock.js'],
        dest: '<%= yeoman.dist %>/angular-apimock.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        report: 'gzip'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/angular-apimock.min.js': [
            '<%= yeoman.dist %>/angular-apimock.js'
          ]
        }
      }
    },

    concat: {
      options: {
        banner: '/*! Angular API Mock v<%= yeoman.version %>\n * Licensed with MIT\n * Made with ♥ from Seriema + Redhorn */\n',
      },
      dist: {
        src: '<%= yeoman.app %>/scripts/**/*.js',
        dest: '<%= yeoman.dist %>/angular-apimock.js'
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('serve', [
    'connect',
    'watch:js'
  ]);

  grunt.registerTask('test', [
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concat',
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
