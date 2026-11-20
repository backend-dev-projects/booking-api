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

export function registerGet(
  router: Router,
  path: string,
  controller: object,
  method: RequestHandler,
): void {
  const middleware = routeMiddleware.get(method) ?? [];
  router.get(path, ...middleware, method.bind(controller));
}
