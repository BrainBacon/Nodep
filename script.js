'use strict';

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-34998188-5', 'auto');
ga('send', 'pageview');

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

