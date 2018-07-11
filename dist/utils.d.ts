declare const convertPath: (path: string) => string;
declare const getPath: (prefix: string, path: string) => string;
declare const reservedMethodNames: string[];
declare const reqMethods: string[];
declare const isSwaggerRouter: (o: any) => boolean;
declare const getFilepaths: (dir: string, recursive?: boolean) => string[];
declare const loadClass: (filepath: string) => any;
declare const loadSwaggerClasses: (dir?: string, options?: {
    recursive?: boolean;
}) => any[];
export { convertPath, getPath, isSwaggerRouter, getFilepaths, loadClass, reqMethods, loadSwaggerClasses, reservedMethodNames };
