'use strict';

var $p = require('../../nodep')();

module.exports = function() {
    $p.load({
        foo: true
    });
    return $p;
};

