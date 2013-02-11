define(['app/timeago'], function(timeago) {

    suite('timeago');

    test('inWords', function(){
        assert.equal(timeago.inWords(null), null);
        assert.equal(timeago.inWords(1000, new Date(0)), 'less than a minute ago');
        assert.equal(timeago.inWords(new Date(1000), new Date(0)), 'less than a minute ago');
        assert.equal(timeago.inWords(new Date(60 * 1000), new Date(0)), 'about a minute ago');
        assert.equal(timeago.inWords(new Date(2 * 60 * 1000), new Date(0)), 'two minutes ago');
        assert.equal(timeago.inWords(new Date(15 * 60 * 1000), new Date(0)), 'fifteen minutes ago');
        assert.equal(timeago.inWords(new Date(60 * 60 * 1000), new Date(0)), 'about an hour ago');
        assert.equal(timeago.inWords(new Date(2 * 60 * 60 * 1000), new Date(0)), 'about two hours ago');
        assert.equal(timeago.inWords(new Date(15 * 60 * 60 * 1000), new Date(0)), 'about fifteen hours ago');
        assert.equal(timeago.inWords(new Date(24 * 60 * 60 * 1000), new Date(0)), 'a day ago');
        assert.equal(timeago.inWords(new Date(2 * 24 * 60 * 60 * 1000), new Date(0)), 'two days ago');
        assert.equal(timeago.inWords(new Date(7 * 24 * 60 * 60 * 1000), new Date(0)), 'seven days ago');
        assert.equal(timeago.inWords(new Date(31 * 24 * 60 * 60 * 1000), new Date(0)), 'about a month ago');
        assert.equal(timeago.inWords(new Date(62 * 24 * 60 * 60 * 1000), new Date(0)), 'two months ago');
        assert.equal(timeago.inWords(new Date(2 * 365 * 24 * 60 * 60 * 1000), new Date(0)), 'two years ago');
    });
    
    return {};

});