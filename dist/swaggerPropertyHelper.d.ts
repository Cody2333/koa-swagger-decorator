/**
 * All other regular column types.
 */
export declare type PropertyType = "string" | "number" | "boolean" | "array" | "object";
declare type CustromStringFormatT = string;
export declare type StringFormatT = "date" | "date-time" | "password" | "byte" | "binary" | CustromStringFormatT;
declare class BasePropertyOptions {
    required?: boolean;
    example?: any;
    description?: string;
    readOnly?: boolean;
    writeOnly?: boolean;
    nullable?: boolean;
}
declare type StringPropertyOptionsT = BasePropertyOptions & {
    type: "string";
    minLength?: number;
    maxLength?: number;
    format?: StringFormatT;
    pattern?: string;
};
declare type NumberPropertyOptionsT = BasePropertyOptions & {
    type: "number";
    minimum?: number;
    exclusiveMinimum?: boolean;
    maximum?: number;
    exclusiveMaximum?: boolean;
    multipleOf?: number;
};
declare type BooleanPropertyOptionsT = BasePropertyOptions & {
    type: "boolean";
};
declare type ArrayPropertyOptionsT = BasePropertyOptions & {
    type: "array";
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    items?: PropertyOptions;
};
declare type ObjectPropertyOptionsT = BasePropertyOptions & {
    type: "object";
    properties?: any;
    minProperties?: number;
    maxProperties?: number;
};
export declare type PropertyOptions = StringPropertyOptionsT | NumberPropertyOptionsT | BooleanPropertyOptionsT | ArrayPropertyOptionsT | ObjectPropertyOptionsT;
/**
 * Made for empty class
 */
export declare function swaggerClass(): Function;
/**
 * @param options
 */
export declare function swaggerProperty(options?: PropertyOptions): Function;
export {};
