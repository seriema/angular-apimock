// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	var sourcePreprocessors = ['coverage'];
	function isDebug(argument) {
		return argument === '--debug';
	}
	if (process.argv.some(isDebug)) {
		sourcePreprocessors = [];
	}

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['mocha', 'chai'],

		// reporter style
		reporters: [ 'progress' ],

		preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			'app/scripts/**/*.js': sourcePreprocessors
		},

		// list of files / patterns to load in the browser
		files: [
			'app/bower_components/angular/angular.js',
			'app/bower_components/angular-mocks/angular-mocks.js',
			'app/scripts/**/*.js',
			'test/spec/**/*.js'
		],

		// list of files / patterns to exclude
		exclude: [],

		// web server port
		port: 9876, // default

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Firefox'],

		// For more browsers on Sauce Labs see:
		// https://saucelabs.com/docs/platforms/webdriver
		captureTimeout: 120000,
		customLaunchers: {
			'SL_Chrome': {
				base: 'SauceLabs',
				browserName: 'chrome'
			},
			'SL_Firefox': {
				base: 'SauceLabs',
				browserName: 'firefox'
			},
			'SL_Safari': {
				base: 'SauceLabs',
				browserName: 'safari'
			},
			'SL_IE_9': {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 2008',
				version: '9'
			},
			'SL_IE_10': {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 2012',
				version: '10'
			},
			'SL_IE_11': {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 8.1',
				version: '11'
			},
			'SL_iOS': {
				base: 'SauceLabs',
				browserName: 'iphone'
			}
		},

		// SauceLabs config for local development.
		sauceLabs: {
			testName: 'Angular ApiMock',
			startConnect: true,
			options: {
				'selenium-version': '2.41.0'
			}
		},

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});

	// Travis specific configs.
	if (process.env.TRAVIS) {
		var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

		config.sauceLabs.build = buildLabel;
		config.sauceLabs.startConnect = false;
		config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
		config.sauceLabs.recordScreenshots = true;

		if (process.env.BROWSER_PROVIDER === 'saucelabs' || !process.env.BROWSER_PROVIDER) {
			// Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
			// for another build to finish) and so the `captureTimeout` typically kills
			// an in-queue-pending request, which makes no sense.
			config.captureTimeout = 0;
		}
	}
};
