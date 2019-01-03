/**
 * All other regular column types.
 */
export declare type PropertyType = "string" | "number" | "boolean" | "array" | "object";
/**
 *
 * @param constructor
 */
export declare function swaggerClass(constructor?: Function): Function;
/**
 *
 */
export declare class PropertyOptions {
    /**
     *
     */
    type: PropertyType;
    /**
     *
     */
    required?: boolean;
    /**
     *
     */
    example?: any;
    /**
     *
     */
    descriptor?: PropertyDescriptor;
    /**
     *
     */
    items?: PropertyOptions;
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
export declare function swaggerProperty(options?: PropertyOptions): Function;
