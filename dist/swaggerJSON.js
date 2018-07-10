"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerTemplate_1 = __importDefault(require("./swaggerTemplate"));
const utils_1 = require("./utils");
/**
 * build swagger json from apiObjects
 */
const swaggerJSON = (options = {}, apiObjects) => {
    const { title, description, version, prefix = '', swaggerOptions = {} } = options;
    const swaggerJSON = swaggerTemplate_1.default(title, description, version, swaggerOptions);
    Object.keys(apiObjects).forEach((key) => {
        const value = apiObjects[key];
        if (!Object.keys(value).includes('request')) {
            return;
        }
        const { method } = value.request;
        let { path } = value.request;
        path = utils_1.getPath(prefix, value.prefix ? `${value.prefix}${path}` : path); // 根据前缀补全path
        const summary = value.summary || '';
        const description = value.description || summary;
        const responses = value.responses || {
            200: { description: 'success' }
        };
        const { query = [], path: pathParams = [], body = [], tags, formData = [], security, deprecated } = value;
        const parameters = [...pathParams, ...query, ...formData, ...body];
        // init path object first
        if (!swaggerJSON.paths[path]) {
            swaggerJSON.paths[path] = {};
        }
        // add content type [multipart/form-data] to support file upload
        const consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;
        swaggerJSON.paths[path][method] = {
            consumes,
            summary,
            description,
            parameters,
            responses,
            tags,
            security,
            deprecated
        };
    });
    return swaggerJSON;
};
exports.swaggerJSON = swaggerJSON;
exports.default = swaggerJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlckpTT04uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc3dhZ2dlckpTT04udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBcUM7QUFDckMsbUNBQWtDO0FBQ2xDOztHQUVHO0FBQ0gsTUFBTSxXQUFXLEdBQUcsQ0FBQyxVQUFpQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUU7SUFDdEUsTUFBTSxFQUNKLEtBQUssRUFDTCxXQUFXLEVBQ1gsT0FBTyxFQUNQLE1BQU0sR0FBRyxFQUFFLEVBQ1gsY0FBYyxHQUFHLEVBQUUsRUFDcEIsR0FBRyxPQUFPLENBQUM7SUFDWixNQUFNLFdBQVcsR0FBRyx5QkFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDdEMsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLEdBQUcsZUFBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYTtRQUNyRixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQztRQUNqRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxJQUFJO1lBQ25DLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUU7U0FDaEMsQ0FBQztRQUNGLE1BQU0sRUFDSixLQUFLLEdBQUcsRUFBRSxFQUNWLElBQUksRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUNyQixJQUFJLEdBQUcsRUFBRSxFQUNULElBQUksRUFDSixRQUFRLEdBQUcsRUFBRSxFQUNiLFFBQVEsRUFDUixVQUFVLEVBQ1gsR0FBRyxLQUFLLENBQUM7UUFFVixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFbkUseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzlCO1FBRUQsZ0VBQWdFO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUUzRSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHO1lBQ2hDLFFBQVE7WUFDUixPQUFPO1lBQ1AsV0FBVztZQUNYLFVBQVU7WUFDVixTQUFTO1lBQ1QsSUFBSTtZQUNKLFFBQVE7WUFDUixVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBR08sa0NBQVc7QUFEcEIsa0JBQWUsV0FBVyxDQUFDIn0=