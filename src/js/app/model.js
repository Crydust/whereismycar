/*jslint browser: true, vars: true */
/*global define: false */

define(['store', './objects'], function (store, objects) {
    'use strict';
    
    var nullToDefault = objects.nullToDefault;

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

    var storedModel = store.get('model');
    model = nullToDefault(storedModel, model);
    
    function getModel() {
        return model;
    }
    function storeModel() {
        store.set('model', model);
    }

    return {
        get: getModel,
        store: storeModel
    };
});