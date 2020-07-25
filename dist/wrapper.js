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
const getMeta = (item) => (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.meta = item;
    yield next();
});
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
        chain.push(getMeta(item));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi93cmFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSw0REFBZ0M7QUFDaEMsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QiwwREFBa0M7QUFDbEMsK0NBQTRDO0FBQzVDLCtDQUE0QztBQUM1QyxvRUFBNEM7QUFDNUMsbUNBTWlCO0FBVWpCLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxDQUFPLEdBQVksRUFBRSxJQUF3QixFQUFFLEVBQUU7SUFDOUUsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQSxDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxVQUFlLEVBQUUsRUFBRSxDQUFDLENBQU8sR0FBWSxFQUFFLElBQXdCLEVBQUUsRUFBRTtJQUN0RixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUNiLE9BQU87S0FDUjtJQUVELElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtRQUNwQixHQUFHLENBQUMsY0FBYyxHQUFHLGtCQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxlQUFlLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3RDtJQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtRQUNuQixHQUFHLENBQUMsYUFBYSxHQUFHLGtCQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBQ0Qs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