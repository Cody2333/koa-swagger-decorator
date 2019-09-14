import is from 'is-type-of';
import _ from 'ramda';

export interface Expect {
  required?: boolean;
  enum?: any[];
  default?: any;
  properties?: any;
  [name: string]: any;
}

const cRequired = (input: any, expect: Expect = {}) => {
  if (expect.required && input === undefined) {
    return { is: false };
  }
  return { is: true, val: input };
};

const cNullable = (input: any, expect: Expect = {}) => {
  if (expect.nullable && is.null(input)) {
    return { is: true, val: input};
  }
  return { is: false, val: input };
};

const cEnum = (input: any, expect: Expect = {}) => {
  if (Array.isArray(expect.enum) && expect.enum.length) {
    return expect.enum.includes(input)
      ? { is: true, val: input }
      : { is: false };
  }
  return { is: true, val: input };
};

const cDefault = (input: any, expect: Expect = {}) =>
  expect.default !== undefined && input === undefined
    ? { is: true, val: expect.default }
    : { is: true, val: input };

const cString = (val: any, expect: Expect) => {
  if (!cRequired(val, expect).is) return { is: false };
  if (expect.enum && !cEnum(val, expect).is) return { is: false };
  return typeof val === 'string'
    ? { is: true, val: String(val) }
    : { is: false };
};

const cNum = (val: any, expect: Expect) => {
  if (!cRequired(val, expect).is) return { is: false };
  if (expect.enum && !cEnum(Number(val), expect).is) return { is: false };
  return isNaN(Number(val)) || val === '' ? { is: false } : { is: true, val: Number(val) };
};

const cBool = (val: any, expect: Expect) => {
  if (!cRequired(val, expect).is) return { is: false };
  const cond = _.cond([
    [_.equals('true'), _.always({ is: true, val: true })],
    [_.equals('false'), _.always({ is: true, val: false })],
    [_.T, _.always({ is: typeof val === 'boolean', val })]
  ]);
  return cond(val);
};
// /**
//  * 对 Object 做检验, 支持嵌套数据
// {
//   aaaa: 'hh',
//   bbbb: 'qq',
// }
// { // expect:
//   type: 'object',
//   properties: {
//     aaaa: { type: 'string', example: 'http://www.baidu.com', required: true },
//     bbbb: { type: 'string', example: 'Bob' }
//     c: { type: 'object', properties: {ii: {type: 'string'}, jj: {type: 'number'}} }

//   }
// }
//  */
const cObject = (input: any, expect: Expect = {}) => {
  if (!cRequired(input, expect).is) return { is: false };

  const res = { is: true, val: input };
  if (!is.object(input)) return { is: false };
  if (!expect.properties) return res;

  for (const key of Object.keys(expect.properties)) {
    // ignore empty key if not required
    if (!expect.properties[key].required && input[key] === undefined) {
      continue; // eslint-disable-line
    }
    const { is, val } = check(input[key], expect.properties[key]);
    if (!is) {
      console.log('error object properties:', key); // TODO need to update error debug info
      res.is = false;
      break;
    }
    input[key] = is ? val : input[key];
  }
  return res;
};


// {
//   type: 'array', required: true, items: 'string', example: ['填写内容']
// }
const cArray = (input: any, expect: Expect) => {
  if (!cRequired(input, expect).is) return { is: false };
  const res = { is: true, val: input };

  if (!Array.isArray(input)) {
    return { is: false };
  }
  if (!expect.items) {
    return res;
  }

  // items 字段为一个对象的情况, 验证该对象内的字段
  if (is.object(expect.items)) {
    for (const item of input) {
      const { is } = check(item, expect.items);
      if (!is) {
        res.is = false;
        return res;
      }
    }
  }

  // items 字段为字符串的情况: array 中的内容是基本类型, 或者为object|array类型但不需要校验内部字段
  if (is.string(expect.items)) {
    const check: Function = (func: Function) => () =>
      input.length === input.filter(item => func(item)).length;

    const cond = _.cond([
      [_.equals('string'), check(is.string)],
      [_.equals('boolean'), check(is.boolean)],
      [_.equals('number'), check(is.number)],
      [_.equals('object'), check(is.object)],
      [_.equals('array'), check(is.array)],
      [_.T, true]
    ]);

    return { is: cond(expect.items), val: input };
  }

  return res;
};

const check = (input: any, expect: Expect) => {
  // 添加对body参数 nullable 情况的支持
  const r = cNullable(input, expect);
  if (r.is === true) return r;
  const cond = _.cond([
    [_.equals('string'), () => cString(input, expect)],
    [_.equals('boolean'), () => cBool(input, expect)],
    [_.equals('number'), () => cNum(input, expect)],
    [_.equals('object'), () => cObject(input, expect)],
    [_.equals('array'), () => cArray(input, expect)],
    [_.T, () => ({ is: true, val: input })] // 其他类型不做校验，直接返回原数据
  ]);

  return cond(expect.type);
};
const Checker = {
  required: cRequired,
  object: cObject,
  string: cString,
  num: cNum,
  bool: cBool,
  default: cDefault,
  array: cArray,
  check
};
export default Checker;
