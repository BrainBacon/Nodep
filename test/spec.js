'use strict';

var assert = require('assert');
var _ = require('lodash');

var nodep = require('../nodep');
var $p = nodep();

var noArgs = require('./mock/no.args');
var noArgsCommented = require('./mock/no.args.commented');
var arg = require('./mock/arg');
var argCommented = require('./mock/arg.commented');
var args = require('./mock/args');
var argsCommented = require('./mock/args.commented');
var str = require('./mock/str');
var num = require('./mock/num');
var obj = require('./mock/obj');

describe('$p', function() {
    it('should register itself', function() {
        assert.equal($p.dependencies.$p,$p);
    });
});

describe('$p.name', function() {
    it('should camelcase paths', function() {
        assert.equal($p.name('./foo.bar1.js'), 'fooBar1');
        assert.equal($p.name('./foo/foo-bar2'), 'fooBar2');
        assert.equal($p.name('./foo/bar/foo_bar3.js'), 'fooBar3');
        assert.equal($p.name('./.foo/fooBar4'), 'fooBar4');
        assert.equal($p.name('/foo-._bar5.js'), 'fooBar5');
        assert.equal($p.name('/-._fooBar6'), 'fooBar6');
        assert.equal($p.name('/fooBar7-_..js'), 'fooBar7');
    });
});

describe('$p.args', function() {
    it('should find no arguments', function() {
        assert.deepEqual($p.args(noArgs), []);
    });

    it('should find no arguments from commented function', function() {
        assert.deepEqual($p.args(noArgsCommented), []);
    });

    it('should find one argument', function() {
        assert.deepEqual($p.args(arg), ['noArgs']);
    });

    it('should find one argument from commented function', function() {
        assert.deepEqual($p.args(argCommented), ['noArgs']);
    });

    it('should find arguments', function() {
        assert.deepEqual($p.args(args), [
            'noArgs',
            'noArgsCommented',
            'arg',
            'argCommented'
        ]);
    });

    it('should find arguments from commented function', function() {
        assert.deepEqual($p.args(argsCommented), [
            'noArgs',
            'noArgsCommented',
            'arg',
            'argCommented',
            'args'
        ]);
    });
});

var reset = function() {
    $p = nodep();
};

describe('$p.decorator', function() {
    beforeEach(reset);

    it('should create and apply dependency', function() {
        var foo = function() {
            return 'bar';
        };
        $p.decorator('foo', foo);
        assert.equal($p.dependencies.foo, foo());
    });

    it('should create and not apply dependency', function() {
        var foo = function() {
            return 'bar';
        };
        $p.decorator('foo', foo, true);
        assert.equal($p.dependencies.foo, foo);
    });

    it('should create dependency string', function() {
        $p.decorator('foo', 'bar');
        assert.equal($p.dependencies.foo, 'bar');
    });

    it('should create dependency object', function() {
        var foo = {
            bar: true
        };
        $p.decorator('foo', foo);
        assert.equal($p.dependencies.foo, foo);
    });

    it('should create dependency number', function() {
        $p.decorator('foo', 13);
        assert.equal($p.dependencies.foo, 13);
    });

    it('should overwrite dependency', function() {
        $p.decorator('foo', 17);
        $p.decorator('foo', 19);
        assert.equal($p.dependencies.foo, 19);
    });

    it('should overwrite and inject dependency', function() {
        $p.decorator('foo', 23);
        $p.decorator('bar', 29);
        $p.decorator('foo', function(bar) {
            return 31 * bar;
        });
        assert.equal($p.dependencies.foo, 899);
    });

    it('should overwrite and inject old dependency', function() {
        $p.decorator('foo', 37);
        $p.decorator('foo', function(foo) {
            return 41 * foo;
        });
        assert.equal($p.dependencies.foo, 1517);
    });
});

describe('$p.easyRegister', function() {
    beforeEach(reset);

    it('should reject a non-string type', function() {
        assert.throws($p.easyRegister, TypeError, $p.REGISTER_TYPE_ERROR_MESSAGE);
    });

    it('should find a dependency', function() {
        $p.dependencies.bar = true;
        assert.strictEqual($p.easyRegister('./foo', 'bar'), true);
    });

    it('should register npm dependency', function() {
        $p.easyRegister('lodash');
        assert.equal($p.dependencies.lodash, _);
    });

    it('should not register path', function() {
        assert.strictEqual($p.easyRegister('./foo'), false);
    });
});

