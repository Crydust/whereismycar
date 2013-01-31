define(['./defer', 'json3', './again'], function (defer, JSON3, again) {
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
                    deferred.resolve(request.responseText);
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
            deferred.resolve(JSON3.parse(text));
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
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
                win.clearTimeout(timeoutid);
                win[callbackname] = null;
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
            timeoutid = win.setTimeout(timeoutHandler, 5000);
            win[callbackname] = callback;
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
        //>>excludeStart("prod", pragmas.prod);
        getJsonp: again(getJsonp),
        //>>excludeEnd("prod");
        getJson: again(getJson)
    };
});