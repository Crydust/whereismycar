interface IPromise {
	done(onDone: () => void): IPromise;
	then(onDone: () => void, onFail: () => void): IPromise;
    valueOf(): any;
}

interface IDeferred extends IPromise {
    reject(...args: any[]): void;
    resolve(...args: any[]): void;
    promise: IPromise;
}

export function defer():IDeferred {};