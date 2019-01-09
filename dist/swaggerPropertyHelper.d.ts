/**
 * All other regular column types.
 */
export declare type PropertyType = "string" | "number" | "boolean" | "array" | "object";
export declare function swaggerClass(constructor?: Function): Function;
export declare class PropertyOptions {
    type: PropertyType;
    required?: boolean;
    example?: any;
    descriptor?: PropertyDescriptor;
    items?: PropertyOptions;
    properties?: any;
}
export declare function swaggerProperty(options?: PropertyOptions): Function;
