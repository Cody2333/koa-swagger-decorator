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
    const { swaggerJsonEndpoint = '/swagger-json', swaggerHtmlEndpoint = '/swagger-html', prefix = '', swaggerConfiguration = {}, } = options;
    // setup swagger router
    router.get(swaggerJsonEndpoint, (ctx) => __awaiter(this, void 0, void 0, function* () {
        let data = {};
        if (router instanceof SwaggerRouter) {
            Object.keys(swaggerObject_1.default.data).forEach(k => {
                if (router.swaggerKeys.has(k)) {
                    data[k] = swaggerObject_1.default.data[k];
                }
            });
        }
        else {
            // 兼容使用 wrapper 的情况
            data = swaggerObject_1.default.data;
        }
        ctx.body = swaggerJSON_1.swaggerJSON(options, data);
    }));
    router.get(swaggerHtmlEndpoint, (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = swaggerHTML_1.swaggerHTML(utils_1.getPath(prefix, swaggerJsonEndpoint), swaggerConfiguration);
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
    const staticMethods = Object.getOwnPropertyNames(SwaggerClass)
        .filter(method => !utils_1.reservedMethodNames.includes(method))
        .map(method => SwaggerClass[method]);
    const SwaggerClassPrototype = SwaggerClass.prototype;
    const methods = Object.getOwnPropertyNames(SwaggerClassPrototype)
        .filter(method => !utils_1.reservedMethodNames.includes(method))
        .map(method => {
        const wrapperMethod = (ctx) => __awaiter(this, void 0, void 0, function* () {
            const c = new SwaggerClass(ctx);
            yield c[method](ctx);
        });
        // 添加了一层 wrapper 之后，需要把原函数的名称暴露出来 fnName
        Object.assign(wrapperMethod, SwaggerClassPrototype[method], { fnName: method });
        return wrapperMethod;
    });
    // map all methods
    [...staticMethods, ...methods]
        // filter methods withour @request decorator
        .filter((item) => {
        const { path, method } = item;
        if (!path && !method) {
            return false;
        }
        return true;
    })
        // add router
        .forEach((item) => {
        if (item.name === 'wrapperMethod') {
            // 添加 swaggerKeys
            router._addKey(`${SwaggerClass.name}-${item.fnName}`);
        }
        else {
            router._addKey(`${SwaggerClass.name}-${item.name}`);
        }
        const { path, method } = item;
        let { middlewares = [] } = item;
        const localParams = item.parameters || {};
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
        ];
        if (doValidation) {
            chain.push(validator(localParams));
        }
        chain.push(...classMiddlewares);
        chain.push(...middlewares);
        chain.push(item);
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
    constructor(opts = {}, swaggerOpts = {}) {
        super(opts);
        this.opts = opts || {}; // koa-router opts
        this.swaggerKeys = new Set();
        this.swaggerOpts = swaggerOpts || {}; // swagger-router opts
        if (this.opts.prefix && !this.swaggerOpts.prefix) {
            this.swaggerOpts.prefix = this.opts.prefix;
        }
    }
    _addKey(str) {
        this.swaggerKeys.add(str);
    }
    swagger(options = {}) {
        const opts = Object.assign(options, this.swaggerOpts);
        handleSwagger(this, opts);
    }
    map(SwaggerClass, options) {
        handleMap(this, SwaggerClass, options);
    }
    mapDir(dir, options = {}) {
        handleMapDir(this, dir, options);
    }
}
exports.SwaggerRouter = SwaggerRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi93cmFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSw0REFBZ0M7QUFDaEMsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QiwwREFBa0M7QUFDbEMsK0NBQTRDO0FBQzVDLCtDQUE0QztBQUM1QyxvRUFBNEM7QUFDNUMsbUNBTWlCO0FBU2pCLE1BQU0sU0FBUyxHQUFHLENBQUMsVUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFPLEdBQVksRUFBRSxJQUF3QixFQUFFLEVBQUU7SUFDdEYsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDYixPQUFPO0tBQ1I7SUFFRCxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsR0FBRyxDQUFDLGNBQWMsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRTtJQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtRQUNuQixHQUFHLENBQUMsZUFBZSxHQUFHLGtCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7UUFDbkIsR0FBRyxDQUFDLGFBQWEsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqRTtJQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUEsQ0FBQztBQXdERixNQUFNLGFBQWEsR0FBRyxDQUE2QixNQUFzQyxFQUFFLE9BQXVCLEVBQUUsRUFBRTtJQUNwSCxNQUFNLEVBQ0osbUJBQW1CLEdBQUcsZUFBZSxFQUNyQyxtQkFBbUIsR0FBRyxlQUFlLEVBQ3JDLE1B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