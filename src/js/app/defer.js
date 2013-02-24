//20.994 bytes
define(['promises-a'], function (defer) {
    'use strict';
    function deferWithResolve() {
        var result = defer();
        result.resolve = result.fulfill;
        return result;
    }
    return deferWithResolve;
});
/*
//32.138 bytes
define(['q'], function (q) {
    'use strict';
    return q.defer;
});
*/
/*
//23.634 bytes
define(['when'], function (when) {
    'use strict';
    return when.defer;
});
*/