export const CONFIG_SYMBOL = Symbol.for("CONFIG");
export const DECORATOR_REQUEST = Symbol.for("DECORATOR_REQUEST");
export const DECORATOR_SCHEMAS = Symbol.for("DECORATOR_SCHEMAS");

export function getIdentifier(target: any, methodName: string) {
  const className = target.constructor.name;
  const identifier = `${className}-${methodName}`;
  return identifier;
}

export function convertPath(path: string) {
  const re = new RegExp("{(.*?)}", "g");
  return path.replace(re, ":$1");
};

export const reservedMethodNames = [
  "middlewares",
  "name",
  "constructor",
  "length",
  "prototype",
  "parameters",
  "prefix",
];

export type Method =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";
