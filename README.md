# ApiMock for AngularJS: UI-first development [![Build Status](https://travis-ci.org/seriema/angular-apimock.png?branch=master)](https://travis-ci.org/seriema/angular-apimock) [![devDependency Status](https://david-dm.org/seriema/angular-apimock/dev-status.png)](https://david-dm.org/seriema/angular-apimock#info=devDependencies)

ApiMock is a minimal (0.3kb gzipped!) library for AngularJS that allows you to mock your HTTP API on _any_ platform, without know anything about servers. It routes your API calls to static JSON files with a simple flag in the browser URL.


## Example
The left shows the page where the API is missing. The right shows the same page, but API calls being rerouted to static JSON files.

![Online](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.04.25.png) ![Offline](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.03.54.png)


## Try it out

Go to our [website demo](http://johansson.jp/angular-apimock/#/demo-simple) to try it out. That's the simplest way to understand.


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


## Options

ApiMock follows a simple concept: reroute HTTP requests, from `apiPath` to `mockDataPath`. So you can change the paths but any deeper configuration is probably easier to write your own `httpInterceptor` (check the FAQ).

Configure is done through `apiMockProvider.config()`. Add this to your AngularJS config file (e.g. `app.js`):
````
.config(function (apiMockProvider) {
  apiMockProvider.config({
    mockDataPath: '/my_mock_data_path',
    apiPath: '/my_api_path',
  });
});
````

### mockDataPath

Type: `string`
Default: `'/mock_data'`

Set the path to be rerouted to.

### apiPath

Type: `string`
Default: `'/api'`

Set the path to be rerouted from.


## Samples

Check the [source code](https://github.com/seriema/angular-apimock/blob/gh-pages-dev/app/scripts/controllers/demo-simple.js) for our [website demo](http://johansson.jp/angular-apimock/#/demo-simple). We're working on more demos. :)


## FAQ

### Why not just use [Interfake](https://github.com/basicallydan/interfake)?
Interfake is a great complement to ApiMock. We assume you have a way to serve static JSON files. That can be because you're on a project with a server already set up and you can't do many changes to it but at least you can add static files. If you don't have that, then Interfake is a great way to set it up. Our idea is that the frontend JS doesn't change between calling the "real" API and the "fake" one.

### Why would I want to reroute my API calls?
Sometimes you don't have control over the API. It could be down for some reason, or it might not have been developed yet. ApiMock allows you as a frontend developer to continue working on the UI without changing any code. It's also helpful in figuring out what your API actually _should_ have as you can play around with your static JSON and then have it serve the role as documentation for backend developers.

### Isn't this the same as `$httpBackend`?
No, but it works in a similar fashion: it routes HTTP calls. Our initial implementation of apiMock used `$httpBackend` but then it would route _all_ AJAX requests and we only wanted to route API calls. A difference that's noticed when Angular tries to get HTML templates for directives, or if you try to load an image through AJAX. `$httpBackend` is for unit testing, `apiMock` is for the actual webpage.

### Is there a complete "offline" mode?
Like disabling all network traffic yet things work? No, but it's a good idea. It would be perfect for presentation demo's when the WiFi is unreliable. If you have an idea of how to implement this, let us know!

### Can I mock when [...] or instead of URL replacing can I [...]?
Actually the basic idea here is to intercept http calls then do whatever we want. This project, `angular-apimock`, aims to do things a certain way. Although everything is configurable and can be overriden in `.config()` you might want to create your own module. If so, here's the basics:
````
angular.module('myModule', [])

.config(function ($httpProvider) {
/* This is where the magic happens. Configure $httpProvider to use our
   httpInterceptor on all calls. It's what allows us to do automatic routing. */
  $httpProvider.interceptors.push('yourHttpInterceptor');
})

.service('yourHttpInterceptor', function($q) {
/* The main service. Is jacked in as a interceptor on $http so it gets called
   on every http call. This allows us to do our magic. */
  this.request = function (req) {
    if (req) {
      // Do whatever you want to the request here.
    }

    return req || $q.when(req);
  };
});
````

## Wishlist

* Demo based on Magic The Gathering cards (reference to a //build presentation)
* Demo for `isMocked`
* Demo with [Interfake](https://github.com/basicallydan/interfake)
* Handle queries (?search=banana)
* Handle body data in POST requests
* Generate sample JSON from JSON Schema (json-schema.org) and JSON LD (json-ld.org) (maybe a separate project?)
* Simulate complete offline, e.g. fail all API calls to test for 404 etc. `apimock=auto`?
* Automatic fallback to apiMock if the real API doesn't answer (or gives an error)
* Test `apimock=true` in more scenarios
* Remember mock-mode after page navigation
* Plunkr demos


## Contribute

ApiMock started as a concept at a large eCommerce project years ago. Having the backend team completely separate from the frontend team created some constraints that needed to be solved. Now it's been cleaned up and simplified for AngularJS. We'd love any feedback so feel free to raise [an issue](https://github.com/seriema/angular-apimock/issues) or do a [pull request](https://github.com/seriema/angular-apimock/pulls) (make sure you run `grunt`). If you want to implement something from the Wishlist, that would be awesome too!


♥ from [Seriema](http://johansson.jp) + [Redhorn](http://redhorn.se/)
