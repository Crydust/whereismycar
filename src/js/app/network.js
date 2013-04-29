define(function (require) {
    'use strict';

    var deferModule = require('./defer');
    var JSON3 = require('vendor/json3');

    var defer = deferModule.defer;

    var NOOP = function () {};

    function createRequest() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                return new window.ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        }
        return null;
    }

    function getText(url) {
        var deferred = defer(),
        request = createRequest(),
        timeoutid;
        if (request !== null) {
            var timeoutHandler = function () {
                request.onreadystatechange = NOOP;
                request.abort();
                deferred.reject(new Error('Timed out'));
            };
            var readystatechangeHandler = function () {
                if (request.readyState === 4 && request.status === 200) {
                    window.clearTimeout(timeoutid);
                    request.onreadystatechange = NOOP;
                    deferred.resolve(request.responseText);
                }
            };
            timeoutid = window.setTimeout(timeoutHandler, 5000);
            request.onreadystatechange = readystatechangeHandler;
            request.open('GET', url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send(null);
        } else {
            deferred.reject(new Error('XMLHttpRequest unsupported'));
        }
        return deferred.promise;
    }

    function parseJson(text) {
        return JSON3.parse(text);
    }

    function getJson(url) {
        return getText(url).then(parseJson);
    }

    var uniq = 0;
    function getJsonp(url) {
        uniq++;
        var deferred = defer(),
        callbackname = 'jsonpcallbackb_' + (+new Date()) + '_' + uniq,
        re = /([\?&]callback=)\?/,
        timeoutid;
        if (re.test(url)) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            var cleanup = function () {
                window.clearTimeout(timeoutid);
                window[callbackname] = null;
                script.onerror = null;
                head.removeChild(script);
                script = null;
            };
            var timeoutHandler = function () {
                cleanup();
                deferred.reject(new Error('Timed out'));
            };
            var errorHandler = function () {
                cleanup();
                deferred.reject(new Error('Error loading jsonp'));
            };
            var callback = function (val) {
                cleanup();
                deferred.resolve(val);
            };
            script.onerror = errorHandler;
            timeoutid = window.setTimeout(timeoutHandler, 5000);
            window[callbackname] = callback;
            url = url.replace(re, '$1' + callbackname);
            script.src = url;
            script.type = 'text/javascript';
            script.async = true;
            head.appendChild(script);
        } else {
            deferred.reject(new Error('url must contain callback=?'));
        }
        return deferred.promise;
    }

    return {
        getJson: getJson,
        getJsonp: getJsonp
    };

});