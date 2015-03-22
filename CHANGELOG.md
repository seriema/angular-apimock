<a name="0.1.8"></a>
### 0.1.8 (2015-03-22)


#### Bug Fixes

* **apimock:** Adjust for PR19. Always use 'GET' requests. ([0ae1ba57](http://github.com/seriema/angular-apimock/commit/0ae1ba571359f80a30a04f05c6a18b620932668e))


#### Features

* **apimock:** update Angular dependencies in Bower to latest (below 2.x). ([8847c192](http://github.com/seriema/angular-apimock/commit/8847c192e50ed82576e6ae0e736c547ebdb1def8))


<a name="0.1.7"></a>
### 0.1.7 (2014-10-19)


#### Features

* **apimock:** add disable config (#15) ([9e7b14a1](http://github.com/seriema/angular-apimock/commit/9e7b14a1d893a321835aa2d453a4aab5b60c01e5))


<a name="0.1.6"></a>
### 0.1.6 (2014-05-29)


#### Bug Fixes

* **apimock:**
  * fix command 'auto' ([acfc2371](http://github.com/seriema/angular-apimock/commit/acfc2371079be8f428a02e31ece05e1d90bb5c38))
  * treat NaN as false for command ([a28544d4](http://github.com/seriema/angular-apimock/commit/a28544d43c5d11f65095b6950fba75bd07553578))
* **nuget:** fix nuget push task ([e77e6e7f](http://github.com/seriema/angular-apimock/commit/e77e6e7f96a8da6510390b3e70ca49b0ab4d4a6a))


#### Features

* **apimock:** add logging through $log ([9d93551f](http://github.com/seriema/angular-apimock/commit/9d93551f3801483a2cd479c972a89a033e88fcab))


<a name="0.1.5"></a>
### 0.1.5 (2014-05-19)


#### Bug Fixes

* **apimock:** fix logic in automatic fallbacks ([96c9f4d5](http://github.com/seriema/angular-apimock/commit/96c9f4d578c879807dbdcbb6f3652481d1db8675))


#### Features

* **apimock:** automatic fallbacks ([9245bc8a](http://github.com/seriema/angular-apimock/commit/9245bc8a7d477af87f468cb5b6b7a4397597b31f))


#### Breaking Changes

* Interface for apiMock service has changed.

You shouldn’t be using apiMock object anymore. There’s currently not a
good way to detect if mocking is enabled as that can change on
individual http-requests anyway.

We’re considering printing to $log to notify when mocking is occuring.
Suggestions are welcome.
 ([c96f9188](http://github.com/seriema/angular-apimock/commit/c96f91883ec0faef1df34e7f151a76acbed553a0))


<a name="0.1.4"></a>
### 0.1.4 (2014-05-11)

