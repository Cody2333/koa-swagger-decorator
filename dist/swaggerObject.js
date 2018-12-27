"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * used for building swagger docs object
 */
const is_type_of_1 = __importDefault(require("is-type-of"));
const ramda_1 = __importDefault(require("ramda"));
const utils_1 = require("./utils");
class SwaggerObject {
    constructor() {
        this.data = {};
    }
    add(target, name, content) {
        if (!is_type_of_1.default.object(content)) {
            throw new Error('illegal params [content] for SwaggerObject.add');
        }
        // when using non-static method decorators
        // target will be class.prototype rather than class
        // hack and make target always be class itself
        if (!target.prototype && target.constructor) {
            target = target.constructor;
        }
        const key = `${target.name}-${name}`;
        if (!this.data[key])
            this.data[key] = {};
        // merge class decorator and method decorator if it is an array
        // eg. query parameters, tag paramemters
        Object.keys(content).forEach((k) => {
            if (is_type_of_1.default.array(this.data[key][k])) {
                this.data[key][k] = [...this.data[key][k], ...content[k]];
                if (this.data[key][k].length === 0)
                    return;
                this.data[key][k] = is_type_of_1.default.object(this.data[key][k][0]) ?
                    ramda_1.default.uniqBy((o) => o.name, this.data[key][k])
                    : ramda_1.default.uniq(this.data[key][k]);
            }
            else {
                Object.assign(this.data[key], { [k]: content[k] });
            }
        });
    }
    // only add to methods with a @request decorator
    addMulti(target, content, filters = ['ALL']) {
        const staticMethods = Object.getOwnPropertyNames(target)
            .filter(method => !utils_1.reservedMethodNames.includes(method));
        const methods = Object.getOwnPropertyNames(target.prototype)
            .filter(method => !utils_1.reservedMethodNames.includes(method));
        [...staticMethods, ...methods].forEach((name) => {
            const key = `${target.name}-${name}`;
            if (!this.data[key] || !this.data[key].request)
                return;
            filters = filters.map(i => i.toLowerCase());
            if (filters.includes('all') ||
                filters.includes(this.data[key].request.method)) {
                this.add(target, name, content);
            }
        });
    }
}
const swaggerObject = new SwaggerObject();
exports.default = swaggerObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlck9iamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9zd2FnZ2VyT2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0REFBNEI7QUFDNUIsa0RBQXNCO0FBQ3RCLG1DQUE4QztBQVE5QyxNQUFNLGFBQWE7SUFJakI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQVcsRUFBRSxJQUFZLEVBQUUsT0FBWTtRQUN6QyxJQUFJLENBQUMsb0JBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsMENBQTBDO1FBQzFDLG1EQUFtRDtRQUNuRCw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUMzQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUM3QjtRQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV6QywrREFBK0Q7UUFDL0Qsd0NBQXdDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDakMsSUFBSSxvQkFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUFFLE9BQU87Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsb0JBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELGVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFELENBQUMsQ0FBQyxlQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3QjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDcEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnREFBZ0Q7SUFDaEQsUUFBUSxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ25ELE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7YUFDckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzthQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRTNELENBQUUsR0FBRyxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoRCxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUN2RCxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLElBQ0UsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZCLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQy9DO2dCQUNBLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNqQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUUxQyxrQkFBZSxhQUFhLENBQUMifQ==