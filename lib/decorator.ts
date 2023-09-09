import { ZodObject } from "zod";
import { Container } from "./utils/container";
import { DECORATOR_REQUEST, Method } from "./utils/constant";

const request =
  (method: Method, path: string) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    descriptor.value.method = method;
    descriptor.value.path = path;
    const apiList = Container.get(DECORATOR_REQUEST);
    if (!apiList) {
      Container.set(DECORATOR_REQUEST, [{ method, path, name }]);
    } else {
      apiList.push({ method, path, name });
      Container.set(DECORATOR_REQUEST, apiList);
    }

    return descriptor;
  };

const body =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_BODY_${name}`, v);
    return descriptor;
  };

const query =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_QUERY_${name}`, v);
    return descriptor;
  };

const pathParams =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_PATHPARAMS_${name}`, v);
    return descriptor;
  };

const responses =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_RESPONSES_${name}`, v);
    return descriptor;
  };

const summary =
  (v: string) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_SUMMARY_${name}`, v);
    return descriptor;
  };

const description =
  (v: string) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_DESCRIPTION_${name}`, v);
    return descriptor;
  };

const tags =
  (v: string | string[]) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(`DECORATOR_TAGS_${name}`, v);
    return descriptor;
  };

export {
  request,
  body,
  query,
  pathParams,
  responses,
  summary,
  tags,
  description,
};
