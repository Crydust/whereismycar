/*jslint browser: true, vars: true */
/*global define: false */

define(['./util', 'signals'], function (util, Signal) {
    'use strict';

    var capitalizeFirstLetter = util.capitalizeFirstLetter;
    var betterTypeof = util.betterTypeof;

    function Property(obj, name, signal, fullName) {
        this.obj = obj;
        this.name = name;
        this.signal = signal;
        this.fullName = fullName || name;
    }
    Property.prototype.get = function () {
        return this.obj[this.name];
    };
    Property.prototype.set = function (val) {
        this.obj[this.name] = val;
        this.signal.dispatch(this.fullName);
    };

    function createApi(model, changed) {
        /*jslint maxdepth: 7, maxcomplexity: 6 */
        var api = {};
        var obj;
        var fullName;
        for (var name in model) {
            if (model.hasOwnProperty(name)) {
                if (betterTypeof(model[name]) === 'object') {
                    for (var subname in model[name]) {
                        if (!model[name].hasOwnProperty(subname)) {
                            obj = model[name];
                            fullName = name + capitalizeFirstLetter(subname);
                            api[fullName] = new Property(obj, subname, changed, fullName);
                        }
                    }
                } else {
                    obj = model;
                    api[fullName] = new Property(obj, name, changed);
                }
            }
        }
        return api;
    }

    var model = {
        'current': {
            'timestamp': null,
            'latitude': null,
            'longitude': null,
            'accuracy': null,
            'address': null,
            'img': null
        },
        'stored': {
            'timestamp': null,
            'latitude': null,
            'longitude': null,
            'accuracy': null,
            'address': null,
            'img': null
        },
        'distance': null, //m
        'bearing': null, //deg
        'heading': null, //deg
        'compass': null, //compass heading deg
        'updateViewCount': 0,
        'updateImageCount': 0,
        'updateAdressCount': 0
    };

    var changed = new Signal();

    return createApi(model, changed);
});