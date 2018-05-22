import Checker from './check';

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
