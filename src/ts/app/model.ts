import objectsModule = module('./objects');
//import store = module('vendor/store');

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
    'distance': null,
    'bearing': null,
    'heading': null,
    'compass': null,
    'updateViewCount': 0,
    'updateImageCount': 0,
    'updateAdressCount': 0,
    'status': ''
};

export var defaults = objectsModule.copy(model);

//var storedModel = store.get('storedModel');
//model.stored = objectsModule.nullToDefault(storedModel, objectsModule.copy(modelData.stored));

export function get() {
    return model;
}
export function store() {
    //store.set('storedModel', modelData.stored);
}
