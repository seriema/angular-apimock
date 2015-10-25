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
			version: require('./package.json').version,
			app: 'app',
			dist: 'dist',
			test: 'test'
		},

		// Test run with `grunt bump --dry-run`
		bump: {
			options: {
				files: [ 'package.json', 'bower.json' ],
				updateConfigs: [ 'yeoman' ],
				commit: true,
				commitMessage: 'chore(release): release %VERSION%. See CHANGELOG.md',
				commitFiles: [ '-a' ], // '-a' for all files
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},

		conventionalChangelog: {
			options: {
				changelogOpts: {
					preset: 'angular'
				}
			},
			release: {
				src: 'CHANGELOG.md'
			}
		},

		conventionalGithubReleaser: {
			release: {
				options: {
					auth: {
						type: 'oauth',
						token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
					},
					changelogOpts: {
						preset: 'angular'
					}
				}
			}
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: [ '<%= yeoman.app %>/scripts/{,*/}*.js' ],
				tasks: [ 'newer:jshint:all', 'karma:default' ],
				options: {
					livereload: true
				}
			},
			jsTest: {
				files: [ 'test/spec/{,*/}*.js' ],
				tasks: [ 'newer:jshint:test', 'karma:default' ]
			},
			gruntfile: {
				files: [ 'Gruntfile.js' ]
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
				port: 0,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			test: {
				options: {
					port: 0,
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
				src: [ 'test/spec/{,*/}*.js' ]
			}
		},

		// Check code style guidelines
		jscs: {
			src: [
				'<%= yeoman.app %>/scripts/**/*.js',
				'<%= yeoman.test %>/spec/**/*.js',
				'*.js'
			],
			options: {
					config: '.jscsrc',
					verbose: true
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
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			dist: {
				src: [ '<%= yeoman.dist %>/angular-apimock.js' ],
				dest: '<%= yeoman.dist %>/angular-apimock.js'
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
				banner: '/*! Angular API Mock v<%= yeoman.version %>\n * Licensed with MIT\n * Made with ♥ from Seriema + Redhorn */\n'
			},
			dist: {
				src: '<%= yeoman.app %>/scripts/**/*.js',
				dest: '<%= yeoman.dist %>/angular-apimock.js'
			}
		},

		nugetpack: {
			dist: {
				src: 'package.nuspec',
				dest: 'nuget/',
				options: {
					version: '<%= yeoman.version %>'
				}
			}
		},

		nugetpush: {
			dist: {
				src: 'nuget/Angular-ApiMock.<%= yeoman.version %>.nupkg'
			}
		},

		gitadd: {
			task: {
				files: {
					src: [ 'nuget/Angular-ApiMock.<%= yeoman.version %>.nupkg' ]
				}
			}
		},

		// Test settings
		karma: {
			options: {
				configFile: 'karma.conf.js',
				singleRun: true
			},
			default: {
				// Default
			},
			sauce: {
				browsers: [ 'SL_Chrome', 'SL_Firefox', 'SL_Safari', 'SL_iOS', 'SL_IE_8', 'SL_IE_9', 'SL_IE_10', 'SL_IE_11' ],
				reporters: [ 'progress', 'saucelabs' ],
				files: [{
					src: [
						// It has to be Angular 1.2 because it's the lowest one, and the only one that runs on IE8.
						'test/ref/angular-v1.2.js',
						'test/ref/angular-mocks-v1.2.js',
						'<%= watch.js.files %>',
						'<%= watch.jsTest.files %>'
					]}
				]
			},
			coverage: {
				browsers: [ 'PhantomJS' ],
				reporters: [ 'dots', 'coverage' ],
				coverageReporter: {
					reporters: [
						{ type: 'lcov', subdir: 'PhantomJS' },
						{ type: 'text' }
					]
				}
			},
			dist: {
				files: [{
					src: [
						'app/bower_components/angular/angular.js',
						'app/bower_components/angular-mocks/angular-mocks.js',
						'<%= yeoman.dist %>/*.min.js',
						'<%= watch.jsTest.files %>'
					]}
				]
			},
			angular12: {
				files: [{
					src: [
						'test/ref/angular-v1.2.js',
						'test/ref/angular-mocks-v1.2.js',
						'<%= watch.js.files %>',
						'<%= watch.jsTest.files %>'
					]}
				]
			},
			angular13: {
				files: [{
					src: [
						'test/ref/angular-v1.3.js',
						'test/ref/angular-mocks-v1.3.js',
						'<%= watch.js.files %>',
						'<%= watch.jsTest.files %>'
					]}
				]
			},
			angular14: {
				files: [{
					src: [
						'test/ref/angular-v1.4.js',
						'test/ref/angular-mocks-v1.4.js',
						'<%= watch.js.files %>',
						'<%= watch.jsTest.files %>'
					]}
				]
			}
		},

		// To run locally you need to set `COVERALLS_REPO_TOKEN` as an environment variable.
		// It's currently being run from Travis-CI (see .travis.yml)
		coveralls: {
			options: {
				force: true
			},
			src: 'coverage/**/*.info'
		}
	});

	grunt.registerTask('serve', [
		'connect',
		'watch:js'
	]);

	grunt.registerTask('test', [
		'jshint',
		'jscs',
		'connect:test',
		'karma:coverage',
		'karma:angular12',
		'karma:angular13',
		'karma:angular14'
	]);

	grunt.registerTask('build', [
		'clean',
		'concat',
		'ngAnnotate',
		'uglify',
		'karma:dist'
	]);

	grunt.registerTask('_publish', [
		'build',
		'nugetpack',
		'gitadd',
		'conventionalChangelog',
		'bump-commit',
		'conventionalGithubReleaser',
		'nugetpush',
		'npm-publish'
	]);

	grunt.registerTask('publish', [ 'publish:patch' ]);
	grunt.registerTask('publish:patch', [ 'validate-package', 'test', 'karma:sauce', 'bump-only:patch', '_publish' ]);
	grunt.registerTask('publish:minor', [ 'validate-package', 'test', 'karma:sauce', 'bump-only:minor', '_publish' ]);
	grunt.registerTask('publish:major', [ 'validate-package', 'test', 'karma:sauce', 'bump-only:major', '_publish' ]);

	grunt.registerTask('default', [
		'test'
	]);
};
