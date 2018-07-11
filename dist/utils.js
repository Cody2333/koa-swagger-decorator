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
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];
exports.reqMethods = reqMethods;
// check if an object is an instance of SwaggerRouter
const isSwaggerRouter = (o) => {
    if (!o) {
        return false;
    }
    return true;
};
exports.isSwaggerRouter = isSwaggerRouter;
const getFilepaths = (dir, recursive = true) => {
    const paths = recursive
        ? globby_1.default.sync(['**/*.js'], { cwd: dir })
        : globby_1.default.sync(['*.js'], { cwd: dir });
    return paths.map(path => path_1.default.join(dir, path));
};
exports.getFilepaths = getFilepaths;
const loadModule = (filepath) => {
    const obj = require(filepath); // eslint-disable-line global-require
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxnREFBeUI7QUFDekIsb0RBQTRCO0FBQzVCLDREQUE0QjtBQUU1Qiw0QkFBNEI7QUFDNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUNuQyxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFvREEsa0NBQVc7QUFsRGIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBbUR0RiwwQkFBTztBQWpEVCxNQUFNLG1CQUFtQixHQUFHO0lBQzFCLGFBQWE7SUFDYixNQUFNO0lBQ04sYUFBYTtJQUNiLFFBQVE7SUFDUixXQUFXO0lBQ1gsWUFBWTtDQUNiLENBQUM7QUFnREEsa0RBQW1CO0FBOUNyQixNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQTRDM0QsZ0NBQVU7QUExQ1oscURBQXFEO0FBQ3JELE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUU7SUFDakMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNOLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQWlDQSwwQ0FBZTtBQS9CakIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFXLEVBQUUsWUFBcUIsSUFBSSxFQUFFLEVBQUU7SUFDOUQsTUFBTSxLQUFLLEdBQUcsU0FBUztRQUNyQixDQUFDLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDO0FBMkJBLG9DQUFZO0FBekJkLE1BQU0sVUFBVSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFDQUFxQztJQUNwRSxJQUFJLENBQUMsR0FBRztRQUFFLE9BQU8sR0FBRyxDQUFDO0lBQ3JCLGlCQUFpQjtJQUNqQixJQUFJLEdBQUcsQ0FBQyxVQUFVO1FBQUUsT0FBTyxTQUFTLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDaEUsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRixNQUFNLFNBQVMsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUNyQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsSUFBSSxvQkFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUM5QixPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQWNBLDhCQUFTO0FBWlgsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLFVBQWlDLEVBQUUsRUFBRSxFQUFFO0lBQ25GLEdBQUcsR0FBRyxjQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ3JDLE9BQU8sWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7U0FDaEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQVFBLGdEQUFrQiJ9