import { ZodObject } from "zod";
import { registry } from "./registry";
import { Container } from "./container";
import { DECORATOR_REQUEST } from "./utils/constant";

const request =
  (method: any, path: string) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    const requestKey = `${name}Request`;
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
  (target: any, name: string, descriptor: PropertyDescriptor) => {};

const params =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {};

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
export { request, body, query, params, responses, summary };
