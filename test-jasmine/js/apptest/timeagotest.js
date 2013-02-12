define(['app/timeago'], function(timeago) {

    describe('Timeago.inWords, formatting past time', function() {
        it('should deal with nulls', function() {
            expect(timeago.inWords(null)).toBeNull();
        });
        it('should return less than a minute ago', function() {
            expect(timeago.inWords(1000, new Date(0))).toBe('less than a minute ago');
        });
        it('should return less than a minute ago', function() {
            expect(timeago.inWords(new Date(1000), new Date(0))).toBe('less than a minute ago');
        });
        it('should return about a minute ago', function() {
            expect(timeago.inWords(new Date(60 * 1000), new Date(0))).toBe('about a minute ago');
        });
        it('should return two minutes ago', function() {
            expect(timeago.inWords(new Date(2 * 60 * 1000), new Date(0))).toBe('two minutes ago');
        });
        it('should return fifteen minutes ago', function() {
            expect(timeago.inWords(new Date(15 * 60 * 1000), new Date(0))).toBe('fifteen minutes ago');
        });
        it('should return about an hour ago', function() {
            expect(timeago.inWords(new Date(60 * 60 * 1000), new Date(0))).toBe('about an hour ago');
        });
        it('should return about two hours ago', function() {
            expect(timeago.inWords(new Date(2 * 60 * 60 * 1000), new Date(0))).toBe('about two hours ago');
        });
        it('should return about fifteen hours ago', function() {
            expect(timeago.inWords(new Date(15 * 60 * 60 * 1000), new Date(0))).toBe('about fifteen hours ago');
        });
        it('should return a day ago', function() {
            expect(timeago.inWords(new Date(24 * 60 * 60 * 1000), new Date(0))).toBe('a day ago');
        });
        it('should return two days ago', function() {
            expect(timeago.inWords(new Date(2 * 24 * 60 * 60 * 1000), new Date(0))).toBe('two days ago');
        });
        it('should return seven days ago', function() {
            expect(timeago.inWords(new Date(7 * 24 * 60 * 60 * 1000), new Date(0))).toBe('seven days ago');
        });
        it('should return about a month ago', function() {
            expect(timeago.inWords(new Date(31 * 24 * 60 * 60 * 1000), new Date(0))).toBe('about a month ago');
        });
        it('should return two months ago', function() {
            expect(timeago.inWords(new Date(62 * 24 * 60 * 60 * 1000), new Date(0))).toBe('two months ago');
        });
        it('should return two years ago', function() {
            expect(timeago.inWords(new Date(2 * 365 * 24 * 60 * 60 * 1000), new Date(0))).toBe('two years ago');
        });
    });
    
    return {};

});