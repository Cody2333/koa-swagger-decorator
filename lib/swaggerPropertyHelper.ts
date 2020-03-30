/**
 * All other regular column types.
 */
export type PropertyType = "string" | "number" | "boolean" | "array" | "object";

type CustromStringFormatT = string;
export type StringFormatT = "date" | "date-time" | "password" | "byte" | "binary" | CustromStringFormatT;

class BasePropertyOptions {
    required?: boolean;
    example?: any;
    description?: string;
    readOnly?: boolean;
    writeOnly?: boolean;
    nullable?: boolean;
}

type StringPropertyOptionsT = BasePropertyOptions & {
    type: "string";
    minLength?: number;
    maxLength?: number;
    format?: StringFormatT;
    pattern?: string;
};

type NumberPropertyOptionsT = BasePropertyOptions & {
    type: "number";
    minimum?: number;
    exclusiveMinimum?: boolean;
    maximum?: number;
    exclusiveMaximum?: boolean;
    multipleOf?: number;
};

type BooleanPropertyOptionsT = BasePropertyOptions & {
    type: "boolean";
};

type ArrayPropertyOptionsT = BasePropertyOptions & {
    type: "array",
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    items?: PropertyOptions;
};

type ObjectPropertyOptionsT = BasePropertyOptions & {
    type: "object",
    properties?: any;
    minProperties?: number;
    maxProperties?: number;
};

export type PropertyOptions =
    | StringPropertyOptionsT
    | NumberPropertyOptionsT
    | BooleanPropertyOptionsT
    | ArrayPropertyOptionsT
    | ObjectPropertyOptionsT
;

/**
 *
 * @param source
 */
function deepClone(source: any) {
    if (!source || typeof source !== 'object') {
        return null;
    }
    const targetObj: any = source.constructor === Array ? [] : {};
    for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            } else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
}

/**
 * Made for empty class
 */
export function swaggerClass(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.swaggerDocument == undefined) target.swaggerDocument = {};
        if (target.swaggerClass == undefined) target.swaggerClass = target;
        if (target.swaggerClass != target) {
            target.swaggerClass = target;
            target.swaggerDocument = deepClone(target.swaggerDocument);
        }
    };
}

/**
 * @param options
 */
export function swaggerProperty(options?: PropertyOptions): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.constructor.swaggerDocument == undefined) target.constructor.swaggerDocument = {};
        if (target.constructor.swaggerClass == undefined) target.constructor.swaggerClass = target.constructor;
        if (target.constructor.swaggerClass != target.constructor) {
            target.constructor.swaggerClass = target.constructor;
            target.constructor.swaggerDocument = deepClone(target.constructor.swaggerDocument);
        }
        target.constructor.swaggerDocument[propertyKey] = options;
    };
}
