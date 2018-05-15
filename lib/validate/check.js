import is from 'is-type-of';
import _ from 'ramda';

const cRequired = (input, expect = {}) => {
  if (expect.required && input === undefined) {
    return { is: false };
  }
  return { is: true, val: input };
};

const cDefault = (input, expect = {}) =>
  expect.default !== undefined && input === undefined ? { is: true, val: expect.default } : { is: true, val: input };

const cString = (val, expect) => {
  if (!cRequired(val, expect).is) return { is: false };
  return typeof val === 'string' ? ({ is: true, val: String(val) }) : { is: false };
};

const cNum = (val, expect) => {
  if (!cRequired(val, expect).is) return { is: false };
  return isNaN(Number(val)) ? { is: false } : { is: true, val: Number(val) };
};

const cBool = (val, expect) => {
  if (!cRequired(val, expect).is) return { is: false };
  const cond = _.cond([
    [_.equals('true'), _.always({ is: true, val: true })],
    [_.equals('false'), _.always({ is: true, val: false })],
    [_.always(true), _.always({ is: (typeof val) === 'boolean', val })]
  ]);
  return cond(val);
};
/**
 * 对 Object 做检验, 支持嵌套数据
 * @param {Object} input
 * @param {Object} expect
{
  aaaa: 'hh',
  bbbb: 'qq',
}
{ // expect:
  type: 'object',
  properties: {
    aaaa: { type: 'string', example: 'http://www.baidu.com', required: true },
    bbbb: { type: 'string', example: 'Bob' }
    c: { type: 'object', properties: {ii: {type: 'string'}, jj: {type: 'number'}} }

  }
}
 */
const cObject = (input, expect = {}) => {
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

/**
 * TODO
 * @param {*} input
 * @param {*} expect
{
  type: 'array', required: true, items: 'string', example: ['填写内容']
}
 */
const cArray = (input, expect) => {
  if (!cRequired(input, expect).is) return { is: false };
  const res = { is: true, val: input };

  if (!Array.isArray(input)) {
    return { is: false };
  }
  if (!expect.items) {
    return res;
  }

  // TODO items 字段为一个对象的情况, 验证该对象内的字段
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
    const check = func => () => input.length === input.filter(item => func(item)).length;

    const cond = _.cond([
      [_.equals('string'), check(is.string)],
      [_.equals('boolean'), check(is.boolean)],
      [_.equals('number'), check(is.number)],
      [_.equals('object'), check(is.object)],
      [_.equals('array'), check(is.array)],
      [_.always(true), true],
    ]);

    return { is: cond(expect.items), val: input };
  }

  return res;
};

const check = (input, expect) => {
  const cond = _.cond([
    [_.equals('string'), () => cString(input, expect)],
    [_.equals('boolean'), () => cBool(input, expect)],
    [_.equals('number'), () => cNum(input, expect)],
    [_.equals('object'), () => cObject(input, expect)],
    [_.equals('array'), () => cArray(input, expect)],
    [_.always(true), () => ({ is: true })],
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
  check,
};
export default Checker;
