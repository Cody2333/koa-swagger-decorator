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
    if (!utils_1.isSwaggerRouter(SwaggerClass))
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
        if (!utils_1.reqMethods.includes(method)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi93cmFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBZ0M7QUFFaEMsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QiwwREFBa0M7QUFDbEMsK0NBQTRDO0FBQzVDLCtDQUE0QztBQUM1QyxvRUFBNEM7QUFDNUMsbUNBT2lCO0FBUWpCLE1BQU0sU0FBUyxHQUFHLENBQUMsVUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFPLEdBQVksRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUN2RSxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUNiLE9BQU87S0FDUjtJQUVELElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtRQUNwQixHQUFHLENBQUMsY0FBYyxHQUFHLGtCQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxlQUFlLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3RDtJQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtRQUNuQixHQUFHLENBQUMsYUFBYSxHQUFHLGtCQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQSxDQUFDO0FBYUYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFjLEVBQUUsT0FBdUIsRUFBRSxFQUFFO0lBQ2hFLE1BQU0sRUFDSixtQkFBbUIsR0FBRyxlQUFlLEVBQ3JDLG1CQUFtQixHQUFHLGVBQWUsRUFDckMsTUFBTSxH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