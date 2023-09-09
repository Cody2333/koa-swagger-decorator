import { ZodObject, ZodTypeAny } from "zod";
import { Container } from "./utils/container";
import {
  DECORATOR_REQUEST,
  DECORATOR_SCHEMAS,
  Method,
  getIdentifier,
} from "./utils/constant";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";

const body =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    descriptor.value.bodySchema = v;
    Container.set(`DECORATOR_BODY_${getIdentifier(target, name)}`, v);
    return descriptor;
  };

const responses =
  (v: ZodObject<any>) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    descriptor.value.responsesSchema = v;
    Container.set(`DECORATOR_RESPONSES_${getIdentifier(target, name)}`, v);
    return descriptor;
  };

const middlewares =
  (middlewares: Function[]) =>
  (target: any, name: string, descriptor: PropertyDescriptor) => {
    Container.set(
      `DECORATOR_MIDDLEWARES_${getIdentifier(target, name)}`,
      middlewares
    );
    descriptor.value.middlewares = middlewares;
    return descriptor;
  };

const routeConfig =
  (v: Partial<RouteConfig>) =>
  (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    if (!v.method || !v.path) {
      throw new Error(`missing [method] and [path] fields for routeConfig`);
    }
    const className = target.constructor.name;
    const identifier = `${className}-${methodName}`;
    Container.set(`DECORATOR_MERGE_${identifier}`, v);
    const { method, path } = v;
    descriptor.value.routeConfig = v;
    const apiList = Container.get(DECORATOR_REQUEST);
    if (!apiList) {
      Container.set(DECORATOR_REQUEST, [
        { method, path, identifier, methodName, className },
      ]);
    } else {
      apiList.push({ method, path, identifier, methodName, className });
      Container.set(DECORATOR_REQUEST, apiList);
    }

    return descriptor;
  };

export { body, responses, routeConfig, middlewares };
