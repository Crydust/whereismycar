/*jslint browser: true */
/*global define: false */
define(['promises-a', 'json3'], function (defer, JSON3) {
    'use strict';

    var win = window;
    var NOOP = function () {};

    function createRequest() {
        if (win.XMLHttpRequest) {
            return new win.XMLHttpRequest();
        } else if (win.ActiveXObject) {
            try {
                return new win.ActiveXObject('Microsoft.XMLHTTP');
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
                    win.clearTimeout(timeoutid);
                    request.onreadystatechange = NOOP;
                    deferred.fulfill(request.responseText);
                }
            };
            timeoutid = win.setTimeout(timeoutHandler, 5000);
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
        var deferred = defer();
        try {
            deferred.fulfill(JSON3.parse(text));
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }
    
    function getJson(url) {
        return getText(url).then(parseJson);
    }
    
//TODO timeout
    var uniq = 0;
    function getJsonp(url) {
        uniq++;
        var deferred = defer(),
        callbackname = 'jsonpcallbackb_' + (+new Date()) + '_' + uniq,
        re = /([\?&]callback=)\?/;
        if (re.test(url)) {
            var callback = function (val) {
                win[callbackname] = null;
                deferred.fulfill(val);
            };
            win[callbackname] = callback;
            url = url.replace(re, '$1' + callbackname);
            var script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.async = true;
            document.getElementsByTagName('head')[0].appendChild(script);
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