# Contributing

ApiMock started as a concept at a large eCommerce project years ago. We'd love to know how others use it and what we can do to improve it.

Below we've gathered some guidelines on how to report bugs, request features, or submit pull-requests.


## Bugs

Any bug reports are welcome. Check [issues](https://github.com/seriema/angular-apimock/issues/) if it is already logged or fixed before creating a new issue.

Focus on a [reduced test case](https://css-tricks.com/reduced-test-cases/) and do any or all of these:
- Create a [Plunker](http://plnkr.co) sample (use the `$http` config syntax for `apiMock`)
- Create a [unit test](test/spec/)
- Write reproduction steps and expected result compared to actual result


## Features

Feature requests are more than welcome. Check [issues](https://github.com/seriema/angular-apimock/issues/) to find or add an issue where we can discuss the feature before any code is written. Consider impacts on current users.

Do any or all of these:
- Demonstrate usage with real or pseudo code (think [dreamcode](http://nobackend.org/dreamcode.html))
- Create a [unit test](test/spec)
- Write a clear use case for when this feature would be useful for others
- Create a demo for the [website](http://johansson.jp/angular-apimock/#/)
- Write documentation for the [README](README.md)


## PRs (pull-requests)

Please follow these guidelines for PRs. Make sure you're familiar with [GitHub PRs](https://help.github.com/articles/using-pull-requests) and issues. PRs for [the wishlist in the README](README.md#wishlist) would be especially awesome!

Helpful steps:

1. One PR per logged bug or feature (read above about **Bugs** or **Features**)
2. Check for an existing issue or create a new one (see step 1)
3. Fork the project and create a new branch to do your changes in
4. Install dependencies with `npm install` and `bower install` (you'll need [Node](https://nodejs.org), [Grunt](http://gruntjs.com), and [Bower](http://bower.io) already installed)
5. Run `grunt` before every commit and see the **Commit guidelines** section below
6. Create a PR and reference the issue from step 2

Never run `grunt publish`! Just use `grunt` or `grunt test` to verify that your code is working.

Don't change the [CHANGELOG](CHANGELOG.md) file. It's auto-generated when publishing a new version of ApiMock.

### Code guidelines

Follow the conventions (indentation, newlines, etc) in [.editorconfig](.editorconfig). Most editors have a plugin for [EditorConfig](http://editorconfig.org) that helps you.

See [.jshintrc](.jshintrc) for the [JSHint](http://jshint.com) conventions (use semicolon, single quote marks, etc). Run `grunt jshint` to check that your code fulfills those settings. Otherwise just follow the conventions you see in the existing code.

### Commit guidelines

Run `grunt watch` to run unit-tests and JSHint continuously while developing. Always run `grunt test` before doing a commit. *Never commit if `grunt test` gives an error!*

Run `npm run debug` to debug in Chrome.


Don't commit unnecessary changes (like white-space differences). Github for [Windows](https://windows.github.com) / [Mac](https://mac.github.com) has a useful diff-tool that allows you to pick files and which rows to include in the commit.

#### Commit messages

We use a [conventional changelog tool](https://github.com/btford/grunt-conventional-changelog) to generate the [CHANGELOG](CHANGELOG.md) so commit message formatting is really important. Check our [commit history](https://github.com/seriema/angular-apimock/commits/master) to see how it's used.

##### Summary message

The first line of the commit message must be the _type_, _area_, and _summary_. As in `type(area): summary`.

Example: `feat(apimock): add disable config`

_Type_ must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

_Area_ should be one of these:

* apimock
* all
* grunt
* travis
* readme
* npm
* tests (plural! don't forget the ending "s")
* bower

_Summary_ should preferably be less than 80 characters and succinctly summarize the commit. Use the description message (see below) to detail further and reference Github issues.

##### Description message

References to issues or pull requests go after the summary message, each one on their own line. Use:

* **Fixes**: When the commit fixes an open issue
* **Closes**: When the commit closes an open pull request
* **Ref**: When referencing an issue or pull request that is already closed or should remain open. Examples include partial fixes and commits that add a test but not a fix

Example: `Fixes #15`