describe('$p.register', function() {
    beforeEach(reset);

    it('should register npm module', function() {
        $p.register('lodash');
        assert.equal($p.dependencies.lodash, _);
    });

    it('should register string', function() {
        $p.register('./mock/str');
        assert.equal($p.dependencies.str, str);
    });

    it('should register number', function() {
        $p.register('./mock/num');
        assert.equal($p.dependencies.num, num);
    });

    it('should register object', function() {
        $p.register('./mock/obj');
        assert.equal($p.dependencies.obj, obj);
    });

    it('should throw error for undefined', function() {
        assert.throws($p.register, TypeError, $p.REGISTER_TYPE_ERROR_MESSAGE);
    });

    it('should throw error for non-existent dependency', function() {
        assert.throws(function() {
            $p.register('./nope');
        }, Error, 'Cannot find module \'./nope\'');
    });

    it('should throw error for non-existent npm module', function() {
        assert.throws(function() {
            $p.register('nope');
        }, Error, 'Cannot find module \'nope\'');
    });

    it('should not overwrite existing dependency', function() {
        $p.register('./mock/random');
        var first = $p.dependencies.random;
        $p.register('./mock/random');
        assert.equal($p.dependencies.random, first);
    });

    it('should find new npm module', function() {
        $p.register('./mock/npm');
        assert.equal($p.dependencies.npm, _);
    });

    it('should inject dependency', function() {
        $p.register('./mock/no.args');
        $p.register('./mock/arg');
        assert.equal($p.dependencies.arg, 3);
    });

    it('should inject dependencies', function() {
        $p.register('./mock/no.args');
        $p.register('./mock/no.args.commented');
        $p.register('./mock/arg');
        $p.register('./mock/arg.commented');
        $p.register('./mock/args');
        $p.register('./mock/args.commented');
        assert.equal($p.dependencies.argsCommented, 69300);
    });

    it('should inject dependency array', function() {
        $p.register([
            './mock/no.args',
            './mock/no.args.commented',
            './mock/arg',
            './mock/arg.commented',
            './mock/args',
            './mock/args.commented'
        ]);
        assert.equal($p.dependencies.argsCommented, 69300);
    });

    it('should inject dependencies in reverse', function() {
        $p.register([
            './mock/args.commented',
            './mock/args',
            './mock/arg.commented',
            './mock/arg',
            './mock/no.args.commented',
            './mock/no.args',
        ]);
        assert.equal($p.dependencies.argsCommented, 69300);
    });

    it('should detect circular dependency', function() {
        assert.throws(function() {
            $p.register(['./mock/circular']);
        }, Error, $p.CIRCULAR_DEPENDENCY_ERROR_MESSAGE);
    });
});

describe('$p.init', function() {
    beforeEach(reset);

    it('should register dependency', function() {
        $p.init('./mock/no.args');
        assert.equal($p.dependencies.noArgs, 1);
    });

    it('should register dependency array', function() {
        $p.init([
            './mock/no.args',
            './mock/no.args.commented'
        ]);
        assert.equal($p.dependencies.noArgs, 1);
        assert.equal($p.dependencies.noArgsCommented, 2);
    });

    it('should register dependency object', function() {
        $p.init({
            foo: 'bar'
        });
        assert.equal($p.dependencies.foo, 'bar');
    });

    it('should not overwrite dependency from array', function() {
        $p.init(['./mock/random']);
        var first = $p.dependencies.random;
        $p.init(['./mock/random']);
        assert.equal($p.dependencies.random, first);
    });

    it('should not overwrite dependency from object', function() {
        $p.init({
            foo: 'bar'
        });
        $p.init({
            foo: 'baz'
        });
        assert.equal($p.dependencies.foo, 'bar');
    });

    it('should return $p', function() {
        assert.equal($p.init({
            foo: 'bar'
        }).init([
            './mock/num'
        ]), $p);
    });
});

describe('$p.provider', function() {
    beforeEach(reset);

    it('should register other provider object', function() {
        $p.provider(nodep().init({
            foo: true
        }));
        assert.equal($p.dependencies.foo, true);
    });

    it('should register other provider function', function() {
        $p.provider(function() {
            return nodep().init({
                foo: true
            });
        });
        assert.equal($p.dependencies.foo, true);
    });

    it('should register other provider array', function() {
        $p.provider([
            nodep().init({
                foo: true
            }),
            nodep().init({
                bar: true
            })
        ]);
        assert.equal($p.dependencies.foo, true);
        assert.equal($p.dependencies.bar, true);
    });

    it('should register other provider string function', function() {
        $p.provider('./mock/provider');
        assert.equal($p.dependencies.foo, true);
    });

    it('should register other provider string object', function() {
        $p.provider('./mock/provider.obj');
        assert.equal($p.dependencies.foo, true);
    });

    it('should error on invalid provider', function() {
        assert.throws($p.provider, TypeError, $p.PROVIDER_TYPE_ERROR_MESSAGE);
    });

    it('should return $p', function() {
        assert.equal($p.provider(nodep()), $p);
    });
});

describe('$p.inject', function() {
    beforeEach(reset);

    it('should return a reference to $p', function() {
        assert.equal($p.inject('$p'), $p);
    });

    it('should return a reference to dependency', function() {
        $p.decorator('foo', 'bar');
        assert.equal($p.inject('foo'), 'bar');
    });

    it('should return an undefined reference', function() {
        assert.equal($p.inject('foo'), undefined);
    });
});
