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
const getFilepaths = (dir, recursive = true, ignore = []) => {
    const ignoreDirs = ignore.map((path => `!${path}`));
    const paths = recursive
        ? globby_1.default.sync(['**/*.js', '**/*.ts', ...ignoreDirs], { cwd: dir })
        : globby_1.default.sync(['*.js', '*.ts', ...ignoreDirs], { cwd: dir });
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
    return getFilepaths(dir, recursive, options.ignore)
        .map(filepath => loadClass(filepath))
        .filter(cls => cls);
};
exports.loadSwaggerClasses = loadSwaggerClasses;
const swaggerKeys = (className, methods) => methods.map(m => `${className}- ${m}`);
exports.swaggerKeys = swaggerKeys;
/**
 * Sorts an object (dictionary) by value returned by the valSelector function.
 * Note that order is only guaranteed for string keys.
 */
const sortObject = (obj, comparisonSelector, callbackFn) => {
    const unsortedKeys = Object.keys(obj);
    const sortedKeys = unsortedKeys.sort((a, b) => (comparisonSelector(obj[a], unsortedKeys.length) > comparisonSelector(obj[b], unsortedKeys.length) ? 1 :
        comparisonSelector(obj[a], unsortedKeys.length) < comparisonSelector(obj[b], unsortedKeys.length) ? -1 : 0));
    return sortedKeys.reduce((sorted, k) => {
        let value = obj[k];
        if (callbackFn && is_type_of_1.default.function(callbackFn)) {
            value = callbackFn(value);
        }
        sorted[k] = value;
        return sorted;
    }, {});
};
exports.sortObject = sortObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBeUI7QUFDekIsb0RBQTRCO0FBQzVCLDREQUE0QjtBQUc1Qiw0QkFBNEI7QUFDNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUNuQyxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFpRkEsa0NBQVc7QUEvRWIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FDL0MsR0FBRyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQStFdEMsMEJBQU87QUE3RVQsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixhQUFhO0lBQ2IsTUFBTTtJQUNOLGFBQWE7SUFDYixRQUFRO0lBQ1IsV0FBVztJQUNYLFlBQVk7SUFDWixRQUFRO0NBQ1QsQ0FBQztBQXlFQSxrREFBbUI7QUF2RXJCLElBQUssY0FNSjtBQU5ELFdBQUssY0FBYztJQUNqQiw2QkFBVSxDQUFBO0lBQ1YsK0JBQVksQ0FBQTtJQUNaLDZCQUFVLENBQUE7SUFDVixpQ0FBYyxDQUFBO0lBQ2QsbUNBQWdCLENBQUE7QUFDbEIsQ0FBQyxFQU5JLGNBQWMsS0FBZCxjQUFjLFFBTWxCO0FBa0VDLHdDQUFjO0FBaEVoQixNQUFNLFlBQVksR0FBRyxDQUFDLEdBQVcsRUFBRSxZQUFxQixJQUFJLEVBQUUsU0FBbUIsRUFBRSxFQUFFLEVBQUU7SUFDckYsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFB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