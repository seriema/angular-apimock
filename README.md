angular-apiMock [![Build Status](https://travis-ci.org/seriema/angular-offline.png?branch=master)](https://travis-ci.org/seriema/angular-offline)
===============

Mock your API requests during development to focus on the UI first. With `angular-offline` you just add `?offline=true` to the browser URL and your app will start hitting your JSON mocks instead of the real API.

`angular-offline` follows the same URL path as your api, but with two additions:
* it changes the starting folder from your api-path to your offline-path.
* it appends the HTTP-verb and `.json` to the path.

So a GET-request to `/api/people/pikachu` becomes `/offline_data/people/pikachu.get.json`.

_"Online"_ vs _"Offline"_

![Offline](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.04.25.png) ![Offline](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.03.54.png)

## Usage

Include `angular-apimock.js` into your project and add it as a dependency in your app.

````
angular.module('myApp', ['apiMock']);
````

The default paths are `/mock_data` for getting .json files and `/api` for using the real API. You can change this with `config()` during the `run()` operation of your module.

````
.run(function (httpInterceptor) {
    httpInterceptor.config({
        offlineDataPath: '/mock_data',
        apiPath: '/api'
    });
````

Then when running your app you just do `$http` requests as usual to your API. If you append `?apimock=true` to the URL in your browser when accessing the page, then offlineMode will kick in and you'll get your predefined json instead of calling the API.

````
angular.module('myApp')
	.controller('MainCtrl', function ($scope, $http) {
		$scope.name = 'unknown';

        $http.get('/api/people/pikachu').success(function(data) {
            $scope.name = data.name;
        });
    });
````

This means that in regular operation you'll call `/api/people/pikachu` as you'd expect. But if the API is down for some reason, or it's not even finished, and you want to work on the frontend, then just add `?apimock=true` to the URL _in the browser_ (the idea is that you _don't_ change you JS) and it will instead do a request to `/mock_data/people/pikachu.get.json`.
