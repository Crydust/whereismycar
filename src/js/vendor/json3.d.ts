export function parse(text: string, reviver?: (key: any, value: any) => any): any;
export function stringify(value: any): string;
export function stringify(value: any, replacer: (key: string, value: any) => any): string;
export function stringify(value: any, replacer: any[]): string;
export function stringify(value: any, replacer: (key: string, value: any) => any, space: any): string;
export function stringify(value: any, replacer: any[], space: any): string;
