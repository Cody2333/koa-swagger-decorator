
import { clone } from 'ramda';
import Checker from './check';
import { Expect } from './check';
class InputError extends Error {
  field: string;
  status: number;
  constructor(field: string) {
    super(`incorrect field: '${field}', please check again!`);
    this.field = field;
    this.status = 400;
  }
}
export interface ExpectObject {
  [key: string]: Expect;
}
export interface Input {
  [key: string]: any;
}
export default function (rawInput: Input, expect: ExpectObject) {
  // make it pure
  const input = clone(rawInput);

  Object.keys(expect).forEach((key) => {
    if (expect[key] === undefined) {
      delete input[key]; // remove unexpected key/vals.
      return;
    }

    // if this key is required but not in input.
    if (!Checker.required(input[key], expect[key]).is) {
      throw new InputError(key);
    }

    // if this key has default value
    const defaultVal = Checker.default(input[key], expect[key]).val;

    // only set default value when it is not undefined
    // avoid side effect of undefined default value
    if (defaultVal !== undefined) {
      input[key] = defaultVal;
    }

    if (input[key] === undefined) return;

    const { is, val } = Checker.check(input[key], expect[key]);

    if (!is) throw new InputError(key);

    input[key] = val;
  });
  return input;
}
