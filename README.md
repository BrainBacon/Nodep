# Nodep
A lightweight dependency injection framework for Node.js.

## Installation
``` bash
npm install --save nodep
```

## Usage
``` javascript
var $p = require('nodep')();
$p.load([
    './routes'
]);
```

## API Reference

<a name="module_nodep"></a>
## nodep
**Author:** Brian Jesse (@BrainBacon)  

<a name="module_nodep..$p"></a>
### nodep~$p : <code>Object</code>
The dependency injection provider

**Kind**: inner property of <code>[nodep](#module_nodep)</code>  

* [~$p](#module_nodep..$p) : <code>Object</code>
  * [.dependencies](#module_nodep..$p.dependencies) : <code>Object</code>
  * [.nodep](#module_nodep..$p.nodep) : <code>Object</code>
  * [.module](#module_nodep..$p.module) : <code>Object</code>
  * [.CAMEL_CASE_REGEXP](#module_nodep..$p.CAMEL_CASE_REGEXP) : <code>RegExp</code>
  * [.CAMEL_CASE_CLEANUP](#module_nodep..$p.CAMEL_CASE_CLEANUP) : <code>RegExp</code>
  * [.PATH_REPLACE_REGEXP](#module_nodep..$p.PATH_REPLACE_REGEXP) : <code>RegExp</code>
  * [.PATH_REPLACE_RESULT](#module_nodep..$p.PATH_REPLACE_RESULT) : <code>String</code>
  * [.REMOVE_COMMENTS_REGEXP](#module_nodep..$p.REMOVE_COMMENTS_REGEXP) : <code>RegExp</code>
  * [.REGISTER_TYPE_ERROR_MESSAGE](#module_nodep..$p.REGISTER_TYPE_ERROR_MESSAGE) : <code>String</code>
  * [.PROVIDER_TYPE_ERROR_MESSAGE](#module_nodep..$p.PROVIDER_TYPE_ERROR_MESSAGE) : <code>String</code>
  * [.camelCase(match, $1, offset)](#module_nodep..$p.camelCase) ⇒ <code>String</code>
  * [.name(path)](#module_nodep..$p.name) ⇒ <code>String</code>
  * [.args(fn)](#module_nodep..$p.args)
  * [.decorator(name, dependency, skipInject)](#module_nodep..$p.decorator)
  * [.register(path)](#module_nodep..$p.register)
  * [.inject(name)](#module_nodep..$p.inject) ⇒ <code>?</code>

<a name="module_nodep..$p.dependencies"></a>
#### $p.dependencies : <code>Object</code>
The dependency reference storage object

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.nodep"></a>
#### $p.nodep : <code>Object</code>
The package of this library

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.module"></a>
#### $p.module : <code>Object</code>
The module of $p

**Kind**: static property of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.CAMEL_CASE_REGEXP"></a>
#### $p.CAMEL_CASE_REGEXP : <code>RegExp</code>
Expression used to parse dependency names and format them to camel case

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.CAMEL_CASE_CLEANUP"></a>
#### $p.CAMEL_CASE_CLEANUP : <code>RegExp</code>
Expression used to clean up trailing characters in a path

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.PATH_REPLACE_REGEXP"></a>
#### $p.PATH_REPLACE_REGEXP : <code>RegExp</code>
Expression to remove path and .js extension when calculating the dependency name

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.PATH_REPLACE_RESULT"></a>
#### $p.PATH_REPLACE_RESULT : <code>String</code>
Replace string when evaluating `PATH_REPLACE_REGEXP`

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.REMOVE_COMMENTS_REGEXP"></a>
#### $p.REMOVE_COMMENTS_REGEXP : <code>RegExp</code>
Expression to remove comments when parsing arguments for a dependency

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.REGISTER_TYPE_ERROR_MESSAGE"></a>
#### $p.REGISTER_TYPE_ERROR_MESSAGE : <code>String</code>
Error message to send when trying to register a non-string type

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.PROVIDER_TYPE_ERROR_MESSAGE"></a>
#### $p.PROVIDER_TYPE_ERROR_MESSAGE : <code>String</code>
Error message to send when trying to register a provider without dependencies

**Kind**: static constant of <code>[$p](#module_nodep..$p)</code>  
<a name="module_nodep..$p.camelCase"></a>
#### $p.camelCase(match, $1, offset) ⇒ <code>String</code>
Used to format text into camel case

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>String</code> - a camel case formatted result  

| Param | Type | Description |
| --- | --- | --- |
| match | <code>String</code> | the matched text from a replace |
| $1 | <code>String</code> | the first capture group |
| offset | <code>String</code> | the current index of the match group |

<a name="module_nodep..$p.name"></a>
#### $p.name(path) ⇒ <code>String</code>
Used to format dependency names from filenames

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>String</code> - a formatted dependency name  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | the file path to turn into a dependency name |

<a name="module_nodep..$p.args"></a>
#### $p.args(fn)
Will extract the order and name of injectable arguments in a given function

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to extract injection arguments from |

<a name="module_nodep..$p.decorator"></a>
#### $p.decorator(name, dependency, skipInject)
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

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of a dependency to register to the provider |
| dependency | <code>?</code> | a value to assign to this dependency |
| skipInject | <code>Boolean</code> | inject into a provided dependency of type function unless true |

<a name="module_nodep..$p.register"></a>
#### $p.register(path)
Default registration function in front of `$p.decorator`

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | the name or filepath of a dependency to register to the provider |

<a name="module_nodep..$p.inject"></a>
#### $p.inject(name) ⇒ <code>?</code>
Used to programmatically obtain a reference to a dependency

**Kind**: static method of <code>[$p](#module_nodep..$p)</code>  
**Returns**: <code>?</code> - a reference to the dependency with (name)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the dependency to inject |

 

## License
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
