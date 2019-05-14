"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const globby_1 = __importDefault(require("globby"));
const is_type_of_1 = __importDefault(require("is-type-of"));
// eg. /api/{id} -> /api/:id
const convertPath = (path) => {
    const re = new RegExp('{(.*?)}', 'g');
    return path.replace(re, ':$1');
};
exports.convertPath = convertPath;
const getPath = (prefix, path) => `${prefix}${path}`.replace('//', '/');
exports.getPath = getPath;
const reservedMethodNames = [
    'middlewares',
    'name',
    'constructor',
    'length',
    'prototype',
    'parameters',
    'prefix',
];
exports.reservedMethodNames = reservedMethodNames;
var allowedMethods;
(function (allowedMethods) {
    allowedMethods["GET"] = "get";
    allowedMethods["POST"] = "post";
    allowedMethods["PUT"] = "put";
    allowedMethods["PATCH"] = "patch";
    allowedMethods["DELETE"] = "delete";
})(allowedMethods || (allowedMethods = {}));
exports.allowedMethods = allowedMethods;
const getFilepaths = (dir, recursive = true) => {
    const paths = recursive
        ? globby_1.default.sync(['**/*.js', '**/*.ts'], { cwd: dir })
        : globby_1.default.sync(['*.js', '*.ts'], { cwd: dir });
    return paths.map(path => path_1.default.join(dir, path));
};
exports.getFilepaths = getFilepaths;
const loadModule = (filepath) => {
    const obj = require(filepath);
    if (!obj)
        return obj;
    // it's es module
    if (obj.__esModule)
        return 'default' in obj ? obj.default : obj;
    return obj;
};
const loadClass = (filepath) => {
    const cls = loadModule(filepath);
    if (is_type_of_1.default.class(cls))
        return cls;
    return false;
};
exports.loadClass = loadClass;
const loadSwaggerClasses = (dir = '', options = {}) => {
    dir = path_1.default.resolve(dir);
    const { recursive = true } = options;
    return getFilepaths(dir, recursive)
        .map(filepath => loadClass(filepath))
        .filter(cls => cls);
};
exports.loadSwaggerClasses = loadSwaggerClasses;
const swaggerKeys = (className, methods) => methods.map(m => `${className}- ${m}`);
exports.swaggerKeys = swaggerKeys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBeUI7QUFDekIsb0RBQTRCO0FBQzVCLDREQUE0QjtBQUU1Qiw0QkFBNEI7QUFDNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUNuQyxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxDQUFDLENBQUM7QUF1REEsa0NBQVc7QUFyRGIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FDL0MsR0FBRyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQXFEdEMsMEJBQU87QUFuRFQsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixhQUFhO0lBQ2IsTUFBTTtJQUNOLGFBQWE7SUFDYixRQUFRO0lBQ1IsV0FBVztJQUNYLFlBQVk7SUFDWixRQUFRO0NBQ1QsQ0FBQztBQStDQSxrREFBbUI7QUE3Q3JCLElBQUssY0FNSjtBQU5ELFdBQUssY0FBYztJQUNqQiw2QkFBVSxDQUFBO0lBQ1YsK0JBQVksQ0FBQTtJQUNaLDZCQUFVLENBQUE7SUFDVixpQ0FBYyxDQUFBO0lBQ2QsbUNBQWdCLENBQUE7QUFDbEIsQ0FBQyxFQU5JLGNBQWMsS0FBZCxjQUFjLFFBTWxCO0FBd0NDLHdDQUFjO0FBdENoQixNQUFNLFlBQVksR0FBRyxDQUFDLEdBQVcsRUFBRSxZQUFxQixJQUFJLEVBQUUsRUFBRTtJQUM5RCxNQUFNLEtBQUssR0FBRyxTQUFTO1FBQ3JCLENBQUMsQ0FBQyxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNuRCxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQztBQTZCQSxvQ0FBWTtBQTNCZCxNQUFNLFVBQVUsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUN0QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLEdBQUc7UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUNyQixpQkFBaUI7SUFDakIsSUFBSSxHQUFHLENBQUMsVUFBVTtRQUFFLE9BQU8sU0FBUyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2hFLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDckMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLElBQUksb0JBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQUUsT0FBTyxHQUFHLENBQUM7SUFDOUIsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFnQkEsOEJBQVM7QUFkWCxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUUsVUFBaUMsRUFBRSxFQUFFLEVBQUU7SUFDbkYsR0FBRyxHQUFHLGNBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsTUFBTSxFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDckMsT0FBTyxZQUFZLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQztTQUNoQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBU0EsZ0RBQWtCO0FBUHBCLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBaUIsRUFBRSxPQUFpQixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQVVuRyxrQ0FBVyJ9