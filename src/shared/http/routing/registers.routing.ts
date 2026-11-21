import type { RequestHandler, Router } from "express";

const routeMiddleware = new WeakMap<RequestHandler, RequestHandler[]>();

export function UseMiddleware(...middleware: RequestHandler[]) {
  return (method: RequestHandler): void => {
    routeMiddleware.set(method, [
      ...middleware,
      ...(routeMiddleware.get(method) ?? []),
    ]);
  };
}

export function Get(
  router: Router,
  path: string,
  controller: object,
  method: RequestHandler,
): void {
  const middleware = routeMiddleware.get(method) ?? [];
  router.get(path, ...middleware, method.bind(controller));
}

export function Post(
  router: Router,
  path: string,
  controller: object,
  method: RequestHandler,
): void {
  const middleware = routeMiddleware.get(method) ?? [];
  router.post(path, ...middleware, method.bind(controller));
}

export function Patch(
  router: Router,
  path: string,
  controller: object,
  method: RequestHandler,
): void {
  const middleware = routeMiddleware.get(method) ?? [];
  router.patch(path, ...middleware, method.bind(controller));
}

export function Delete(
  router: Router,
  path: string,
  controller: object,
  method: RequestHandler,
): void {
  const middleware = routeMiddleware.get(method) ?? [];
  router.delete(path, ...middleware, method.bind(controller));
}
