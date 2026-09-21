import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList';
/**
 * Simulate the behaviour of the DOMTokenList Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
export declare class DOMTokenListService implements PseudoDOMTokenList {
    private tokens;
    private readonly onChange;
    /**
     * @param {string} [value=''] The space separated tokens to start with
     * @param {function(string): void} [onChange] Called with the new value whenever the tokens change
     * @constructor
     */
    constructor(value?: string, onChange?: (value: string) => void);
    private static parse;
    private update;
    private static validate;
    get length(): number;
    get value(): string;
    set value(value: string);
    item(index: number): string | null;
    contains(token: string): boolean;
    add(...tokens: string[]): void;
    remove(...tokens: string[]): void;
    replace(oldToken: string, newToken: string): boolean;
    supports(token: string): boolean;
    toggle(token: string, force?: boolean): boolean;
    entries(): Iterator<[number, string]>;
    forEach(callback: Function, thisArg?: any): void;
    keys(): Iterator<number>;
    values(): Iterator<string>;
}
