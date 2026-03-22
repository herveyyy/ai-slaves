// src/api/decorators/http.decorators.ts
import "reflect-metadata";

export const ROUTE_METADATA = "route_metadata";

interface RouteDefinition {
    path: string;
    method: "get" | "post" | "put" | "delete";
    methodName: string;
}

const createMappingDecorator =
    (method: "get" | "post" | "put" | "delete") =>
    (path: string = ""): MethodDecorator => {
        return (target, propertyKey) => {
            const routes: RouteDefinition[] =
                Reflect.getMetadata(ROUTE_METADATA, target.constructor) || [];
            routes.push({
                path,
                method,
                methodName: propertyKey as string,
            });
            Reflect.defineMetadata(ROUTE_METADATA, routes, target.constructor);
        };
    };

export const Get = createMappingDecorator("get");
export const Post = createMappingDecorator("post");
export const Put = createMappingDecorator("put");
export const Delete = createMappingDecorator("delete");
