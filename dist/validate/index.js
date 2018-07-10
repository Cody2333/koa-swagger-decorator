"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = __importDefault(require("./check"));
class InputError extends Error {
    constructor(field) {
        super(`incorrect field: '${field}', please check again!`);
        this.field = field;
        this.status = 400;
    }
}
function default_1(input, expect) {
    Object.keys(expect).forEach((key) => {
        if (expect[key] === undefined) {
            delete input[key];
            return;
        }
        // if this key is required but not in input.
        if (!check_1.default.required(input[key], expect[key]).is) {
            throw new InputError(key);
        }
        // if this key has default value
        input[key] = check_1.default.default(input[key], expect[key]).val;
        if (input[key] === undefined)
            return;
        const { is, val } = check_1.default.check(input[key], expect[key]);
        if (!is)
            throw new InputError(key);
        input[key] = val;
    });
    return input;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map