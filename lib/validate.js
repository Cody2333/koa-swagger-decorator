import _ from 'ramda';

class InputError extends Error {
  /**
   * Constructor
   * @param {string} field the error field in request parameters.
   */
  constructor(field) {
    super(`incorrect field: '${field}', please check again!`);
    this.field = field;
    this.status = 400;
  }
}


const isNum = val => isNaN(Number(val)) ? { is: false } : { is: true, val: Number(val) };

/**
 * 如果输入不是string，则强制转为string
 * @param {*} val
 */
const isString = val => ['number', 'string', 'boolean'].includes(typeof val) ? ({ is: true, val: String(val) }) : { is: false };

const isObject = val => typeof val === 'object' ? { is: true, val } : { is: false };

const isBool = (val) => {
  const cond = _.cond([
    [_.equals('true'), _.always({ is: true, val: true })],
    [_.equals('false'), _.always({ is: true, val: false })],
    [_.always(true), _.always({ is: (typeof val) === 'boolean', val })]
  ]);
  const r = cond(val);
  return r;
};

/**
 * 校验 array 中 item 的类型
 * @param {Array} arr input[key]
 * @param {*} itemType itemType == expect[key].items
 */
const checkArrItem = (arr, itemType) => {
  if (!Array.isArray(arr)) {
    return false;
  }
  if (!itemType) {
    return true;
  }

  // TODO items 字段为一个对象的情况, 验证该对象内的字段
  if (isObject(itemType).is) {
    return true;
  }

  // items 字段为字符串的情况: array 中的内容如果是基本类型, 或者为object类型但不需要校验字段
  if (isString(itemType).is) {
    const check = func => () => arr.length === arr.filter(item => func(item).is).length;

    const cond = _.cond([
      [_.equals('string'), check(isString)],
      [_.equals('boolean'), check(isBool)],
      [_.equals('number'), check(isNum)],
      [_.equals('object'), check(isObject)],
      [_.always(true), false],
    ]);
    return cond(itemType);
  }

  return false;
};

const isArray = (val, expect) => {
  const is = checkArrItem(val, expect.items);
  return { is, val };
};

// dirty, alter input[key] values in this func
const checkVal = (isFunc, input, key, expect) => {
  const res = isFunc(input[key], expect);
  if (!res.is) {
    throw new InputError(key);
  }
  input[key] = res.val;
};

/**
 * validate the input values
 * @param {Object} input the input object, like request.query, request.body and so on.
 * @param {Object} expect the expect value, Ex: { name: { required: true, type: String }}
 */
export default function (input, expect) {
  Object.keys(expect).forEach((key) => {
    if (expect[key] === undefined) {
      delete input[key];
      return;
    }
    // if this key is required but not in input.
    if (expect[key].required && input[key] === undefined) {
      throw new InputError(key);
    }
    // if this key is in input, but the type is wrong
    // first check the number type
    if (input[key] !== undefined && expect[key].type === 'number') {
      checkVal(isNum, input, key);
      return;
    }
    // second check the boolean type
    if (input[key] !== undefined && expect[key].type === 'boolean') {
      checkVal(isBool, input, key);
      return;
    }
    // third check the string type
    if (input[key] !== undefined && expect[key].type === 'string') {
      checkVal(isString, input, key);
      return;
    }
    // forth check the object type
    if (input[key] !== undefined && expect[key].type === 'object') {
      checkVal(isObject, input, key);
      return;
    }
    // last check the array type
    if (input[key] !== undefined && expect[key].type === 'array') {
      checkVal(isArray, input, key, expect[key]);
      return;
    }
    // if this key is not in input and need a default value
    if (input[key] === undefined && expect[key].default !== undefined) {
      input[key] = expect[key].default;
    }
  });
  return input;
}
