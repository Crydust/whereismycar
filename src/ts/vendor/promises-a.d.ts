// Type definitions for promisses-a
// Project: https://github.com/ForbesLindesay/promises-a
// Definitions by: Kristof Neirynck
// Definitions: https://github.com/borisyankov/DefinitelyTyped  


interface PromiseA {
    then(callback: Function, errback?: Function): PromiseA;
    done(callback: Function, errback?: Function): PromiseA;
    valueOf(): any;
}

interface DeferredA {
    promise: PromiseA;
    fulfill(value: any): any;
    reject(error: any);
}

interface DeferredStaticA {
    (): DeferredA;
}

declare var promise: DeferredStaticA;
export declare var promise: DeferredStaticA;