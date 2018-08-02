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
    'parameters'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBeUI7QUFDekIsb0RBQTRCO0FBQzVCLDREQUE0QjtBQUU1Qiw0QkFBNEI7QUFDNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUNuQyxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFtREEsa0NBQVc7QUFqRGIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FDL0MsR0FBRyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQWlEdEMsMEJBQU87QUEvQ1QsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixhQUFhO0lBQ2IsTUFBTTtJQUNOLGFBQWE7SUFDYixRQUFRO0lBQ1IsV0FBVztJQUNYLFlBQVk7Q0FDYixDQUFDO0FBNENBLGtEQUFtQjtBQTFDckIsSUFBSyxjQU1KO0FBTkQsV0FBSyxjQUFjO0lBQ2pCLDZCQUFVLENBQUE7SUFDViwrQkFBWSxDQUFBO0lBQ1osNkJBQVUsQ0FBQTtJQUNWLGlDQUFjLENBQUE7SUFDZCxtQ0FBZ0IsQ0FBQTtBQUNsQixDQUFDLEVBTkksY0FBYyxLQUFkLGNBQWMsUUFNbEI7QUFxQ0Msd0NBQWM7QUFuQ2hCLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBVyxFQUFFLFlBQXFCLElBQUksRUFBRSxFQUFFO0lBQzlELE1BQU0sS0FBSyxHQUFHLFNBQVM7UUFDckIsQ0FBQyxDQUFDLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ25ELENBQUMsQ0FBQyxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDO0FBMEJBLG9DQUFZO0FBeEJkLE1BQU0sVUFBVSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixJQUFJLENBQUMsR0FBRztRQUFFLE9BQU8sR0FBRyxDQUFDO0lBQ3JCLGlCQUFpQjtJQUNqQixJQUFJLEdBQUcsQ0FBQyxVQUFVO1FBQUUsT0FBTyxTQUFTLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDaEUsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRixNQUFNLFNBQVMsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUNyQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsSUFBSSxvQkFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUM5QixPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQWFBLDhCQUFTO0FBWFgsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLFVBQWlDLEVBQUUsRUFBRSxFQUFFO0lBQ25GLEdBQUcsR0FBRyxjQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ3JDLE9BQU8sWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7U0FDaEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQU1BLGdEQUFrQiJ9