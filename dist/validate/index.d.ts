import { Expect } from './check';
export interface ExpectObject {
    [key: string]: Expect;
}
export interface Input {
    [key: string]: any;
}
export default function (rawInput: Input, expect: ExpectObject): Input;
