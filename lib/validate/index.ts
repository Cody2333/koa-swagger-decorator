import _ from 'ramda';
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

export default function (rawInput: any, expect: Expect) {
  const input = _.clone(rawInput); // 不修改原生 query body params 对象
  Object.keys(expect).forEach((key) => {
    if (expect[key] === undefined) {
      delete input[key];
      return;
    }
    // if this key is required but not in input.
    if (!Checker.required(input[key], expect[key]).is) {
      throw new InputError(key);
    }

    // if this key has default value
    input[key] = Checker.default(input[key], expect[key]).val;

    if (input[key] === undefined) return;

    const { is, val } = Checker.check(input[key], expect[key]);

    if (!is) throw new InputError(key);

    input[key] = val;
  });
  return input;
}
