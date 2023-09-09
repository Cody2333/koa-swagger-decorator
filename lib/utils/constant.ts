export const CONFIG_SYMBOL = Symbol.for("CONFIG");
export const DECORATOR_REQUEST = Symbol.for("DECORATOR_REQUEST");
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
