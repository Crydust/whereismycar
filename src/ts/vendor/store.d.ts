// Type definitions for store.js
// store.js exposes a simple API for cross browser local storage
// Project: https://github.com/marcuswestin/store.js/
// Definitions by: Vincent Bortone <https://github.com/vbortone/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface StoreJSStatic {
	write(key: string, value: any): any;
	read(key: string): any;
	remove(key: string): void;
	clear(): void;
	enabled: bool;
	disabled: bool;
	transact(key: string, defaultValue: any, transactionFn?: (val: any) => void): void;
	readAll(): any;
	serialize(value: any): string;
	deserialize(value: string): any;
}

export var store:StoreJSStatic;