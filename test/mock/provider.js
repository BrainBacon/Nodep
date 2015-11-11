'use strict';

var $p = require('../../nodep')();

module.exports = function() {
    $p.init({
        foo: true
    });
    return $p;
};

