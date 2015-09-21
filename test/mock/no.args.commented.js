'use strict';

// attempt to break the comment cleanup regex
module.exports = function(
    /*
     * multiline block
     */
    // inline
    /* block */
    /* block // inline */
    // inline /* block */
) {
    /*
     * multiline block
     */
    // inline
    /* block */
    /* inline // block */
    // inline /* block */
    /* block */ return 2; // inline /* block */
};
// => 2
