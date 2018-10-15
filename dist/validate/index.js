"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const check_1 = __importDefault(require("./check"));
class InputError extends Error {
    constructor(field) {
        super(`incorrect field: '${field}', please check again!`);
        this.field = field;
        this.status = 400;
    }
}
function default_1(rawInput, expect) {
    // make it pure
    const input = ramda_1.default.clone(rawInput);
    Object.keys(expect).forEach((key) => {
        if (expect[key] === undefined) {
            delete input[key]; // remove unexpected key/vals.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdmFsaWRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBc0I7QUFDdEIsb0RBQThCO0FBRTlCLGdCQUFpQixTQUFRLEtBQUs7SUFHNUIsWUFBWSxLQUFhO1FBQ3ZCLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQU9ELG1CQUF5QixRQUFlLEVBQUUsTUFBb0I7SUFDNUQsZUFBZTtJQUNmLE1BQU0sS0FBSyxHQUFHLGVBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNsQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyw4QkFBOEI7WUFDakQsT0FBTztTQUNSO1FBRUQsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxlQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDakQsTUFBTSxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUVELGdDQUFnQztRQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsZUFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBRTFELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVM7WUFBRSxPQUFPO1FBRXJDLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsZUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLEVBQUU7WUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5DLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUEzQkQsNEJBMkJDIn0=