/**
 * All other regular column types.
 */
export declare type PropertyType = "string" | "number" | "boolean" | "array" | "object";
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
    description?: string;
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
 * Made for empty class
 * @param constructor
 */
export declare function swaggerClass(constructor?: Function): Function;
/**
 *
 * @param type
 * @param options
 */
export declare function swaggerProperty(options?: PropertyOptions): Function;
