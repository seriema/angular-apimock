# ApiMock for AngularJS: UI-first development [![Build Status](https://travis-ci.org/seriema/angular-apimock.png?branch=master)](https://travis-ci.org/seriema/angular-apimock) [![Coverage Status](https://coveralls.io/repos/seriema/angular-apimock/badge.svg?branch=master&service=github)](https://coveralls.io/github/seriema/angular-apimock?branch=master) [![devDependency Status](https://david-dm.org/seriema/angular-apimock/dev-status.png)](https://david-dm.org/seriema/angular-apimock#info=devDependencies)

[![Join the chat at https://gitter.im/seriema/angular-apimock](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/seriema/angular-apimock?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

ApiMock is a minimal (1.5kb gzipped) library for AngularJS that allows you to mock your RESTful API by routing your API calls to static JSON files.


## Example
The left shows the page where the API is missing. The right shows the same page, but API calls being rerouted to static JSON files.

![Online](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.04.25.png) ![Offline](https://dl.dropboxusercontent.com/u/5566693/Screenshot%202014-02-23%2015.03.54.png)


## Try it out

Go to our [website demo](http://johansson.jp/angular-apimock/#/demo-simple) to try it out. That's the simplest way to understand.


## Get started

Download it  [here](https://raw.githubusercontent.com/seriema/angular-apimock/master/dist/angular-apimock.min.js). Or grab it through [NuGet](https://www.nuget.org/packages/Angular-ApiMock/), [Bower](http://bower.io/search/?q=angular-apimock), or [npm](https://www.npmjs.com/package/angular-apimock):

* [NuGet](https://www.nuget.org/packages/Angular-ApiMock/): `PM> Install-Package Angular-ApiMock`
* [Bower](http://bower.io/search/?q=angular-apimock): `$ bower install angular-apimock --save`
* [npm](https://www.npmjs.com/package/angular-apimock): `$ npm install angular-apimock --save`


Include `angular-apimock.min.js` in your HTML:
````
<script src="/bower_components/angular-apimock/dist/angular-apimock.min.js"></script>
````

Add `apiMock` as a dependency in your AngularJS app config (e.g. `app.js`):
````
angular.module('myApp', ['apiMock']) ...
````

Now use `$http` as usual. When you're looking at your webpage and want to use mock data, just add `?apimock=true` to the _browser_ page URL. This way you never need to change your JavaScript!

You can also do individual overrides right in the `config` object to `$http`. E.g. `$http( { url: '/...', method: GET, apiMock: true } )`.

If you want to design/test your error-handling then you can give a HTTP status code instead of `true`. So `?apimock=401` will fail all requests with status code `401` (unauthorized). This is probably more useful on individual `$http` requests.

You can also set it to automatically reroute API calls that fail. Just set the parameter to `auto` (`apimock=auto` in browser or $http call).

ApiMock appends the HTTP-verb before `.json` so a GET-request to `/api/customers/5` will be routed to `/mock_data/customers/5.get.json`. Now just fill your `/mock_data` directory with all the JSON files you want to grab.


## Options

### Usage

ApiMock supports several operation modes. They're set globally and/or locally, where globally means on the browser URL and locally means in the $http request. There's only one parameter, `apiMock` (case-insensitive).

#### apiMock

Type: `boolean/string/number`

Default: `undefined`

Values:

`true`: reroutes all requests

`false`: turns off rerouting

`auto`: will try the original request, if it fails then it tries to recover with a reroute

`404`, `500`, etc: will reject all requests with the given HTTP status code

##### Global flag

In the browser URL, just append `?apiMock=command` where `command` is described above (`true`, `auto`, etc).

##### Local flag

In the JavaScript, where you do the `$http` request, the request object needs an attribute `apiMock` with the value set to the command described above (`true`, `auto`, etc).

E.g.
````
$http({ method: 'GET', url: '...', apiMock: true });
````

### Config

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

#### mockDataPath

Type: `string`

Default: `'/mock_data'`

Set the path to be rerouted to.

#### apiPath

Type: `string` | `RegExp` | `[<string|RegExp>]`

Default: `'/api'`

Set the path to be rerouted from, for strings, will match request path from the left part, if it is a regular expresion it will evaluate expression.
It can handle arrays and both mixed.

#### disable

Type: `boolean`

Default: `false`

Disable apiMock completely. Used for production.

#### stripQueries

Type: `boolean`

Default: `true`

Remove query strings from url.  If false then "?" is replaced with "\" in expected filepath.

#### delay

Type: `number`

Default: `0`

Simulate network latency (in milliseconds).


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
Actually the basic idea here is to intercept http calls then do something that helps at design-time of the website. This project, `angular-apimock`, aims to do that through rerouting API calls to static JSON files. We've experimented with making that flexible so you could configure it to do whatever you want, but that requires so much from this project and the core functionality (http interceptors) is so simple it's probably easier to create your own. If so, here's the basics:
````
angular.module('myModule', [])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('yourHttpInterceptor');
})

.service('yourHttpInterceptor', function($q) {
  this.request = function (req) {
    if (req) {
      // Do whatever you want to the request here.
    }

    return req || $q.when(req);
  };
});
````

[This blog post](http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/) is pretty good at diving deeper into this.

## Wishlist

* Demo based on Magic The Gathering cards (reference to a //build presentation)
* Demo for checking mock-flag
* Demo with [Interfake](https://github.com/basicallydan/interfake)
* Handle body data in POST requests?
* HTTP response overrides (200?) shouldn't always go to $http.error()
* Test `apimock=true` in more scenarios
* Remember mock-mode after page navigation
* Plunkr demos
* Visual queue that mock is happening. Maybe also $log?
* Work with $resource (maybe it does already?)


## Contribute

ApiMock started as a concept on a large eCommerce project years ago. We'd love to get feedback or help to improve things. If you want to contribute, take a look at [CONTRIBUTING](CONTRIBUTING.md).


♥ from [Seriema](http://johansson.jp) + [Redhorn](http://redhorn.se/)
