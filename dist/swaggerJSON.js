"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerTemplate_1 = __importDefault(require("./swaggerTemplate"));
const utils_1 = require("./utils");
const utils_2 = require("./utils");
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
        let fixedBody = [];
        if (body && body.length) {
            fixedBody = utils_2.fixBodySchema(JSON.parse(JSON.stringify(body))) || body;
        }
        const parameters = [...pathParams, ...query, ...formData, ...fixedBody];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlckpTT04uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc3dhZ2dlckpTT04udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBcUM7QUFDckMsbUNBQWtDO0FBQ2xDLG1DQUFzQztBQUV0Qzs7R0FFRztBQUNILE1BQU0sV0FBVyxHQUFHLENBQUMsVUFBaUMsRUFBRSxFQUFFLFVBQWUsRUFBRSxFQUFFO0lBQzNFLE1BQU0sRUFDSixLQUFLLEVBQ0wsV0FBVyxFQUNYLE9BQU8sRUFDUCxNQUFNLEdBQUcsRUFBRSxFQUNYLGNBQWMsR0FBRyxFQUFFLEVBQ3BCLEdBQUcsT0FBTyxDQUFDO0lBQ1osTUFBTSxXQUFXLEdBQVEseUJBQUksQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMzRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0MsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDakMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxHQUFHLGVBQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDckYsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDcEMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUM7UUFDakQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSTtZQUNuQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFO1NBQ2hDLENBQUM7UUFDRixNQUFNLEVBQ0osS0FBSyxHQUFHLEVBQUUsRUFDVixJQUFJLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFDckIsSUFBSSxHQUFHLEVBQUUsRUFDVCxJQUFJLEVBQ0osUUFBUSxHQUFHLEVBQUUsRUFDYixRQUFRLEVBQ1IsVUFBVSxFQUNYLEdBQUcsS0FBSyxDQUFDO1FBRVYsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFBO1FBQ2xCLElBQUcsSUFBSSxJQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7WUFDbkIsU0FBUyxHQUFHLHFCQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBRSxJQUFJLENBQUE7U0FDbEU7UUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsUUFBUSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFFeEUseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzlCO1FBRUQsZ0VBQWdFO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUUzRSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHO1lBQ2hDLFFBQVE7WUFDUixPQUFPO1lBQ1AsV0FBVztZQUNYLFVBQVU7WUFDVixTQUFTO1lBQ1QsSUFBSTtZQUNKLFFBQVE7WUFDUixVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBR08sa0NBQVc7QUFEcEIsa0JBQWUsV0FBVyxDQUFDIn0=