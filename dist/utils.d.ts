import { Dictionary } from 'ramda';
declare const convertPath: (path: string) => string;
declare const getPath: (prefix: string, path: string) => string;
declare const reservedMethodNames: string[];
declare enum allowedMethods {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete"
}
declare const getFilepaths: (dir: string, recursive?: boolean, ignore?: string[]) => string[];
declare const loadClass: (filepath: string) => any;
declare const loadSwaggerClasses: (dir?: string, options?: {
    recursive?: boolean;
    ignore?: string[];
}) => any[];
declare const swaggerKeys: (className: String, methods: [String]) => string[];
/**
 * Sorts an object (dictionary) by value returned by the valSelector function.
 * Note that order is only guaranteed for string keys.
 */
declare const sortObject: <TValue>(obj: Dictionary<TValue>, comparisonSelector: (val: TValue, length: number) => string | number, callbackFn?: (val: TValue) => TValue) => {};
export { convertPath, getPath, getFilepaths, loadClass, loadSwaggerClasses, reservedMethodNames, allowedMethods, swaggerKeys, sortObject, };
