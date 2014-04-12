# ApiMock for AngularJS: UI-first development [![Build Status](https://travis-ci.org/seriema/angular-apimock.png?branch=master)](https://travis-ci.org/seriema/angular-apimock) [![devDependency Status](https://david-dm.org/seriema/angular-apimock/dev-status.png)](https://david-dm.org/seriema/angular-apimock#info=devDependencies)

ApiMock is a minimal (0.4kb gzipped!) library for AngularJS that allows you to mock your HTTP API on _any_ platform. It routes your API calls to static JSON files on the server with a simple flag in the browser URL.


## Example
The left shows the page where the API is missing. The right shows the same page, but API calls being rerouted to static JSON files.

![Online](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.04.25.png) ![Offline](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.03.54.png)


## Try it out

Go to our [website demo](http://johansson.jp/angular-apimock/demo) to try it out. That's the simplest way to understand.


## Get started

Download it  [here](https://raw.githubusercontent.com/seriema/angular-apimock/master/dist/angular-apimock.min.js) or grab it through Bower.

````
bower install angular-apimock --save
````

Include `angular-apimock.min.js` in your HTML:
````
<script src="/bower_components/angular-apimock/dist/angular-apimock.min.js"></script>
````

Add `apiMock` as a dependency in your AngularJS app config (e.g. `app.js`):
````
angular.module('myApp', ['apiMock']) ...
````

Now use `$http` as usual. When you're looking at your webpage and want to use mock data, just add `?apimock=true` to the _browser_ page URL. This way you never need to change your JavaScript!

ApiMock appends the HTTP-verb before `.json` so a GET-request to `/api/customers/5` will be routed to `/mock_data/customers/5.get.json`. Now just fill your `/mock_data` directory with all the JSON files you want to grab.

## Config

Currently you can only change the api and mock-data paths.

Add this to your AngularJS config (e.g. `app.js`):
````
.config(function (httpInterceptorProvider) {
  httpInterceptorProvider.config({
    mockDataPath: '/my_mock_data_path',
    apiPath: '/my_api_path'
  });
});
````

## Samples

Check the [source code](http://johansson.jp/angular-apimock/demo) for our [website demo](http://johansson.jp/angular-apimock/demo). We're working on a better demo. :)

## FAQ

### Why not just use [Interfake](https://github.com/basicallydan/interfake)?
Interfake is a great complement to ApiMock. We assume you have a way to serve static JSON files. That can be because you're on a project with a server already set up and you can't do many changes to it but at least you can add static files. If you don't have that, then Interfake is a great way to set it up. Our idea is that the frontend JS doesn't change between calling the "real" API and the "fake" one.

### Why would I want to reroute my API calls?
Sometimes you don't have control over the API. It could be down for some reason, or it might not have been developed yet. ApiMock allows you as a frontend developer to continue working on the UI without changing any code. It's also helpful in figuring out what your API actually _should_ have as you can play around with your static JSON and then have it serve the role as documentation for backend developers.


## Contribute

ApiMock started as a concept at a large eCommerce project years ago. Having the backend team completely separate from the frontend team created some constraints that needed to be solved. Now it's been cleaned up and simplified for AngularJS. We'd love any feedback so feel free to raise [an issue]() or do a [pull request]() (make sure you run `grunt`).


♥ from [Seriema](http://johansson.jp) + [Redhorn](http://redhorn.se/)
