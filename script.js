'use strict';

Flatdoc.run({
    fetcher: Flatdoc.github('BrainBacon/Nodep')
});

$(document).on('flatdoc:ready', function() {
    var apiLinks = $('#api-reference-item');
    var apiTitle = $('#api-reference');
    var apiBody = apiTitle.nextUntil('#license');
    var notApi = apiTitle.prevAll();
    var notLink = $('li.level-1').not('#api-reference-item');
    var licenseTitle = $('#license');
    var licenseBody = licenseTitle.nextAll();
    var body = $('body');

    apiTitle.nextAll('ul:first').remove();

    var showHome = function() {
        apiLinks.hide();
        apiTitle.hide();
        apiBody.hide();
        notApi.show();
        notLink.show();
        licenseTitle.show();
        licenseBody.show();
        body.removeClass('no-literate');

    };
    showHome();

    $('#title-link').click(function(event) {
        event.preventDefault();
        showHome();
    });

    $('#api-header-button').click(function(event) {
        event.preventDefault();
        apiLinks.show();
        apiTitle.show();
        apiBody.show();
        notApi.hide();
        notLink.hide();
        licenseTitle.hide();
        licenseBody.hide();
        body.addClass('no-literate');
    });
});

