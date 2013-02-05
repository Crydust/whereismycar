define(['app/timeago'], function(timeago) {

    module('timeago');

    test('inWords', 15, function(){
        equal(timeago.inWords(null), null);
        equal(timeago.inWords(1000, new Date(0)), 'less than a minute ago');
        equal(timeago.inWords(new Date(1000), new Date(0)), 'less than a minute ago');
        equal(timeago.inWords(new Date(60 * 1000), new Date(0)), 'about a minute ago');
        equal(timeago.inWords(new Date(2 * 60 * 1000), new Date(0)), 'two minutes ago');
        equal(timeago.inWords(new Date(15 * 60 * 1000), new Date(0)), 'fifteen minutes ago');
        equal(timeago.inWords(new Date(60 * 60 * 1000), new Date(0)), 'about an hour ago');
        equal(timeago.inWords(new Date(2 * 60 * 60 * 1000), new Date(0)), 'about two hours ago');
        equal(timeago.inWords(new Date(15 * 60 * 60 * 1000), new Date(0)), 'about fifteen hours ago');
        equal(timeago.inWords(new Date(24 * 60 * 60 * 1000), new Date(0)), 'a day ago');
        equal(timeago.inWords(new Date(2 * 24 * 60 * 60 * 1000), new Date(0)), 'two days ago');
        equal(timeago.inWords(new Date(7 * 24 * 60 * 60 * 1000), new Date(0)), 'seven days ago');
        equal(timeago.inWords(new Date(31 * 24 * 60 * 60 * 1000), new Date(0)), 'about a month ago');
        equal(timeago.inWords(new Date(62 * 24 * 60 * 60 * 1000), new Date(0)), 'two months ago');
        equal(timeago.inWords(new Date(2 * 365 * 24 * 60 * 60 * 1000), new Date(0)), 'two years ago');
    });
    
    return {};

});