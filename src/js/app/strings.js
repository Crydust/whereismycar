define(function (require) {
    'use strict';

    var objects = require('./objects');

    var isArray = objects.isArray;
    var toArray = objects.toArray;

    function capitalizeFirstLetter(string) {
        if (typeof string !== 'string') {
            return null;
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * @param {string} s
     * @return {string}
     */
    function trim(s) {
        if (typeof s !== 'string') {
            return null;
        }
        return s.replace(/^\s+|\s+$/g, '');
    }

    /**
     * sprintf(format, argument_list)
     *
     * The string function like one in C/C++, PHP, Perl
     * Each conversion specification is defined as below:
     *
     * %[index][precision]type
     *
     * index        An optional index specifier that changes the order of the 
     *              arguments in the list to be displayed.
     * precision    An optional precision specifier that says how many decimal digits 
     *              should be displayed for floating-point numbers. This option has 
     *              no effect for other types than float.
     * type         A type specifier that says what type the argument data should be 
     *              treated as. Possible types:
     *
     * % - a literal percent character. No argument is required.  
     * b - the argument is treated as an integer, and presented as a binary number.
     * c - the argument is treated as an integer, and presented as the character 
     *      with that ASCII value.
     * d - the argument is treated as an integer, and presented as a decimal number.
     * u - the same as "d".
     * f - the argument is treated as a float, and presented as a floating-point.
     * o - the argument is treated as an integer, and presented as an octal number.
     * s - the argument is treated as and presented as a string.
     * x - the argument is treated as an integer and presented as a hexadecimal 
     *       number (with lowercase letters).
     * X - the argument is treated as an integer and presented as a hexadecimal 
     *       number (with uppercase letters).
     */
    function sprintf(input, args) {
        if (!isArray(args)) {
            args = toArray(arguments).slice(1);
        }
        var result = input;
        var index = 0;
        result = input.replace(/%(\d*)((?:.\d+)?)([%bcdufosxX])/g, function (match, indexOverride, precision, type) {
            if (type === '%') {
                return '%';
            }
            var value = args[index];
            if (indexOverride !== '') {
                value = args[+indexOverride];
            } else {
                index++;
            }
            var numericValue = +value;
            if (precision !== '') {
                precision = +precision.substring(1);
            } else {
                precision = 0;
            }
            var replacement = match;
            switch (type) {
            case 'b':
                replacement = Math.round(numericValue).toString(2);
                break;
            case 'c':
                replacement = String.fromCharCode(numericValue);
                break;
            case 'd':
            case 'u':
                replacement = Math.round(numericValue);
                break;
            case 'f':
                replacement = (numericValue).toFixed(precision);
                break;
            case 'o':
                replacement = Math.round(numericValue).toString(8);
                break;
            case 's':
                replacement = value;
                break;
            case 'x':
                replacement = Math.round(numericValue).toString(16).toLowerCase();
                break;
            case 'X':
                replacement = Math.round(numericValue).toString(16).toUpperCase();
                break;
            }
            return replacement;
        });

        return result;
    }

    return {
        capitalizeFirstLetter: capitalizeFirstLetter,
        trim: trim,
        sprintf: sprintf
    };

});
