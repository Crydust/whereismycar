define(function (require) {
    'use strict';

    var objectsModule = require('./objects');
    var store = require('vendor/store');

    var modelData = {
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
        'distance': null,
        'bearing': null,
        'heading': null,
        'compass': null,
        'updateViewCount': 0,
        'updateImageCount': 0,
        'updateAdressCount': 0,
        'status': ''
    };

    var defaults = objectsModule.copy(modelData);

    var storedModel = store.get('storedModel');
    modelData.stored = objectsModule.nullToDefault(storedModel, objectsModule.copy(modelData.stored));

    function read() {
        return modelData;
    }
    function write() {
        store.set('storedModel', modelData.stored);
    }

    return {
        defaults: defaults,
        read: read,
        write: write
    };

});