'use strict';
/**
 * # License
 * [The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)
 *
 * Copyright (c) 2015 Brian Jesse
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * @module license
 */

var nodep = require('./package');
var _ = require('lodash');

var REGISTER_TYPE_ERROR_MESSAGE = 'Dependency is not a string';
var PROVIDER_TYPE_ERROR_MESSAGE = 'Module does not have dependencies';

/**
 * # Contributing
 * ## Requirements
 * [Gulp](http://gulpjs.com/)
 * ```bash
 * $ npm install -g gulp
 * ```
 * ## Running the test suite
 * ```bash
 * $ gulp
 * ```
 * ## Generating README.md
 * ```bash
 * $ gulp docs
 * ```
 * Note:
 * - jshint is part of the test suite and should be kept clean
 * - Pull requests should have high test coverage
 * - Docs should be kept up to date
 * - Additions should come with documentation
 * @module contributing
 */
/**
 * # Nodep
 * [![Build Status](https://travis-ci.org/BrainBacon/Nodep.svg)](https://travis-ci.org/BrainBacon/Nodep)
 * [![Coverage Status](https://coveralls.io/repos/BrainBacon/Nodep/badge.svg?branch=master&service=github)](https://coveralls.io/github/BrainBacon/Nodep?branch=master)
 *
 * A simple dependency injection framework for Node.js inspired by Angular.js.
 *
 * Inject directly into your exports functions!
 * ```js
 * module.exports = function(myDep) {
 *     // do something awesome with myDep
 * };
 * ```
 * # Installation
 * ```bash
 * $ npm install --save nodep
 * ```
 * # Usage
 * @module header
 */
/**
 * @namespace
 * @module nodep
 * @type {Function}
 * @author Brian Jesse (@BrainBacon)
 */
