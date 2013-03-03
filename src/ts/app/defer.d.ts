///<reference path="../vendor/promises-a.d.ts" />
/*
This is a dummy file, which compiles to nothingness and is replaced by the js file in the same folder.
I realise that is lame, but I need to move on.
*/

interface Deferred {
    promise: Promise;
    resolve(value: any): any;
    reject(error: any);
}

interface Promise {
    then(callback: Function, errback?: Function): Promise;
    done(callback: Function, errback?: Function): Promise;
    valueOf(): any;
}

interface DeferredStatic {
    (): Deferred;
}

export declare var defer:DeferredStatic;
