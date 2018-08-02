"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const ramda_1 = __importDefault(require("ramda"));
const is_type_of_1 = __importDefault(require("is-type-of"));
const validate_1 = __importDefault(require("./validate"));
const swaggerHTML_1 = require("./swaggerHTML");
const swaggerJSON_1 = require("./swaggerJSON");
const swaggerObject_1 = __importDefault(require("./swaggerObject"));
const utils_1 = require("./utils");
const validator = (parameters) => (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (!parameters) {
        yield next();
        return;
    }
    if (parameters.query) {
        ctx.validatedQuery = validate_1.default(ctx.request.query, parameters.query);
    }
    if (parameters.path) {
        ctx.validatedParams = validate_1.default(ctx.params, parameters.path);
    }
    if (parameters.body) {
        ctx.validatedBody = validate_1.default(ctx.request.body, parameters.body);
    }
    yield next();
});
const handleSwagger = (router, options) => {
    const { swaggerJsonEndpoint = '/swagger-json', swaggerHtmlEndpoint = '/swagger-html', prefix = '' } = options;
    // setup swagger router
    router.get(swaggerJsonEndpoint, (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = swaggerJSON_1.swaggerJSON(options, swaggerObject_1.default.data);
    }));
    router.get(swaggerHtmlEndpoint, (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = swaggerHTML_1.swaggerHTML(utils_1.getPath(prefix, swaggerJsonEndpoint));
    }));
};
const handleMap = (router, SwaggerClass, { doValidation = true }) => {
    if (!SwaggerClass)
        return;
    const classMiddlewares = SwaggerClass.middlewares || [];
    const classPrefix = SwaggerClass.prefix || '';
    const classParameters = SwaggerClass.parameters || {};
    const classParametersFilters = SwaggerClass.parameters
        ? SwaggerClass.parameters.filters
        : ['ALL'];
    classParameters.query = classParameters.query ? classParameters.query : {};
    // remove useless field in class object:  constructor, length, name, prototype
    const methods = Object.getOwnPropertyNames(SwaggerClass).filter(method => !utils_1.reservedMethodNames.includes(method));
    // map all method in methods
    methods
        // filter methods withour @request decorator
        .filter((item) => {
        const { path, method } = SwaggerClass[item];
        if (!path && !method) {
            return false;
        }
        return true;
    })
        // add router
        .forEach((item) => {
        const { path, method } = SwaggerClass[item];
        let { middlewares = [] } = SwaggerClass[item];
        const localParams = SwaggerClass[item].parameters || {};
        if (classParametersFilters.includes('ALL') ||
            classParametersFilters.map(i => i.toLowerCase()).includes(method)) {
            const globalQuery = ramda_1.default.clone(classParameters.query);
            localParams.query = localParams.query ? localParams.query : {};
            // merge local query and class query
            // local query 的优先级更高
            localParams.query = Object.assign(globalQuery, localParams.query);
        }
        if (is_type_of_1.default.function(middlewares)) {
            middlewares = [middlewares];
        }
        if (!is_type_of_1.default.array(middlewares)) {
            throw new Error('middlewares params must be an array or function');
        }
        middlewares.forEach((item) => {
            if (!is_type_of_1.default.function(item)) {
                throw new Error('item in middlewares must be a function');
            }
        });
        if (!utils_1.allowedMethods.hasOwnProperty(method.toUpperCase())) {
            throw new Error(`illegal API: ${method} ${path} at [${item}]`);
        }
        const chain = [
            `${utils_1.convertPath(`${classPrefix}${path}`)}`,
            doValidation
                ? validator(localParams)
                : (ctx, next) => __awaiter(this, void 0, void 0, function* () {
                    yield next();
                }),
            ...classMiddlewares,
            ...middlewares,
            SwaggerClass[item]
        ];
        router[method](...chain);
    });
};
const handleMapDir = (router, dir, options) => {
    utils_1.loadSwaggerClasses(dir, options).forEach((c) => {
        router.map(c, options);
    });
};
const wrapper = (router) => {
    router.swagger = (options = {}) => {
        handleSwagger(router, options);
    };
    router.map = (SwaggerClass, options = {}) => {
        handleMap(router, SwaggerClass, options);
    };
    router.mapDir = (dir, options = {}) => {
        handleMapDir(router, dir, options);
    };
};
exports.wrapper = wrapper;
class SwaggerRouter extends koa_router_1.default {
    swagger(options = {}) {
        handleSwagger(this, options);
    }
    map(SwaggerClass, options) {
        handleMap(this, SwaggerClass, options);
    }
    mapDir(dir, options = {}) {
        handleMapDir(this, dir, options);
    }
}
exports.SwaggerRouter = SwaggerRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi93cmFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBZ0M7QUFFaEMsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QiwwREFBa0M7QUFDbEMsK0NBQTRDO0FBQzVDLCtDQUE0QztBQUM1QyxvRUFBNEM7QUFDNUMsbUNBTWlCO0FBUWpCLE1BQU0sU0FBUyxHQUFHLENBQUMsVUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFPLEdBQVksRUFBRSxJQUF3QixFQUFFLEVBQUU7SUFDdEYsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDYixPQUFPO0tBQ1I7SUFFRCxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsR0FBRyxDQUFDLGNBQWMsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRTtJQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtRQUNuQixHQUFHLENBQUMsZUFBZSxHQUFHLGtCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7UUFDbkIsR0FBRyxDQUFDLGFBQWEsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqRTtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUEsQ0FBQztBQWFGLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBYyxFQUFFLE9BQXVCLEVBQUUsRUFBRTtJQUNoRSxNQUFNLEVBQ0osbUJBQW1CLEdBQUcsZUFBZSxFQUNyQyxtQkFBbUIsR0FBRyxlQUFlLEVBQ3JDLE1BQU0s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