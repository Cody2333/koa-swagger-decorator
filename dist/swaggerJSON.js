"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
    const paths = {};
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
        const { query = [], header = [], path: pathParams = [], body = [], order, tags, formData = [], security, deprecated } = value;
        const parameters = [...pathParams, ...query, ...header, ...formData, ...body];
        // init path object first
        if (!paths[path]) {
            paths[path] = {};
        }
        // add content type [multipart/form-data] to support file upload
        const consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;
        paths[path][method] = {
            consumes,
            summary,
            description,
            parameters,
            responses,
            tags,
            security,
            deprecated
        };
        if (!paths[path]._order) {
            paths[path]._order = order;
        }
    });
    swaggerJSON.paths = utils_1.sortObject(paths, (path, length) => path._order || length, (path) => {
        const { _order } = path, restOfPathData = __rest(path, ["_order"]);
        return restOfPathData;
    });
    return swaggerJSON;
};
exports.swaggerJSON = swaggerJSON;
exports.default = swaggerJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlckpTT04uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc3dhZ2dlckpTT04udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3RUFBcUM7QUFDckMsbUNBQThDO0FBRTlDOztHQUVHO0FBQ0gsTUFBTSxXQUFXLEdBQUcsQ0FBQyxVQUFpQyxFQUFFLEVBQUUsVUFBZSxFQUFFLEVBQUU7SUFDM0UsTUFBTSxFQUNKLEtBQUssRUFDTCxXQUFXLEVBQ1gsT0FBTyxFQUNQLE1BQU0sR0FBRyxFQUFFLEVBQ1gsY0FBYyxHQUFHLEVBQUUsRUFDcEIsR0FBRyxPQUFPLENBQUM7SUFDWixNQUFNLFdBQVcsR0FBUSx5QkFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sS0FBSyxHQUF3QyxFQUFFLENBQUM7SUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN0QyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNDLE9BQU87U0FDUjtRQUVELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksR0FBRyxlQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ3JGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3BDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDO1FBQ2pELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUk7WUFDbkMsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRTtTQUNoQyxDQUFDO1FBQ0YsTUFBTSxFQUNKLEtBQUssR0FBRyxFQUFFLEVBQ1YsTUFBTSxHQUFHLEVBQUUsRUFDWCxJQUFJLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFDckIsSUFBSSxHQUFHLEVBQUUsRUFDVCxLQUFLLEVBQ0wsSUFBSSxFQUNKLFFBQVEsR0FBRyxFQUFFLEVBQ2IsUUFBUSxFQUNSLFVBQVUsRUFDWCxHQUFHLEtBQUssQ0FBQztRQUVWLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxVQUFVLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUU5RSx5QkFBeUI7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2xCO1FBRUQsZ0VBQWdFO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUUzRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUc7WUFDcEIsUUFBUTtZQUNSLE9BQU87WUFDUCxXQUFXO1lBQ1gsVUFBVTtZQUNWLFNBQVM7WUFDVCxJQUFJO1lBQ0osUUFBUTtZQUNSLFVBQVU7U0FDWCxDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDNUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILFdBQVcsQ0FBQyxLQUFLLEdBQUcsa0JBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3RGLE1BQU0sRUFBRSxNQUFNLEtBQXVCLElBQUksRUFBekIseUNBQXlCLENBQUM7UUFDMUMsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFHTyxrQ0FBVztBQURwQixrQkFBZSxXQUFXLENBQUMifQ==