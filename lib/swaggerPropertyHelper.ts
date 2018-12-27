/**
 * All other regular column types.
 */
export type PropertyType = "string" | "number" | "boolean" | "array" | "object"

/**
 * 
 * @param constructor 
 */
export function swaggerClass(constructor?: Function): Function {
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.swaggerDocument == undefined) target.swaggerDocument = {};
    }
};

/**
 * 
 */
export class PropertyOptions {
    /**
     * 
     */
    type: PropertyType=null;
    /**
     * 
     */
    required?: boolean = null;
    /**
     * 
     */
    example?: any = null;
    /**
     * 
     */
    descriptor?: PropertyDescriptor = null;
    /**
     * 
     */
    items?: PropertyOptions = null;
    /**
     * 
     */
    properties?: any;
}

/**
 * 
 * @param type 
 * @param options 
 */
export function swaggerProperty(options?: PropertyOptions): Function {
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.swaggerDocument == undefined) target.swaggerDocument = {};
        target.swaggerDocument[propertyKey] = options;
    }
};