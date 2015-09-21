'use strict';

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
        expect($p.dependencies.$p).toBe($p);
    });
});

describe('$p.name', function() {
    it('should camelcase paths', function() {
        expect($p.name('./foo.bar1.js')).toBe('fooBar1');
        expect($p.name('./foo/foo-bar2')).toBe('fooBar2');
        expect($p.name('./foo/bar/foo_bar3.js')).toBe('fooBar3');
        expect($p.name('./.foo/fooBar4')).toBe('fooBar4');
        expect($p.name('/foo-._bar5.js')).toBe('fooBar5');
        expect($p.name('/-._fooBar6')).toBe('fooBar6');
        expect($p.name('/fooBar7-_..js')).toBe('fooBar7');
    });
});

describe('$p.args', function() {
    it('should find no arguments', function() {
        expect($p.args(noArgs)).toEqual([]);
    });

    it('should find no arguments from commented function', function() {
        expect($p.args(noArgsCommented)).toEqual([]);
    });

    it('should find one argument', function() {
        expect($p.args(arg)).toEqual(['noArgs']);
    });

    it('should find one argument from commented function', function() {
        expect($p.args(argCommented)).toEqual(['noArgs']);
    });

    it('should find arguments', function() {
        expect($p.args(args)).toEqual([
            'noArgs',
            'noArgsCommented',
            'arg',
            'argCommented'
        ]);
    });

    it('should find arguments from commented function', function() {
        expect($p.args(argsCommented)).toEqual([
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
        expect($p.dependencies.foo).toEqual(foo());
    });

    it('should create and not apply dependency', function() {
        var foo = function() {
            return 'bar';
        };
        $p.decorator('foo', foo, true);
        expect($p.dependencies.foo).toEqual(foo);
    });

    it('should create dependency string', function() {
        $p.decorator('foo', 'bar');
        expect($p.dependencies.foo).toBe('bar');
    });

    it('should create dependency object', function() {
        var foo = {
            bar: true
        };
        $p.decorator('foo', foo);
        expect($p.dependencies.foo).toEqual(foo);
    });

    it('should create dependency number', function() {
        $p.decorator('foo', 13);
        expect($p.dependencies.foo).toBe(13);
    });

    it('should overwrite dependency', function() {
        $p.decorator('foo', 17);
        $p.decorator('foo', 19);
        expect($p.dependencies.foo).toBe(19);
    });

    it('should overwrite and inject dependency', function() {
        $p.decorator('foo', 23);
        $p.decorator('bar', 29);
        $p.decorator('foo', function(bar) {
            return 31 * bar;
        });
        expect($p.dependencies.foo).toBe(899);
    });

    it('should overwrite and inject old dependency', function() {
        $p.decorator('foo', 37);
        $p.decorator('foo', function(foo) {
            return 41 * foo;
        });
        expect($p.dependencies.foo).toBe(1517);
    });
});

describe('$p.register', function() {
    beforeEach(reset);

    it('should register npm module', function() {
        $p.register('lodash');
        expect($p.dependencies.lodash).toEqual(_);
    });

    it('should register string', function() {
        $p.register('./mock/str');
        expect($p.dependencies.str).toBe(str);
    });

    it('should register number', function() {
        $p.register('./mock/num');
        expect($p.dependencies.num).toBe(num);
    });

    it('should register object', function() {
        $p.register('./mock/obj');
        expect($p.dependencies.obj).toEqual(obj);
    });

    it('should throw error for undefined', function() {
        expect($p.register).toThrowError(TypeError, $p.REGISTER_TYPE_ERROR_MESSAGE);
    });

    it('should throw error for non-existent dependency', function() {
        expect(function() {
            $p.register('./nope');
        }).toThrowError(Error, 'Cannot find module \'./nope\'');
    });

    it('should throw error for non-existent npm module', function() {
        expect(function() {
            $p.register('nope');
        }).toThrowError(Error, 'Cannot find module \'nope\'');
    });

    it('should not overwrite existing dependency', function() {
        $p.register('./mock/random');
        var first = $p.dependencies.random;
        $p.register('./mock/random');
        expect($p.dependencies.random).toBe(first);
    });

    it('should find new npm module', function() {
        $p.register('./mock/npm');
        expect($p.dependencies.npm).toEqual(_);
    });

    it('should inject dependency', function() {
        $p.register('./mock/no.args');
        $p.register('./mock/arg');
        expect($p.dependencies.arg).toBe(3);
    });

    it('should inject dependencies', function() {
        $p.register('./mock/no.args');
        $p.register('./mock/no.args.commented');
        $p.register('./mock/arg');
        $p.register('./mock/arg.commented');
        $p.register('./mock/args');
        $p.register('./mock/args.commented');
        expect($p.dependencies.argsCommented).toBe(69300);
    });
});

describe('$p.load', function() {
    beforeEach(reset);

    it('should register dependency', function() {
        $p.load('./mock/no.args');
        expect($p.dependencies.noArgs).toBe(1);
    });

    it('should register dependency array', function() {
        $p.load([
            './mock/no.args',
            './mock/no.args.commented'
        ]);
        expect($p.dependencies.noArgs).toBe(1);
        expect($p.dependencies.noArgsCommented).toBe(2);
    });

    it('should register dependency object', function() {
        $p.load({
            foo: 'bar'
        });
        expect($p.dependencies.foo).toBe('bar');
    });

    it('should not overwrite dependency from array', function() {
        $p.load(['./mock/random']);
        var first = $p.dependencies.random;
        $p.load(['./mock/random']);
        expect($p.dependencies.random).toBe(first);
    });

    it('should not overwrite dependency from object', function() {
        $p.load({
            foo: 'bar'
        });
        $p.load({
            foo: 'baz'
        });
        expect($p.dependencies.foo).toBe('bar');
    });

    it('should return $p', function() {
        expect($p.load({
            foo: 'bar'
        }).load([
            './mock/num'
        ])).toEqual($p);
    });
});

describe('$p.provider', function() {
    beforeEach(reset);

    it('should register other provider object', function() {
        $p.provider(nodep().load({
            foo: true
        }));
        expect($p.dependencies.foo).toBe(true);
    });

    it('should register other provider function', function() {
        $p.provider(function() {
            return nodep().load({
                foo: true
            });
        });
        expect($p.dependencies.foo).toBe(true);
    });

    it('should register other provider array', function() {
        $p.provider([
            nodep().load({
                foo: true
            }),
            nodep().load({
                bar: true
            })
        ]);
        expect($p.dependencies.foo).toBe(true);
        expect($p.dependencies.bar).toBe(true);
    });

    it('should register other provider string function', function() {
        $p.provider('./mock/provider');
        expect($p.dependencies.foo).toBe(true);
    });

    it('should register other provider string object', function() {
        $p.provider('./mock/provider.obj');
        expect($p.dependencies.foo).toBe(true);
    });

    it('should error on invalid provider', function() {
        expect($p.provider).toThrowError(TypeError, $p.PROVIDER_TYPE_ERROR_MESSAGE);
    });

    it('should return $p', function() {
        expect($p.provider(nodep())).toBe($p);
    });
});

describe('$p.inject', function() {
    beforeEach(reset);

    it('should return a reference to $p', function() {
        expect($p.inject('$p')).toBe($p);
    });

    it('should return a reference to dependency', function() {
        $p.decorator('foo', 'bar');
        expect($p.inject('foo')).toBe('bar');
    });

    it('should return an undefined reference', function() {
        expect($p.inject('foo')).toBe(undefined);
    });
});
