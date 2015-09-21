'use strict';

module.exports = function(
    noArgs,
    noArgsCommented, arg, argCommented
) {
    return 7 * noArgs * noArgsCommented * arg * argCommented;
};
// => 210
