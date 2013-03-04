import objectsModule = module('./objects');
import storeModule = module('vendor/store');

var store = storeModule.store;

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

export var defaults = objectsModule.copy(modelData);

var storedModel = store.read('storedModel');
modelData.stored = objectsModule.nullToDefault(storedModel, objectsModule.copy(modelData.stored));

export function read() {
    return modelData;
}
export function write() {
    store.write('storedModel', modelData.stored);
}
