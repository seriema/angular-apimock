<a name="0.3.0"></a>
# [0.3.0](https://github.com/seriema/angular-apimock/compare/v0.2.1...v0.3.0) (2015-10-05)


### Bug Fixes

* **grunt:** revert failed merge ([7df9420](https://github.com/seriema/angular-apimock/commit/7df9420))

### Features

* **apiMock:** default mock setting ([f4e2258](https://github.com/seriema/angular-apimock/commit/f4e2258)), closes [#24](https://github.com/seriema/angular-apimock/issues/24)
* **apiPath:** add support for arrays and/or regexp when matching ([0a08a7d](https://github.com/seriema/angular-apimock/commit/0a08a7d)), closes [#16](https://github.com/seriema/angular-apimock/issues/16)
* **grunt:** enforce code style with JSCS ([583b65a](https://github.com/seriema/angular-apimock/commit/583b65a)), closes [#30](https://github.com/seriema/angular-apimock/issues/30)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/seriema/angular-apimock/compare/v0.2.0...v0.2.1) (2015-09-13)


### Bug Fixes

* **apimock:** correctly detect URL commands ([29874c9](https://github.com/seriema/angular-apimock/commit/29874c9)), closes [#37](https://github.com/seriema/angular-apimock/issues/37)
* **apimock:** correctly detect URL commands ([ccf22f2](https://github.com/seriema/angular-apimock/commit/ccf22f2)), closes [#37](https://github.com/seriema/angular-apimock/issues/37)
* **travis:** don't run SauceLabs on PR's ([b20c786](https://github.com/seriema/angular-apimock/commit/b20c786)), closes [#31](https://github.com/seriema/angular-apimock/issues/31)
* **travis:** don't run SauceLabs tests on PR's ([0e07eb3](https://github.com/seriema/angular-apimock/commit/0e07eb3)), closes [#32](https://github.com/seriema/angular-apimock/issues/32) [#31](https://github.com/seriema/angular-apimock/issues/31)

### Features

* **npm:** Angular ApiMock now available on the npm registry! ([f7d5663](https://github.com/seriema/angular-apimock/commit/f7d5663))



<a name="0.2.0"></a>
# 0.2.0 (2015-08-09)


### Bug Fixes

* **demo:** simple demo was outdated ([96b0196](https://github.com/seriema/angular-apimock/commit/96b0196))
* **grunt:** grunt-conventional-changelog 2.0 changed name ([b21b909](https://github.com/seriema/angular-apimock/commit/b21b909))
* **tests:** switch back to Jasmine for IE8 support ([6338b69](https://github.com/seriema/angular-apimock/commit/6338b69))

### Features

* **apimock:** add network latency simulation ([2783f10](https://github.com/seriema/angular-apimock/commit/2783f10)), closes [#20](https://github.com/seriema/angular-apimock/issues/20)
* **delay:** add network latency simulation ([8b996d3](https://github.com/seriema/angular-apimock/commit/8b996d3)), closes [#20](https://github.com/seriema/angular-apimock/issues/20)
* **queryParams:**  add query param functionality ([1e779c3](https://github.com/seriema/angular-apimock/commit/1e779c3)), closes [#23](https://github.com/seriema/angular-apimock/issues/23)
* **queryParams:** ignore nested objects and arrays on $http config.param ([0e3138a](https://github.com/seriema/angular-apimock/commit/0e3138a))
* **queryParams:** lowercase query params ([2aeb262](https://github.com/seriema/angular-apimock/commit/2aeb262))
* **queryParams:** support nested objects and arrays in $http config ([4147b33](https://github.com/seriema/angular-apimock/commit/4147b33))
* **readme:** add coverage status badge ([61dc226](https://github.com/seriema/angular-apimock/commit/61dc226))
* **travis:** add Sauce Labs testing to CI ([3375513](https://github.com/seriema/angular-apimock/commit/3375513))



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

