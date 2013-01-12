/*jslint browser: true, vars: true */
/*global define: false */

define([], function () {
    'use strict';
    
    // copied from timeago
    
    var strings = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'ago',
        suffixFromNow: 'from now',
        seconds: 'less than a minute',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years',
        wordSeparator: ' ',
        numbers: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'forty', 'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine', 'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty']
    };

    /**
     * replace %d in a string by a number
     * @param {string} s
     * @param {number} n
     * @return {string}
     */
    function substitute(s, n) {
        var value = strings.numbers[n] || n;
        return s.replace(/%d/i, value);
    }

    /**
     * difference between a date and now
     * @param {Date} date
     * @return {number} milliseconds
     */
    function distance(date) {
        if (date === null) {
            return null;
        }
        return (new Date().getTime() - date.getTime());
    }

    /**
     * @param {string} s
     * @return {string}
     */
    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }
    
    /**
     * @param {Date|number} timestamp
     * @return {string}
     */
    function inWords(timestamp) {
        var date;
        if (timestamp === null) {
            return null;
        } else if (typeof timestamp === 'number') {
            date = new Date(timestamp);
        } else {
            date = timestamp;
        }
        var distanceMillis = distance(date);
    
        var prefix = strings.prefixAgo;
        var suffix = strings.suffixAgo;

        var seconds = Math.abs(distanceMillis) / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        var words = (seconds < 45 && substitute(strings.seconds, Math.round(seconds))) ||
            (seconds < 90 && substitute(strings.minute, 1)) ||
            (minutes < 45 && substitute(strings.minutes, Math.round(minutes))) ||
            (minutes < 90 && substitute(strings.hour, 1)) ||
            (hours < 24 && substitute(strings.hours, Math.round(hours))) ||
            (hours < 42 && substitute(strings.day, 1)) ||
            (days < 30 && substitute(strings.days, Math.round(days))) ||
            (days < 45 && substitute(strings.month, 1)) ||
            (days < 365 && substitute(strings.months, Math.round(days / 30))) ||
            (years < 1.5 && substitute(strings.year, 1)) ||
            substitute(strings.years, Math.round(years));

        return trim([prefix, words, suffix].join(strings.wordSeparator));
    }
    

    return {
        'inWords': inWords
    };
    
});