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
    const input = ramda_1.default.clone(rawInput); // 不修改原生 query body params 对象
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdmFsaWRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBc0I7QUFDdEIsb0RBQThCO0FBRTlCLGdCQUFpQixTQUFRLEtBQUs7SUFHNUIsWUFBWSxLQUFhO1FBQ3ZCLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQUVELG1CQUF5QixRQUFhLEVBQUUsTUFBYztJQUNwRCxNQUFNLEtBQUssR0FBRyxlQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsNkJBQTZCO0lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbEMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE9BQU87U0FDUjtRQUNELDRDQUE0QztRQUM1QyxJQUFJLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2pELE1BQU0sSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7UUFFRCxnQ0FBZ0M7UUFDaEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGVBQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUUxRCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTO1lBQUUsT0FBTztRQUVyQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxFQUFFO1lBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBeEJELDRCQXdCQyJ9