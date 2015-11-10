<p align="center"><img src="https://cdn.rawgit.com/BrainBacon/artwork/master/nodep.svg" width="264" height="300"></p>

# Nodep
[![Build Status](https://travis-ci.org/BrainBacon/Nodep.svg)](https://travis-ci.org/BrainBacon/Nodep)
[![Coverage Status](https://coveralls.io/repos/BrainBacon/Nodep/badge.svg?branch=master&service=github)](https://coveralls.io/github/BrainBacon/Nodep?branch=master)

A simple dependency injection framework for Node.js inspired by Angular.js.

Inject directly into your exports functions!
```js
module.exports = function(myDep) {
    // do something awesome with myDep
};
```
# Installation
```bash
$ npm install --save nodep
```
# Usage


ERROR, Cannot find module.
## Existing providers
Register other instances of nodep into your project.

### Providers can be loaded as follows:
- an array of paths, npm module names, or local variables
- a single instance of any of the above

### Example
**index.js**
```js
var $p = require('nodep')();

$p.provider([
    'anNpmPackage',
    './a.local.provider',
    aLocalVariable
]).provider('anotherNpmPackage');
```
- Now all dependencies from `anNpmPackage`, `aLocalVariable`, and `anotherNpmPackage` are available for injection.


## Inject dependencies at runtime
**a.module.loaded.into.nodep.js**
```js
// $p is already available for injection
module.exports = function($p) {
    var myDependency = $p.inject('myDependency');
};
```


## Override existing dependencies
```js
// You can inject the old instance of this dependency
$p.decorator('aDependencyToOverride', function(aDependencyToOverride) {
    var oldDep = aDependencyToOverride;
});
```


# Contributing
## Requirements
- [Gulp](http://gulpjs.com/)
```bash
$ npm install -g gulp
```
## Running the test suite
### Single Run:
```bash
$ gulp
```
### Continuous testing when files are changed:
```bash
$ gulp autotest
```
## Generating README.md
```bash
$ gulp docs
```
## Generating CHANGELOG.md
```bash
$ gulp changelog
```
## Notes
- jshint is part of the test suite and should be kept clean
- Pull requests should have high test coverage
- Docs should be kept up to date
- Additions should come with documentation
- commit messages should follow [conventional format](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)


# API Reference
<a name="module_nodep"></a>
## nodep : <code>function</code>

<a name="module_nodep..$p"></a>
## nodep~$p : <code>Object</code>
The dependency injection provider

**Kind**: inner property of <code>[nodep](#module_nodep)</code>  
**Example**  
```js
var $p = require('nodep')();
```

* [~$p](#module_nodep..$p) : <code>Object</code>
  * [.dependencies](#module_nodep..$p.dependencies) : <code>Object</code>
  * [.nodep](#module_nodep..$p.nodep) : <code>Object</code>
  * [.module](#module_nodep..$p.module) : <code>Object</code>
  * [.dependencies.$p](#module_nodep..$p.dependencies.$p) : <code>Object</code>
  * [.CAMEL_CASE_REGEXP](#module_nodep..$p.CAMEL_CASE_REGEXP) : <code>RegExp</code>
  * [.CAMEL_CASE_CLEANUP](#module_nodep..$p.CAMEL_CASE_CLEANUP) : <code>RegExp</code>
  * [.PATH_REPLACE_REGEXP](#module_nodep..$p.PATH_REPLACE_REGEXP) : <code>RegExp</code>
  * [.PATH_REPLACE_RESULT](#module_nodep..$p.PATH_REPLACE_RESULT) : <code>String</code>
  * [.REMOVE_COMMENTS_REGEXP](#module_nodep..$p.REMOVE_COMMENTS_REGEXP) : <code>RegExp</code>
  * [.REGISTER_TYPE_ERROR_MESSAGE](#module_nodep..$p.REGISTER_TYPE_ERROR_MESSAGE) : <code>String</code>
  * [.CIRCULAR_DEPENDENCY_ERROR_MESSAGE](#module_nodep..$p.CIRCULAR_DEPENDENCY_ERROR_MESSAGE) : <code>String</code>
  * [.PROVIDER_TYPE_ERROR_MESSAGE](#module_nodep..$p.PROVIDER_TYPE_ERROR_MESSAGE) : <code>String</code>
  * [.camelCase(match, $1, offset)](#module_nodep..$p.camelCase) ⇒ <code>String</code>
  * [.name(path)](#module_nodep..$p.name) ⇒ <code>String</code>
  * [.args(fn)](#module_nodep..$p.args)
  * [.applyArgs(name, args)](#module_nodep..$p.applyArgs)
  * [.decorator(name, dependency, [skipInject])](#module_nodep..$p.decorator) ⇒ <code>Object</code>
  * [.easyRegister(path)](#module_nodep..$p.easyRegister) ⇒ <code>Boolean</code>
  * [.register(paths)](#module_nodep..$p.register)
  * [.init(paths)](#module_nodep..$p.init) ⇒ <code>Object</code>
  * [.provider(instances)](#module_nodep..$p.provider) ⇒ <code>Object</code>
  * [.inject(name)](#module_nodep..$p.inject) ⇒ <code>?</code>

<a name="module_nodep..$p.dependencies"></a>
### $p.dependencies : <code>Object</code>
The dependency reference storage object

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.nodep"></a>
### $p.nodep : <code>Object</code>
The package of this library

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.module"></a>
### $p.module : <code>Object</code>
The module of $p

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.dependencies.$p"></a>
### $p.dependencies.$p : <code>Object</code>
An injectable reference to this module

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.CAMEL_CASE_REGEXP"></a>
### $p.CAMEL_CASE_REGEXP : <code>RegExp</code>
Expression used to parse dependency names and format them to camel case

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.CAMEL_CASE_CLEANUP"></a>
### $p.CAMEL_CASE_CLEANUP : <code>RegExp</code>
Expression used to clean up trailing characters in a path

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.PATH_REPLACE_REGEXP"></a>
### $p.PATH_REPLACE_REGEXP : <code>RegExp</code>
Expression to remove path and .js extension when calculating the dependency name

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.PATH_REPLACE_RESULT"></a>
### $p.PATH_REPLACE_RESULT : <code>String</code>
Replace string when evaluating `PATH_REPLACE_REGEXP`

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.REMOVE_COMMENTS_REGEXP"></a>
### $p.REMOVE_COMMENTS_REGEXP : <code>RegExp</code>
Expression to remove comments when parsing arguments for a dependency

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.REGISTER_TYPE_ERROR_MESSAGE"></a>
### $p.REGISTER_TYPE_ERROR_MESSAGE : <code>String</code>
Error message to send when trying to register a non-string type

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.CIRCULAR_DEPENDENCY_ERROR_MESSAGE"></a>
### $p.CIRCULAR_DEPENDENCY_ERROR_MESSAGE : <code>String</code>
Error message to send when a circular reference is detected in the dependency tree

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.PROVIDER_TYPE_ERROR_MESSAGE"></a>
### $p.PROVIDER_TYPE_ERROR_MESSAGE : <code>String</code>
Error message to send when trying to register a provider without dependencies

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.camelCase"></a>
### $p.camelCase(match, $1, offset) ⇒ <code>String</code>
Used to format text into camel case

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>String</code> - a camel case formatted result  

| Param | Type | Description |
| --- | --- | --- |
| match | <code>String</code> | the matched text from a replace |
| $1 | <code>String</code> | the first capture group |
| offset | <code>String</code> | the current index of the match group |

<a name="module_nodep..$p.name"></a>
### $p.name(path) ⇒ <code>String</code>
Used to format dependency names from filenames

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>String</code> - a formatted dependency name  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | the file path to turn into a dependency name |

<a name="module_nodep..$p.args"></a>
### $p.args(fn)
Will extract the order and name of injectable arguments in a given function

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to extract injection arguments from |

<a name="module_nodep..$p.applyArgs"></a>
### $p.applyArgs(name, args)
Function to apply args to a new dependency and register it

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the new dependency to register |
| args | <code>Array.&lt;String&gt;</code> | the names of args to apply to the new dependeency |

<a name="module_nodep..$p.decorator"></a>
### $p.decorator(name, dependency, [skipInject]) ⇒ <code>Object</code>
Main dependency injection function

Dependency Handling:
 - Dependencies with names, generated or otherwise, will not be overwritten by `$p.register`
 - Local Dependencies
   - Dependencies with a path-like filename, e.g. `./my/project/example.js`
   - Loaded relative to the parent module (the module that reqired nodep)
   - Resulting dependency will have a normalized filename produced by `$p.name`
   - Default naming scheme is lower-camel-case
   - Will be initialized if are of type {function}
   - Initialized functions will have dependencies injected according to that function's param names
 - Global Dependencies
   - npm dependencies e.g. `example`
   - Loaded relative to the parent module (the module that reqired nodep)
   - Name remains unchanged for resulting dependency
   - Will not be initialized in the same manner as local dependencies

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>Object</code> - a reference to this provider  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of a dependency to register to the provider |
| dependency | <code>?</code> | a value to assign to this dependency |
| [skipInject] | <code>Boolean</code> | inject into a provided dependency of type function unless true |

<a name="module_nodep..$p.easyRegister"></a>
### $p.easyRegister(path) ⇒ <code>Boolean</code>
Easy dependency test, will register simple dependencies

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>Boolean</code> - true if register was successful  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | the name or filepath of a dependency to register to the provider |

<a name="module_nodep..$p.register"></a>
### $p.register(paths)
Default registration function in front of `$p.decorator`

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | the name or filepath of a dependency to register to the provider or an array of the former |

<a name="module_nodep..$p.init"></a>
### $p.init(paths) ⇒ <code>Object</code>
Load one or more dependencies into the provider
Loading Mechanism:
 - All strings in an array loaded into $p will be initialized according to `$p.register`
 - Objects will have their members placed directly into $p.dependencies with keys of the same names
 - Strings are treated as a single call to $p.register

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>Object</code> - a reference to this provider  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;String&gt;</code> &#124; <code>Object</code> &#124; <code>String</code> | a list, key/value store, or single dependency |

<a name="module_nodep..$p.provider"></a>
### $p.provider(instances) ⇒ <code>Object</code>
Load an existing instance of nodep into this provider

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>Object</code> - a reference to this provider  

| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;Object&gt;</code> &#124; <code>Object</code> &#124; <code>String</code> | an array of existing provider or single instance |

<a name="module_nodep..$p.inject"></a>
### $p.inject(name) ⇒ <code>?</code>
Used to programmatically obtain a reference to a dependency

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>?</code> - a reference to the dependency with (name)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the dependency to inject |


# License
[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Copyright (c) 2015 Brian Jesse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


