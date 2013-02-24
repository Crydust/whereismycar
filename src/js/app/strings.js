define([], function () {
    'use strict';
    
    function capitalizeFirstLetter(string) {
        if (typeof string !== 'string') {
            return null;
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        'capitalizeFirstLetter': capitalizeFirstLetter
    };
    
});