/**
 * All other regular column types.
 */
export type PropertyType = "string" | "number" | "boolean" | "array" | "object";


export function swaggerClass(constructor?: Function): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.swaggerDocument == undefined) target.swaggerDocument = {};
    };
}

export class PropertyOptions {

    type: PropertyType = undefined;

    required?: boolean = undefined;

    example?: any = undefined;

    descriptor?: PropertyDescriptor = undefined;

    items?: PropertyOptions = undefined;

    properties?: any;
}

export function swaggerProperty(options?: PropertyOptions): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.swaggerDocument == undefined) target.swaggerDocument = {};
        target.swaggerDocument[propertyKey] = options;
    };
}