module.exports = function() {

    /**
     * The dependency injection provider
     * @type {Object}
     * @example
     * ```js
     * var $p = require('nodep')();
     * ```
     */
    var $p = {

        /**
         * The dependency reference storage object
         * @type {Object}
         */
        dependencies: {},

        /**
         * The package of this library
         * @type {Object}
         */
        nodep: nodep,

        /**
         * The module of $p
         * @type {Object}
         */
        module: module,

        /**
         * Expression used to parse dependency names and format them to camel case
         * @constant
         * @type {RegExp}
         */
        CAMEL_CASE_REGEXP: /[\.\-\_]+(.)/g,

        /**
         * Expression used to clean up trailing characters in a path
         * @constant
         * @type {RegExp}
         */
        CAMEL_CASE_CLEANUP: /[\.\-\_]/g,

        /**
         * Expression to remove path and .js extension when calculating the dependency name
         * @constant
         * @type {RegExp}
         */
        PATH_REPLACE_REGEXP: /.*\/(.*?)(\.js)?$/g,

        /**
         * Replace string when evaluating `PATH_REPLACE_REGEXP`
         * @constant
         * @type {String}
         */
        PATH_REPLACE_RESULT: '$1',

        /**
         * Expression to remove comments when parsing arguments for a dependency
         * @constant
         * @type {RegExp}
         */
        REMOVE_COMMENTS_REGEXP: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,

        /**
         * Used to format text into camel case
         * @function
         * @param {String} match the matched text from a replace
         * @param {String} $1 the first capture group
         * @param {String} offset the current index of the match group
         * @returns {String} a camel case formatted result
         */
        camelCase: function(match, $1, offset) {
            return offset ? $1.toUpperCase() : $1;
        },

        /**
         * Used to format dependency names from filenames
         * @function
         * @param {String} path the file path to turn into a dependency name
         * @returns {String} a formatted dependency name
         */
        name: function(path) {
            if(_.includes(path, '/')) {
                path = path.replace(this.PATH_REPLACE_REGEXP, this.PATH_REPLACE_RESULT);
                path = path.replace(this.CAMEL_CASE_REGEXP, this.camelCase);
                path = path.replace(this.CAMEL_CASE_CLEANUP, '');
            }
            return path;
        },

        /**
         * Will extract the order and name of injectable arguments in a given function
         * @function
         * @param {Function} fn the function to extract injection arguments from
         */
        args: function(fn) {
            var clean = fn.toString().replace(this.REMOVE_COMMENTS_REGEXP, '');
            var args = clean.substring(clean.indexOf('(') + 1, clean.indexOf(')')).split(',');
            var output = [];
            _.forEach(args, function(val) {
                val = val.trim();
                if(val && val !== '') {
                    output.push(val);
                }
            });
            return output;
        },

        /**
         * ## Override existing dependencies
         * ```js
         * // You can inject the old instance of this dependency
         * $p.decorator('aDependencyToOverride', function(aDependencyToOverride) {
         *     var oldDep = aDependencyToOverride;
         * });
         * ```
         * @module decorator
         */
        /**
         * Main dependency injection function
         *
         * Dependency Handling:
         *  - Dependencies with names, generated or otherwise, will not be overwritten by `$p.register`
         *  - Local Dependencies
         *    - Dependencies with a path-like filename, e.g. `./my/project/example.js`
         *    - Loaded relative to the parent module (the module that reqired nodep)
         *    - Resulting dependency will have a normalized filename produced by `$p.name`
         *    - Default naming scheme is lower-camel-case
         *    - Will be initialized if are of type {function}
         *    - Initialized functions will have dependencies injected according to that function's param names
         *  - Global Dependencies
         *    - npm dependencies e.g. `example`
         *    - Loaded relative to the parent module (the module that reqired nodep)
         *    - Name remains unchanged for resulting dependency
         *    - Will not be initialized in the same manner as local dependencies
         * @function
         * @param {String} name the name of a dependency to register to the provider
         * @param {?} dependency a value to assign to this dependency
         * @param {Boolean} [skipInject] inject into a provided dependency of type function unless true
         */
        decorator: function(name, dependency, skipInject) {
            if(!_.isFunction(dependency) || skipInject) {
                this.dependencies[name] = dependency;
                return;
            }
            var args = this.args(dependency);
            var self = this;
            // TODO determine what to make of the "this arg" value. Perhaps set it as $p?
            this.dependencies[name] = dependency.apply(undefined, _.map(args, function(arg) {
                var dep = self.dependencies[arg];
                if(_.isUndefined(dep)) {
                    dep = module.parent.require(arg);
                    self.dependencies[arg] = dep;
                }
                return dep;
            }));
            return this;
        },

        /**
         * Error message to send when trying to register a non-string type
         * @constant
         * @type {String}
         */
        REGISTER_TYPE_ERROR_MESSAGE: REGISTER_TYPE_ERROR_MESSAGE,

        /**
         * Default registration function in front of `$p.decorator`
         * @function
         * @param {String} path the name or filepath of a dependency to register to the provider
         */
        register: function(path) {
            if(!_.isString(path)) {
                throw new TypeError(REGISTER_TYPE_ERROR_MESSAGE);
            }
            var name = this.name(path);
            if(!_.isUndefined(this.dependencies[name])) {
                return;
            }
            if(!_.includes(path, '/')) {
                this.dependencies[path] = module.parent.require(path);
                return;
            }
            var dependency = module.parent.require(path);
            this.decorator(name, dependency);
        },

        /**
         * ## Load dependencies into nodep
         * Dependencies can be loaded as follows:
         * - an array of paths and npm module names
         * - a single instance of any of the above
         * - an object with the keys being the dependency names
         *
         * **index.js**
         * ```js
         * var $p = require('nodep')();
         *
         * $p.load([
         *     './a.local.dependency',
         *     './another/local.dependency',
         *     'anNpmPackage'
         * ]).load({
         *     myVar: localVariable
         * });
         * ```
         * *(Local dependencies are changed to camel-case names without paths)*
         *
         * Use your dependencies like this:
         *
         * **a.local.dependency.js**
         * ```js
         * module.exports = function(localDependency, myVar, anNpmPackage) {
         *     localDependency.doStuff();
         *     myVar.doStuff();
         *     anNpmPackage();
         * };
         * ```
         *
         * Summary:
         * - `./a.local.dependency` becomes `aLocalDependency` is executed and injectable
         * - `./another/local.dependency` becomes `localDependency` is executed and injectable
         * - `anNpmPackage` is loaded from `node_modules`
         * - `myVar` is injectable
         * @module load
         */
        /**
         * Load one or more dependencies into the provider
         * Loading Mechanism:
         *  - All strings in an array loaded into $p will be initialized according to `$p.register`
         *  - Objects will have their members placed directly into $p.dependencies with keys of the same names
         *  - Strings are treated as a single call to $p.register
         * @function
         * @param {(Array<String>|Object|String)} paths a list, key/value store, or single dependency
         * @returns {Object} a reference to this provider
         */
        load: function(paths) {
            var self = this;
            if(_.isArray(paths)) {
                _.forEach(paths, function(path) {
                    self.register(path);
                });
            } else if(_.isObject(paths)) {
                _.forEach(paths, function(path, name) {
                    if(_.isUndefined(self.dependencies[name])) {
                        self.dependencies[name] = path;
                    }
                });
            } else {
                this.register(paths);
            }
            return this;
        },

        /**
         * Error message to send when trying to register a provider without dependencies
         * @constant
         * @type {String}
         */
        PROVIDER_TYPE_ERROR_MESSAGE: PROVIDER_TYPE_ERROR_MESSAGE,

        /**
         * ## Existing providers
         * Register other instances of nodep into your project.
         *
         * Providers can be loaded as follows:
         * - an array of paths, npm module names, or local variables
         * - a single instance of any of the above
         *
         * **index.js**
         * ```js
         * var $p = require('nodep')();
         *
         * $p.provider([
         *     'anNpmPackage',
         *     './a.local.provider',
         *     aLocalVariable
         * ]).provider('anotherNpmPackage');
         * ```
         * Now all dependencies from `anNpmPackage`, `aLocalVariable`, and `anotherNpmPackage` are available for injection.
         * @module provider
         */
        /**
         * Load an existing instance of nodep into this provider
         * @function
         * @param {(Array<Object>|Object|String)} instances an array of existing provider or single instance
         * @returns {Object} a reference to this provider
         */
        provider: function(instances) {
            var self = this;
            var provide = function(instance) {
                    if(_.isString(instance)) {
                        instance = module.parent.require(instance);
                    }
                    if(_.isFunction(instance)) {
                        instance = instance();
                    }
                    if(!instance || !instance.dependencies) {
                        throw new TypeError(PROVIDER_TYPE_ERROR_MESSAGE);
                    }
                    self.load(instance.dependencies);
            };
            if(_.isArray(instances)) {
                _.forEach(instances, provide);
            } else {
                provide(instances);
            }
            return this;
        },

        /**
         * ## Inject dependencies at runtime
         * **a.module.loaded.into.nodep.js**
         * ```js
         * // $p is already available for injection
         * module.exports = function($p) {
         *     var myDependency = $p.inject('myDependency');
         * };
         * ```
         * @module inject
         */
        /**
         * Used to programmatically obtain a reference to a dependency
         * @function
         * @param {String} name The name of the dependency to inject
         * @returns {?} a reference to the dependency with (name)
         */
        inject: function(name) {
            return this.dependencies[name];
        },
    };

    /**
     * An injectable reference to this module
     * @type {Object}
     */
    $p.dependencies.$p = $p;

    return $p;
};

