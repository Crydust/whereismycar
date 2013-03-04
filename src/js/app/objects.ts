/**
 * @param {*|null} theValue
 * @param {*} theDefault
 */
export function nullToDefault(theValue:any, theDefault:any = 'Unknown'):any {
    if (theValue === null || theValue === undefined ||
            (typeof theValue === 'number' && isNaN(theValue))) {
        return theDefault;
    } else {
        return theValue;
    }
}

var EMPY_OBJECT = {};
export function betterTypeof(obj:any):string {
    if (obj === null) {
        return 'null';
    }
    if (obj === undefined) {
        return 'undefined';
    }
    return EMPY_OBJECT.toString.call(obj).slice(8, -1).toLowerCase();
}

export function copy(obj:any):any {
    var result = null;
    switch (betterTypeof(obj)) {
    case 'null':
        result = null;
        break;
    case 'undefined':
        result = undefined;
        break;
    case 'object':
        result = {};
        for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
                result[n] = copy(obj[n]);
            }
        }
        break;
    case 'array':
        result = [];
        for (var i = 0, leni = obj.length; i < leni; i++) {
            result[i] = copy(obj[i]);
        }
        break;
    case 'number':
        result = + obj;
        break;
    case 'boolean':
        result = !! obj;
        break;
    case 'string':
        result = '' + obj;
        break;
    }
    return result;
}
