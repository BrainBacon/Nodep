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
    /* block */ noArgs // inline /* block */
    // inline /* block */
    /* block // inline */
    /* block */
    // inline
    /*
     * multiline block
     */
) {
    /*
     * multiline block
     */
    // inline
    /* block */
    /* inline // block */
    // inline /* block */
    /* block */ return noArgs * 5; // inline /* block */
};
// => 5
