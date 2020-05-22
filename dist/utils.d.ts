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
declare const fixBodySchema: (bodies: any[]) => any[];
export { convertPath, getPath, getFilepaths, loadClass, loadSwaggerClasses, reservedMethodNames, allowedMethods, swaggerKeys, fixBodySchema };
