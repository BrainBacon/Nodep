'use strict';

var nodep = require('./package');
var _ = require('lodash');

var REGISTER_TYPE_ERROR_MESSAGE = 'Dependency is not a string';
var PROVIDER_TYPE_ERROR_MESSAGE = 'Module does not have dependencies';

/**
 * @namespace
 * @module nodep
 * @type {Object}
 * @author Brian Jesse (@BrainBacon)
 */
module.exports = function() {

    /**
     * The dependency injection provider
     * @type {Object}
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
         * @param {Boolean} skipInject inject into a provided dependency of type function unless true
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
         * Load one or more dependencies into the provider
         *
         * Loading Mechanism:
         *  - All strings in an array loaded into $p will be initialized according to `$p.register`
         *  - Objects will have their members placed directly into $p.dependencies with keys of the same names
         *  - Strings are treated as a single call to $p.register
         * @function
         * @example
         * ``` javascript
         *     $p.load([
         *         './example',
         *         './foo/bar.js',
         *         'baz'
         *     ]).load({
         *         bang: require('bang')
         *     }).load('./grok');
         * ```
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
         * Load an existing instance of nodep into this provider
         * @function
         * @example
         * ``` javascript
         *     $p.module([
         *         require('addon1'),
         *         require('addon2')
         *     ]).module(require('addon'));
         * ```
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

