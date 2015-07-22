<a name="0.2.0"></a>
## 0.2.0 (2014-05-21)


#### Bug Fixes

* **apiMock:** lower Angular version requirement ([634390f1](http://github.com/seriema/angular-apimock/commit/634390f16726f36fa3ce98e7a04f1705432c8865), closes [#11](http://github.com/seriema/angular-apimock/issues/11))
* **bower:** bump version in Bower ([b9a3f667](http://github.com/seriema/angular-apimock/commit/b9a3f66707509edc86448c0c661fedbe3d1ff2ae))
* **nuget:** fix target path ([f9e588d9](http://github.com/seriema/angular-apimock/commit/f9e588d999918f705c5224d687988319a89d7283))


#### Features

* **distribution:** now available on NuGet ([32e686c4](http://github.com/seriema/angular-apimock/commit/32e686c48248ce04185f1be0ab0526842dac85ad), closes [#12](http://github.com/seriema/angular-apimock/issues/12))


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

