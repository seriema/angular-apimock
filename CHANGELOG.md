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

